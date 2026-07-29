import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { JobSheetRecord, LessonContentRecord, LessonRecord, ModuleRecord, getModuleById, getLessonById, getLessonContentById, listJobSheetByLessonContentId } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

export default function JobSheetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ moduleId?: string; lessonId?: string; lessonContentId?: string; userId?: string }>();
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);
  const lessonContentId = Number(params.lessonContentId);

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(null);
  const [jobSheets, setJobSheets] = useState<JobSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobSheet = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [mod, lesson, content] = await Promise.all([
        getModuleById(moduleId),
        getLessonById(lessonId),
        getLessonContentById(lessonContentId),
      ]);
      setModuleItem(mod ?? null);
      setLessonItem(lesson ?? null);
      setContentItem(content ?? null);

      if (!mod || !lesson || !content) {
        setError('Module, lesson, or lesson content not found.');
        setLoading(false);
        return;
      }

      const sheets = await listJobSheetByLessonContentId(content.lesson_content_id);
      setJobSheets(sheets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load job sheet.');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId]);

  useEffect(() => {
    if (Number.isInteger(moduleId) && Number.isInteger(lessonId) && Number.isInteger(lessonContentId) && moduleId > 0 && lessonId > 0 && lessonContentId > 0) {
      loadJobSheet();
    } else {
      Alert.alert('Select a lesson content first', 'Please select a module and lesson from the Lesson page before viewing the job sheet.');
      setError('Invalid module, lesson, or lesson content.');
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, loadJobSheet]);

  return (
    <ThemedView style={styles.screen}>
      <Header title="Job Sheet" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading job sheet...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load job sheet</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>{moduleItem?.module_name}</Text>
              <Text style={styles.headerSubtitle}>{lessonItem?.lesson_name}</Text>
              {contentItem ? <Text style={styles.contentName}>{contentItem.content_name}</Text> : null}
            </View>

            {jobSheets.length > 0 ? (
              jobSheets.map((sheet) => (
                <View key={sheet.job_id} style={styles.sheetCard}>
                  <Text style={styles.sheetTitle}>{sheet.job_title}</Text>
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Objectives</Text>
                    <Text style={styles.sectionText}>{sheet.job_objectives}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Materials</Text>
                    <Text style={styles.sectionText}>{sheet.job_materials}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Steps</Text>
                    <Text style={styles.sectionText}>{sheet.job_steps}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Assessment Method</Text>
                    <Text style={styles.sectionText}>{sheet.job_assesment_method || '-'}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyBoxText}>No job sheet records found for this lesson content.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="job" userId={Number(params.userId ?? '1')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  container: {
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  contentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyBoxText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.18)',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  errorTitle: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
  },
  errorDescription: {
    color: '#b91c1c',
    fontSize: 13,
    lineHeight: 18,
  },
});
