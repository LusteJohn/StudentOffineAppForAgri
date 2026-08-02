import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCustomAlert } from '@/lib/custom-alert';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { LessonContentRecord, LessonRecord, ModuleRecord, createQuestionAnswersBatch, getModuleById, getLessonById, getLessonContentById, listQuestionInstructByLessonContentId, listQuestionContentByLessonContentId, listQuestionChoiceByQuestionId, listQuestionAnswersByUserAndQuestions } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

type QuestionWithChoices = {
  question: any;
  choices: any[];
};

function getCorrectAnswer(question: any, choices: any[]): string {
  if (!choices || choices.length === 0) return 'N/A';

  if (question.question_type === 'multiple_choice' || question.question_type === 'true_or_false') {
    const correctChoice = choices.find((c) => c.is_correct === 'correct');
    return correctChoice ? correctChoice.choice_text : 'N/A';
  }

  if (question.question_type === 'enumeration' || question.question_type === 'identification') {
    const openEnded = choices.find((c) => c.is_correct && c.is_correct.trim().length > 0 && c.is_correct !== 'correct');
    return openEnded ? openEnded.is_correct.trim() : 'N/A';
  }

  return 'N/A';
}

function isAnswerWrong(question: any, choices: any[], studentAnswer: string | undefined): boolean {
  if (!studentAnswer || String(studentAnswer).trim().length === 0) {
    return false;
  }

  if (question.question_type === 'multiple_choice') {
    const correctChoice = choices.find((c) => c.is_correct === 'correct');
    if (!correctChoice) return false;
    return studentAnswer !== correctChoice.choice_label;
  }

  if (question.question_type === 'true_or_false') {
    const correctChoice = choices.find((c) => c.is_correct === 'correct');
    if (!correctChoice) return false;
    return studentAnswer !== correctChoice.choice_text;
  }

  if (question.question_type === 'enumeration' || question.question_type === 'identification') {
    const openEnded = choices.find((c) => c.is_correct && c.is_correct.trim().length > 0 && c.is_correct !== 'correct');
    if (!openEnded) return false;
    return studentAnswer.trim().toLowerCase() !== openEnded.is_correct.trim().toLowerCase();
  }

  return false;
}

