import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AssetTextView } from "@/components/asset-text";
import { useTheme } from "@/hooks/use-theme";
import {
  getLessonsByModuleId,
  listLessonContentByLessonId,
  listQuestionChoiceByQuestionId,
  listQuestionContentByLessonContentId,
  QuestionChoiceRecord,
  QuestionContentRecord,
} from "@/lib/auth-api";

const PRIMARY = "#5bec13";

type PreTestQuestion = QuestionContentRecord & {
  question_type?: string;
  questionType?: string;
};

type PreTestQuestionWithChoices = {
  question: PreTestQuestion;
  choices: QuestionChoiceRecord[];
};

type PreTestProps = {
  visible: boolean;
  userId: number;
  moduleId: number;
  moduleName: string;
  onClose: () => void;
  onComplete: () => void;
};

function getQuestionType(question: PreTestQuestion): string {
  return question.question_type ?? question.questionType ?? "";
}

function getQuestionTypeLabel(type: string): string {
  switch (type) {
    case "multiple_choice":
      return "Multiple Choice";
    case "true_or_false":
      return "True or False";
    case "identification":
      return "Identification";
    case "enumeration":
      return "Enumeration";
    default:
      return "Exercise";
  }
}

function isOpenEnded(type: string): boolean {
  return type === "identification" || type === "enumeration";
}

/** Fisher-Yates shuffle so every pre-test attempt presents the questions in a different order. */
function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCorrectAnswer(
  question: PreTestQuestion,
  choices: QuestionChoiceRecord[],
): string {
  if (!choices || choices.length === 0) return "N/A";
  const type = getQuestionType(question);

  if (type === "multiple_choice" || type === "true_or_false") {
    const correct = choices.find((c) => c.is_correct === "correct");
    return correct ? correct.choice_text : "N/A";
  }

  const openEnded = choices.find(
    (c) =>
      c.is_correct &&
      c.is_correct.trim().length > 0 &&
      c.is_correct !== "correct",
  );
  return openEnded ? openEnded.is_correct.trim() : "N/A";
}

function isAnswerCorrect(
  question: PreTestQuestion,
  choices: QuestionChoiceRecord[],
  answer: string | undefined,
): boolean {
  if (!answer || answer.trim().length === 0) return false;
  const type = getQuestionType(question);

  if (type === "multiple_choice") {
    const correct = choices.find((c) => c.is_correct === "correct");
    return !!correct && answer === correct.choice_label;
  }

  if (type === "true_or_false") {
    const correct = choices.find((c) => c.is_correct === "correct");
    return !!correct && answer === correct.choice_text;
  }

  const openEnded = choices.find(
    (c) =>
      c.is_correct &&
      c.is_correct.trim().length > 0 &&
      c.is_correct !== "correct",
  );
  if (!openEnded) return false;
  return (
    answer.trim().toLowerCase() === openEnded.is_correct.trim().toLowerCase()
  );
}

