import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { ModuleAchievementRecord, ModuleRecord, LessonRecord, LessonAchievementRecord, LessonContentRecord, LessonContentProgressRecord, StudentLessonAchievementRecord, listModuleAchievements, listModules, listLessons, listLessonAchievements, listLessonContentProgressByUser, listStudentLessonAchievementByUser, listStudentLessonAchievementByUserAndLessonAchievement, createStudentLessonAchievement, listLessonContentByLessonId } from '@/lib/auth-api';

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

const moduleAchievementBadgeImages: Record<number, any> = {
  1: require('@/assets/module_badges/badge_m1.png'),
  2: require('@/assets/module_badges/badge_m2.png'),
  3: require('@/assets/module_badges/badge_m3.png'),
  4: require('@/assets/module_badges/badge_m4.png'),
  5: require('@/assets/module_badges/module_complete.png'),
};

const lessonAchievementBadgeImages: Record<number, any> = {
  1: require('@/assets/lesson_badges/badge_m1_l1.png'),
  2: require('@/assets/lesson_badges/badge_m1_l2.png'),
  3: require('@/assets/lesson_badges/badge_m1_l3.png'),
  4: require('@/assets/lesson_badges/badge_m1_l4.png'),
  5: require('@/assets/lesson_badges/badge_m2_l1.png'),
  6: require('@/assets/lesson_badges/badge_m2_l2.png'),
  7: require('@/assets/lesson_badges/badge_m2_l3.png'),
  8: require('@/assets/lesson_badges/badge_m2_l4.png'),
  9: require('@/assets/lesson_badges/badge_m3_l1.png'),
  10: require('@/assets/lesson_badges/badge_m3_l2.png'),
  11: require('@/assets/lesson_badges/badge_m4_l1.png'),
  12: require('@/assets/lesson_badges/badge_m4_l2.png'),
  13: require('@/assets/lesson_badges/badge_m4_l3.png'),
};

const getModuleBadgeImage = (achievementId: number) => {
  return moduleAchievementBadgeImages[achievementId] ?? null;
};

const getLessonBadgeImage = (achievementId: number) => {
  return lessonAchievementBadgeImages[achievementId] ?? null;
};

type AchievementTab = 'module' | 'lesson';

