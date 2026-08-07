import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";

import { useCustomAlert } from "@/lib/custom-alert";
import { useTheme } from "@/hooks/use-theme";

import { BottomNavbar } from "@/components/bottom-navbar";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ContentInfoRecord,
  LessonContentRecord,
  LessonRecord,
  ModuleRecord,
  JobSheetAnswerRecord,
  JobSheetRecord,
  PerformanceAnswerRecord,
  PerformanceChecklistRecord,
  createLessonContentProgress,
  listLessonContentProgressByUserAndLessonContent,
  listLessonContentProgressByUser,
  listLessonAchievementsByLesson,
  createStudentLessonAchievement,
  listStudentLessonAchievementByUserAndLessonAchievement,
  listLessons,
  listModuleAchievementsByModule,
  createStudentModuleAchievement,
  listStudentModuleAchievementByUserAndModuleAchievement,
  updateLessonContentProgress,
  createLessonContentBookmark,
  updateLessonContentBookmark,
  listLessonContentBookmarkByUserAndLessonContent,
  getLessonContentById,
  getLessonById,
  getModuleById,
  listContentInfoByLessonContentId,
  listLessonContentByLessonId,
  createQuestionAnswersBatch,
  listQuestionInstructByLessonContentId,
  listQuestionContentByLessonContentId,
  listQuestionChoiceByQuestionId,
  listQuestionAnswersByUserAndQuestions,
  createJobSheetAnswer,
  listJobSheetByLessonContentId,
  listJobSheetAnswersByUserAndJob,
  listJobSheetAnswersByUser,
  createPerformanceAnswer,
  listPerformanceCheckByLessonContentId,
  listPerformanceAnswersByUser,
} from "@/lib/auth-api";
import { resolveContentInfoAsset } from "@/lib/content-info-assets";

let ImagePicker: any = null;
try {
  ImagePicker = require("expo-image-picker");
} catch {
  ImagePicker = null;
}

type QuestionWithChoices = {
  question: any;
  choices: any[];
};

function getCorrectAnswer(question: any, choices: any[]): string {
  if (!choices || choices.length === 0) return "N/A";

  if (
    question.question_type === "multiple_choice" ||
    question.question_type === "true_or_false"
  ) {
    const correctChoice = choices.find((c) => c.is_correct === "correct");
    return correctChoice ? correctChoice.choice_text : "N/A";
  }

  if (
    question.question_type === "enumeration" ||
    question.question_type === "identification"
  ) {
    const openEnded = choices.find(
      (c) =>
        c.is_correct &&
        c.is_correct.trim().length > 0 &&
        c.is_correct !== "correct",
    );
    return openEnded ? openEnded.is_correct.trim() : "N/A";
  }

  return "N/A";
}

function isAnswerWrong(
  question: any,
  choices: any[],
  studentAnswer: string | undefined,
): boolean {
  if (!studentAnswer || String(studentAnswer).trim().length === 0) {
    return false;
  }

  if (question.question_type === "multiple_choice") {
    const correctChoice = choices.find((c) => c.is_correct === "correct");
    if (!correctChoice) return false;
    return studentAnswer !== correctChoice.choice_label;
  }

  if (question.question_type === "true_or_false") {
    const correctChoice = choices.find((c) => c.is_correct === "correct");
    if (!correctChoice) return false;
    return studentAnswer !== correctChoice.choice_text;
  }

  if (
    question.question_type === "enumeration" ||
    question.question_type === "identification"
  ) {
    const openEnded = choices.find(
      (c) =>
        c.is_correct &&
        c.is_correct.trim().length > 0 &&
        c.is_correct !== "correct",
    );
    if (!openEnded) return false;
    return (
      studentAnswer.trim().toLowerCase() !==
      openEnded.is_correct.trim().toLowerCase()
    );
  }

  return false;
}

