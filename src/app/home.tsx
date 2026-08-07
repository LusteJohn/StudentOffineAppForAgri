import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BottomNavbar } from "@/components/bottom-navbar";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import { useTheme } from "@/hooks/use-theme";
import {
  listCompetencies,
  listModules,
  listLessons,
  listLessonContent,
  listPerformanceAnswersByUser,
  listQuestionAnswersByUser,
  listLessonContentProgressByUser,
  LessonContentProgressRecord,
  listContinueLearning,
  ContinueLearningRecord,
  getStudentTutorialByUserId,
  updateStudentTutorial,
  createStudentTutorial,
  getWeeklyActivity,
  getDailyActivity,
} from "@/lib/auth-api";

function WeekCalendar({ data, color, onDayPress }: { data: number[]; color: string; onDayPress?: (index: number) => void }) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: days[i],
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });

  const maxValue = Math.max(...data, 1);

  return (
    <View style={styles.weekCalendar}>
      <View style={styles.weekHeader}>
        {weekDates.map((item, index) => (
          <Pressable
            key={index}
            style={styles.weekDayCell}
            onPress={() => onDayPress?.(index)}
          >
            {({ pressed }) => (
              <>
                <Text style={[styles.weekDayLabel, item.isToday && styles.weekDayLabelActive, pressed && { opacity: 0.6 }]}>
                  {item.day}
                </Text>
                <View style={[styles.weekDateCircle, item.isToday && styles.weekDateCircleActive, pressed && { opacity: 0.7 }]}>
                  <Text style={[styles.weekDateText, item.isToday && styles.weekDateTextActive, pressed && { opacity: 0.7 }]}>
                    {item.date}
                  </Text>
                </View>
                <View style={styles.weekActivityRow}>
                  {[1, 2, 3].map((level) => {
                    const threshold = (level / 3) * maxValue;
                    const hasActivity = (data[index] || 0) >= threshold;
                    return (
                      <View
                        key={level}
                        style={[
                          styles.weekActivityDot,
                          {
                            backgroundColor: hasActivity ? color : "#e2e8f0",
                          },
                          pressed && { opacity: 0.6 },
                        ]}
                      />
                    );
                  })}
                </View>
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LineChart({
  data,
  labels,
  color,
  screenWidth,
}: {
  data: number[];
  labels: string[];
  color: string;
  screenWidth: number;
}) {
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const chartHeight = 200;
  const chartWidth = screenWidth - 32;
  const padding = 40;

  const points = data.map((value, index) => {
    const x =
      padding +
      (index / Math.max(data.length - 1, 1)) * (chartWidth - padding * 2);
    const y =
      chartHeight -
      padding -
      ((value - minValue) / range) * (chartHeight - padding * 2);
    return { x, y, value, label: labels[index] };
  });

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = padding + ratio * (chartHeight - padding * 2);
    const maxY = maxValue;
    const minY = minValue;
    const val = Math.round(minY + ratio * (maxY - minY));
    return { y, val };
  });

  return (
    <View style={styles.lineChart}>
      <View style={styles.lineChartArea}>
        {gridLines.map((grid, i) => (
          <View key={`grid-${i}`} style={[styles.gridLine, { top: grid.y }]}>
            <Text style={styles.gridLabel}>{grid.val}</Text>
          </View>
        ))}
        {points.length > 1 && (
          <View style={styles.areaFill}>
            {points.map((p, i) => {
              if (i === 0) return null;
              const prev = points[i - 1];
              const dx = p.x - prev.x;
              const dy = p.y - prev.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              const midX = (prev.x + p.x) / 2 - length / 2;
              const midY = (prev.y + p.y) / 2;
              return (
                <View
                  key={`area-${i}`}
                  style={[
                    styles.areaSegment,
                    {
                      left: midX,
                      top: midY - 4,
                      width: length,
                      backgroundColor: color,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
        {points.length > 1 &&
          points.map((p, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            const dx = p.x - prev.x;
            const dy = p.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const midX = (prev.x + p.x) / 2 - length / 2;
            const midY = (prev.y + p.y) / 2;
            return (
              <View
                key={`line-${i}`}
                style={[
                  styles.lineSegment,
                  {
                    left: midX,
                    top: midY - 3,
                    width: length,
                    backgroundColor: color,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}
        {points.map((p, i) => (
          <View
            key={`dot-${i}`}
            style={[
              styles.lineDot,
              { left: p.x - 10, top: p.y - 10, backgroundColor: color },
            ]}
          >
            <Text style={styles.dotValue}>{p.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.lineChartLabels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.lineChartLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ProgressBar({
  data,
  onPress,
}: {
  data: {
    module_id: number;
    module_name: string;
    total: number;
    completed: number;
  }[];
  onPress: (index: number) => void;
}) {
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  return (
    <View style={styles.progressList}>
      {data.map((item, index) => {
        const percent =
          item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
        return (
          <View key={item.module_id} style={styles.progressItem}>
            <View style={styles.progressItemHeader}>
              <Text style={[{ color: theme.text }, styles.progressLabel]}>
                {item.module_name}
              </Text>
              <Text
                style={[{ color: theme.textSecondary }, styles.progressValue]}
              >
                {item.completed}/{item.total} ({percent}%)
              </Text>
            </View>
            <Pressable
              onPress={() => onPress(index)}
              style={[
                styles.progressBarTrack,
                {
                  backgroundColor: isDark
                    ? theme.backgroundSelected
                    : "#f1f5f9",
                },
              ]}
            >
              <View
                style={[styles.progressBarFill, { width: `${percent}%` }]}
              />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const PRIMARY = "#5bec13";

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  return (
    <View style={[styles.summaryCard, { backgroundColor: isDark ? "#2a2a2e" : "#f8fafc", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 163, 184, 0.12)" }]}>
      <View style={[styles.summaryCardIcon, { backgroundColor: isDark ? "rgba(91, 236, 19, 0.15)" : "#e7f8d5" }]}>
        <Ionicons name={icon as any} size={20} color={isDark ? "#86efac" : "#166534"} />
      </View>
      <Text style={[styles.summaryCardValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.summaryCardLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const router = useRouter();
  const userId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [competencies, setCompetencies] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonContents, setLessonContents] = useState<any[]>([]);
  const [performanceAnswers, setPerformanceAnswers] = useState<any[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<any[]>([]);
  const [lessonContentProgress, setLessonContentProgress] = useState<
    LessonContentProgressRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [continueLearning, setContinueLearning] = useState<
    ContinueLearningRecord[]
  >([]);
  const [continueLoading, setContinueLoading] = useState(false);
  const continueLearningLoaded = useRef(false);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(
    null,
  );
  const [selectedDayDate, setSelectedDayDate] = useState<string>("");
  const [dailyActivity, setDailyActivity] = useState<{
    questionAnswers: any[];
    jobSheetAnswers: any[];
    performanceAnswers: any[];
    lessonProgress: any[];
    lessonAchievements: any[];
    moduleAchievements: any[];
  } | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          backgroundColor: theme.background,
        },
        headerCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        heroCard: {
          backgroundColor: isDark ? "#212225" : "#f8fff3",
          borderColor: isDark
            ? "rgba(91, 236, 19, 0.18)"
            : "rgba(85, 225, 10, 0.22)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        heroBadge: {
          backgroundColor: isDark ? "rgba(91, 236, 19, 0.15)" : "#e4f8d6",
        },
        heroBadgeText: {
          color: isDark ? "#86efac" : "#166534",
        },
        heroBadgeSecondary: {
          backgroundColor: theme.backgroundElement,
        },
        heroBadgeSecondaryText: {
          color: theme.text,
        },
        appNameText: {
          color: theme.text,
        },
        welcomeText: {
          color: theme.text,
        },
        chartContainer: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        chartTitle: {
          color: theme.text,
        },
        noDataText: {
          color: theme.textSecondary,
        },
        progressLabel: {
          color: theme.text,
        },
        progressValue: {
          color: theme.textSecondary,
        },
        progressBarTrack: {
          backgroundColor: isDark ? "#2E3135" : "#f1f5f9",
        },
        surfaceCard: {
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        barLabelContainer: {
          backgroundColor: isDark ? "#2E3135" : "#f1f5f9",
        },
        barValue: {
          color: theme.text,
        },
        barLabel: {
          color: theme.textSecondary,
        },
        gridLine: {
          backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
        },
        gridLabel: {
          color: theme.textSecondary,
        },
        lineDot: {
          borderColor: theme.backgroundElement,
        },
        lineChartLabel: {
          color: theme.textSecondary,
        },
        tableContainer: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        tableHeader: {
          backgroundColor: isDark ? "#2E3135" : "#f1f5f9",
        },
        tableHeaderCell: {
          color: theme.textSecondary,
        },
        tableRow: {
          borderBottomColor: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(148, 163, 184, 0.08)",
        },
        tableRowEven: {
          backgroundColor: isDark ? "#1a1b1e" : "#f8fafc",
        },
        tableCell: {
          color: theme.text,
        },
        tableCellValue: {
          color: theme.text,
        },
        card: {
          backgroundColor: isDark
            ? "rgba(33, 34, 37, 0.9)"
            : "rgba(255, 255, 255, 0.78)",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255, 255, 255, 0.8)",
          shadowColor: isDark ? "#000000" : "#000",
        },
        secondaryButton: {
          backgroundColor: isDark
            ? "rgba(33, 34, 37, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(92, 107, 97, 0.18)",
        },
        secondaryButtonText: {
          color: theme.text,
        },
        loadingText: {
          color: theme.textSecondary,
        },
        modalOverlay: {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.45)"
            : "rgba(2, 6, 23, 0.45)",
        },
        modalCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        modalTitle: {
          color: theme.text,
        },
        modalCloseButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f1f5f9",
        },
        modalCloseText: {
          color: theme.text,
        },
        modalSummaryLabel: {
          color: theme.textSecondary,
        },
        progressContentCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        progressContentName: {
          color: isDark ? "#86efac" : "#166534",
        },
        progressContentLabel: {
          color: theme.textSecondary,
        },
        progressContentValue: {
          color: theme.text,
        },
        closeButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#0f172a",
        },
        closeButtonText: {
          color: isDark ? theme.text : "#ffffff",
        },
        emptyContentCard: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        emptyContentText: {
          color: theme.textSecondary,
        },
        activitySectionTitle: {
          color: theme.text,
        },
        activityItem: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(148, 163, 184, 0.12)",
        },
        activityItemText: {
          color: theme.text,
        },
        activityItemTime: {
          color: theme.textSecondary,
        },
      }),
    [theme, isDark],
  );

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(
    null,
  );
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [
        compData,
        modData,
        lessonData,
        contentData,
        perfAnswers,
        qAnswers,
        progressData,
        weeklyData,
      ] = await Promise.all([
        listCompetencies(),
        listModules(),
        listLessons(),
        listLessonContent(),
        listPerformanceAnswersByUser(userId),
        listQuestionAnswersByUser(userId),
        listLessonContentProgressByUser(userId),
        getWeeklyActivity(userId),
      ]);
      setCompetencies(compData);
      setModules(modData);
      setLessons(lessonData);
      setLessonContents(contentData);
      setPerformanceAnswers(perfAnswers);
      setQuestionAnswers(qAnswers);
      setLessonContentProgress(progressData);
      setWeeklyActivity(weeklyData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const existing = await getStudentTutorialByUserId(userId);
          if (existing) {
            if (existing.completed !== 1) {
              setTutorialVisible(true);
            }
          } else {
            await createStudentTutorial({
              user_id: userId,
              completed: false,
              step1_done: false,
              step2_done: false,
              step3_done: false,
            });
            setTutorialVisible(true);
          }
        } catch {
          setTutorialVisible(true);
        }
      })();
      (async () => {
        if (continueLearningLoaded.current) return;
        continueLearningLoaded.current = true;
        try {
          setContinueLoading(true);
          const data = await listContinueLearning(userId);
          setContinueLearning(data);
        } catch {
          // ignore
        } finally {
          setContinueLoading(false);
        }
      })();
    }, [userId]),
  );

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleStep1Complete = useCallback(async () => {
    const existing = await getStudentTutorialByUserId(userId);
    if (existing) {
      await updateStudentTutorial(existing.tutorial_id, { step1_done: 1 });
    } else {
      await createStudentTutorial({ user_id: userId, step1_done: true });
    }
  }, [userId]);

  const handleStep2Complete = useCallback(async () => {
    const existing = await getStudentTutorialByUserId(userId);
    if (existing) {
      await updateStudentTutorial(existing.tutorial_id, { step2_done: 1 });
    } else {
      await createStudentTutorial({ user_id: userId, step2_done: true });
    }
  }, [userId]);

  const handleStep3Complete = useCallback(async () => {
    const existing = await getStudentTutorialByUserId(userId);
    if (existing) {
      await updateStudentTutorial(existing.tutorial_id, {
        step3_done: 1,
        completed: 1,
      });
    } else {
      await createStudentTutorial({
        user_id: userId,
        step3_done: true,
        completed: true,
      });
    }
    setTutorialVisible(false);
  }, [userId]);

  const handleTutorialSkip = useCallback(async () => {
    const existing = await getStudentTutorialByUserId(userId);
    if (existing) {
      await updateStudentTutorial(existing.tutorial_id, { completed: 1 });
    } else {
      await createStudentTutorial({ user_id: userId, completed: true });
    }
    setTutorialVisible(false);
  }, [userId]);

  const moduleCompletionData = useMemo(() => {
    const readContentIds = new Set(
      lessonContentProgress
        .filter((p) => p.is_read)
        .map((p) => p.lesson_content_id),
    );
    return modules.map((mod: any) => {
      const modLessons = lessons.filter(
        (l: any) => l.module_id === mod.module_id,
      );
      const modContents = lessonContents.filter((c: any) =>
        modLessons.some((ml: any) => ml.lesson_id === c.lesson_id),
      );
      const completed = modContents.filter((c) =>
        readContentIds.has(c.lesson_content_id),
      ).length;
      return {
        module_id: mod.module_id,
        module_name: mod.module_name,
        total: modContents.length,
        completed,
      };
    });
  }, [modules, lessons, lessonContents, lessonContentProgress]);

  const selectedModule =
    selectedModuleIndex !== null
      ? moduleCompletionData[selectedModuleIndex]
      : null;

  const selectedModuleContents = useMemo(() => {
    if (!selectedModule) return [];
    const moduleId = selectedModule.module_id;
    const modLessons = lessons.filter((l: any) => l.module_id === moduleId);
    const modContents = lessonContents.filter((c: any) =>
      modLessons.some((ml: any) => ml.lesson_id === c.lesson_id),
    );
    const progressMap = new Map(
      lessonContentProgress.map((p) => [p.lesson_content_id, p]),
    );
    return modContents.map((content: any) => {
      const progress = progressMap.get(content.lesson_content_id);
      return {
        lesson_content_id: content.lesson_content_id,
        content_name: content.content_name,
        objectives: content.objectives,
        lesson_id: content.lesson_id,
        is_read: progress ? progress.is_read : false,
        read_at: progress ? progress.read_at : null,
      };
    });
  }, [selectedModule, lessons, lessonContents, lessonContentProgress]);

  const openModuleProgress = (moduleIndex: number) => {
    setSelectedModuleIndex(moduleIndex);
    setProgressModalVisible(true);
  };

  const closeModuleProgress = () => {
    setProgressModalVisible(false);
    setSelectedModuleIndex(null);
  };

  const openDayActivity = async (index: number) => {
    setSelectedDayIndex(index);
    setDailyLoading(true);
    setActivityModalVisible(true);
    try {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const target = new Date(monday);
      target.setDate(monday.getDate() + index);
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`;
      setSelectedDayDate(dateStr);
      const data = await getDailyActivity(userId, dateStr);
      setDailyActivity(data);
    } catch {
      setDailyActivity(null);
    } finally {
      setDailyLoading(false);
    }
  };

  const closeDayActivity = () => {
    setActivityModalVisible(false);
    setSelectedDayIndex(null);
    setSelectedDayDate("");
    setDailyActivity(null);
  };

  if (loading) {
    return (
      <ThemedView style={[styles.screen, dynamicStyles.screen]}>
        <Header title="Student Dashboard" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, dynamicStyles.loadingText]}>
              Loading dashboard...
            </Text>
          </View>
        </ScrollView>
        <BottomNavbar activeTab="home" userId={userId} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.screen, dynamicStyles.screen]}>
        <Header title="Student Dashboard" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to load dashboard</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        </ScrollView>
        <BottomNavbar activeTab="home" userId={userId} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Student Dashboard" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerCard,
            styles.heroCard,
            dynamicStyles.headerCard,
            dynamicStyles.heroCard,
          ]}
        >
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, dynamicStyles.heroBadge]}>
              <Text style={[styles.heroBadgeText, dynamicStyles.heroBadgeText]}>
                Learning progress
              </Text>
            </View>
            <View
              style={[
                styles.heroBadgeSecondary,
                dynamicStyles.heroBadgeSecondary,
              ]}
            >
              <Text
                style={[
                  styles.heroBadgeSecondaryText,
                  dynamicStyles.heroBadgeSecondaryText,
                ]}
              >
                Offline ready
              </Text>
            </View>
          </View>
          <ThemedText
            type="subtitle"
            style={[styles.appNameText, dynamicStyles.appNameText]}
          >
            Organic Agriculture Production Learning App
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.welcomeText, dynamicStyles.welcomeText]}
          >
            Welcome, Student #{userId}
          </ThemedText>
        </View>

        {continueLoading ? (
          <View
            style={[
              styles.card,
              styles.surfaceCard,
              dynamicStyles.card,
              dynamicStyles.surfaceCard,
            ]}
          >
            <ThemedText type="code" themeColor="textSecondary">
              Continue Learning
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.summaryText}>
              Loading your progress...
            </ThemedText>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              styles.surfaceCard,
              dynamicStyles.card,
              dynamicStyles.surfaceCard,
            ]}
          >
            <ThemedText type="code" themeColor="textSecondary">
              Continue Learning
            </ThemedText>
            {continueLearning.length === 0 ? (
              <ThemedText themeColor="textSecondary" style={styles.summaryText}>
                No continue learning data yet. Mark lesson content as read to
                see it here.
              </ThemedText>
            ) : (
              <>
                <ThemedText
                  themeColor="textSecondary"
                  style={styles.summaryText}
                >
                  Marked as read:{" "}
                  {continueLearning.filter((r) => r.is_read).length} | Next to
                  read: {continueLearning.filter((r) => r.is_next).length}
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.continueScroll}
                >
                  {continueLearning.map((record) => (
                    <Pressable
                      key={record.lesson_content_id}
                      style={[
                        styles.continueItem,
                        { backgroundColor: isDark ? "#2a2a2e" : "#f8fafc" },
                      ]}
                      onPress={() => {
                        router.push({
                          pathname: "/content-info/[id]",
                          params: {
                            id: String(record.lesson_content_id),
                            userId: String(userId),
                          },
                        });
                      }}
                    >
                      <View style={styles.continueItemContent}>
                        {record.is_read ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#5bec13"
                          />
                        ) : (
                          <Ionicons
                            name="arrow-forward-circle"
                            size={16}
                            color={PRIMARY}
                          />
                        )}
                        <View style={styles.continueItemText}>
                          <ThemedText
                            type="default"
                            style={styles.continueItemTitle}
                          >
                            {record.content_name}
                          </ThemedText>
                          <ThemedText
                            themeColor="textSecondary"
                            style={styles.continueItemLesson}
                          >
                            {record.lesson_name}
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <View style={[styles.card, styles.surfaceCard, dynamicStyles.card, dynamicStyles.surfaceCard]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.summaryCarousel}
          >
            <View style={styles.summaryCarouselContent}>
              <SummaryCard label="Competencies" value={String(competencies.length)} icon="school-outline" />
              <SummaryCard label="Modules" value={String(modules.length)} icon="library-outline" />
              <SummaryCard label="Lessons" value={String(lessons.length)} icon="book-outline" />
              <SummaryCard label="Lesson Contents" value={String(lessonContents.length)} icon="document-text-outline" />
            </View>
          </ScrollView>
        </View>

        <View style={[styles.chartContainer, dynamicStyles.chartContainer]}>
          <Text style={[styles.chartTitle, dynamicStyles.chartTitle]}>
            Weekly Activity
          </Text>
          <View style={styles.chart}>
            {weeklyActivity.some((v) => v > 0) ? (
              <WeekCalendar
                data={weeklyActivity}
                color={PRIMARY}
                onDayPress={openDayActivity}
              />
            ) : (
              <Text style={[styles.noDataText, dynamicStyles.noDataText]}>
                No activity data yet
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.chartContainer, dynamicStyles.chartContainer]}>
          <Text style={[styles.chartTitle, dynamicStyles.chartTitle]}>
            Module Completion
          </Text>
          {moduleCompletionData.length > 0 ? (
            <ProgressBar
              data={moduleCompletionData}
              onPress={openModuleProgress}
            />
          ) : (
            <Text style={[styles.noDataText, dynamicStyles.noDataText]}>
              No module data yet
            </Text>
          )}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="home" userId={userId} />

      <Modal
        transparent
        animationType="fade"
        visible={progressModalVisible}
        onRequestClose={closeModuleProgress}
      >
        {selectedModule ? (
          <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
            <View style={[styles.modalCard, dynamicStyles.modalCard]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                  {selectedModule.module_name}
                </Text>
                <Pressable
                  onPress={closeModuleProgress}
                  style={[
                    styles.modalCloseButton,
                    dynamicStyles.modalCloseButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalCloseText,
                      dynamicStyles.modalCloseText,
                    ]}
                  >
                    ✕
                  </Text>
                </Pressable>
              </View>

              <View style={styles.modalSummaryRow}>
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryValue}>
                    {selectedModule.completed}
                  </Text>
                  <Text
                    style={[
                      styles.modalSummaryLabel,
                      dynamicStyles.modalSummaryLabel,
                    ]}
                  >
                    Read
                  </Text>
                </View>
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryValue}>
                    {selectedModule.total}
                  </Text>
                  <Text
                    style={[
                      styles.modalSummaryLabel,
                      dynamicStyles.modalSummaryLabel,
                    ]}
                  >
                    Total Contents
                  </Text>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalContentList}
              >
                {selectedModuleContents.length > 0 ? (
                  selectedModuleContents.map((content: any) => (
                    <View
                      key={content.lesson_content_id}
                      style={[
                        styles.progressContentCard,
                        dynamicStyles.progressContentCard,
                      ]}
                    >
                      <View style={styles.progressContentHeader}>
                        <Text
                          style={[
                            styles.progressContentName,
                            dynamicStyles.progressContentName,
                          ]}
                        >
                          • {content.content_name}
                        </Text>
                        {content.is_read ? (
                          <View
                            style={[styles.progressBadge, styles.readBadge]}
                          >
                            <Text
                              style={[
                                styles.readBadgeText,
                                dynamicStyles.heroBadgeText,
                              ]}
                            >
                              ✓ Read
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[styles.progressBadge, styles.unreadBadge]}
                          >
                            <Text style={styles.unreadBadgeText}>Unread</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.progressContentBody}>
                        <Text
                          style={[
                            styles.progressContentLabel,
                            dynamicStyles.progressContentLabel,
                          ]}
                        >
                          Objectives
                        </Text>
                        <Text
                          style={[
                            styles.progressContentValue,
                            dynamicStyles.progressContentValue,
                          ]}
                        >
                          {content.objectives}
                        </Text>
                      </View>
                      {content.is_read && content.read_at ? (
                        <View style={styles.progressContentBody}>
                          <Text
                            style={[
                              styles.progressContentLabel,
                              dynamicStyles.progressContentLabel,
                            ]}
                          >
                            Read At
                          </Text>
                          <Text
                            style={[
                              styles.progressContentValue,
                              dynamicStyles.progressContentValue,
                            ]}
                          >
                            {content.read_at}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))
                ) : (
                  <View
                    style={[
                      styles.emptyContentCard,
                      dynamicStyles.emptyContentCard,
                    ]}
                  >
                    <Text
                      style={[
                        styles.emptyContentText,
                        dynamicStyles.emptyContentText,
                      ]}
                    >
                      No lesson contents available for this module.
                    </Text>
                  </View>
                )}
              </ScrollView>

              <Pressable
                onPress={closeModuleProgress}
                style={[styles.closeButton, dynamicStyles.closeButton]}
              >
                <Text
                  style={[
                    styles.closeButtonText,
                    dynamicStyles.closeButtonText,
                  ]}
                >
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={activityModalVisible}
        onRequestClose={closeDayActivity}
      >
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.modalCard, dynamicStyles.modalCard]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                {selectedDayDate
                  ? new Date(selectedDayDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Daily Activity'}
              </Text>
              <Pressable
                onPress={closeDayActivity}
                style={[
                  styles.modalCloseButton,
                  dynamicStyles.modalCloseButton,
                ]}
              >
                <Text
                  style={[
                    styles.modalCloseText,
                    dynamicStyles.modalCloseText,
                  ]}
                >
                  ✕
                </Text>
              </Pressable>
            </View>

            {dailyLoading ? (
              <Text style={styles.summaryText}>Loading activity...</Text>
            ) : dailyActivity ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalContentList}
              >
                {dailyActivity.questionAnswers.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Quiz Submissions ({dailyActivity.questionAnswers.length})
                    </Text>
                    {dailyActivity.questionAnswers.map((qa: any) => (
                      <View key={qa.answer_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Question #{qa.question_id}: {qa.answer_text}
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(qa.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.jobSheetAnswers.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Job Sheet Answers ({dailyActivity.jobSheetAnswers.length})
                    </Text>
                    {dailyActivity.jobSheetAnswers.map((jsa: any) => (
                      <View key={jsa.answer_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Job #{jsa.job_id}: {jsa.answer_text}
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(jsa.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.performanceAnswers.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Performance Answers ({dailyActivity.performanceAnswers.length})
                    </Text>
                    {dailyActivity.performanceAnswers.map((pa: any) => (
                      <View key={pa.performance_answer_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Performance #{pa.performance_id}: {pa.performance_answer_text}
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(pa.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.lessonProgress.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Lesson Content Progress ({dailyActivity.lessonProgress.length})
                    </Text>
                    {dailyActivity.lessonProgress.map((lp: any) => (
                      <View key={lp.progress_lesson_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Lesson Content #{lp.lesson_content_id}: {lp.is_read ? 'Marked as read' : 'Updated'}
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(lp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.lessonAchievements.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Lesson Achievements ({dailyActivity.lessonAchievements.length})
                    </Text>
                    {dailyActivity.lessonAchievements.map((la: any) => (
                      <View key={la.stud_lesson_achievement_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Lesson Achievement #{la.lesson_achievement_id} acquired
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(la.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.moduleAchievements.length > 0 && (
                  <View style={styles.activitySection}>
                    <Text style={[styles.activitySectionTitle, dynamicStyles.activitySectionTitle]}>
                      Module Achievements ({dailyActivity.moduleAchievements.length})
                    </Text>
                    {dailyActivity.moduleAchievements.map((ma: any) => (
                      <View key={ma.stud_module_achievement_id} style={[styles.activityItem, dynamicStyles.activityItem]}>
                        <Text style={[styles.activityItemText, dynamicStyles.activityItemText]}>
                          Module Achievement #{ma.module_achievement_id} acquired
                        </Text>
                        <Text style={[styles.activityItemTime, dynamicStyles.activityItemTime]}>
                          {new Date(ma.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {dailyActivity.questionAnswers.length === 0 &&
                  dailyActivity.jobSheetAnswers.length === 0 &&
                  dailyActivity.performanceAnswers.length === 0 &&
                  dailyActivity.lessonProgress.length === 0 &&
                  dailyActivity.lessonAchievements.length === 0 &&
                  dailyActivity.moduleAchievements.length === 0 && (
                    <Text style={[styles.noDataText, dynamicStyles.noDataText]}>
                      No activity recorded on this day.
                    </Text>
                  )}
              </ScrollView>
            ) : (
              <Text style={[styles.noDataText, dynamicStyles.noDataText]}>
                No activity data available.
              </Text>
            )}

            <Pressable
              onPress={closeDayActivity}
              style={[styles.closeButton, dynamicStyles.closeButton]}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  dynamicStyles.closeButtonText,
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <TutorialOverlay
        visible={tutorialVisible}
        userId={userId}
        onStep1Complete={handleStep1Complete}
        onStep2Complete={handleStep2Complete}
        onStep3Complete={handleStep3Complete}
        onCompleted={() => setTutorialVisible(false)}
        onSkip={handleTutorialSkip}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#edf4ea",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 12,
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    padding: 20,
    gap: 8,
  },
  heroCard: {
    backgroundColor: "#f8fff3",
    borderColor: "rgba(85, 225, 10, 0.22)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  heroBadge: {
    borderRadius: 999,
    backgroundColor: "#e4f8d6",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "700",
  },
  heroBadgeSecondary: {
    borderRadius: 999,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeSecondaryText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "700",
  },
  appNameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    padding: 16,
    gap: 12,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chart: {
    borderRadius: 16,
    overflow: "hidden",
  },
  barChart: {
    gap: 8,
  },
  progressList: {
    gap: 16,
  },
  progressItem: {
    gap: 8,
  },
  progressItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  progressBarTrack: {
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#5bec13",
    borderRadius: 12,
    minWidth: 2,
  },
  surfaceCard: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  barChartInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 180,
    paddingHorizontal: 8,
  },
  barItem: {
    alignItems: "center",
    gap: 4,
  },
  barLabelContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  barValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
  },
  bar: {
    width: 32,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  lineChart: {
    gap: 8,
  },
  lineChartArea: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  gridLabel: {
    position: "absolute",
    left: -36,
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "500",
  },
  areaFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  areaSegment: {
    position: "absolute",
    height: 8,
    opacity: 0.2,
    borderRadius: 4,
  },
  lineSegment: {
    position: "absolute",
    height: 5,
    borderRadius: 3,
  },
  lineDot: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  dotValue: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff",
  },
  lineChartLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 4,
  },
  lineChartLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  weekCalendar: {
    paddingVertical: 8,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  weekDayLabelActive: {
    color: "#5bec13",
  },
  weekDateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  weekDateCircleActive: {
    backgroundColor: "#5bec13",
  },
  weekDateText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  weekDateTextActive: {
    color: "#000000",
  },
  weekActivityRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  weekActivityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noDataText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingVertical: 20,
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    padding: 16,
    gap: 12,
  },
  tableWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.08)",
  },
  tableRowEven: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },
  tableCellValue: {
    fontWeight: "600",
    color: "#000000",
    textAlign: "right",
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 460,
    padding: 24,
    borderRadius: 28,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(92, 107, 97, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  secondaryButtonText: {
    fontWeight: "700",
    color: "#102318",
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "rgba(185, 28, 28, 0.18)",
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  errorTitle: {
    color: "#b91c1c",
    fontSize: 14,
    fontWeight: "700",
  },
  errorDescription: {
    color: "#b91c1c",
    fontSize: 13,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(2, 6, 23, 0.45)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: "#ffffff",
    alignSelf: "stretch",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  modalSummaryRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  modalSummaryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  modalSummaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563eb",
  },
  modalSummaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 2,
  },
  modalContentList: {
    flex: 1,
  },
  progressContentCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    backgroundColor: "#ffffff",
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  progressContentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  progressContentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
    lineHeight: 20,
    flex: 1,
  },
  progressBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  readBadge: {
    backgroundColor: "#5bec13",
  },
  unreadBadge: {
    backgroundColor: "#f59e0b",
  },
  readBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  progressContentBody: {
    gap: 4,
  },
  progressContentLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  progressContentValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
    lineHeight: 18,
  },
  closeButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#0f172a",
    marginTop: 8,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  emptyContentCard: {
    paddingVertical: 24,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  emptyContentText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  continueScroll: {
    marginTop: 8,
  },
  continueItem: {
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 160,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  continueItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  continueItemText: {
    flex: 1,
    gap: 2,
  },
  continueItemTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  continueItemLesson: {
    fontSize: 11,
  },
  summaryCarousel: {
    marginTop: 8,
  },
  summaryCarouselContent: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 8,
    minWidth: 120,
  },
  summaryCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  summaryCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  activitySection: {
    marginBottom: 16,
  },
  activitySectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  activityItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    marginBottom: 6,
    gap: 4,
  },
  activityItemText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },
  activityItemTime: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
});
