import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { resetAndSeedLocalData } from '@/lib/auth-api';

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = Number(params.userId ?? '1');

  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleImportResources = async () => {
    Alert.alert(
      'Import offline resources',
      'This will replace your local competency, module, lesson, lesson-content, and content-info records with the default offline resources. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            setImporting(true);
            setMessage('');
            try {
              const result = await resetAndSeedLocalData();
              if (result.alreadyImported) {
                setMessage(
                  `Offline resources are already imported for this device. Currently stored: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, and ${result.lessonLink} lesson link records.`
                );
              } else {
                setMessage(
                  `Import completed: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, and ${result.lessonLink} lesson link records saved to this device.`
                );
              }
            } catch (importError) {
              setMessage(
                importError instanceof Error
                  ? importError.message
                  : 'Failed to import offline resources. Please try again.'
              );
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Settings" userId={activeUserId} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="code" style={{ color: '#000000' }}>
            Settings
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: '#000000' }}>
            Device data
          </ThemedText>
          <ThemedText style={{ color: '#000000' }}>Manage offline resources stored on this device.</ThemedText>

          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View>
                <ThemedText type="subtitle" style={[styles.actionTitle, { color: '#000000' }]}>
                  Import offline resources
                </ThemedText>
                <ThemedText style={[styles.actionDescription, { color: '#000000' }]}>
                  Replace the current local competency, module, lesson, lesson-content, content-info, lesson-info, and lesson-link data with the default offline dataset.
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={handleImportResources}
              disabled={importing}
              style={[styles.primaryButton, importing && styles.primaryButtonDisabled]}>
              <ThemedText style={styles.primaryButtonText}>{importing ? 'Importing...' : 'Import resources'}</ThemedText>
            </Pressable>

            {message ? (
              <View
                style={[
                  styles.statusBox,
                  message.includes('Failed')
                    ? styles.statusBoxError
                    : styles.statusBoxSuccess,
                ]}>
                <ThemedText
                  style={[
                    styles.statusText,
                    message.includes('Failed') ? styles.statusTextError : styles.statusTextSuccess,
                  ]}>
                  {message}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <BottomNavbar activeTab="settings" userId={activeUserId} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#edf4ea',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 12,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    padding: 18,
    borderRadius: 24,
    gap: 12,
    backgroundColor: 'transparent',
  },
  actionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    padding: 16,
    gap: 12,
  },
  actionHeader: {
    gap: 6,
  },
  actionTitle: {
    fontSize: 18,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '700',
  },
  statusBox: {
    borderRadius: 16,
    padding: 12,
    gap: 6,
    borderWidth: 1,
  },
  statusBoxSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: 'rgba(4, 120, 87, 0.18)',
  },
  statusBoxError: {
    backgroundColor: '#fef2f2',
    borderColor: 'rgba(185, 28, 28, 0.18)',
  },
  statusTextSuccess: {
    color: '#047857',
    fontWeight: '600',
  },
  statusTextError: {
    color: '#b91c1c',
    fontWeight: '600',
  },
});
