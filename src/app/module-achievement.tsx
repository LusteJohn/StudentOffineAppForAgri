import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { ModuleAchievementRecord, ModuleRecord, LessonRecord, listModuleAchievements, listModules, listLessons } from '@/lib/auth-api';

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

const achievementBadgeImages: Record<number, any> = {
  1: require('@/assets/module_badges/badge_m1.png'),
  2: require('@/assets/module_badges/badge_m2.png'),
  3: require('@/assets/module_badges/badge_m3.png'),
  4: require('@/assets/module_badges/badge_m4.png'),
  5: require('@/assets/module_badges/module_complete.png'),
};

const getAchievementBadgeImage = (achievementId: number) => {
  return achievementBadgeImages[achievementId] ?? null;
};

export default function ModuleAchievementScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [achievements, setAchievements] = useState<ModuleAchievementRecord[]>([]);
  const [modules, setModules] = useState<Record<number, ModuleRecord>>({});
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAchievementId, setExpandedAchievementId] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [achievementRecords, moduleRecords, lessonRecords] = await Promise.all([
        listModuleAchievements(),
        listModules(),
        listLessons(),
      ]);
      setAchievements(achievementRecords);
      setLessons(lessonRecords);
      const moduleMap: Record<number, ModuleRecord> = {};
      for (const m of moduleRecords) {
        moduleMap[m.module_id] = m;
      }
      setModules(moduleMap);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load achievements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const toggleAchievement = (achievementId: number) => {
    setExpandedAchievementId((current) => (current === achievementId ? null : achievementId));
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Module Achievements" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load achievements</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : loading ? (
          <Text style={styles.loadingText}>Loading achievements...</Text>
        ) : achievements.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No module achievements available yet.</Text>
          </View>
        ) : (
          <View style={styles.achievementList}>
            {achievements.map((achievement) => {
              const moduleRecord = achievement.module_id > 0 ? modules[achievement.module_id] : null;
              const lessonCount = moduleRecord
                ? lessons.filter((l) => l.module_id === moduleRecord.module_id).length
                : 0;
              const isCompleteBadge = achievement.module_id === 0;
              const isExpanded = expandedAchievementId === achievement.module_achievement_id;
              const moduleLessons = moduleRecord
                ? lessons.filter((l) => l.module_id === moduleRecord.module_id).sort((a, b) => a.order_number - b.order_number || a.lesson_id - b.lesson_id)
                : [];

              return (
                <View key={achievement.module_achievement_id} style={styles.achievementCardContainer}>
                  <Pressable
                    onPress={() => toggleAchievement(achievement.module_achievement_id)}
                    style={[styles.achievementCard, isCompleteBadge && styles.achievementCardComplete, isCompact && styles.achievementCardCompact]}
                  >
                    <View style={styles.achievementImageWrap}>
                      {getAchievementBadgeImage(achievement.module_achievement_id) ? (
                        <Image
                          source={getAchievementBadgeImage(achievement.module_achievement_id)}
                          style={styles.achievementBadge}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="trophy" size={32} color={PRIMARY} />
                      )}
                    </View>
                    <View style={styles.achievementTextGroup}>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      {moduleRecord ? (
                        <Text style={styles.achievementModule}>
                          {moduleRecord.module_name} • {lessonCount} lessons
                        </Text>
                      ) : isCompleteBadge ? (
                        <Text style={styles.achievementModule}>Overall completion badge</Text>
                      ) : (
                        <Text style={styles.achievementModule}>Module badge</Text>
                      )}
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                      size={18}
                      color="#94a3b8"
                      style={isExpanded ? { transform: [{ rotate: '90deg' }] } : undefined}
                    />
                  </Pressable>

                  {isExpanded && moduleLessons.length > 0 ? (
                    <View style={styles.lessonList}>
                      {moduleLessons.map((lesson) => (
                        <View key={lesson.lesson_id} style={styles.lessonItem}>
                          <View style={styles.lessonIndicator} />
                          <View style={styles.lessonTextGroup}>
                            <Text style={styles.lessonTitle}>{lesson.lesson_name}</Text>
                            <Text style={styles.lessonMeta}>Order: {lesson.order_number}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : isExpanded && moduleRecord && moduleLessons.length === 0 ? (
                    <View style={styles.emptyLessonRow}>
                      <Text style={styles.emptyLessonText}>No lessons available for this module.</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="module-achievement" userId={activeUserId} />
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
  loadingText: {
    fontSize: 15,
    color: '#64748b',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#0f172a',
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
    backgroundColor: '#f0fdf4',
    borderColor: 'rgba(34, 197, 94, 0.32)',
  },
  achievementCardCompact: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  achievementImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e8',
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
    color: '#0f172a',
    lineHeight: 20,
  },
  achievementModule: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  lessonList: {
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
    color: '#0f172a',
    lineHeight: 20,
  },
  lessonMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
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
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 48,
  },
  emptyStateText: {
    fontSize: 15,
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
