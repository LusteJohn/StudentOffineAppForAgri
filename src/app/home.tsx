import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="code" themeColor="textSecondary">Student dashboard</ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Welcome, user #{activeUserId}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Open your dedicated profile page to add or edit student information.
          </ThemedText>

          <Pressable onPress={() => router.replace('/login')} style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>Back to login</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavbar activeTab="home" userId={activeUserId} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 12,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    padding: 24,
    borderRadius: 28,
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  title: {
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  secondaryButtonText: {
    fontWeight: '700',
    color: '#0f172a',
  },
});
