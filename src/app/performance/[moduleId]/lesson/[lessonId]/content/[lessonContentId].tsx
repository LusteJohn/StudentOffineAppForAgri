import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { LessonContentRecord, LessonRecord, ModuleRecord, PerformanceAnswerRecord, PerformanceChecklistRecord, createPerformanceAnswer, getModuleById, getLessonById, getLessonContentById, listPerformanceCheckByLessonContentId, listPerformanceAnswersByUser } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

export default function PerformanceCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ moduleId?: string; lessonId?: string; lessonContentId?: string; userId?: string }>();
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);
  const lessonContentId = Number(params.lessonContentId);
  const userId = Number(params.userId ?? '1');

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(null);
  const [checklist, setChecklist] = useState<PerformanceChecklistRecord[]>([]);
  const [answers, setAnswers] = useState<PerformanceAnswerRecord[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState('');

  const loadPerformanceCheck = useCallback(async () => {
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

      const checks = await listPerformanceCheckByLessonContentId(content.lesson_content_id);
      setChecklist(checks);

      if (Number.isInteger(userId) && userId > 0) {
        const allAnswers = await listPerformanceAnswersByUser(userId);
        setAnswers(allAnswers);
        const answerMap: Record<number, string> = {};
        for (const answer of allAnswers) {
          answerMap[answer.performance_id] = answer.performance_answer_text;
        }
        setSelectedAnswers(answerMap);

        const answeredIds = new Set(allAnswers.map((a) => a.performance_id));
        const allAnswered = checks.length > 0 && checks.every((c) => answeredIds.has(c.performance_id));
        setAlreadySubmitted(allAnswered);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load performance checklist.');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, userId]);

  useEffect(() => {
    if (Number.isInteger(moduleId) && Number.isInteger(lessonId) && Number.isInteger(lessonContentId) && moduleId > 0 && lessonId > 0 && lessonContentId > 0) {
      loadPerformanceCheck();
    } else {
      Alert.alert('Select a lesson content first', 'Please select a module and lesson from the Lesson page before viewing the performance checklist.');
      setError('Invalid module, lesson, or lesson content.');
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, loadPerformanceCheck]);

  const toggleAnswer = (performanceId: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [performanceId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (checklist.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      for (const item of checklist) {
        const answer = selectedAnswers[item.performance_id];
        if (!answer) {
          Alert.alert('Answer required', `Please select Yes or No for: ${item.performance_question}`);
          setSubmitting(false);
          return;
        }

        await createPerformanceAnswer({
          performance_id: item.performance_id,
          user_id: userId,
          performance_answer_text: answer,
        });
      }

      Alert.alert('Submitted', 'Performance checklist submitted successfully.');
      loadPerformanceCheck();
    } catch (submitError) {
      Alert.alert('Submit failed', submitError instanceof Error ? submitError.message : 'Unable to submit performance checklist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Performance Checklist" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading performance checklist...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load performance checklist</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>{moduleItem?.module_name}</Text>
              <Text style={styles.headerSubtitle}>{lessonItem?.lesson_name}</Text>
              {contentItem ? <Text style={styles.contentName}>{contentItem.content_name}</Text> : null}
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introText}>Did the trainee demonstrate the required performance?</Text>
            </View>

            {checklist.length > 0 ? (
              checklist.map((item) => {
                const currentAnswer = selectedAnswers[item.performance_id] ?? '';
                return (
                  <View key={item.performance_id} style={styles.checkItem}>
                    <View style={styles.checkItemLeft}>
                      <Text style={styles.checkOrder}>{item.order}.</Text>
                      <Text style={styles.checkQuestion}>{item.performance_question}</Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <Pressable
                        onPress={() => toggleAnswer(item.performance_id, 'Yes')}
                        style={[styles.radioButton, currentAnswer === 'Yes' && styles.radioButtonSelected]}
                      >
                        <Text style={[styles.radioLabel, currentAnswer === 'Yes' && styles.radioLabelSelected]}>Yes</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => toggleAnswer(item.performance_id, 'No')}
                        style={[styles.radioButton, currentAnswer === 'No' && styles.radioButtonSelected]}
                      >
                        <Text style={[styles.radioLabel, currentAnswer === 'No' && styles.radioLabelSelected]}>No</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyBoxText}>No performance checklist records found for this lesson content.</Text>
              </View>
            )}

            {checklist.length > 0 ? (
              alreadySubmitted ? (
                <View style={styles.alreadySubmittedCard}>
                  <Text style={styles.alreadySubmittedText}>You have already submitted this performance checklist.</Text>
                </View>
              ) : (
                <Pressable
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                >
                  <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Answers'}</Text>
                </Pressable>
              )
            ) : null}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="performance" userId={userId} />
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
  introCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
  },
  introText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
  },
  checkItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  checkItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkOrder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    minWidth: 24,
  },
  checkQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
    flex: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.2)',
    backgroundColor: '#f8fafc',
    minWidth: 44,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  radioLabelSelected: {
    color: '#ffffff',
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 15,
  },
  alreadySubmittedCard: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.18)',
  },
  alreadySubmittedText: {
    color: '#b91c1c',
    fontWeight: '700',
    fontSize: 14,
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