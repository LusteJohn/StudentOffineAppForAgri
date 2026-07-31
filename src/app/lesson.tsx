import { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { LessonContentRecord, LessonInfoRecord, LessonLinkRecord, LessonRecord, ModuleRecord, listLessons, listLessonContentByLessonId, listModules, listLessonInfoByLessonId, listLessonLinkByLessonId } from '@/lib/auth-api';

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

type LessonGroup = {
  module_id: number;
  module_name: string;
  lessons: LessonRecord[];
};

export default function LessonScreen() {
  const params = useLocalSearchParams<{ userId?: string; moduleId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const initialModuleId = useMemo(() => {
    const parsed = Number(params.moduleId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [params.moduleId]);

  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [lessonContents, setLessonContents] = useState<LessonContentRecord[]>([]);
  const [lessonInfos, setLessonInfos] = useState<LessonInfoRecord[]>([]);
  const [lessonLinks, setLessonLinks] = useState<LessonLinkRecord[]>([]);
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
      if (initialModuleId && moduleRecords.some((m) => m.module_id === initialModuleId)) {
        setExpandedModuleId(initialModuleId);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load lessons.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialModuleId]);

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

  const openLessonDetail = async (lesson: LessonRecord) => {
    setSelectedLesson(lesson);
    setDetailVisible(true);
    try {
      const contents = await listLessonContentByLessonId(lesson.lesson_id);
      setLessonContents(contents);

      const [infos, links] = await Promise.all([
        listLessonInfoByLessonId(lesson.lesson_id),
        listLessonLinkByLessonId(lesson.lesson_id),
      ]);
      setLessonInfos(infos);
      setLessonLinks(links);
    } catch {
      setLessonContents([]);
      setLessonInfos([]);
      setLessonLinks([]);
    }
  };

  const openContentInfo = (lessonContentId: number) => {
    router.replace({
      pathname: '/content-info/[id]',
      params: { id: String(lessonContentId), userId: String(activeUserId) },
    });
  };

  const closeLessonDetail = () => {
    setDetailVisible(false);
    setSelectedLesson(null);
    setLessonContents([]);
    setLessonInfos([]);
    setLessonLinks([]);
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
                  <View>
                    <View style={styles.lessonList}>
                      {group.lessons.length > 0 ? (
                        group.lessons.map((lesson) => (
                          <View key={lesson.lesson_id} style={styles.lessonItemContainer}>
                            <Pressable onPress={() => openLessonDetail(lesson)} style={styles.lessonRow}>
                              <View style={styles.lessonIndicator} />
                              <View style={styles.lessonTextGroup}>
                                <Text style={styles.lessonTitle}>{lesson.lesson_name}</Text>
                                <Text style={styles.lessonMeta}>Order: {lesson.order_number}</Text>
                              </View>
                              <Pressable onPress={() => openLessonDetail(lesson)} style={styles.lessonViewButton}>
                                <Text style={styles.lessonViewButtonText}>View</Text>
                              </Pressable>
                            </Pressable>
                          </View>
                        ))
                      ) : (
                        <View style={styles.emptyLessonRow}>
                          <Text style={styles.emptyLessonText}>No lessons available for this module.</Text>
                        </View>
                      )}
                    </View>
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

      <BottomNavbar activeTab="lesson" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={detailVisible} onRequestClose={closeLessonDetail}>
        {selectedLesson ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Lesson</Text>
                <Pressable onPress={closeLessonDetail} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
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

              {lessonInfos.length > 0 ? (
                <View style={styles.infoCard}>
                  <Text style={styles.modalSection}>Lesson Info</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListContent}>
                    {lessonInfos.map((info) => (
                      <View key={info.lesson_info_id} style={styles.horizontalCard}>
                        <Text style={styles.horizontalLabel}>{info.label}</Text>
                        <Text style={styles.horizontalContent}>{info.content}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {lessonLinks.length > 0 ? (
                <View style={styles.infoCard}>
                  <Text style={styles.modalSection}>Lesson Links</Text>
                  {lessonLinks.map((link) => (
                    <View key={link.lesson_link_id} style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Link</Text>
                      <Text style={[styles.infoValue, styles.linkText]}>{link.link}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <Text style={styles.modalSection}>Lesson Contents</Text>
              <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                {lessonContents.length > 0 ? (
                  lessonContents.map((content) => (
                    <View key={content.lesson_content_id} style={styles.contentCard}>
                      <View style={styles.contentHeader}>
                        <Text style={styles.contentName}>• {content.content_name}</Text>
                      </View>
                      <View style={styles.contentBody}>
                        <Text style={styles.contentLabel}>Objectives</Text>
                        <Text style={styles.contentValue}>{content.objectives}</Text>
                      </View>
                      <Pressable onPress={() => openContentInfo(content.lesson_content_id)} style={styles.contentViewButton}>
                        <Text style={styles.contentViewButtonText}>View Content Info</Text>
                      </Pressable>
                      <Pressable onPress={() => router.replace({ pathname: '/exercise/[moduleId]/lesson/[lessonId]/content/[lessonContentId]', params: { moduleId: String(selectedLesson?.module_id), lessonId: String(selectedLesson?.lesson_id), lessonContentId: String(content.lesson_content_id), userId: String(activeUserId) } })} style={styles.exerciseButton}>
                        <Text style={styles.exerciseButtonText}>Exercise</Text>
                      </Pressable>
                      <Pressable onPress={() => router.replace({ pathname: '/job/[moduleId]/lesson/[lessonId]/content/[lessonContentId]', params: { moduleId: String(selectedLesson?.module_id), lessonId: String(selectedLesson?.lesson_id), lessonContentId: String(content.lesson_content_id), userId: String(activeUserId) } })} style={styles.jobSheetButton}>
                        <Text style={styles.jobSheetButtonText}>Job Sheet</Text>
                      </Pressable>
                      <Pressable onPress={() => router.replace({ pathname: '/performance/[moduleId]/lesson/[lessonId]/content/[lessonContentId]', params: { moduleId: String(selectedLesson?.module_id), lessonId: String(selectedLesson?.lesson_id), lessonContentId: String(content.lesson_content_id), userId: String(activeUserId) } })} style={styles.performanceButton}>
                        <Text style={styles.performanceButtonText}>Performance Check</Text>
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContentCard}>
                    <Text style={styles.emptyContentText}>No lesson content available for this lesson.</Text>
                  </View>
                )}
</ScrollView>

               <Pressable onPress={closeLessonDetail} style={styles.closeButton}>
                 <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
        ) : null}
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
    maxHeight: '85%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
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
  exerciseButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#166534',
    marginTop: 8,
  },
  exerciseButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  jobSheetButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#2563eb',
    marginTop: 8,
  },
  jobSheetButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  performanceButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#5bec13',
    marginTop: 8,
  },
  performanceButtonText: {
    color: '#000000',
    fontWeight: '700',
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
  modalSection: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  modalScrollContent: {
    gap: 10,
    paddingBottom: 16,
  },
  contentList: {
    maxHeight: 220,
  },
  contentCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 8,
  },
  contentHeader: {
    gap: 4,
  },
  contentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 20,
  },
  contentBody: {
    gap: 4,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  contentValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
  },
  emptyContentCard: {
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  emptyContentText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  lessonItemContainer: {
    backgroundColor: '#ffffff',
  },
  contentViewButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
  },
  contentViewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  linkText: {
    fontSize: 12,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  horizontalListContent: {
    gap: 10,
  },
  horizontalCard: {
    minWidth: 220,
    maxWidth: 260,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  horizontalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  horizontalContent: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
  },
});
