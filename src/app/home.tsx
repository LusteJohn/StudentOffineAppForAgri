import { useMemo, useState, useCallback, useEffect } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { listCompetencies, listModules, listLessons, listLessonContent, listPerformanceAnswersByUser, listQuestionAnswersByUser, listLessonContentProgressByUser, LessonContentProgressRecord } from '@/lib/auth-api';

const { width: screenWidth } = Dimensions.get('window');

function LineChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const chartHeight = 200;
  const chartWidth = screenWidth - 32;
  const padding = 40;

  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((value - minValue) / range) * (chartHeight - padding * 2);
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
        {points.length > 1 && points.map((p, i) => {
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
          <View key={`dot-${i}`} style={[styles.lineDot, { left: p.x - 10, top: p.y - 10, backgroundColor: color }]}>
            <Text style={styles.dotValue}>{p.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.lineChartLabels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.lineChartLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );
}

function BarChart({ data, labels, colors, onBarPress }: { data: number[]; labels: string[]; colors: string[]; onBarPress?: (index: number) => void }) {
  const maxValue = Math.max(...data, 1);
  const barWidth = Math.min(40, (screenWidth - 80) / data.length - 8);

  return (
    <View style={styles.barChart}>
      <View style={styles.barChartInner}>
        {data.map((value, index) => (
          <Pressable key={index} onPress={() => onBarPress?.(index)} style={styles.barItem}>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barValue}>{value}</Text>
            </View>
            <View style={[styles.bar, { height: (value / maxValue) * 160, backgroundColor: colors[index % colors.length] }]} />
            <Text style={styles.barLabel}>{labels[index]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
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
  const [lessonContentProgress, setLessonContentProgress] = useState<LessonContentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [compData, modData, lessonData, contentData, perfAnswers, qAnswers, progressData] = await Promise.all([
        listCompetencies(),
        listModules(),
        listLessons(),
        listLessonContent(),
        listPerformanceAnswersByUser(userId),
        listQuestionAnswersByUser(userId),
        listLessonContentProgressByUser(userId),
      ]);
      setCompetencies(compData);
      setModules(modData);
      setLessons(lessonData);
      setLessonContents(contentData);
      setPerformanceAnswers(perfAnswers);
      setQuestionAnswers(qAnswers);
      setLessonContentProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const totalLessons = lessons.length;
  const completedLessons = lessonContents.length;
  const totalPerformanceAnswers = performanceAnswers.length;
  const totalQuestionAnswers = questionAnswers.length;
  const totalRecords = totalPerformanceAnswers + totalQuestionAnswers;

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const moduleCompletionData = useMemo(() => {
    const readContentIds = new Set(
      lessonContentProgress.filter((p) => p.is_read).map((p) => p.lesson_content_id)
    );
    return modules.map((mod: any) => {
      const modLessons = lessons.filter((l: any) => l.module_id === mod.module_id);
      const modContents = lessonContents.filter((c: any) =>
        modLessons.some((ml: any) => ml.lesson_id === c.lesson_id)
      );
      const completed = modContents.filter((c) => readContentIds.has(c.lesson_content_id)).length;
      return {
        module_id: mod.module_id,
        module_name: mod.module_name,
        total: modContents.length,
        completed,
      };
    });
  }, [modules, lessons, lessonContents, lessonContentProgress]);

  const lineChartData = useMemo(() => {
    const labels = ['W1', 'W2', 'W3', 'W4'];
    const values = [5, 12, 8, totalRecords];
    return { labels, values };
  }, [totalRecords]);

  const barChartData = useMemo(() => {
    const labels = moduleCompletionData.map((m: any) => m.module_name.slice(0, 6));
    const values = moduleCompletionData.map((m: any) => m.completed);
    return { labels, values };
  }, [moduleCompletionData]);

  const barColors = useMemo(() => ['#2563eb', '#55e10a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'], []);

  const selectedModule = selectedModuleIndex !== null ? moduleCompletionData[selectedModuleIndex] : null;

  const selectedModuleContents = useMemo(() => {
    if (!selectedModule) return [];
    const moduleId = selectedModule.module_id;
    const modLessons = lessons.filter((l: any) => l.module_id === moduleId);
    const modContents = lessonContents.filter((c: any) =>
      modLessons.some((ml: any) => ml.lesson_id === c.lesson_id)
    );
    const progressMap = new Map(
      lessonContentProgress.map((p) => [p.lesson_content_id, p])
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

  const tableData = useMemo(() => {
    const rows = [
      { label: 'Competencies', value: String(competencies.length) },
      { label: 'Modules', value: String(modules.length) },
      { label: 'Lessons', value: String(lessons.length) },
      { label: 'Lesson Contents', value: String(lessonContents.length) },
      { label: 'Performance Answers', value: String(totalPerformanceAnswers) },
      { label: 'Question Answers', value: String(totalQuestionAnswers) },
      { label: 'Total Records', value: String(totalRecords) },
      { label: 'Progress', value: `${progressPercent}%` },
    ];
    return rows;
  }, [competencies, modules, lessons, lessonContents, totalPerformanceAnswers, totalQuestionAnswers, totalRecords, progressPercent]);

  if (loading) {
    return (
      <ThemedView style={styles.screen}>
        <Header title="Student Dashboard" userId={userId} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        </ScrollView>
        <BottomNavbar activeTab="home" userId={userId} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.screen}>
        <Header title="Student Dashboard" userId={userId} />
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
    <ThemedView style={styles.screen}>
      <Header title="Student Dashboard" userId={userId} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <ThemedText type="subtitle" style={styles.welcomeText}>
            Welcome, Student #{userId}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.progressText}>
            Overall Progress: {progressPercent}% ({completedLessons}/{totalLessons} lessons)
          </ThemedText>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Activity</Text>
          <View style={styles.chart}>
            {lineChartData.values.length > 0 ? (
              <LineChart data={lineChartData.values} labels={lineChartData.labels} color="#2563eb" />
            ) : (
              <Text style={styles.noDataText}>No activity data yet</Text>
            )}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Module Completion</Text>
          {barChartData.values.length > 0 ? (
            <BarChart data={barChartData.values} labels={barChartData.labels} colors={barColors} onBarPress={openModuleProgress} />
          ) : (
            <Text style={styles.noDataText}>No module data yet</Text>
          )}
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.chartTitle}>Data Records Overview</Text>
          <View style={styles.tableWrapper}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Record Type</Text>
              <Text style={styles.tableHeaderCell}>Count</Text>
            </View>
            {tableData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={styles.tableCell}>{row.label}</Text>
                <Text style={[styles.tableCell, styles.tableCellValue]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText type="code" themeColor="textSecondary">Dashboard summary</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.summaryText}>
            You have {totalRecords} total records across all categories.
            {competencies.length} competencies, {modules.length} modules, {lessons.length} lessons, and {lessonContents.length} lesson contents loaded.
          </ThemedText>
        </View>
      </ScrollView>

      <BottomNavbar activeTab="home" userId={userId} />

      <Modal transparent animationType="fade" visible={progressModalVisible} onRequestClose={closeModuleProgress}>
        {selectedModule ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>{selectedModule.module_name}</Text>
                <Pressable onPress={closeModuleProgress} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.modalSummaryRow}>
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryValue}>{selectedModule.completed}</Text>
                  <Text style={styles.modalSummaryLabel}>Read</Text>
                </View>
                <View style={styles.modalSummaryItem}>
                  <Text style={styles.modalSummaryValue}>{selectedModule.total}</Text>
                  <Text style={styles.modalSummaryLabel}>Total Contents</Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContentList}>
                {selectedModuleContents.length > 0 ? (
                  selectedModuleContents.map((content: any) => (
                    <View key={content.lesson_content_id} style={styles.progressContentCard}>
                      <View style={styles.progressContentHeader}>
                        <Text style={styles.progressContentName}>• {content.content_name}</Text>
                        {content.is_read ? (
                          <View style={[styles.progressBadge, styles.readBadge]}>
                            <Text style={styles.readBadgeText}>✓ Read</Text>
                          </View>
                        ) : (
                          <View style={[styles.progressBadge, styles.unreadBadge]}>
                            <Text style={styles.unreadBadgeText}>Unread</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.progressContentBody}>
                        <Text style={styles.progressContentLabel}>Objectives</Text>
                        <Text style={styles.progressContentValue}>{content.objectives}</Text>
                      </View>
                      {content.is_read && content.read_at ? (
                        <View style={styles.progressContentBody}>
                          <Text style={styles.progressContentLabel}>Read At</Text>
                          <Text style={styles.progressContentValue}>{content.read_at}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContentCard}>
                    <Text style={styles.emptyContentText}>No lesson contents available for this module.</Text>
                  </View>
                )}
              </ScrollView>

              <Pressable onPress={closeModuleProgress} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
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
    backgroundColor: '#edf4ea',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 12,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 20,
    gap: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  progressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 12,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chart: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  barChart: {
    gap: 8,
  },
  barChartInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    paddingHorizontal: 8,
  },
  barItem: {
    alignItems: 'center',
    gap: 4,
  },
  barLabelContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  bar: {
    width: 32,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  lineChart: {
    gap: 8,
  },
  lineChartArea: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    position: 'absolute',
    left: -36,
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '500',
  },
  areaFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  areaSegment: {
    position: 'absolute',
    height: 8,
    opacity: 0.2,
    borderRadius: 4,
  },
  lineSegment: {
    position: 'absolute',
    height: 5,
    borderRadius: 3,
  },
  lineDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotValue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  lineChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  lineChartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  noDataText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 12,
  },
  tableWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  tableCellValue: {
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    padding: 24,
    borderRadius: 28,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    shadowColor: '#000',
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryButtonText: {
    fontWeight: '700',
    color: '#102318',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
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
  modalSummaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  modalSummaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  modalSummaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
  },
  modalSummaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  modalContentList: {
    flex: 1,
  },
  progressContentCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  progressContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressContentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 20,
    flex: 1,
  },
  progressBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  readBadge: {
    backgroundColor: '#5bec13',
  },
  unreadBadge: {
    backgroundColor: '#f59e0b',
  },
  readBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressContentBody: {
    gap: 4,
  },
  progressContentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  progressContentValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
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
});