export default function ExerciseContentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ moduleId?: string; lessonId?: string; lessonContentId?: string; userId?: string }>();
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);
  const lessonContentId = Number(params.lessonContentId);

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(null);
  const [instructs, setInstructs] = useState<any[]>([]);
  const [questions, setQuestions] = useState<QuestionWithChoices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [hasExistingAnswers, setHasExistingAnswers] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const { showAlert } = useCustomAlert();

  const loadExercise = useCallback(async () => {
    setError('');
    setLoading(true);
    setAnswers({});
    setHasExistingAnswers(false);
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

      const [loadedInstructs, loadedQuestions] = await Promise.all([
        listQuestionInstructByLessonContentId(content.lesson_content_id),
        listQuestionContentByLessonContentId(content.lesson_content_id),
      ]);
      setInstructs(loadedInstructs);

      const questionsWithChoices: QuestionWithChoices[] = await Promise.all(
        loadedQuestions.map(async (q) => ({
          question: q,
          choices: await listQuestionChoiceByQuestionId(q.question_id),
        }))
      );
      setQuestions(questionsWithChoices);

      const userId = Number(params.userId ?? '1');
      const questionIds = loadedQuestions.map((q) => q.question_id);
      if (questionIds.length > 0 && userId > 0) {
        const existingAnswers = await listQuestionAnswersByUserAndQuestions(userId, questionIds);
        if (existingAnswers.length > 0) {
          setHasExistingAnswers(true);
          const initialAnswers: Record<number, string> = {};
          existingAnswers.forEach((record) => {
            initialAnswers[record.question_id] = record.answer_text;
          });
          setAnswers(initialAnswers);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load exercise.');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, params.userId]);

  useEffect(() => {
    if (Number.isInteger(moduleId) && Number.isInteger(lessonId) && Number.isInteger(lessonContentId) && moduleId > 0 && lessonId > 0 && lessonContentId > 0) {
      loadExercise();
    } else {
       showAlert('Select a lesson content first', 'Please select a lesson content from the Lesson page before viewing the exercise.');
      setError('Invalid module, lesson, or lesson content.');
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, loadExercise]);

  const renderChoices = (question: any, choices: any[], questionId: number) => {
    const selected = answers[questionId] || '';

    if (question.question_type === 'multiple_choice') {
      return choices.map((choice) => {
        const isSelected = selected === choice.choice_label;
        return (
          <Pressable
            key={choice.choice_id}
            style={[styles.choiceRow, isSelected && styles.choiceRowSelected]}
            onPress={() => setAnswers((prev) => ({ ...prev, [questionId]: choice.choice_label }))}>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>
              {choice.choice_label} {choice.choice_text}
            </Text>
          </Pressable>
        );
      });
    }

    if (question.question_type === 'true_or_false') {
      return ['True', 'False'].map((val) => {
        const isSelected = selected === val;
        return (
          <Pressable
            key={val}
            style={[styles.choiceRow, isSelected && styles.choiceRowSelected]}
            onPress={() => setAnswers((prev) => ({ ...prev, [questionId]: val }))}>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>
              {val}
            </Text>
          </Pressable>
        );
      });
    }

    return (
      <TextInput
        style={styles.textInput}
        placeholder="Type your answer here..."
        value={selected}
        onChangeText={(text) => setAnswers((prev) => ({ ...prev, [questionId]: text }))}
      />
    );
  };

  const handleSubmit = async () => {
    const userId = Number(params.userId ?? '1');

    if (hasExistingAnswers) {
      showAlert('Already submitted', 'You have already submitted answers for this lesson content. Duplicate submissions are not allowed.');
      return;
    }

    const unanswered = questions
      .filter((q) => {
        const answer = answers[q.question.question_id];
        return !answer || String(answer).trim().length === 0;
      })
      .map((q) => q.question.question);

    if (unanswered.length > 0) {
      const missingList = unanswered.map((text, index) => `${index + 1}. ${text}`).join('\n');
      showAlert(
        'Please answer all questions',
        `The following questions are still unanswered:\n\n${missingList}`
      );
      return;
    }

    const answerEntries = Object.entries(answers).map(([questionId, answer_text]) => ({
      question_id: Number(questionId),
      answer_text,
    }));

    showAlert(
      'Submit answers',
      'Are you sure you want to submit your answers? This will save your responses.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSubmitting(true);
            try {
              await createQuestionAnswersBatch({ user_id: userId, answers: answerEntries });
              setHasExistingAnswers(true);
              showAlert('Submitted', 'Your answers have been saved successfully.');
            } catch (submitError) {
              showAlert('Submit failed', submitError instanceof Error ? submitError.message : 'Unable to submit answers.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Exercise" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading exercise...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load exercise</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={[styles.headerCard, styles.surfaceCard]}>
              <Text style={styles.headerTitle}>{moduleItem?.module_name}</Text>
              <Text style={styles.headerSubtitle}>{lessonItem?.lesson_name}</Text>
              {contentItem ? <Text style={styles.contentName}>{contentItem.content_name}</Text> : null}
            </View>

            {instructs.map((instruct) => (
              <View key={instruct.instruct_id} style={[styles.instructCard, styles.surfaceCard, isCompact && styles.instructCardCompact]}>
                <Text style={styles.instructLabel}>Instructions</Text>
                <Text style={styles.instructTitle}>{instruct.question_title}</Text>
                <Text style={styles.instructText}>{instruct.question_instruction}</Text>
              </View>
            ))}

            {questions.map((q, idx) => (
              <View key={q.question.question_id} style={[styles.questionCard, styles.surfaceCard, isCompact && styles.questionCardCompact]}>
                <Text style={styles.questionNumber}>{idx + 1}. {q.question.question}</Text>
                <View style={styles.choicesContainer}>
                  {renderChoices(q.question, q.choices, q.question.question_id)}
                </View>
                {hasExistingAnswers && isAnswerWrong(q.question, q.choices, answers[q.question.question_id]) ? (
                  <View style={styles.correctAnswerContainer}>
                    <Text style={styles.correctAnswerLabel}>Correct Answer:</Text>
                    <Text style={styles.correctAnswerText}>{getCorrectAnswer(q.question, q.choices)}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {!loading && !error ? (
        <View style={styles.submitWrap}>
          {hasExistingAnswers ? (
            <View style={styles.submitBlockedBox}>
              <Text style={styles.submitBlockedText}>You have already submitted answers for this lesson content.</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}>
              <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Answers'}</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      <BottomNavbar activeTab="exercise" userId={Number(params.userId ?? '1')} />
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
    borderRadius: 18,
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
  surfaceCard: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  instructCard: {
    gap: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  instructLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  instructTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  instructText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 18,
  },
  instructCardCompact: {
    paddingVertical: 10,
  },
  questionCard: {
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
  },
  choicesContainer: {
    gap: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  choiceRowSelected: {
    borderColor: '#166534',
    backgroundColor: '#f0fdf4',
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  choiceTextSelected: {
    fontWeight: '700',
    color: '#166534',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#166534',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#166534',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffffff',
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
  submitWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  submitBlockedBox: {
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.18)',
  },
  submitBlockedText: {
    color: '#b91c1c',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  correctAnswerContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: 'rgba(22, 101, 52, 0.18)',
    gap: 4,
  },
  correctAnswerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  correctAnswerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    lineHeight: 18,
  },
});
