import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { LessonContentRecord, LessonRecord, ModuleRecord, getModuleById, getLessonById, getLessonContentById, listQuestionInstructByLessonContentId, listQuestionContentByLessonContentId, listQuestionChoiceByQuestionId } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

type QuestionWithChoices = {
  question: any;
  choices: any[];
};

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

  const loadExercise = useCallback(async () => {
    setError('');
    setLoading(true);
    setAnswers({});
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load exercise.');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId]);

  useEffect(() => {
    if (Number.isInteger(moduleId) && Number.isInteger(lessonId) && Number.isInteger(lessonContentId) && moduleId > 0 && lessonId > 0 && lessonContentId > 0) {
      loadExercise();
    } else {
      Alert.alert('Select a lesson content first', 'Please select a lesson content from the Lesson page before viewing the exercise.');
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
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>{moduleItem?.module_name}</Text>
              <Text style={styles.headerSubtitle}>{lessonItem?.lesson_name}</Text>
              {contentItem ? <Text style={styles.contentName}>{contentItem.content_name}</Text> : null}
            </View>

            {instructs.map((instruct) => (
              <View key={instruct.instruct_id} style={styles.instructCard}>
                <Text style={styles.instructLabel}>Instructions</Text>
                <Text style={styles.instructTitle}>{instruct.question_title}</Text>
                <Text style={styles.instructText}>{instruct.question_instruction}</Text>
              </View>
            ))}

            {questions.map((q, idx) => (
              <View key={q.question.question_id} style={styles.questionCard}>
                <Text style={styles.questionNumber}>{idx + 1}. {q.question.question}</Text>
                <View style={styles.choicesContainer}>
                  {renderChoices(q.question, q.choices, q.question.question_id)}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
});