export default function AchievementScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [moduleAchievements, setModuleAchievements] = useState<ModuleAchievementRecord[]>([]);
  const [lessonAchievements, setLessonAchievements] = useState<LessonAchievementRecord[]>([]);
  const [modules, setModules] = useState<Record<number, ModuleRecord>>({});
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
   const [lessonContents, setLessonContents] = useState<Record<number, LessonContentRecord[]>>({});
   const [lessonContentProgress, setLessonContentProgress] = useState<LessonContentProgressRecord[]>([]);
   const [studentLessonAchievements, setStudentLessonAchievements] = useState<StudentLessonAchievementRecord[]>([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AchievementTab>('module');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
    },
    tabContainer: {
      backgroundColor: theme.backgroundElement,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.12)',
    },
    tabButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
    },
    tabButtonText: {
      color: isDark ? theme.textSecondary : '#475569',
    },
    tabButtonTextActive: {
      color: '#ffffff',
    },
    loadingText: {
      color: theme.textSecondary,
    },
    achievementCardContainer: {
      backgroundColor: theme.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    achievementCardComplete: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#f0fdf4',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.28)' : 'rgba(34, 197, 94, 0.32)',
    },
    achievementImageWrap: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f8e8',
    },
    achievementName: {
      color: theme.text,
    },
    achievementModule: {
      color: theme.textSecondary,
    },
    lessonTitle: {
      color: theme.text,
    },
    lessonMeta: {
      color: theme.textSecondary,
    },
    emptyLessonText: {
      color: theme.textSecondary,
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
     acquiredBadge: {
       backgroundColor: isDark ? '#86efac' : '#166534',
       borderColor: isDark ? '#86efac' : '#166534',
     },
     acquiredLabel: {
       color: isDark ? '#86efac' : '#166534',
     },
     acquiredLabelPending: {
       color: isDark ? '#94a3b8' : '#94a3b8',
     },
   }), [theme, isDark]);

   const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [moduleAchievementRecords, lessonAchievementRecords, moduleRecords, lessonRecords, progressRecords, studentLessonAchievementRecords] = await Promise.all([
        listModuleAchievements(),
        listLessonAchievements(),
        listModules(),
        listLessons(),
        listLessonContentProgressByUser(activeUserId),
        listStudentLessonAchievementByUser(activeUserId),
      ]);
      setModuleAchievements(moduleAchievementRecords);
      setLessonAchievements(lessonAchievementRecords);
      setLessons(lessonRecords);
      setLessonContentProgress(progressRecords);
      setStudentLessonAchievements(studentLessonAchievementRecords);
      const moduleMap: Record<number, ModuleRecord> = {};
      for (const m of moduleRecords) {
        moduleMap[m.module_id] = m;
      }
      setModules(moduleMap);

      const contentMap: Record<number, LessonContentRecord[]> = {};
      const studentAchievedIds: number[] = [];
      for (const la of lessonAchievementRecords) {
        const contents = await listLessonContentByLessonId(la.lesson_id);
        contentMap[la.lesson_id] = contents;
        const contentIds = contents.map((c) => c.lesson_content_id);
        const readContentIds = new Set(
          progressRecords
            .filter((r) => r.is_read && contentIds.includes(r.lesson_content_id))
            .map((r) => r.lesson_content_id)
        );
        const allContentRead = contentIds.length > 0 && contentIds.every((id) => readContentIds.has(id));
        if (allContentRead) {
          studentAchievedIds.push(la.lesson_achievement_id);
        }
      }
      setLessonContents(contentMap);

      for (const achievedId of studentAchievedIds) {
        if (!studentLessonAchievementRecords.some((r) => r.lesson_achievement_id === achievedId)) {
          try {
            await createStudentLessonAchievement({
              lesson_achievement_id: achievedId,
              user_id: activeUserId,
            });
            const newRecord = await listStudentLessonAchievementByUserAndLessonAchievement(activeUserId, achievedId);
            if (newRecord.length > 0) {
              setStudentLessonAchievements((prev) => [...prev, ...newRecord]);
            }
          } catch {
            // ignore duplicate key or insert errors
          }
        }
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load achievements.');
    } finally {
      setLoading(false);
    }
   }, [activeUserId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const toggleModuleAchievement = (achievementId: number) => {
    setExpandedModuleId((current) => (current === achievementId ? null : achievementId));
  };

  const toggleLessonAchievement = (achievementId: number) => {
    setExpandedLessonId((current) => (current === achievementId ? null : achievementId));
  };

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Achievements" />

      <View style={[styles.tabContainer, dynamicStyles.tabContainer]}>
        <Pressable
          onPress={() => setActiveTab('module')}
          style={[styles.tabButton, activeTab === 'module' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'module' && styles.tabButtonTextActive, dynamicStyles.tabButtonText]}>Module</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('lesson')}
          style={[styles.tabButton, activeTab === 'lesson' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'lesson' && styles.tabButtonTextActive, dynamicStyles.tabButtonText]}>Lesson</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={[styles.errorBox, dynamicStyles.errorBox]}>
            <Text style={[styles.errorTitle, dynamicStyles.errorTitle]}>Unable to load achievements</Text>
            <Text style={[styles.errorDescription, dynamicStyles.errorDescription]}>{error}</Text>
          </View>
        ) : loading ? (
          <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading achievements...</Text>
        ) : activeTab === 'module' ? (
          moduleAchievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#94a3b8" />
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>No module achievements available yet.</Text>
            </View>
          ) : (
            <View style={styles.achievementList}>
              {moduleAchievements.map((achievement) => {
                const moduleRecord = achievement.module_id > 0 ? modules[achievement.module_id] : null;
                const lessonCount = moduleRecord
                  ? lessons.filter((l) => l.module_id === moduleRecord.module_id).length
                  : 0;
                const isCompleteBadge = achievement.module_id === 0;
                const isExpanded = expandedModuleId === achievement.module_achievement_id;
                const moduleLessons = moduleRecord
                  ? lessons.filter((l) => l.module_id === moduleRecord.module_id).sort((a, b) => a.order_number - b.order_number || a.lesson_id - b.lesson_id)
                  : [];

                return (
                  <View key={achievement.module_achievement_id} style={styles.achievementCardContainer}>
                    <Pressable
                      onPress={() => toggleModuleAchievement(achievement.module_achievement_id)}
                      style={[styles.achievementCard, isCompleteBadge && styles.achievementCardComplete, isCompact && styles.achievementCardCompact]}
                    >
                      <View style={styles.achievementImageWrap}>
                        {getModuleBadgeImage(achievement.module_achievement_id) ? (
                          <Image
                            source={getModuleBadgeImage(achievement.module_achievement_id)}
                            style={styles.achievementBadge}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="trophy" size={32} color={PRIMARY} />
                        )}
                      </View>
                      <View style={styles.achievementTextGroup}>
                        <Text style={[styles.achievementName, dynamicStyles.achievementName]}>{achievement.name}</Text>
                        {moduleRecord ? (
                          <Text style={[styles.achievementModule, dynamicStyles.achievementModule]}>
                            {moduleRecord.module_name} • {lessonCount} lessons
                          </Text>
                        ) : isCompleteBadge ? (
                          <Text style={[styles.achievementModule, dynamicStyles.achievementModule]}>Overall completion badge</Text>
                        ) : (
                          <Text style={[styles.achievementModule, dynamicStyles.achievementModule]}>Module badge</Text>
                        )}
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                        size={18}
                        color={theme.textSecondary}
                        style={isExpanded ? { transform: [{ rotate: '90deg' }] } : undefined}
                      />
                    </Pressable>

                    {isExpanded && moduleLessons.length > 0 ? (
                      <View style={styles.lessonList}>
                        {moduleLessons.map((lesson) => (
                          <View key={lesson.lesson_id} style={styles.lessonItem}>
                            <View style={styles.lessonIndicator} />
                            <View style={styles.lessonTextGroup}>
                              <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>{lesson.lesson_name}</Text>
                              <Text style={[styles.lessonMeta, dynamicStyles.lessonMeta]}>Order: {lesson.order_number}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : isExpanded && moduleRecord && moduleLessons.length === 0 ? (
                      <View style={styles.emptyLessonRow}>
                        <Text style={[styles.emptyLessonText, dynamicStyles.emptyLessonText]}>No lessons available for this module.</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )
        ) : (
          lessonAchievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>No lesson achievements available yet.</Text>
            </View>
          ) : (
            <View style={styles.achievementList}>
              {lessonAchievements.map((achievement) => {
                const lessonRecord = lessons.find((l) => l.lesson_id === achievement.lesson_id) ?? null;
                const moduleRecord = lessonRecord ? modules[lessonRecord.module_id] : null;
                const contents = lessonContents[achievement.lesson_id] ?? [];
                const isExpanded = expandedLessonId === achievement.lesson_achievement_id;
                const lessonContentIds = contents.map((c) => c.lesson_content_id);
                const readContentIds = new Set(
                  lessonContentProgress
                    .filter((r) => r.is_read && lessonContentIds.includes(r.lesson_content_id))
                     .map((r) => r.lesson_content_id)
                 );
                const allContentRead = contents.length > 0 && lessonContentIds.every((id) => readContentIds.has(id));
                const hasStudentRecord = studentLessonAchievements.some((r) => r.lesson_achievement_id === achievement.lesson_achievement_id);
                const isAcquired = hasStudentRecord || allContentRead;

                return (
                  <View key={achievement.lesson_achievement_id} style={styles.achievementCardContainer}>
                    <Pressable
                      onPress={() => toggleLessonAchievement(achievement.lesson_achievement_id)}
                      style={[styles.achievementCard, isCompact && styles.achievementCardCompact]}
                    >
                   <View style={[styles.achievementImageWrap, dynamicStyles.achievementImageWrap]}>
                         {getLessonBadgeImage(achievement.lesson_achievement_id) ? (
                           <Image
                             source={getLessonBadgeImage(achievement.lesson_achievement_id)}
                             style={styles.achievementBadge}
                             resizeMode="cover"
                           />
                         ) : (
                           <Ionicons name="trophy" size={32} color={PRIMARY} />
                         )}
                         {isAcquired ? (
                           <View style={[styles.acquiredBadge, dynamicStyles.acquiredBadge]}>
                             <Ionicons name="checkmark-circle" size={14} color={isDark ? '#000000' : '#ffffff'} />
                           </View>
                         ) : null}
                       </View>
                       <View style={styles.achievementTextGroup}>
                         <Text style={[styles.achievementName, dynamicStyles.achievementName]}>{achievement.name}</Text>
                         {lessonRecord && moduleRecord ? (
                           <Text style={[styles.achievementModule, dynamicStyles.achievementModule]}>
                             {moduleRecord.module_name} • {lessonRecord.lesson_name}
                           </Text>
                         ) : (
                           <Text style={[styles.achievementModule, dynamicStyles.achievementModule]}>Lesson badge</Text>
                         )}
                         {isAcquired ? (
                           <Text style={[styles.acquiredLabel, dynamicStyles.acquiredLabel]}>Acquired</Text>
                         ) : (
                           <Text style={[styles.acquiredLabel, dynamicStyles.acquiredLabelPending]}>Not acquired</Text>
                         )}
                       </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                        size={18}
                        color={theme.textSecondary}
                        style={isExpanded ? { transform: [{ rotate: '90deg' }] } : undefined}
                      />
                    </Pressable>

                    {isExpanded && contents.length > 0 ? (
                      <View style={styles.contentList}>
                        {contents.map((content) => (
                          <View key={content.lesson_content_id} style={styles.lessonItem}>
                            <View style={styles.lessonIndicator} />
                            <View style={styles.lessonTextGroup}>
                              <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>{content.content_name}</Text>
                              <Text style={[styles.lessonMeta, dynamicStyles.lessonMeta]}>Objectives: {content.objectives}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : isExpanded && contents.length === 0 ? (
                      <View style={styles.emptyLessonRow}>
                        <Text style={[styles.emptyLessonText, dynamicStyles.emptyLessonText]}>No content available for this lesson.</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )
        )}
      </ScrollView>

      <BottomNavbar activeTab="achievement" userId={activeUserId} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#166534',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 32,
  },
  achievementList: {
    gap: 12,
  },
  achievementCardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  achievementCardComplete: {
  },
  achievementCardCompact: {
    padding: 14,
    gap: 10,
  },
  achievementImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  achievementBadge: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  achievementTextGroup: {
    flex: 1,
    gap: 2,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  achievementModule: {
    fontSize: 12,
    fontWeight: '500',
  },
  lessonList: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.08)',
    gap: 4,
  },
  contentList: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.08)',
    gap: 4,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.06)',
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
  emptyLessonRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.08)',
  },
  emptyLessonText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 48,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
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
   acquiredBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
   acquiredLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