export function PreTestModal({
  visible,
  userId,
  moduleId,
  moduleName,
  onClose,
  onComplete,
}: PreTestProps) {
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  const [questions, setQuestions] = useState<PreTestQuestionWithChoices[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.backgroundElement,
        },
        eyebrow: {
          color: theme.textSecondary,
        },
        title: {
          color: theme.text,
        },
        moduleName: {
          color: theme.textSecondary,
        },
        loadingText: {
          color: theme.textSecondary,
        },
        emptyText: {
          color: theme.textSecondary,
        },
        questionCard: {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(148, 163, 184, 0.06)",
          borderColor: isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(148, 163, 184, 0.18)",
        },
        questionTypeChip: {
          backgroundColor: isDark
            ? "rgba(91, 236, 19, 0.14)"
            : "#f1f8e8",
        },
        questionTypeText: {
          color: isDark ? "#86efac" : "#166534",
        },
        questionText: {
          color: theme.text,
        },
        optionRow: {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.75)",
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(148, 163, 184, 0.24)",
        },
        optionRowSelected: {
          borderColor: PRIMARY,
        },
        optionLabel: {
          color: theme.text,
        },
        optionText: {
          color: theme.text,
        },
        input: {
          color: theme.text,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255, 0.8)",
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(148, 163, 184, 0.24)",
        },
        feedbackCorrect: {
          borderColor: "#22c55e",
          backgroundColor: isDark
            ? "rgba(34, 197, 94, 0.12)"
            : "rgba(34, 197, 94, 0.10)",
        },
        feedbackWrong: {
          borderColor: "#ef4444",
          backgroundColor: isDark
            ? "rgba(239, 68, 68, 0.12)"
            : "rgba(239, 68, 68, 0.08)",
        },
        feedbackTitleCorrect: {
          color: isDark ? "#86efac" : "#15803d",
        },
        feedbackTitleWrong: {
          color: isDark ? "#fca5a5" : "#b91c1c",
        },
        feedbackAnswer: {
          color: theme.text,
        },
        correctAnswerText: {
          color: theme.text,
        },
        scoreText: {
          color: theme.text,
        },
        progressCount: {
          color: theme.text,
        },
        progressTrack: {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(148, 163, 184, 0.18)",
        },
        skipText: {
          color: theme.textSecondary,
        },
        secondaryButton: {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "#f1f5f9",
        },
        secondaryButtonText: {
          color: theme.text,
        },
        primaryButton: {
          backgroundColor: isDark ? "#86efac" : PRIMARY,
        },
        primaryButtonText: {
          color: isDark ? "#000000" : "#0f172a",
        },
      }),
    [theme, isDark],
  );

  // Pull exercises from the module's seed data: lessons -> lesson contents ->
  // questions -> choices. Only the first exercise is needed, so the search stops
  // as soon as one is found. Nothing is written back to the database.
  const loadPreTest = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const moduleLessons = await getLessonsByModuleId(moduleId);
      const contentsPerLesson = await Promise.all(
        moduleLessons.map((lesson) => listLessonContentByLessonId(lesson.lesson_id)),
      );
      const allContents = contentsPerLesson.flat();

      // Walk the lesson contents until a single exercise is found, then stop so
      // the rest of the module's questions are never queried.
      let pickedQuestion: PreTestQuestion | null = null;
      for (const content of allContents) {
        if (pickedQuestion) break;
        const group = await listQuestionContentByLessonContentId(
          content.lesson_content_id,
        );
        const first = group[0];
        if (first) {
          pickedQuestion = first as PreTestQuestion;
        }
      }

      const withChoices = pickedQuestion
        ? [
            {
              question: pickedQuestion,
              choices: await listQuestionChoiceByQuestionId(pickedQuestion.question_id),
            },
          ]
        : [];

      setQuestions(shuffleArray(withChoices));
      setCurrentIndex(0);
      setAnswers({});
      setSubmitted(false);
      setResults({});
    } catch (loadError) {
      setQuestions([]);
      setCurrentIndex(0);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the pre-test.",
      );
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await loadPreTest();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [visible, loadPreTest]);

  const answeredCount = useMemo(
    () =>
      questions.filter(({ question }) => {
        const answer = answers[question.question_id];
        return !!answer && answer.trim().length > 0;
      }).length,
    [questions, answers],
  );

  const score = useMemo(
    () => questions.filter(({ question }) => results[question.question_id]).length,
    [questions, results],
  );

  const currentItem = questions[currentIndex] ?? null;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleGoToQuestion = (index: number) => {
    setCurrentIndex(() => Math.min(Math.max(index, 0), questions.length - 1));
  };

  const handlePrevQuestion = () => {
    if (!isFirstQuestion) {
      handleGoToQuestion(currentIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmit();
      return;
    }
    handleGoToQuestion(currentIndex + 1);
  };

  const handleSelectOption = (questionId: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleTextAnswer = (questionId: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    const evaluated: Record<number, boolean> = {};
    for (const { question, choices } of questions) {
      evaluated[question.question_id] = isAnswerCorrect(
        question,
        choices,
        answers[question.question_id],
      );
    }
    setResults(evaluated);
    setCurrentIndex(0);
    setSubmitted(true);
  };

  // The modal is mounted/unmounted by the parent, so state is discarded on
  // close and a fresh pre-test is loaded the next time it opens.
  const handleClose = () => {
    onClose();
  };

  const renderQuestionBody = (item: PreTestQuestionWithChoices) => {
    const { question, choices } = item;
    const type = getQuestionType(question);
    const currentAnswer = answers[question.question_id] ?? "";

    if (isOpenEnded(type)) {
      return (
        <TextInput
          style={[styles.input, dynamicStyles.input]}
          value={currentAnswer}
          onChangeText={(value) => handleTextAnswer(question.question_id, value)}
          placeholder={type === "enumeration" ? "Enter your answers" : "Enter your answer"}
          placeholderTextColor={theme.textSecondary}
          multiline={type === "enumeration"}
          numberOfLines={type === "enumeration" ? 3 : 1}
          editable={!submitted}
        />
      );
    }

    return (
      <View style={styles.optionsGroup}>
        {choices.map((choice) => {
          const isSelected =
            type === "multiple_choice"
              ? currentAnswer === choice.choice_label
              : currentAnswer === choice.choice_text;
          const isCorrectChoice = choice.is_correct === "correct";
          const showCorrect = submitted && isCorrectChoice;
          const showWrong = submitted && isSelected && !isCorrectChoice;

          return (
            <Pressable
              key={choice.choice_id}
              onPress={() =>
                handleSelectOption(
                  question.question_id,
                  type === "multiple_choice"
                    ? choice.choice_label
                    : choice.choice_text,
                )
              }
              disabled={submitted}
              style={({ pressed }) => [
                styles.optionRow,
                dynamicStyles.optionRow,
                isSelected && dynamicStyles.optionRowSelected,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
                pressed && styles.pressed,
              ]}
            >
              {type === "multiple_choice" ? (
                <Text style={[styles.optionLabel, dynamicStyles.optionLabel]}>
                  {choice.choice_label}
                </Text>
              ) : null}
              <Text
                style={[
                  styles.optionText,
                  dynamicStyles.optionText,
                  showCorrect && styles.optionTextCorrect,
                  showWrong && styles.optionTextWrong,
                ]}
              >
                {choice.choice_text}
              </Text>
              {showCorrect ? (
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              ) : null}
              {showWrong ? (
                <Ionicons name="close-circle" size={18} color="#ef4444" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, dynamicStyles.card]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.eyebrow, dynamicStyles.eyebrow]}>Pre-test</Text>
              <Text style={[styles.title, dynamicStyles.title]}>Quick check</Text>
              <Text style={[styles.moduleName, dynamicStyles.moduleName]} numberOfLines={2}>
                {moduleName}
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close pre-test"
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <Text style={[styles.loadingText, dynamicStyles.loadingText]}>
                Loading pre-test...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerState}>
              <Ionicons name="alert-circle-outline" size={36} color="#b91c1c" />
              <Text style={[styles.emptyText, dynamicStyles.emptyText]}>{error}</Text>
              <Pressable
                onPress={loadPreTest}
                style={[styles.primaryButton, dynamicStyles.primaryButton, styles.retryButton]}
              >
                <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : questions.length === 0 ? (
            <View style={styles.centerState}>
              <Ionicons name="document-text-outline" size={36} color={theme.textSecondary} />
              <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                No exercises available for this module yet.
              </Text>
              <Pressable
                onPress={onComplete}
                style={[styles.primaryButton, dynamicStyles.primaryButton, styles.retryButton]}
              >
                <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                  Continue to lesson
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.progressBlock}>
                <View style={styles.progressTextRow}>
                  <Text style={[styles.progressCount, dynamicStyles.progressCount]}>
                    Question {currentIndex + 1} of {questions.length}
                  </Text>
                  {submitted ? (
                    <View style={styles.scoreRow}>
                      <Ionicons name="ribbon-outline" size={16} color={PRIMARY} />
                      <Text style={[styles.scoreText, dynamicStyles.scoreText]}>
                        Score: {score}/{questions.length}
                      </Text>
                    </View>
                  ) : questions.length > 1 ? (
                    <Text style={[styles.answeredCount, dynamicStyles.moduleName]}>
                      {answeredCount}/{questions.length} answered
                    </Text>
                  ) : null}
                </View>
                {questions.length > 1 ? (
                  <View style={[styles.progressTrack, dynamicStyles.progressTrack]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${((currentIndex + 1) / questions.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                ) : null}
              </View>

              <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.instructions, dynamicStyles.moduleName]}>
                  {submitted
                    ? "Review your answer below. The correct answer is always shown."
                    : "Answer this quick check before starting the module. Nothing you answer here is saved."}
                </Text>

                {currentItem
                  ? (() => {
                      const { question, choices } = currentItem;
                      const wasCorrect = results[question.question_id];
                      const correctAnswer = getCorrectAnswer(question, choices);

                      return (
                        <View
                          key={question.question_id}
                          style={[
                            styles.questionCard,
                            dynamicStyles.questionCard,
                            submitted &&
                              (wasCorrect
                                ? dynamicStyles.feedbackCorrect
                                : dynamicStyles.feedbackWrong),
                          ]}
                        >
                          <View style={styles.questionHeader}>
                            <View style={[styles.questionTypeChip, dynamicStyles.questionTypeChip]}>
                              <Text style={[styles.questionTypeText, dynamicStyles.questionTypeText]}>
                                {getQuestionTypeLabel(getQuestionType(question))}
                              </Text>
                            </View>
                            <Text style={[styles.questionNumber, dynamicStyles.moduleName]}>
                              Q{currentIndex + 1}
                            </Text>
                          </View>

                          <AssetTextView
                            value={question.question}
                            style={[styles.questionText, dynamicStyles.questionText]}
                          />

                          {renderQuestionBody(currentItem)}

                          {submitted ? (
                            <View style={styles.feedbackBlock}>
                              <View style={styles.feedbackTitleRow}>
                                <Ionicons
                                  name={wasCorrect ? "checkmark-circle" : "close-circle"}
                                  size={18}
                                  color={wasCorrect ? "#22c55e" : "#ef4444"}
                                />
                                <Text
                                  style={[
                                    styles.feedbackTitle,
                                    wasCorrect
                                      ? dynamicStyles.feedbackTitleCorrect
                                      : dynamicStyles.feedbackTitleWrong,
                                  ]}
                                >
                                  {wasCorrect ? "Correct" : "Wrong"}
                                </Text>
                              </View>
                              <Text style={[styles.feedbackAnswer, dynamicStyles.feedbackAnswer]}>
                                Correct answer:{" "}
                                <Text style={[styles.correctAnswerText, dynamicStyles.correctAnswerText]}>
                                  {correctAnswer}
                                </Text>
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      );
                    })()
                  : null}
              </ScrollView>

              {!submitted ? (
                <Pressable onPress={onComplete} style={styles.skipLink}>
                  <Text style={[styles.skipText, dynamicStyles.skipText]}>Skip and continue</Text>
                </Pressable>
              ) : null}

              <View style={styles.buttonRow}>
                {questions.length > 1 ? (
                  <Pressable
                    onPress={handlePrevQuestion}
                    disabled={isFirstQuestion}
                    style={[
                      styles.secondaryButton,
                      dynamicStyles.secondaryButton,
                      styles.actionButton,
                      isFirstQuestion && styles.buttonDisabled,
                    ]}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={18}
                      color={isFirstQuestion ? theme.textSecondary : theme.text}
                    />
                    <Text
                      style={[
                        styles.secondaryButtonText,
                        dynamicStyles.secondaryButtonText,
                      ]}
                    >
                      Previous
                    </Text>
                  </Pressable>
                ) : null}

                {submitted ? (
                  isLastQuestion ? (
                    <Pressable
                      onPress={onComplete}
                      style={[styles.primaryButton, dynamicStyles.primaryButton, styles.actionButton]}
                    >
                      <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                        Continue to lesson
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={handleNextQuestion}
                      style={[styles.primaryButton, dynamicStyles.primaryButton, styles.actionButton]}
                    >
                      <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                        Next
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={isDark ? "#000000" : "#0f172a"}
                      />
                    </Pressable>
                  )
                ) : isLastQuestion ? (
                  <Pressable
                    onPress={handleSubmit}
                    style={[styles.primaryButton, dynamicStyles.primaryButton, styles.actionButton]}
                  >
                    <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                      Submit
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleNextQuestion}
                    style={[styles.primaryButton, dynamicStyles.primaryButton, styles.actionButton]}
                  >
                    <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                      Next
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={isDark ? "#000000" : "#0f172a"}
                    />
                  </Pressable>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    maxHeight: "90%",
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  moduleName: {
    fontSize: 13,
    fontWeight: "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  centerState: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    gap: 12,
    paddingBottom: 4,
  },
  instructions: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  progressBlock: {
    gap: 6,
  },
  progressTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  progressCount: {
    fontSize: 13,
    fontWeight: "700",
  },
  answeredCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: PRIMARY,
  },
  skipLink: {
    alignSelf: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "700",
  },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  questionTypeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  questionTypeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: "700",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  optionsGroup: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  optionCorrect: {
    borderColor: "#22c55e",
  },
  optionWrong: {
    borderColor: "#ef4444",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  optionTextCorrect: {
    color: "#22c55e",
    fontWeight: "700",
  },
  optionTextWrong: {
    color: "#ef4444",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 46,
  },
  feedbackBlock: {
    gap: 4,
  },
  feedbackTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  feedbackAnswer: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
  },
  correctAnswerText: {
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  secondaryButton: {
    borderRadius: 14,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 14,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
