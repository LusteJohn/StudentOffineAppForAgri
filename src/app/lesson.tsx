import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { LessonContentRecord, LessonInfoRecord, LessonLinkRecord, LessonRecord, ModuleRecord, listLessons, listLessonContentByLessonId, listModules, listLessonInfoByLessonId, listLessonLinkByLessonId, listLessonContentProgressByUser } from '@/lib/auth-api';

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

type LessonGroup = {
  module_id: number;
  module_name: string;
  lessons: LessonRecord[];
};

export default function LessonScreen() {
  const params = useLocalSearchParams<{ userId?: string; moduleId?: string; lessonId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const initialModuleId = useMemo(() => {
    const parsed = Number(params.moduleId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [params.moduleId]);

  const initialLessonId = useMemo(() => {
    const parsed = Number(params.lessonId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [params.lessonId]);

  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [lessonContents, setLessonContents] = useState<LessonContentRecord[]>([]);
  const [lessonInfos, setLessonInfos] = useState<LessonInfoRecord[]>([]);
  const [lessonLinks, setLessonLinks] = useState<LessonLinkRecord[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonRecord | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.backgroundElement,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.12)',
    },
    headerTitle: {
      color: theme.text,
    },
    headerIcon: {
      color: theme.text,
    },
    sectionTitle: {
      color: theme.text,
    },
    moduleCard: {
      backgroundColor: theme.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    moduleName: {
      color: theme.text,
    },
    moduleCount: {
      color: theme.textSecondary,
    },
    moduleChevron: {
      color: theme.textSecondary,
    },
    lessonList: {
      borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    lessonRow: {
      borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148, 163, 184, 0.08)',
    },
    lessonTitle: {
      color: theme.text,
    },
    lessonMeta: {
      color: theme.textSecondary,
    },
    lessonViewButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.2)',
    },
    lessonViewButtonText: {
      color: theme.text,
    },
    emptyLessonRow: {
      backgroundColor: theme.backgroundElement,
    },
    emptyLessonText: {
      color: theme.textSecondary,
    },
    emptyState: {
      backgroundColor: theme.backgroundElement,
    },
    emptyStateText: {
      color: theme.textSecondary,
    },
    errorBox: {
      backgroundColor: '#fef2f2',
      borderColor: 'rgba(185, 28, 28, 0.18)',
    },
    errorTitle: {
      color: '#b91c1c',
    },
    errorDescription: {
      color: '#b91c1c',
    },
    modalOverlay: {
      backgroundColor: 'rgba(2, 6, 23, 0.45)',
    },
    modalCard: {
      backgroundColor: theme.backgroundElement,
    },
    modalTitle: {
      color: theme.text,
    },
    modalCloseButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
    },
    modalCloseText: {
      color: theme.text,
    },
    modalSection: {
      color: theme.text,
    },
    infoLabel: {
      color: theme.textSecondary,
    },
    infoValue: {
      color: theme.text,
    },
    readBadge: {
      backgroundColor: PRIMARY,
    },
    readBadgeText: {
      color: theme.text,
    },
    lockClosed: {
      color: theme.textSecondary,
    },
    closeButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#0f172a',
    },
    closeButtonText: {
      color: theme.text,
    },
    contentCard: {
      backgroundColor: theme.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    contentName: {
      color: isDark ? PRIMARY : '#166534',
    },
    contentLabel: {
      color: theme.textSecondary,
    },
    contentValue: {
      color: theme.text,
    },
    emptyContentCard: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f8fafc',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    emptyContentText: {
      color: theme.textSecondary,
    },
    lessonItemContainer: {
      backgroundColor: theme.backgroundElement,
    },
    viewContentButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#0f172a',
    },
    viewContentButtonDisabled: {
      backgroundColor: isDark ? theme.backgroundSelected : '#cbd5e1',
    },
    viewContentButtonText: {
      color: '#ffffff',
    },
    linkText: {
      color: '#2563eb',
    },
    horizontalCard: {
      backgroundColor: theme.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    horizontalLabel: {
      color: theme.textSecondary,
    },
    horizontalContent: {
      color: theme.text,
    },
  }), [theme, isDark]);

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [moduleRecords, lessonRecords] = await Promise.all([listModules(), listLessons()]);
      setModules(moduleRecords);
      setLessons(lessonRecords);
      if (initialModuleId && moduleRecords.some((m) => m.module_id === initialModuleId)) {
        setExpandedModuleId(initialModuleId);
      }
      if (initialLessonId && lessonRecords.some((l) => l.lesson_id === initialLessonId)) {
        const initialLesson = lessonRecords.find((l) => l.lesson_id === initialLessonId);
        if (initialLesson) {
          setSelectedLesson(initialLesson);
          setDetailVisible(true);
          const contents = await listLessonContentByLessonId(initialLesson.lesson_id);
          setLessonContents(contents);
          const [infos, links] = await Promise.all([
            listLessonInfoByLessonId(initialLesson.lesson_id),
            listLessonLinkByLessonId(initialLesson.lesson_id),
          ]);
          setLessonInfos(infos);
          setLessonLinks(links);
        }
      }

      const parsedUserId = Number(activeUserId);
      if (Number.isInteger(parsedUserId) && parsedUserId > 0) {
        const progress = await listLessonContentProgressByUser(parsedUserId);
        const progressMap: Record<number, boolean> = {};
        for (const p of progress) {
          progressMap[p.lesson_content_id] = p.is_read;
        }
        setProgressMap(progressMap);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load lessons.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialModuleId, initialLessonId, activeUserId]);

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
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Lessons" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Module Lessons</Text>
          {lessonGroups.map((group) => {
            const isExpanded = expandedModuleId === group.module_id;

            return (
              <View key={group.module_id} style={[styles.moduleCard, styles.surfaceCard, isCompact && styles.moduleCardCompact]}>
                <Pressable onPress={() => toggleModule(group.module_id)} style={styles.moduleHeader}>
                  <View style={styles.moduleHeaderText}>
                    <Text style={[styles.moduleName, dynamicStyles.moduleName]}>{group.module_name}</Text>
                    <Text style={[styles.moduleCount, dynamicStyles.moduleCount]}>{group.lessons.length} lessons</Text>
                  </View>
                  <Text style={[styles.moduleChevron, dynamicStyles.moduleChevron]}>{isExpanded ? '▲' : '▼'}</Text>
                </Pressable>

                {isExpanded ? (
                  <View>
                    <View style={[styles.lessonList, dynamicStyles.lessonList]}>
                      {group.lessons.length > 0 ? (
                        group.lessons.map((lesson) => (
                          <View key={lesson.lesson_id} style={styles.lessonItemContainer}>
                            <Pressable onPress={() => openLessonDetail(lesson)} style={[styles.lessonRow, isCompact && styles.lessonRowCompact]}>
                              <View style={styles.lessonIndicator} />
                              <View style={styles.lessonTextGroup}>
                                <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>{lesson.lesson_name}</Text>
                                <Text style={[styles.lessonMeta, dynamicStyles.lessonMeta]}>Order: {lesson.order_number}</Text>
                              </View>
                              <Pressable onPress={() => openLessonDetail(lesson)} style={[styles.lessonViewButton, isCompact && styles.lessonViewButtonCompact]}>
                                <Text style={[styles.lessonViewButtonText, dynamicStyles.lessonViewButtonText]}>View</Text>
                              </Pressable>
                            </Pressable>
                          </View>
                        ))
                      ) : (
                        <View style={[styles.emptyLessonRow, dynamicStyles.emptyLessonRow]}>
                          <Text style={[styles.emptyLessonText, dynamicStyles.emptyLessonText]}>No lessons available for this module.</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}

          {!lessonGroups.length && !error ? (
            <View style={[styles.emptyState, dynamicStyles.emptyState]}>
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>
                {loading ? 'Loading lessons...' : 'No lessons available.'}
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={[styles.errorBox, dynamicStyles.errorBox]}>
              <Text style={[styles.errorTitle, dynamicStyles.errorTitle]}>Unable to load lessons</Text>
              <Text style={[styles.errorDescription, dynamicStyles.errorDescription]}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="lesson" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={detailVisible} onRequestClose={closeLessonDetail}>
        {selectedLesson ? (
          <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
            <View style={[styles.modalCard, dynamicStyles.modalCard]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>Lesson</Text>
                <Pressable onPress={closeLessonDetail} style={[styles.modalCloseButton, dynamicStyles.modalCloseButton]}>
                  <Text style={[styles.modalCloseText, dynamicStyles.modalCloseText]}>✕</Text>
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Lesson ID</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>#{selectedLesson?.lesson_id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Module ID</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>#{selectedLesson?.module_id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Lesson Name</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{selectedLesson?.lesson_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Order</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{selectedLesson?.order_number}</Text>
                </View>
              </View>

              {lessonInfos.length > 0 ? (
                <View style={styles.infoCard}>
                  <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Lesson Info</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListContent}>
                    {lessonInfos.map((info) => (
                      <View key={info.lesson_info_id} style={[styles.horizontalCard, dynamicStyles.horizontalCard]}>
                        <Text style={[styles.horizontalLabel, dynamicStyles.horizontalLabel]}>{info.label}</Text>
                        <Text style={[styles.horizontalContent, dynamicStyles.horizontalContent]}>{info.content}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {lessonLinks.length > 0 ? (
                <View style={styles.infoCard}>
                  <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Lesson Links</Text>
                  {lessonLinks.map((link) => (
                    <View key={link.lesson_link_id} style={styles.infoRow}>
                      <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Link</Text>
                      <Text style={[styles.infoValue, dynamicStyles.infoValue, styles.linkText]}>{link.link}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

               <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Lesson Contents</Text>
               <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                 {lessonContents.length > 0 ? (
                   lessonContents.map((content, index) => {
                     const isFirst = index === 0;
                     const prevContent = lessonContents[index - 1];
                     const isContentUnlocked = isFirst || (prevContent ? !!progressMap[prevContent.lesson_content_id] : false);
                     return (
                       <View key={content.lesson_content_id} style={[styles.contentCard, dynamicStyles.contentCard]}>
                         <View style={styles.contentHeader}>
                           <Text style={[styles.contentName, dynamicStyles.contentName]}>• {content.content_name}</Text>
                           {progressMap[content.lesson_content_id] ? (
                             <View style={[styles.readBadge, dynamicStyles.readBadge]}>
                               <Text style={[styles.readBadgeText, dynamicStyles.readBadgeText]}>✓ Read</Text>
                             </View>
                           ) : null}
                           {!isContentUnlocked ? (
                             <Ionicons name="lock-closed" size={14} color={theme.textSecondary} style={styles.lockClosed} />
                           ) : null}
                         </View>
                         <View style={styles.contentBody}>
                           <Text style={[styles.contentLabel, dynamicStyles.contentLabel]}>Objectives</Text>
                           <Text style={[styles.contentValue, dynamicStyles.contentValue]}>{content.objectives}</Text>
                         </View>
                         <Pressable
                           onPress={() => isContentUnlocked && openContentInfo(content.lesson_content_id)}
                           disabled={!isContentUnlocked}
                           style={[styles.viewContentButton, !isContentUnlocked && styles.viewContentButtonDisabled, dynamicStyles.viewContentButton]}
                         >
                           <Text style={[styles.viewContentButtonText, dynamicStyles.viewContentButtonText]}>View Content</Text>
                         </Pressable>
                       </View>
                     );
                   })
                 ) : (
                  <View style={[styles.emptyContentCard, dynamicStyles.emptyContentCard]}>
                    <Text style={[styles.emptyContentText, dynamicStyles.emptyContentText]}>No lesson content available for this lesson.</Text>
                  </View>
                )}
 </ScrollView>

               <Pressable onPress={closeLessonDetail} style={[styles.closeButton, dynamicStyles.closeButton]}>
                 <Text style={[styles.closeButtonText, dynamicStyles.closeButtonText]}>Close</Text>
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
    borderBottomWidth: 1,
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
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    marginBottom: 4,
  },
  moduleCard: {
    borderRadius: 22,
    borderWidth: 1,
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
    lineHeight: 20,
  },
  moduleCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  moduleChevron: {
    fontSize: 12,
    fontWeight: '700',
  },
  lessonList: {
    borderTopWidth: 1,
  },
  surfaceCard: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  moduleCardCompact: {
    borderRadius: 18,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
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
    lineHeight: 20,
  },
  lessonMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  lessonRowCompact: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  lessonViewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  lessonViewButtonCompact: {
    minWidth: 56,
  },
  lessonViewButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyLessonRow: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyLessonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorBox: {
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
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
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSection: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  modalScrollContent: {
    gap: 10,
    paddingBottom: 16,
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
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  readBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  readBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lockClosed: {
    marginLeft: 4,
    opacity: 0.6,
  },
  closeButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    fontWeight: '700',
  },
  contentList: {
    maxHeight: 220,
  },
  contentCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  contentHeader: {
    gap: 4,
  },
  contentName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
  },
  contentBody: {
    gap: 4,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  contentValue: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  emptyContentCard: {
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyContentText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  lessonItemContainer: {
  },
  viewContentButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContentButtonDisabled: {
  },
  viewContentButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 12,
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
    gap: 6,
  },
  horizontalLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  horizontalContent: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