export default function ContentInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; userId?: string }>();
  const lessonContentId = Number(params.id);
  const activeUserId = Number(params.userId ?? "1");

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(
    null,
  );
  const [contentInfos, setContentInfos] = useState<ContentInfoRecord[]>([]);
  const [imageUris, setImageUris] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRead, setIsRead] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [lessonAchieved, setLessonAchieved] = useState(false);
  const [moduleAchieved, setModuleAchieved] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [togglingBookmark, setTogglingBookmark] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "exercise" | "job" | "performance"
  >("content");
  const [exerciseInstructs, setExerciseInstructs] = useState<any[]>([]);
  const [exerciseQuestions, setExerciseQuestions] = useState<
    QuestionWithChoices[]
  >([]);
  const [exerciseAnswers, setExerciseAnswers] = useState<
    Record<number, string>
  >({});
  const [exerciseSubmitting, setExerciseSubmitting] = useState(false);
  const [exerciseHasExistingAnswers, setExerciseHasExistingAnswers] =
    useState(false);
  const [exerciseLoaded, setExerciseLoaded] = useState(false);
  const [jobSheets, setJobSheets] = useState<JobSheetRecord[]>([]);
  const [jobAnswers, setJobAnswers] = useState<JobSheetAnswerRecord[]>([]);
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<JobSheetRecord | null>(
    null,
  );
  const [answerText, setAnswerText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [jobLoaded, setJobLoaded] = useState(false);
  const [perfChecklist, setPerfChecklist] = useState<
    PerformanceChecklistRecord[]
  >([]);
  const [perfAnswers, setPerfAnswers] = useState<PerformanceAnswerRecord[]>([]);
  const [perfSelectedAnswers, setPerfSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [perfSubmitting, setPerfSubmitting] = useState(false);
  const [perfAlreadySubmitted, setPerfAlreadySubmitted] = useState(false);
  const [perfLoaded, setPerfLoaded] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const { showAlert } = useCustomAlert();
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          backgroundColor: theme.background,
        },
        breadcrumb: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        breadcrumbText: {
          color: isDark ? "#86efac" : "#166534",
        },
        infoCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        infoLabel: {
          color: theme.textSecondary,
        },
        infoValue: {
          color: theme.text,
        },
        infoImage: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
        },
        imageContainer: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
        },
        imagePlaceholderText: {
          color: theme.textSecondary,
        },
        emptyStateText: {
          color: theme.textSecondary,
        },
        errorBox: {
          backgroundColor: "#fef2f2",
          borderColor: "rgba(185, 28, 28, 0.18)",
        },
        errorTitle: {
          color: "#b91c1c",
        },
        errorDescription: {
          color: "#b91c1c",
        },
        markAsReadButton: {
          backgroundColor: isDark ? theme.textSecondary : "#5bec13",
        },
        markAsReadButtonOutline: {
          backgroundColor: "transparent",
          borderColor: isDark ? "#86efac" : "#166534",
        },
        markAsReadButtonAcquired: {
          backgroundColor: isDark ? "rgba(147, 51, 234, 0.18)" : "#f3e8ff",
          borderColor: isDark ? "#a855f7" : "#a855f7",
        },
        markAsReadButtonText: {
          color: isDark ? theme.text : "#000000",
        },
        markAsReadButtonTextOutline: {
          color: isDark ? "#86efac" : "#166534",
        },
        bookmarkButton: {
          backgroundColor: isDark ? "rgba(91, 236, 19, 0.12)" : "#f0fdf4",
          borderColor: isDark
            ? "rgba(91, 236, 19, 0.28)"
            : "rgba(22, 101, 52, 0.18)",
        },
        bookmarkButtonActive: {
          backgroundColor: isDark ? "#86efac" : "#166534",
          borderColor: isDark ? "#86efac" : "#166534",
        },
        bookmarkButtonIcon: {
          color: isDark ? theme.text : "#166534",
        },
        bookmarkButtonText: {
          color: isDark ? theme.text : "#166534",
        },
        bookmarkButtonTextActive: {
          color: isDark ? "#000000" : "#ffffff",
        },
        tabHeader: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        tabButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f1f5f9",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        tabButtonActive: {
          backgroundColor: isDark ? "#86efac" : "#166534",
          borderColor: isDark ? "#86efac" : "#166534",
        },
        tabButtonText: {
          color: theme.textSecondary,
        },
        tabButtonTextActive: {
          color: isDark ? "#000000" : "#ffffff",
        },
        sheetCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        sheetTitle: {
          color: theme.text,
        },
        sectionLabel: {
          color: theme.textSecondary,
        },
        sectionText: {
          color: theme.text,
        },
        addAnswerButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#2563eb",
        },
        addAnswerButtonDisabled: {
          backgroundColor: isDark ? "#4b5563" : "#94a3b8",
        },
        addAnswerButtonText: {
          color: isDark ? theme.text : "#ffffff",
        },
        emptyBoxText: {
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
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        modalTitle: {
          color: theme.text,
        },
        modalSubtitle: {
          color: theme.textSecondary,
        },
        jobTextInput: {
          color: theme.text,
          backgroundColor: isDark ? "#2E3135" : "rgba(255, 255, 255, 0.95)",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(92, 107, 97, 0.18)",
        },
        uploadButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f1f5f9",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.2)",
        },
        uploadButtonText: {
          color: theme.text,
        },
        imagePreviewTitle: {
          color: theme.textSecondary,
        },
        imagePreviewText: {
          color: theme.text,
        },
        cancelButton: {
          backgroundColor: isDark
            ? theme.backgroundSelected
            : "rgba(255, 255, 255, 0.95)",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(92, 107, 97, 0.18)",
        },
        cancelButtonText: {
          color: theme.text,
        },
        saveButton: {
          backgroundColor: isDark ? "#86efac" : "#55e10a",
        },
        saveButtonText: {
          color: isDark ? "#000000" : "#0f172a",
        },
        perfIntroCard: {
          backgroundColor: isDark ? "rgba(91, 236, 19, 0.12)" : "#f0fdf4",
          borderColor: isDark
            ? "rgba(91, 236, 19, 0.28)"
            : "rgba(22, 101, 52, 0.18)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        perfIntroText: {
          color: theme.text,
        },
        checkItem: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        checkOrder: {
          color: isDark ? "#86efac" : "#2563eb",
        },
        checkQuestion: {
          color: theme.text,
        },
        radioButton: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(92, 107, 97, 0.2)",
        },
        radioButtonSelected: {
          backgroundColor: isDark ? "#86efac" : "#2563eb",
          borderColor: isDark ? "#86efac" : "#2563eb",
        },
        radioLabel: {
          color: theme.textSecondary,
        },
        radioLabelSelected: {
          color: isDark ? "#000000" : "#ffffff",
        },
        perfSubmitButton: {
          backgroundColor: isDark ? "#86efac" : "#55e10a",
        },
        perfSubmitButtonText: {
          color: isDark ? "#000000" : "#0f172a",
        },
        alreadySubmittedCard: {
          backgroundColor: "#fef2f2",
          borderColor: "rgba(185, 28, 28, 0.18)",
        },
        alreadySubmittedText: {
          color: "#b91c1c",
        },
        choiceRow: {
          backgroundColor: isDark ? theme.backgroundSelected : "#f8fafc",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        choiceRowSelected: {
          borderColor: isDark ? "#86efac" : "#166534",
          backgroundColor: isDark ? "rgba(91, 236, 19, 0.12)" : "#f0fdf4",
        },
        choiceText: {
          color: theme.text,
        },
        choiceTextSelected: {
          color: isDark ? "#86efac" : "#166534",
        },
        radioOuter: {
          borderColor: theme.textSecondary,
        },
        radioOuterSelected: {
          borderColor: isDark ? "#86efac" : "#166534",
        },
        radioInner: {
          backgroundColor: isDark ? "#86efac" : "#166534",
        },
        textInput: {
          color: theme.text,
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
        },
        questionCard: {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        questionNumber: {
          color: theme.text,
        },
        instructCard: {
          backgroundColor: theme.backgroundElement,
          borderBottomColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(148, 163, 184, 0.12)",
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        instructLabel: {
          color: theme.textSecondary,
        },
        instructTitle: {
          color: theme.text,
        },
        instructText: {
          color: theme.textSecondary,
        },
        correctAnswerContainer: {
          backgroundColor: isDark ? "rgba(91, 236, 19, 0.12)" : "#f0fdf4",
          borderColor: isDark
            ? "rgba(91, 236, 19, 0.28)"
            : "rgba(22, 101, 52, 0.18)",
        },
        correctAnswerLabel: {
          color: isDark ? "#86efac" : "#166534",
        },
        correctAnswerText: {
          color: isDark ? "#86efac" : "#166534",
        },
        submitBlockedBox: {
          backgroundColor: "#fef2f2",
          borderColor: "rgba(185, 28, 28, 0.18)",
        },
        submitBlockedText: {
          color: "#b91c1c",
        },
        exerciseSubmitButton: {
          backgroundColor: isDark ? "#86efac" : "#55e10a",
        },
        exerciseSubmitButtonText: {
          color: isDark ? "#000000" : "#0f172a",
        },
        surfaceCard: {
          shadowColor: isDark ? "#000000" : "#0f172a",
        },
        input: {
          backgroundColor: theme.backgroundElement,
          color: theme.text,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(92, 107, 97, 0.16)",
        },
      }),
    [theme, isDark],
  );

  const checkLessonAchieved = useCallback(
    async (lessonId: number | null | undefined) => {
      if (!lessonId) {
        setLessonAchieved(false);
        return;
      }
      const lessonAchievementRecords =
        await listLessonAchievementsByLesson(lessonId);
      if (lessonAchievementRecords.length === 0) {
        setLessonAchieved(false);
        return;
      }
      const lessonContents = await listLessonContentByLessonId(lessonId);
      const progressRecords =
        await listLessonContentProgressByUser(activeUserId);
      const contentIds = lessonContents.map((c) => c.lesson_content_id);
      const readIds = new Set(
        progressRecords
          .filter((r) => r.is_read && contentIds.includes(r.lesson_content_id))
          .map((r) => r.lesson_content_id),
      );
      const allContentRead =
        contentIds.length > 0 && contentIds.every((id) => readIds.has(id));

      if (allContentRead) {
        for (const la of lessonAchievementRecords) {
          const existing =
            await listStudentLessonAchievementByUserAndLessonAchievement(
              activeUserId,
              la.lesson_achievement_id,
            );
          if (existing.length === 0) {
            await createStudentLessonAchievement({
              lesson_achievement_id: la.lesson_achievement_id,
              user_id: activeUserId,
            });
          }
        }
      }

      let hasAnyRecord = false;
      for (const la of lessonAchievementRecords) {
        const existing =
          await listStudentLessonAchievementByUserAndLessonAchievement(
            activeUserId,
            la.lesson_achievement_id,
          );
        if (existing.length > 0) {
          hasAnyRecord = true;
          break;
        }
      }
      setLessonAchieved(allContentRead || hasAnyRecord);
    },
    [activeUserId],
  );

  const checkModuleAchieved = useCallback(
    async (moduleId: number | null | undefined) => {
      if (!moduleId) {
        setModuleAchieved(false);
        return;
      }
      const moduleAchievementRecords = await listModuleAchievementsByModule(moduleId);
      if (moduleAchievementRecords.length === 0) {
        setModuleAchieved(false);
        return;
      }
      const lessonRecords = await listLessons();
      const moduleLessons = lessonRecords.filter((l) => l.module_id === moduleId);
      const progressRecords = await listLessonContentProgressByUser(activeUserId);

      let allLessonsComplete = false;
      if (moduleLessons.length > 0) {
        allLessonsComplete = true;
        for (const lesson of moduleLessons) {
          const lessonContents = await listLessonContentByLessonId(lesson.lesson_id);
          const contentIds = lessonContents.map((c) => c.lesson_content_id);
          if (contentIds.length === 0) {
            continue;
          }
          const readIds = new Set(
            progressRecords
              .filter((r) => r.is_read && contentIds.includes(r.lesson_content_id))
              .map((r) => r.lesson_content_id),
          );
          if (!contentIds.every((id) => readIds.has(id))) {
            allLessonsComplete = false;
            break;
          }
        }
      }

      if (allLessonsComplete) {
        for (const ma of moduleAchievementRecords) {
          const existing = await listStudentModuleAchievementByUserAndModuleAchievement(
            activeUserId,
            ma.module_achievement_id,
          );
          if (existing.length === 0) {
            await createStudentModuleAchievement({
              module_achievement_id: ma.module_achievement_id,
              user_id: activeUserId,
            });
          }
        }
      }

      let hasAnyRecord = false;
      for (const ma of moduleAchievementRecords) {
        const existing = await listStudentModuleAchievementByUserAndModuleAchievement(
          activeUserId,
          ma.module_achievement_id,
        );
        if (existing.length > 0) {
          hasAnyRecord = true;
          break;
        }
      }
      setModuleAchieved(allLessonsComplete || hasAnyRecord);
    },
    [activeUserId],
  );

  const loadContentInfo = useCallback(async () => {
    setError("");
    setLoading(true);
    setImageUris({});
    try {
      const lessonContent = await getLessonContentById(lessonContentId);
      if (!lessonContent) {
        showAlert("Unable to load content", "Lesson content not found.");
        setError("Lesson content not found.");
        setLoading(false);
        return;
      }
      setContentItem(lessonContent);

      const lesson = await getLessonById(lessonContent.lesson_id);
      const moduleRecord = lesson
        ? await getModuleById(lesson.module_id)
        : null;
      const infos = await listContentInfoByLessonContentId(
        lessonContent.lesson_content_id,
      );

      setLessonItem(lesson ?? null);
      setModuleItem(moduleRecord ?? null);
      setContentInfos(infos);

      const uris: Record<number, string> = {};
      for (const info of infos) {
        if (info.images) {
          const uri = resolveContentInfoAsset(info.images);
          if (uri) {
            uris[info.content_info_id] = uri;
          }
        }
      }
      setImageUris(uris);

      const existingProgress =
        await listLessonContentProgressByUserAndLessonContent(
          activeUserId,
          lessonContentId,
        );
      setIsRead(
        existingProgress.length > 0 && Boolean(existingProgress[0].is_read),
      );

      const existingBookmark =
        await listLessonContentBookmarkByUserAndLessonContent(
          activeUserId,
          lessonContentId,
        );
      setIsBookmarked(
        existingBookmark.length > 0 && Boolean(existingBookmark[0].is_bookmark),
      );

      if (lessonContent?.lesson_id) {
        setCurrentLessonId(lessonContent.lesson_id);
        await checkLessonAchieved(lessonContent.lesson_id);
      }
      if (lessonContent?.lesson_id) {
        const lesson = await getLessonById(lessonContent.lesson_id);
        if (lesson?.module_id) {
          await checkModuleAchieved(lesson.module_id);
        }
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load content info.",
      );
    } finally {
      setLoading(false);
    }
  }, [lessonContentId, checkLessonAchieved, checkModuleAchieved]);

  useEffect(() => {
    if (Number.isInteger(lessonContentId) && lessonContentId > 0) {
      loadContentInfo();
    } else {
      showAlert("Unable to load content", "Invalid content ID.");
      setError("Invalid content ID.");
      setLoading(false);
    }
  }, [lessonContentId, loadContentInfo]);

  const markAsRead = useCallback(async () => {
    if (markingRead) return;
    if (isRead && (lessonAchieved || moduleAchieved)) {
      showAlert(
        "Cannot unmark content",
        lessonAchieved
          ? "This lesson achievement has been acquired. You cannot mark content as unread once the lesson is complete."
          : "This module achievement has been acquired. You cannot mark content as unread once the module is complete.",
      );
      return;
    }
    const confirmed = await new Promise<boolean>((resolve) =>
      showAlert(
        isRead ? "Mark as Unread" : "Mark as Read",
        isRead
          ? "Are you sure you want to mark this content as unread?"
          : "Are you sure you want to mark this content as read?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { text: "Confirm", onPress: () => resolve(true) },
        ],
        { cancelable: true },
      ),
    );
    if (!confirmed) return;
    setMarkingRead(true);
    try {
      if (isRead) {
        const existing = await listLessonContentProgressByUserAndLessonContent(
          activeUserId,
          lessonContentId,
        );
        if (existing.length > 0) {
          await updateLessonContentProgress(existing[0].progress_lesson_id, {
            is_read: false,
          });
        }
        setIsRead(false);
      } else {
        const existing = await listLessonContentProgressByUserAndLessonContent(
          activeUserId,
          lessonContentId,
        );
        if (existing.length > 0) {
          await updateLessonContentProgress(existing[0].progress_lesson_id, {
            is_read: true,
          });
        } else {
          await createLessonContentProgress({
            lesson_content_id: lessonContentId,
            user_id: activeUserId,
            is_read: true,
          });
        }
        setIsRead(true);
      }
      if (currentLessonId) {
        await checkLessonAchieved(currentLessonId);
        const lesson = await getLessonById(currentLessonId);
        if (lesson?.module_id) {
          await checkModuleAchieved(lesson.module_id);
        }
      }
    } catch (markError) {
      showAlert(
        "Unable to update progress",
        markError instanceof Error ? markError.message : "Please try again.",
      );
    } finally {
      setMarkingRead(false);
    }
  }, [
    isRead,
    lessonContentId,
    activeUserId,
    markingRead,
    lessonAchieved,
    moduleAchieved,
    currentLessonId,
    checkLessonAchieved,
    checkModuleAchieved,
  ]);

  const toggleBookmark = useCallback(async () => {
    if (togglingBookmark) return;
    setTogglingBookmark(true);
    try {
      const existing = await listLessonContentBookmarkByUserAndLessonContent(
        activeUserId,
        lessonContentId,
      );
      if (existing.length > 0) {
        await updateLessonContentBookmark(
          existing[0].lesson_content_bookmark_id,
          { is_bookmark: !isBookmarked },
        );
        setIsBookmarked(!isBookmarked);
        showAlert("Bookmark removed", "Lesson content has been unbookmarked.");
      } else {
        await createLessonContentBookmark({
          lesson_content_id: lessonContentId,
          user_id: activeUserId,
          is_bookmark: true,
        });
        setIsBookmarked(true);
        showAlert("Bookmarked", "Lesson content has been bookmarked.");
      }
    } catch (bookmarkError) {
      showAlert(
        "Unable to update bookmark",
        bookmarkError instanceof Error
          ? bookmarkError.message
          : "Please try again.",
      );
    } finally {
      setTogglingBookmark(false);
    }
  }, [isBookmarked, lessonContentId, activeUserId, togglingBookmark]);

  const loadExercise = useCallback(async () => {
    if (exerciseLoaded) return;
    setExerciseLoaded(true);
    setExerciseInstructs([]);
    setExerciseQuestions([]);
    setExerciseAnswers({});
    setExerciseHasExistingAnswers(false);
    try {
      const [loadedInstructs, loadedQuestions] = await Promise.all([
        listQuestionInstructByLessonContentId(lessonContentId),
        listQuestionContentByLessonContentId(lessonContentId),
      ]);
      setExerciseInstructs(loadedInstructs);

      const questionsWithChoices: QuestionWithChoices[] = await Promise.all(
        loadedQuestions.map(async (q) => ({
          question: q,
          choices: await listQuestionChoiceByQuestionId(q.question_id),
        })),
      );
      setExerciseQuestions(questionsWithChoices);

      if (questionsWithChoices.length > 0) {
        const questionIds = loadedQuestions.map((q) => q.question_id);
        const existingAnswers = await listQuestionAnswersByUserAndQuestions(
          activeUserId,
          questionIds,
        );
        if (existingAnswers.length > 0) {
          setExerciseHasExistingAnswers(true);
          const initialAnswers: Record<number, string> = {};
          existingAnswers.forEach((record) => {
            initialAnswers[record.question_id] = record.answer_text;
          });
          setExerciseAnswers(initialAnswers);
        }
      }
    } catch (exerciseError) {
      showAlert(
        "Unable to load exercise",
        exerciseError instanceof Error
          ? exerciseError.message
          : "Please try again.",
      );
    }
  }, [lessonContentId, activeUserId, exerciseLoaded, showAlert]);

  const handleExerciseSubmit = async () => {
    if (exerciseHasExistingAnswers) {
      showAlert(
        "Already submitted",
        "You have already submitted answers for this lesson content. Duplicate submissions are not allowed.",
      );
      return;
    }

    const unanswered = exerciseQuestions
      .filter((q) => {
        const answer = exerciseAnswers[q.question.question_id];
        return !answer || String(answer).trim().length === 0;
      })
      .map((q) => q.question.question);

    if (unanswered.length > 0) {
      const missingList = unanswered
        .map((text, index) => `${index + 1}. ${text}`)
        .join("\n");
      showAlert(
        "Please answer all questions",
        `The following questions are still unanswered:\n\n${missingList}`,
      );
      return;
    }

    const answerEntries = Object.entries(exerciseAnswers).map(
      ([questionId, answer_text]) => ({
        question_id: Number(questionId),
        answer_text,
      }),
    );

    showAlert(
      "Submit answers",
      "Are you sure you want to submit your answers? This will save your responses.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            setExerciseSubmitting(true);
            try {
              await createQuestionAnswersBatch({
                user_id: activeUserId,
                answers: answerEntries,
              });
              setExerciseHasExistingAnswers(true);
              showAlert(
                "Submitted",
                "Your answers have been saved successfully.",
              );
            } catch (submitError) {
              showAlert(
                "Submit failed",
                submitError instanceof Error
                  ? submitError.message
                  : "Unable to submit answers.",
              );
            } finally {
              setExerciseSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const renderExerciseChoices = (
    question: any,
    choices: any[],
    questionId: number,
  ) => {
    const selected = exerciseAnswers[questionId] || "";

    if (question.question_type === "multiple_choice") {
      return choices.map((choice) => {
        const isSelected = selected === choice.choice_label;
        return (
          <Pressable
            key={choice.choice_id}
            style={[
              styles.choiceRow,
              isSelected && styles.choiceRowSelected,
              dynamicStyles.choiceRow,
              isSelected && dynamicStyles.choiceRowSelected,
            ]}
            onPress={() =>
              setExerciseAnswers((prev) => ({
                ...prev,
                [questionId]: choice.choice_label,
              }))
            }
          >
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
                dynamicStyles.radioOuter,
                dynamicStyles.radioOuterSelected,
              ]}
            >
              {isSelected ? (
                <View style={[styles.radioInner, dynamicStyles.radioInner]} />
              ) : null}
            </View>
            <Text
              style={[
                styles.choiceText,
                isSelected && styles.choiceTextSelected,
                dynamicStyles.choiceText,
                dynamicStyles.choiceTextSelected,
              ]}
            >
              {choice.choice_label} {choice.choice_text}
            </Text>
          </Pressable>
        );
      });
    }

    if (question.question_type === "true_or_false") {
      return ["True", "False"].map((val) => {
        const isSelected = selected === val;
        return (
          <Pressable
            key={val}
            style={[
              styles.choiceRow,
              isSelected && styles.choiceRowSelected,
              dynamicStyles.choiceRow,
              isSelected && dynamicStyles.choiceRowSelected,
            ]}
            onPress={() =>
              setExerciseAnswers((prev) => ({ ...prev, [questionId]: val }))
            }
          >
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
                dynamicStyles.radioOuter,
                dynamicStyles.radioOuterSelected,
              ]}
            >
              {isSelected ? (
                <View style={[styles.radioInner, dynamicStyles.radioInner]} />
              ) : null}
            </View>
            <Text
              style={[
                styles.choiceText,
                isSelected && styles.choiceTextSelected,
                dynamicStyles.choiceText,
                dynamicStyles.choiceTextSelected,
              ]}
            >
              {val}
            </Text>
          </Pressable>
        );
      });
    }

    return (
      <TextInput
        style={[styles.textInput, dynamicStyles.textInput]}
        placeholder="Type your answer here..."
        placeholderTextColor={theme.textSecondary}
        value={selected}
        onChangeText={(text) =>
          setExerciseAnswers((prev) => ({ ...prev, [questionId]: text }))
        }
      />
    );
  };

  const loadJobSheet = useCallback(async () => {
    if (jobLoaded) return;
    setJobLoaded(true);
    setJobSheets([]);
    setJobAnswers([]);
    try {
      const sheets = await listJobSheetByLessonContentId(lessonContentId);
      setJobSheets(sheets);

      if (sheets.length > 0) {
        const allAnswers = await listJobSheetAnswersByUser(activeUserId);
        const relevantAnswers = allAnswers.filter((answer) =>
          sheets.some((sheet) => sheet.job_id === answer.job_id),
        );
        setJobAnswers(relevantAnswers);
      }
    } catch (jobError) {
      showAlert(
        "Unable to load job sheet",
        jobError instanceof Error ? jobError.message : "Please try again.",
      );
    }
  }, [lessonContentId, activeUserId, jobLoaded, showAlert]);

  const pickJobImages = async () => {
    if (!ImagePicker) {
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showAlert(
        "Permission required",
        "Please grant camera roll permissions to upload images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const assets = result.assets ?? [];
      const dir = `${FileSystem.documentDirectory}job_sheet_records`;
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }

      const copiedUris: string[] = [];
      for (const asset of assets) {
        const ext = asset.uri.split(".").pop() ?? "jpg";
        const fileName = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const destUri = `${dir}/${fileName}`;
        await FileSystem.copyAsync({ from: asset.uri, to: destUri });
        copiedUris.push(destUri);
      }

      setSelectedImages((prev) => [...prev, ...copiedUris]);
    }
  };

  const openAnswerModal = (sheet: JobSheetRecord) => {
    setSelectedSheet(sheet);
    setAnswerText("");
    setSelectedImages([]);
    setJobModalVisible(true);
  };

  const closeAnswerModal = () => {
    if (!jobSubmitting) {
      setJobModalVisible(false);
      setSelectedSheet(null);
      setAnswerText("");
      setSelectedImages([]);
    }
  };

  const handleJobSubmitAnswer = async () => {
    if (!selectedSheet) {
      return;
    }

    const trimmedAnswer = answerText.trim();

    if (!trimmedAnswer && selectedImages.length === 0) {
      showAlert(
        "Answer required",
        "Please enter a response or upload at least one image.",
      );
      return;
    }

    let answerTextToSave = trimmedAnswer;
    if (selectedImages.length > 0) {
      const imagePaths = selectedImages.map((uri) =>
        uri.replace(FileSystem.documentDirectory ?? "", ""),
      );
      answerTextToSave = trimmedAnswer
        ? `${trimmedAnswer}\nImages: ${imagePaths.join(", ")}`
        : `Images: ${imagePaths.join(", ")}`;
    }

    showAlert(
      "Submit job sheet answer",
      "Are you sure you want to submit your job sheet response?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            setJobSubmitting(true);
            try {
              const newAnswer = await createJobSheetAnswer({
                job_id: selectedSheet.job_id,
                user_id: activeUserId,
                answer_text: answerTextToSave,
              });
              if (newAnswer) {
                setJobAnswers((prev) => [...prev, newAnswer]);
              }
              showAlert("Submitted", "Your job sheet answer has been saved.");
              closeAnswerModal();
            } catch (submitError) {
              showAlert(
                "Submit failed",
                submitError instanceof Error
                  ? submitError.message
                  : "Unable to submit job sheet answer.",
              );
            } finally {
              setJobSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const loadPerformanceCheck = useCallback(async () => {
    if (perfLoaded) return;
    setPerfLoaded(true);
    setPerfChecklist([]);
    setPerfSelectedAnswers({});
    setPerfAlreadySubmitted(false);
    try {
      const checks =
        await listPerformanceCheckByLessonContentId(lessonContentId);
      setPerfChecklist(checks);

      const allAnswers = await listPerformanceAnswersByUser(activeUserId);
      setPerfAnswers(allAnswers);
      const answerMap: Record<number, string> = {};
      for (const answer of allAnswers) {
        answerMap[answer.performance_id] = answer.performance_answer_text;
      }
      setPerfSelectedAnswers(answerMap);

      const answeredIds = new Set(allAnswers.map((a) => a.performance_id));
      const allAnswered =
        checks.length > 0 &&
        checks.every((c) => answeredIds.has(c.performance_id));
      setPerfAlreadySubmitted(allAnswered);
    } catch (perfError) {
      showAlert(
        "Unable to load performance",
        perfError instanceof Error ? perfError.message : "Please try again.",
      );
    }
  }, [lessonContentId, activeUserId, perfLoaded, showAlert]);

  const handlePerformanceSubmit = async () => {
    if (perfChecklist.length === 0) {
      return;
    }

    setPerfSubmitting(true);
    try {
      for (const item of perfChecklist) {
        const answer = perfSelectedAnswers[item.performance_id];
        if (!answer) {
          showAlert(
            "Answer required",
            `Please select Yes or No for: ${item.performance_question}`,
          );
          setPerfSubmitting(false);
          return;
        }

        await createPerformanceAnswer({
          performance_id: item.performance_id,
          user_id: activeUserId,
          performance_answer_text: answer,
        });
      }

      setPerfAlreadySubmitted(true);
      showAlert("Submitted", "Performance checklist submitted successfully.");
    } catch (submitError) {
      showAlert(
        "Submit failed",
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit performance checklist.",
      );
    } finally {
      setPerfSubmitting(false);
    }
  };

  const renderJobSheetSection = () => (
    <View style={styles.jobSection}>
      {jobSheets.length > 0 ? (
        jobSheets.map((sheet) => {
          const hasAnswer = jobAnswers.some(
            (answer) => answer.job_id === sheet.job_id,
          );
          return (
            <View
              key={sheet.job_id}
              style={[
                styles.sheetCard,
                styles.surfaceCard,
                dynamicStyles.sheetCard,
                dynamicStyles.surfaceCard,
                isCompact && styles.sheetCardCompact,
              ]}
            >
              <Text style={[styles.sheetTitle, dynamicStyles.sheetTitle]}>
                {sheet.job_title}
              </Text>
              <View style={styles.jobSectionItem}>
                <Text style={[styles.sectionLabel, dynamicStyles.sectionLabel]}>
                  Objectives
                </Text>
                <Text style={[styles.sectionText, dynamicStyles.sectionText]}>
                  {sheet.job_objectives}
                </Text>
              </View>
              <View style={styles.jobSectionItem}>
                <Text style={[styles.sectionLabel, dynamicStyles.sectionLabel]}>
                  Materials
                </Text>
                <Text style={[styles.sectionText, dynamicStyles.sectionText]}>
                  {sheet.job_materials}
                </Text>
              </View>
              <View style={styles.jobSectionItem}>
                <Text style={[styles.sectionLabel, dynamicStyles.sectionLabel]}>
                  Steps
                </Text>
                <Text style={[styles.sectionText, dynamicStyles.sectionText]}>
                  {sheet.job_steps}
                </Text>
              </View>
              <View style={styles.jobSectionItem}>
                <Text style={[styles.sectionLabel, dynamicStyles.sectionLabel]}>
                  Assessment Method
                </Text>
                <Text style={[styles.sectionText, dynamicStyles.sectionText]}>
                  {sheet.job_assesment_method || "-"}
                </Text>
              </View>
              <Pressable
                onPress={() => openAnswerModal(sheet)}
                disabled={hasAnswer}
                style={[
                  styles.addAnswerButton,
                  dynamicStyles.addAnswerButton,
                  hasAnswer && styles.addAnswerButtonDisabled,
                  hasAnswer && dynamicStyles.addAnswerButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.addAnswerButtonText,
                    dynamicStyles.addAnswerButtonText,
                  ]}
                >
                  {hasAnswer ? "Answer Submitted" : "Add Answer"}
                </Text>
              </Pressable>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyBoxText, dynamicStyles.emptyBoxText]}>
            No job sheet records found for this lesson content.
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={jobModalVisible}
        onRequestClose={closeAnswerModal}
      >
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.modalCard, dynamicStyles.modalCard]}>
            <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
              Job Sheet Answer
            </Text>
            <Text style={[styles.modalSubtitle, dynamicStyles.modalSubtitle]}>
              {selectedSheet?.job_title}
            </Text>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={[styles.jobTextInput, dynamicStyles.jobTextInput]}
                placeholder="Type your answer here..."
                placeholderTextColor={theme.textSecondary}
                value={answerText}
                onChangeText={setAnswerText}
                multiline
                textAlignVertical="top"
              />
              {ImagePicker ? (
                <Pressable
                  onPress={pickJobImages}
                  style={[styles.uploadButton, dynamicStyles.uploadButton]}
                >
                  <Text
                    style={[
                      styles.uploadButtonText,
                      dynamicStyles.uploadButtonText,
                    ]}
                  >
                    Upload Images
                  </Text>
                </Pressable>
              ) : null}
              {selectedImages.length > 0 ? (
                <View style={styles.imagePreviewContainer}>
                  <Text
                    style={[
                      styles.imagePreviewTitle,
                      dynamicStyles.imagePreviewTitle,
                    ]}
                  >
                    Selected Images ({selectedImages.length})
                  </Text>
                  {selectedImages.map((uri, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.imagePreviewText,
                        dynamicStyles.imagePreviewText,
                      ]}
                      numberOfLines={1}
                    >
                      {uri.split("/").pop()}
                    </Text>
                  ))}
                </View>
              ) : null}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable
                disabled={jobSubmitting}
                onPress={closeAnswerModal}
                style={[styles.cancelButton, dynamicStyles.cancelButton]}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    dynamicStyles.cancelButtonText,
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                disabled={jobSubmitting}
                onPress={handleJobSubmitAnswer}
                style={[styles.saveButton, dynamicStyles.saveButton]}
              >
                <Text
                  style={[styles.saveButtonText, dynamicStyles.saveButtonText]}
                >
                  {jobSubmitting ? "Submitting..." : "Submit"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header
        title="Content Info"
        showBack
        onBack={() =>
          router.replace({
            pathname: "/lesson",
            params: { userId: String(activeUserId) },
          })
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>
              Loading content info...
            </Text>
          </View>
        ) : error ? (
          <View style={[styles.errorBox, dynamicStyles.errorBox]}>
            <Text style={[styles.errorTitle, dynamicStyles.errorTitle]}>
              Unable to load content info
            </Text>
            <Text
              style={[styles.errorDescription, dynamicStyles.errorDescription]}
            >
              {error}
            </Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View
              style={[
                styles.breadcrumb,
                styles.surfaceCard,
                dynamicStyles.breadcrumb,
                dynamicStyles.surfaceCard,
              ]}
            >
              <Text
                style={[styles.breadcrumbText, dynamicStyles.breadcrumbText]}
              >
                {moduleItem?.module_name} {" > "} {lessonItem?.lesson_name}{" "}
                {" > "} {contentItem?.content_name}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.tabHeader, dynamicStyles.tabHeader]}
              contentContainerStyle={styles.tabHeaderContent}
            >
              <Pressable
                onPress={() => {
                  setActiveTab("content");
                  loadContentInfo();
                }}
                style={[
                  styles.tabButton,
                  activeTab === "content" && styles.tabButtonActive,
                  dynamicStyles.tabButton,
                  activeTab === "content" && dynamicStyles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "content" && styles.tabButtonTextActive,
                    dynamicStyles.tabButtonText,
                    activeTab === "content" &&
                      dynamicStyles.tabButtonTextActive,
                  ]}
                >
                  Content Info
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveTab("exercise");
                  loadExercise();
                }}
                style={[
                  styles.tabButton,
                  activeTab === "exercise" && styles.tabButtonActive,
                  dynamicStyles.tabButton,
                  activeTab === "exercise" && dynamicStyles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "exercise" && styles.tabButtonTextActive,
                    dynamicStyles.tabButtonText,
                    activeTab === "exercise" &&
                      dynamicStyles.tabButtonTextActive,
                  ]}
                >
                  Exercise
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveTab("job");
                  loadJobSheet();
                }}
                style={[
                  styles.tabButton,
                  activeTab === "job" && styles.tabButtonActive,
                  dynamicStyles.tabButton,
                  activeTab === "job" && dynamicStyles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "job" && styles.tabButtonTextActive,
                    dynamicStyles.tabButtonText,
                    activeTab === "job" && dynamicStyles.tabButtonTextActive,
                  ]}
                >
                  Job Sheet
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveTab("performance");
                  loadPerformanceCheck();
                }}
                style={[
                  styles.tabButton,
                  activeTab === "performance" && styles.tabButtonActive,
                  dynamicStyles.tabButton,
                  activeTab === "performance" && dynamicStyles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "performance" && styles.tabButtonTextActive,
                    dynamicStyles.tabButtonText,
                    activeTab === "performance" &&
                      dynamicStyles.tabButtonTextActive,
                  ]}
                >
                  Performance
                </Text>
              </Pressable>
            </ScrollView>

            {activeTab === "content" ? (
              <>
                {contentInfos.length > 0 ? (
                  contentInfos.map((info) => (
                    <View
                      key={info.content_info_id}
                      style={[
                        styles.infoCard,
                        styles.surfaceCard,
                        dynamicStyles.infoCard,
                        dynamicStyles.surfaceCard,
                        isCompact && styles.infoCardCompact,
                      ]}
                    >
                      <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
                        Label
                      </Text>
                      <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
                        {info.label}
                      </Text>

                      {imageUris[info.content_info_id] ? (
                        <>
                          <Text
                            style={[styles.infoLabel, dynamicStyles.infoLabel]}
                          >
                            Image
                          </Text>
                          <View
                            style={[
                              styles.imageContainer,
                              dynamicStyles.imageContainer,
                            ]}
                          >
                            <Image
                              source={{ uri: imageUris[info.content_info_id] }}
                              style={[
                                styles.infoImage,
                                dynamicStyles.infoImage,
                              ]}
                              resizeMode="contain"
                              onError={(e) =>
                                console.log(
                                  "Image load error:",
                                  info.content_info_id,
                                  e.nativeEvent.error,
                                )
                              }
                            />
                          </View>
                        </>
                      ) : null}

                      <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
                        Description
                      </Text>
                      <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
                        {info.description}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text
                      style={[
                        styles.emptyStateText,
                        dynamicStyles.emptyStateText,
                      ]}
                    >
                      No content info available for this lesson content.
                    </Text>
                  </View>
                )}

                <Pressable
                  onPress={markAsRead}
                   disabled={markingRead || (isRead && (lessonAchieved || moduleAchieved))}
                   style={[
                     styles.markAsReadButton,
                     dynamicStyles.markAsReadButton,
                     isRead && styles.markAsReadButtonOutline,
                     isRead && dynamicStyles.markAsReadButtonOutline,
                     isRead && (lessonAchieved || moduleAchieved) && styles.markAsReadButtonAcquired,
                     isRead &&
                       (lessonAchieved || moduleAchieved) &&
                       dynamicStyles.markAsReadButtonAcquired,
                    isCompact && styles.markAsReadButtonCompact,
                  ]}
                >
                  <Text
                    style={[
                      styles.markAsReadButtonText,
                      dynamicStyles.markAsReadButtonText,
                      isRead && styles.markAsReadButtonTextOutline,
                      isRead && dynamicStyles.markAsReadButtonTextOutline,
                    ]}
                  >
                    {markingRead
                      ? "Saving..."
                      : isRead
                        ? "Mark as Unread"
                        : "Mark as Read"}
                  </Text>
                  {isRead && (lessonAchieved || moduleAchieved) ? (
                    <Ionicons
                      name="lock-closed"
                      size={12}
                      color={isDark ? "#ffffff" : "#ffffff"}
                      style={{ marginLeft: 4 }}
                    />
                  ) : null}
                </Pressable>

                <Pressable
                  onPress={toggleBookmark}
                  disabled={togglingBookmark}
                  style={[
                    styles.bookmarkButton,
                    dynamicStyles.bookmarkButton,
                    isBookmarked && styles.bookmarkButtonActive,
                    isBookmarked && dynamicStyles.bookmarkButtonActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color={
                      isBookmarked
                        ? isDark
                          ? "#000000"
                          : "#ffffff"
                        : isDark
                          ? "#86efac"
                          : "#166534"
                    }
                  />
                  <Text
                    style={[
                      styles.bookmarkButtonText,
                      dynamicStyles.bookmarkButtonText,
                      isBookmarked && styles.bookmarkButtonTextActive,
                      isBookmarked && dynamicStyles.bookmarkButtonTextActive,
                    ]}
                  >
                    {togglingBookmark
                      ? "Saving..."
                      : isBookmarked
                        ? "Bookmarked"
                        : "Add Bookmark"}
                  </Text>
                </Pressable>
              </>
            ) : null}

            {activeTab === "exercise" ? (
              <View style={styles.exerciseContainer}>
                {exerciseInstructs.map((instruct) => (
                  <View
                    key={instruct.instruct_id}
                    style={[
                      styles.instructCard,
                      styles.surfaceCard,
                      dynamicStyles.instructCard,
                      dynamicStyles.surfaceCard,
                      isCompact && styles.instructCardCompact,
                    ]}
                  >
                    <Text
                      style={[
                        styles.instructLabel,
                        dynamicStyles.instructLabel,
                      ]}
                    >
                      Instructions
                    </Text>
                    <Text
                      style={[
                        styles.instructTitle,
                        dynamicStyles.instructTitle,
                      ]}
                    >
                      {instruct.question_title}
                    </Text>
                    <Text
                      style={[styles.instructText, dynamicStyles.instructText]}
                    >
                      {instruct.question_instruction}
                    </Text>
                  </View>
                ))}

                {exerciseQuestions.map((q, idx) => (
                  <View
                    key={q.question.question_id}
                    style={[
                      styles.questionCard,
                      styles.surfaceCard,
                      dynamicStyles.questionCard,
                      dynamicStyles.surfaceCard,
                      isCompact && styles.questionCardCompact,
                    ]}
                  >
                    <Text
                      style={[
                        styles.questionNumber,
                        dynamicStyles.questionNumber,
                      ]}
                    >
                      {idx + 1}. {q.question.question}
                    </Text>
                    <View style={styles.choicesContainer}>
                      {renderExerciseChoices(
                        q.question,
                        q.choices,
                        q.question.question_id,
                      )}
                    </View>
                    {exerciseHasExistingAnswers &&
                    isAnswerWrong(
                      q.question,
                      q.choices,
                      exerciseAnswers[q.question.question_id],
                    ) ? (
                      <View
                        style={[
                          styles.correctAnswerContainer,
                          dynamicStyles.correctAnswerContainer,
                        ]}
                      >
                        <Text
                          style={[
                            styles.correctAnswerLabel,
                            dynamicStyles.correctAnswerLabel,
                          ]}
                        >
                          Correct Answer:
                        </Text>
                        <Text
                          style={[
                            styles.correctAnswerText,
                            dynamicStyles.correctAnswerText,
                          ]}
                        >
                          {getCorrectAnswer(q.question, q.choices)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}

                {exerciseQuestions.length === 0 && !exerciseLoaded ? (
                  <View style={styles.emptyState}>
                    <Text
                      style={[
                        styles.emptyStateText,
                        dynamicStyles.emptyStateText,
                      ]}
                    >
                      Loading exercise...
                    </Text>
                  </View>
                ) : exerciseQuestions.length === 0 && exerciseLoaded ? (
                  <View style={styles.emptyState}>
                    <Text
                      style={[
                        styles.emptyStateText,
                        dynamicStyles.emptyStateText,
                      ]}
                    >
                      No exercise questions available for this lesson content.
                    </Text>
                  </View>
                ) : null}

                {!exerciseHasExistingAnswers && exerciseQuestions.length > 0 ? (
                  <Pressable
                    onPress={handleExerciseSubmit}
                    disabled={exerciseSubmitting}
                    style={[
                      styles.exerciseSubmitButton,
                      dynamicStyles.exerciseSubmitButton,
                      exerciseSubmitting && styles.exerciseSubmitButtonDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.exerciseSubmitButtonText,
                        dynamicStyles.exerciseSubmitButtonText,
                      ]}
                    >
                      {exerciseSubmitting ? "Submitting..." : "Submit Answers"}
                    </Text>
                  </Pressable>
                ) : exerciseHasExistingAnswers ? (
                  <View
                    style={[
                      styles.submitBlockedBox,
                      dynamicStyles.submitBlockedBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.submitBlockedText,
                        dynamicStyles.submitBlockedText,
                      ]}
                    >
                      You have already submitted answers for this lesson
                      content.
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {activeTab === "job" ? renderJobSheetSection() : null}

            {activeTab === "performance" ? (
              <View style={styles.perfSection}>
                {perfChecklist.length > 0 ? (
                  <>
                    <View
                      style={[
                        styles.perfIntroCard,
                        dynamicStyles.perfIntroCard,
                      ]}
                    >
                      <Text
                        style={[
                          styles.perfIntroText,
                          dynamicStyles.perfIntroText,
                        ]}
                      >
                        Did the trainee demonstrate the required performance?
                      </Text>
                    </View>

                    {perfChecklist.map((item) => {
                      const currentAnswer =
                        perfSelectedAnswers[item.performance_id] ?? "";
                      return (
                        <View
                          key={item.performance_id}
                          style={[
                            styles.checkItem,
                            dynamicStyles.checkItem,
                            isCompact && styles.checkItemCompact,
                          ]}
                        >
                          <View style={styles.checkItemLeft}>
                            <Text
                              style={[
                                styles.checkOrder,
                                dynamicStyles.checkOrder,
                              ]}
                            >
                              {item.performance_order}.
                            </Text>
                            <Text
                              style={[
                                styles.checkQuestion,
                                dynamicStyles.checkQuestion,
                              ]}
                            >
                              {item.performance_question}
                            </Text>
                          </View>
                          <View style={styles.radioGroup}>
                            <Pressable
                              onPress={() =>
                                setPerfSelectedAnswers((prev) => ({
                                  ...prev,
                                  [item.performance_id]: "Yes",
                                }))
                              }
                              style={[
                                styles.radioButton,
                                currentAnswer === "Yes" &&
                                  styles.radioButtonSelected,
                                dynamicStyles.radioButton,
                                currentAnswer === "Yes" &&
                                  dynamicStyles.radioButtonSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.radioLabel,
                                  currentAnswer === "Yes" &&
                                    styles.radioLabelSelected,
                                  dynamicStyles.radioLabel,
                                  currentAnswer === "Yes" &&
                                    dynamicStyles.radioLabelSelected,
                                ]}
                              >
                                Yes
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                setPerfSelectedAnswers((prev) => ({
                                  ...prev,
                                  [item.performance_id]: "No",
                                }))
                              }
                              style={[
                                styles.radioButton,
                                currentAnswer === "No" &&
                                  styles.radioButtonSelected,
                                dynamicStyles.radioButton,
                                currentAnswer === "No" &&
                                  dynamicStyles.radioButtonSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.radioLabel,
                                  currentAnswer === "No" &&
                                    styles.radioLabelSelected,
                                  dynamicStyles.radioLabel,
                                  currentAnswer === "No" &&
                                    dynamicStyles.radioLabelSelected,
                                ]}
                              >
                                No
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}

                    {perfAlreadySubmitted ? (
                      <View
                        style={[
                          styles.alreadySubmittedCard,
                          dynamicStyles.alreadySubmittedCard,
                        ]}
                      >
                        <Text
                          style={[
                            styles.alreadySubmittedText,
                            dynamicStyles.alreadySubmittedText,
                          ]}
                        >
                          You have already submitted this performance checklist.
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={handlePerformanceSubmit}
                        disabled={perfSubmitting}
                        style={[
                          styles.perfSubmitButton,
                          dynamicStyles.perfSubmitButton,
                          perfSubmitting && styles.perfSubmitButtonDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.perfSubmitButtonText,
                            dynamicStyles.perfSubmitButtonText,
                          ]}
                        >
                          {perfSubmitting ? "Submitting..." : "Submit Answers"}
                        </Text>
                      </Pressable>
                    )}
                  </>
                ) : (
                  <View style={styles.emptyBox}>
                    <Text
                      style={[styles.emptyBoxText, dynamicStyles.emptyBoxText]}
                    >
                      No performance checklist records found for this lesson
                      content.
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="content-info" userId={activeUserId} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  breadcrumb: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  breadcrumbText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
    lineHeight: 18,
  },
  contentContainer: {
    gap: 12,
  },
  surfaceCard: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    lineHeight: 20,
  },
  infoImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  imageContainer: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  errorBox: {
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
  infoCardCompact: {
    padding: 12,
  },
  markAsReadButton: {
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#5bec13",
    marginTop: 8,
    marginBottom: 24,
  },
  markAsReadButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#166534",
  },
  markAsReadButtonAcquired: {
    borderWidth: 1,
    opacity: 0.6,
  },
  markAsReadButtonCompact: {
    paddingVertical: 12,
  },
  markAsReadButtonText: {
    color: "#000000",
    fontWeight: "700",
  },
  markAsReadButtonTextOutline: {
    color: "#166534",
  },
  bookmarkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "rgba(22, 101, 52, 0.2)",
    marginTop: 8,
    marginBottom: 24,
  },
  bookmarkButtonActive: {
    backgroundColor: "#166534",
    borderColor: "#166534",
  },
  bookmarkButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
  },
  bookmarkButtonTextActive: {
    color: "#ffffff",
  },
  tabHeader: {
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  tabHeaderContent: {
    flexDirection: "row",
    gap: 8,
    padding: 6,
    alignItems: "center",
  },
  tabButton: {
    flexShrink: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  tabButtonActive: {
    backgroundColor: "#166534",
    borderColor: "#166534",
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  tabButtonTextActive: {
    color: "#ffffff",
  },
  exerciseContainer: {
    gap: 16,
    marginTop: 8,
  },
  exerciseSubmitButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#55e10a",
  },
  exerciseSubmitButtonDisabled: {
    opacity: 0.7,
  },
  exerciseSubmitButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 15,
  },
  instructCard: {
    gap: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },
  instructLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  instructTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  instructText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 18,
  },
  instructCardCompact: {
    paddingVertical: 10,
  },
  questionCard: {
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },
  questionCardCompact: {
    padding: 10,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    lineHeight: 20,
  },
  choicesContainer: {
    gap: 8,
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  choiceRowSelected: {
    borderColor: "#166534",
    backgroundColor: "#f0fdf4",
  },
  choiceText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },
  choiceTextSelected: {
    fontWeight: "700",
    color: "#166534",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#166534",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#166534",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  submitBlockedBox: {
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "rgba(185, 28, 28, 0.18)",
  },
  submitBlockedText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  correctAnswerContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "rgba(22, 101, 52, 0.18)",
    gap: 4,
  },
  correctAnswerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  correctAnswerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
    lineHeight: 18,
  },
  jobSection: {
    gap: 16,
    marginTop: 8,
  },
  sheetCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    padding: 16,
    gap: 12,
  },
  sheetCardCompact: {
    padding: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  jobSectionItem: {
    gap: 4,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 20,
  },
  addAnswerButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#2563eb",
  },
  addAnswerButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  addAnswerButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyBoxText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(2, 6, 23, 0.4)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "88%",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  modalScrollContent: {
    gap: 12,
  },
  jobTextInput: {
    borderWidth: 1,
    borderColor: "rgba(92, 107, 97, 0.18)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    minHeight: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
  },
  imagePreviewContainer: {
    gap: 4,
  },
  imagePreviewTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  imagePreviewText: {
    fontSize: 13,
    color: "#334155",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(92, 107, 97, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#55e10a",
  },
  cancelButtonText: {
    color: "#102318",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "700",
  },
  perfSection: {
    gap: 16,
    marginTop: 8,
  },
  perfIntroCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(22, 101, 52, 0.18)",
    padding: 16,
  },
  perfIntroText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 20,
  },
  checkItem: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  checkItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkOrder: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
    minWidth: 24,
  },
  checkQuestion: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 20,
    flex: 1,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 8,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(92, 107, 97, 0.2)",
    backgroundColor: "#f8fafc",
    minWidth: 44,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  radioLabelSelected: {
    color: "#ffffff",
  },
  perfSubmitButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#55e10a",
  },
  perfSubmitButtonDisabled: {
    opacity: 0.7,
  },
  perfSubmitButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 15,
  },
  alreadySubmittedCard: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "rgba(185, 28, 28, 0.18)",
  },
  alreadySubmittedText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 14,
  },
  checkItemCompact: {
    padding: 12,
  },
});
