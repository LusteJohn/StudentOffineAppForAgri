import { useCallback, useMemo, useState } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { LessonContentRecord, LessonInfoRecord, LessonLinkRecord, LessonRecord, ModuleRecord, listLessons, listLessonContentByLessonId, listModules, listLessonInfoByLessonId, listLessonLinkByLessonId, listLessonContentProgressByUser, listLessonContentBookmarkByUser } from '@/lib/auth-api';

const moduleImages: Record<number, any> = {
  1: require('@/assets/learning_materials/modules/1/raise.jpeg'),
  2: require('@/assets/learning_materials/modules/2/vegetables.jpeg'),
  3: require('@/assets/learning_materials/modules/3/fertilizer.jpeg'),
  4: require('@/assets/learning_materials/modules/4/concoction.jpeg'),
};

const getModuleImage = (moduleId: number) => {
  return moduleImages[moduleId] ?? null;
};

const getLessonOrderImage = (moduleId: number, orderNumber: number) => {
  const map: Record<number, Record<number, any>> = {
    1: {
      1: require('@/assets/images/m1_1.jpeg'),
      2: require('@/assets/images/m1_2.jpeg'),
      3: require('@/assets/images/m1_3.jpeg'),
      4: require('@/assets/images/m1_4.jpeg'),
    },
    2: {
      1: require('@/assets/images/m2_1.jpeg'),
      2: require('@/assets/images/m2_2.jpeg'),
      3: require('@/assets/images/m2_3.jpeg'),
      4: require('@/assets/images/m2_4.jpeg'),
    },
    3: {
      1: require('@/assets/images/m3_1.jpeg'),
      2: require('@/assets/images/m3_2.jpeg'),
    },
    4: {
      1: require('@/assets/images/m4_1.jpeg'),
      2: require('@/assets/images/m4_2.jpeg'),
      3: require('@/assets/images/m4_3.jpeg'),
    },
  };
  return map[moduleId]?.[orderNumber] ?? null;
};

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
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [animationValues, setAnimationValues] = useState<Record<number, Animated.Value>>({});
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
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(148, 163, 184, 0.18)',
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    moduleThumbnail: {
      backgroundColor: 'transparent',
    },
    moduleThumbnailPlaceholder: {
      backgroundColor: 'transparent',
    },
    moduleMeta: {
      color: theme.textSecondary,
    },
    moduleChip: {
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.24)',
    },
    moduleChipText: {
      color: theme.textSecondary,
    },
    moduleTogglePill: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    moduleTogglePillText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    moduleName: {
      color: theme.text,
    },
    moduleChevron: {
      color: isDark ? '#000000' : '#0f172a',
    },
    lessonList: {
      backgroundColor: 'transparent',
    },
    lessonRow: {
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)',
    },
    lessonIndicator: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.15)' : '#e7f8d5',
    },
    lessonTitle: {
      color: theme.text,
    },
    lessonMeta: {
      color: theme.textSecondary,
    },
    lessonViewButton: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    lessonViewButtonText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    emptyLessonRow: {
      backgroundColor: 'transparent',
    },
    emptyLessonText: {
      color: theme.textSecondary,
    },
    emptyState: {
      backgroundColor: 'transparent',
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
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(2, 6, 23, 0.45)',
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
    contentDot: {
      backgroundColor: isDark ? '#86efac' : '#166534',
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
      backgroundColor: PRIMARY,
    },
    viewContentButtonDisabled: {
      backgroundColor: isDark ? theme.backgroundSelected : '#cbd5e1',
    },
    viewContentButtonText: {
      color: '#000000',
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
        const [progress, bookmarks] = await Promise.all([
          listLessonContentProgressByUser(parsedUserId),
          listLessonContentBookmarkByUser(parsedUserId),
        ]);
        const progressMap: Record<number, boolean> = {};
        for (const p of progress) {
          progressMap[p.lesson_content_id] = p.is_read;
        }
        const bookmarkMap: Record<number, boolean> = {};
        for (const b of bookmarks) {
          bookmarkMap[b.lesson_content_id] = b.is_bookmark;
        }
        setProgressMap(progressMap);
        setBookmarkMap(bookmarkMap);
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
    const wasExpanded = expandedModuleId === moduleId;
    setExpandedModuleId(wasExpanded ? null : moduleId);
    if (!wasExpanded) {
      setAnimationValues((prev) => {
        const updated = { ...prev };
        if (!updated[moduleId]) {
          updated[moduleId] = new Animated.Value(0);
        } else {
          updated[moduleId].setValue(0);
        }
        Animated.timing(updated[moduleId], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        return updated;
      });
    }
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
            const moduleImage = getModuleImage(group.module_id);
            const firstOrder = group.lessons.length > 0 ? group.lessons[0].order_number : 0;
            const lastOrder = group.lessons.length > 0 ? group.lessons[group.lessons.length - 1].order_number : 0;

            return (
              <View key={group.module_id} style={[styles.moduleCard, styles.surfaceCard, dynamicStyles.moduleCard, isCompact && styles.moduleCardCompact]}>
                <Pressable
                  onPress={() => toggleModule(group.module_id)}
                  style={({ pressed }) => [styles.moduleRow, pressed && styles.moduleRowPressed]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isExpanded }}
                  accessibilityLabel={`${group.module_name}, ${group.lessons.length} lessons`}
                >
                  <View style={styles.moduleMedia}>
                    {moduleImage ? (
                      <Image source={moduleImage} style={[styles.moduleThumbnail, dynamicStyles.moduleThumbnail]} resizeMode="cover" />
                    ) : (
                      <View style={[styles.moduleThumbnail, dynamicStyles.moduleThumbnailPlaceholder]} />
                    )}
                  </View>

                  <View style={styles.moduleInfo}>
                    <Text style={[styles.moduleName, dynamicStyles.moduleName]} numberOfLines={1}>
                      {group.module_name}
                    </Text>

                    <Text style={[styles.moduleMeta, dynamicStyles.moduleMeta]} numberOfLines={1}>
                      {group.lessons.length === 1
                        ? '1 lesson'
                        : `${group.lessons.length} lessons · order ${firstOrder}-${lastOrder}`}
                    </Text>

                    <View style={styles.moduleFooter}>
                      <View style={[styles.moduleChip, dynamicStyles.moduleChip]}>
                        <Text style={[styles.moduleChipText, dynamicStyles.moduleChipText]}>
                          {group.lessons.length} {group.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </Text>
                      </View>

                      <View style={[styles.moduleTogglePill, dynamicStyles.moduleTogglePill]}>
                        <Text style={[styles.moduleTogglePillText, dynamicStyles.moduleTogglePillText]}>
                          {isExpanded ? 'Hide' : 'Show'}
                        </Text>
                        <Text style={[styles.moduleToggleChevron, dynamicStyles.moduleChevron]}>
                          {isExpanded ? '▲' : '▼'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>

                {isExpanded ? (
                  <View style={styles.lessonListWrap}>
                    <View style={[styles.lessonList, dynamicStyles.lessonList]}>
                      {group.lessons.length > 0 ? (
                        group.lessons.map((lesson, lessonIndex) => {
                          const progress = animationValues[group.module_id];
                          const delay = lessonIndex * 50;
                          if (!progress) {
                            return (
                              <Pressable
                                key={lesson.lesson_id}
                                onPress={() => openLessonDetail(lesson)}
                                style={({ pressed }) => [styles.lessonRow, dynamicStyles.lessonRow, pressed && styles.lessonRowPressed]}
                                accessibilityRole="button"
                                accessibilityLabel={`View lesson ${lesson.lesson_name}`}
                              >
                                <Image source={getLessonOrderImage(group.module_id, lesson.order_number)} style={[styles.lessonIndicator, dynamicStyles.lessonIndicator]} resizeMode="cover" />
                                <View style={styles.lessonTextGroup}>
                                  <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]} numberOfLines={2}>
                                    {lesson.lesson_name}
                                  </Text>
                                  <Text style={[styles.lessonMeta, dynamicStyles.lessonMeta]} numberOfLines={1}>
                                    Order {lesson.order_number}
                                  </Text>
                                </View>
                                <View style={[styles.lessonViewButton, dynamicStyles.lessonViewButton]}>
                                  <Text style={[styles.lessonViewButtonText, dynamicStyles.lessonViewButtonText]}>View</Text>
                                </View>
                              </Pressable>
                            );
                          }
                          const opacity = progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          });
                          const translateY = progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          });
                          const animatedStyle = {
                            opacity,
                            transform: [{ translateY }],
                            transitionDelay: delay,
                          };
                          return (
                            <Animated.View key={lesson.lesson_id} style={[styles.lessonItemContainer, animatedStyle]}>
                              <Pressable
                                onPress={() => openLessonDetail(lesson)}
                                style={({ pressed }) => [styles.lessonRow, dynamicStyles.lessonRow, pressed && styles.lessonRowPressed]}
                                accessibilityRole="button"
                                accessibilityLabel={`View lesson ${lesson.lesson_name}`}
                              >
                                <Image source={getLessonOrderImage(group.module_id, lesson.order_number)} style={[styles.lessonIndicator, dynamicStyles.lessonIndicator]} resizeMode="cover" />
                                <View style={styles.lessonTextGroup}>
                                  <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]} numberOfLines={2}>
                                    {lesson.lesson_name}
                                  </Text>
                                  <Text style={[styles.lessonMeta, dynamicStyles.lessonMeta]} numberOfLines={1}>
                                    Order {lesson.order_number}
                                  </Text>
                                </View>
                                <View style={[styles.lessonViewButton, dynamicStyles.lessonViewButton]}>
                                  <Text style={[styles.lessonViewButtonText, dynamicStyles.lessonViewButtonText]}>View</Text>
                                </View>
                              </Pressable>
                            </Animated.View>
                          );
                        })
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
              <View style={styles.modalHero}>
                {(() => {
                  const heroImage = getModuleImage(selectedLesson.module_id);
                  if (heroImage) {
                    return <Image source={heroImage} style={styles.modalHeroImage} resizeMode="cover" />;
                  }
                  return null;
                })()}
                <Pressable onPress={closeLessonDetail} style={styles.modalCloseButton}>
                  <Text style={[styles.modalCloseText, dynamicStyles.modalCloseText]}>✕</Text>
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.modalBodyContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>{selectedLesson.lesson_name}</Text>

                <View style={styles.modalMetaGrid}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, dynamicStyles.infoLabel]}>Lesson</Text>
                    <Text style={[styles.metaValue, dynamicStyles.infoValue]}>{selectedLesson.lesson_name}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, dynamicStyles.infoLabel]}>Module</Text>
                    <Text style={[styles.metaValue, dynamicStyles.infoValue]}>
                      {modules.find((m) => m.module_id === selectedLesson.module_id)?.module_name ?? `#${selectedLesson.module_id}`}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, dynamicStyles.infoLabel]}>Order</Text>
                    <Text style={[styles.metaValue, dynamicStyles.infoValue]}>#{selectedLesson.order_number}</Text>
                  </View>
                </View>

                {lessonInfos.length > 0 ? (
                  <View style={styles.sectionBlock}>
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
                  <View style={styles.sectionBlock}>
                    <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Lesson Links</Text>
                    <View style={styles.linksList}>
                      {lessonLinks.map((link) => (
                        <View key={link.lesson_link_id} style={styles.linkRow}>
                          <View style={styles.linkIcon}>
                            <Ionicons name="link" size={14} color={isDark ? '#86efac' : '#166534'} />
                          </View>
                          <Text style={[styles.linkText, dynamicStyles.infoValue]} numberOfLines={2}>{link.link}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                <View style={styles.sectionBlock}>
                  <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Lesson Contents</Text>
                  <View style={styles.contentsList}>
                    {lessonContents.length > 0 ? (
                      lessonContents.map((content, index) => {
                        const isFirst = index === 0;
                        const prevContent = lessonContents[index - 1];
                        const isContentUnlocked = isFirst || (prevContent ? !!progressMap[prevContent.lesson_content_id] : false);
                        return (
                          <View key={content.lesson_content_id} style={[styles.contentCard, dynamicStyles.contentCard]}>
                            <View style={styles.contentHeader}>
                              <View style={styles.contentTitleRow}>
                                <View style={styles.contentDot} />
                                <Text style={[styles.contentName, dynamicStyles.contentName]}>{content.content_name}</Text>
                              </View>
                              <View style={styles.contentBadges}>
                                {progressMap[content.lesson_content_id] ? (
                                  <View style={[styles.readBadge, dynamicStyles.readBadge]}>
                                    <Text style={[styles.readBadgeText, dynamicStyles.readBadgeText]}>Read</Text>
                                  </View>
                                ) : null}
                                {bookmarkMap[content.lesson_content_id] ? (
                                  <Ionicons name="bookmark" size={16} color="#2563eb" />
                                ) : null}
                                {!isContentUnlocked ? (
                                  <Ionicons name="lock-closed" size={14} color={theme.textSecondary} style={styles.lockClosed} />
                                ) : null}
                              </View>
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
                        <Text style={[styles.emptyContentText, dynamicStyles.emptyContentText]}>No lesson content available.</Text>
                      </View>
                    )}
                  </View>
                </View>

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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  moduleRowPressed: {
    opacity: 0.85,
  },
  moduleMedia: {
    width: 76,
    height: 76,
  },
  moduleThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  moduleInfo: {
    flex: 1,
    gap: 4,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  moduleMeta: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  moduleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  moduleChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moduleTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  moduleTogglePillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  moduleToggleChevron: {
    fontSize: 10,
    fontWeight: '700',
  },
  lessonListWrap: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 8,
  },
  surfaceCard: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  moduleCardCompact: {
    borderRadius: 12,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    backgroundColor: 'transparent',
  },
  lessonRowPressed: {
    opacity: 0.8,
  },
  lessonIndicator: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '400',
    lineHeight: 16,
  },
  lessonViewButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lessonViewButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  lessonList: {
    gap: 8,
  },
  moduleChevron: {
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
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  modalHero: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeroImage: {
    width: '100%',
    height: '100%',
  },
  modalBodyContent: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    flex: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalSection: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  sectionBlock: {
    gap: 8,
  },
  modalMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flex: 1,
    minWidth: 90,
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  linksList: {
    gap: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  linkIcon: {
    marginTop: 2,
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
  contentsList: {
    gap: 8,
  },
  contentCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  contentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  contentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  contentBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

