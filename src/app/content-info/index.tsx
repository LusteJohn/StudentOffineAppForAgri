import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContentInfoRecord, LessonContentRecord, LessonRecord, ModuleRecord, listContentInfo, listLessonContent, listLessons, listModules } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

type GroupedContentInfo = {
  module_id: number;
  module_name: string;
  lesson_id: number;
  lesson_name: string;
  items: ContentInfoRecord[];
};

export default function ContentInfoListScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = Number(params.userId ?? '1');

  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [lessonContents, setLessonContents] = useState<LessonContentRecord[]>([]);
  const [contentInfos, setContentInfos] = useState<ContentInfoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [moduleRecords, lessonRecords, contentRecords, lcRecords] = await Promise.all([
        listModules(),
        listLessons(),
        listContentInfo(),
        listLessonContent(),
      ]);
      setModules(moduleRecords);
      setLessons(lessonRecords);
      setContentInfos(contentRecords);
      setLessonContents(lcRecords);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load content info.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const grouped = useCallback((): GroupedContentInfo[] => {
    const lessonMap = new Map<number, LessonRecord>();
    for (const lesson of lessons) {
      lessonMap.set(lesson.lesson_id, lesson);
    }

    const moduleMap = new Map<number, ModuleRecord>();
    for (const moduleItem of modules) {
      moduleMap.set(moduleItem.module_id, moduleItem);
    }

    const lcMap = new Map<number, LessonContentRecord>();
    for (const lc of lessonContents) {
      lcMap.set(lc.lesson_content_id, lc);
    }

    const byLesson = new Map<number, ContentInfoRecord[]>();
    for (const info of contentInfos) {
      const existing = byLesson.get(info.lesson_content_id) || [];
      existing.push(info);
      byLesson.set(info.lesson_content_id, existing);
    }

    const result: GroupedContentInfo[] = [];
    for (const [lessonContentId, items] of byLesson) {
      const lc = lcMap.get(lessonContentId);
      if (!lc) continue;
      const lesson = lessonMap.get(lc.lesson_id);
      if (!lesson) continue;
      const moduleItem = moduleMap.get(lesson.module_id);
      if (!moduleItem) continue;

      result.push({
        module_id: moduleItem.module_id,
        module_name: moduleItem.module_name,
        lesson_id: lesson.lesson_id,
        lesson_name: lesson.lesson_name,
        items,
      });
    }

    result.sort((a, b) => a.module_id - b.module_id || a.lesson_id - b.lesson_id);
    return result;
  }, [modules, lessons, lessonContents, contentInfos]);

  const rows = grouped();

  return (
    <ThemedView style={styles.screen}>
      <Header title="Content Info" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading content info...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load content info</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {rows.map((row) => (
              <View key={`${row.module_id}-${row.lesson_id}`} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{row.module_name}</Text>
                  <Text style={styles.sectionSubtitle}>{row.lesson_name}</Text>
                </View>
                <View style={styles.itemList}>
                  {row.items.map((info) => (
                    <View key={info.content_info_id} style={styles.itemCard}>
                      <Text style={styles.itemLabel}>Label</Text>
                      <Text style={styles.itemValue}>{info.label}</Text>

                      <Text style={styles.itemLabel}>Description</Text>
                      <Text style={styles.itemValue} numberOfLines={3}>{info.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            {!rows.length ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No content info available.</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="content-info" userId={activeUserId} />
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
  list: {
    gap: 16,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 12,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  itemList: {
    gap: 10,
  },
  itemCard: {
    gap: 6,
    paddingVertical: 4,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
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
