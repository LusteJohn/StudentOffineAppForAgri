import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { LessonRecord, ModuleRecord, listLessons, listModules } from '@/lib/auth-api';

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

type LessonGroup = {
  module_id: number;
  module_name: string;
  lessons: LessonRecord[];
};

export default function LessonScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonRecord | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [moduleRecords, lessonRecords] = await Promise.all([listModules(), listLessons()]);
      setModules(moduleRecords);
      setLessons(lessonRecords);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load lessons.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        if (isActive) {
          await loadData();
        }
      })();
      return () => {
        isActive = false;
      };
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModuleId((current) => (current === moduleId ? null : moduleId));
  };

  const openLessonDetail = (lesson: LessonRecord) => {
    setSelectedLesson(lesson);
    setDetailVisible(true);
  };

  const closeLessonDetail = () => {
    setDetailVisible(false);
    setSelectedLesson(null);
  };

  const lessonGroups = useMemo<LessonGroup[]>(() => {
    const groupMap = new Map<number, LessonRecord[]>();
    for (const lesson of lessons) {
      const existing = groupMap.get(lesson.module_id) || [];
      existing.push(lesson);
      groupMap.set(lesson.module_id, existing);
    }
    const groups: LessonGroup[] = [];
    for (const moduleItem of modules) {
      const moduleLessons = groupMap.get(moduleItem.module_id) || [];
      groups.push({
        module_id: moduleItem.module_id,
        module_name: moduleItem.module_name,
        lessons: moduleLessons.sort((a, b) => a.order_number - b.order_number || a.lesson_id - b.lesson_id),
      });
    }
    return groups;
  }, [modules, lessons]);

  return (
    <ThemedView style={styles.screen}>
      <Header title="Lessons" userId={activeUserId} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Module Lessons</Text>
          {lessonGroups.map((group) => {
            const isExpanded = expandedModuleId === group.module_id;

            return (
              <View key={group.module_id} style={styles.moduleCard}>
                <Pressable onPress={() => toggleModule(group.module_id)} style={styles.moduleHeader}>
                  <View style={styles.moduleHeaderText}>
                    <Text style={styles.moduleName}>{group.module_name}</Text>
                    <Text style={styles.moduleCount}>{group.lessons.length} lessons</Text>
                  </View>
                  <Text style={styles.moduleChevron}>{isExpanded ? '▲' : '▼'}</Text>
                </Pressable>

                {isExpanded ? (
                  <View style={styles.lessonList}>
                    {group.lessons.length > 0 ? (
                      group.lessons.map((lesson) => (
                        <Pressable key={lesson.lesson_id} onPress={() => openLessonDetail(lesson)} style={styles.lessonRow}>
                          <View style={styles.lessonIndicator} />
                          <View style={styles.lessonTextGroup}>
                            <Text style={styles.lessonTitle}>{lesson.lesson_name}</Text>
                            <Text style={styles.lessonMeta}>Order: {lesson.order_number}</Text>
                          </View>
                          <Pressable onPress={() => openLessonDetail(lesson)} style={styles.lessonViewButton}>
                            <Text style={styles.lessonViewButtonText}>View</Text>
                          </Pressable>
                        </Pressable>
                      ))
                    ) : (
                      <View style={styles.emptyLessonRow}>
                        <Text style={styles.emptyLessonText}>No lessons available for this module.</Text>
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}

          {!lessonGroups.length && !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {loading ? 'Loading lessons...' : 'No lessons available.'}
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Unable to load lessons</Text>
              <Text style={styles.errorDescription}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="library" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={detailVisible} onRequestClose={closeLessonDetail}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Lesson</Text>
              <Pressable onPress={closeLessonDetail} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lesson ID</Text>
                <Text style={styles.infoValue}>#{selectedLesson?.lesson_id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Module ID</Text>
                <Text style={styles.infoValue}>#{selectedLesson?.module_id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lesson Name</Text>
                <Text style={styles.infoValue}>{selectedLesson?.lesson_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order</Text>
                <Text style={styles.infoValue}>{selectedLesson?.order_number}</Text>
              </View>
            </View>

            <Pressable onPress={closeLessonDetail} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerIcon: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  moduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  moduleHeaderText: {
    flex: 1,
    gap: 4,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 20,
  },
  moduleCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  moduleChevron: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  lessonList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
  },
  lessonIndicator: {
    width: 4,
    height: 24,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  lessonTextGroup: {
    flex: 1,
    gap: 2,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
  },
  lessonMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  lessonViewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  lessonViewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  emptyLessonRow: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyLessonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  infoCard: {
    gap: 10,
    paddingVertical: 4,
  },
  infoRow: {
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#000000',
  },
  closeButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
