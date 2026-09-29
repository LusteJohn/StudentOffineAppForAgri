import { useCallback, useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type OnboardingStepHandlers = {
  onCompleteStep1?: () => void;
  onCompleteStep2?: () => void;
  onCompleteStep3?: () => void;
  onCompleteStep4?: () => void;
  onCompleteStep5?: () => void;
  onCompleteStep6?: () => void;
  onCompleteStep7?: () => void;
  onCompleteStep8?: () => void;
  onCompleteStep9?: () => void;
};

type CompletedSteps = {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
  step6: boolean;
  step7: boolean;
  step8: boolean;
  step9: boolean;
};

type TutorialOverlayProps = {
  visible: boolean;
  userId: number;
  currentStep: OnboardingStep;
  completedSteps: CompletedSteps;
  handlers: OnboardingStepHandlers;
  onNext: () => void;
  onPrev: () => void;
  onCompleted?: () => void;
  onSkip?: () => void;
};

const PRIMARY = "#5bec13";
const TOTAL_STEPS = 9;

export function TutorialOverlay({
  visible,
  userId,
  currentStep,
  completedSteps,
  handlers,
  onNext,
  onPrev,
  onCompleted,
  onSkip,
}: TutorialOverlayProps) {
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  const handleComplete = useCallback(() => {
    onCompleted?.();
  }, [onCompleted]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  const stepKey = `step${currentStep}` as keyof CompletedSteps;
  const handlerKey = `onCompleteStep${currentStep}` as keyof OnboardingStepHandlers;
  const isCurrentStepDone = completedSteps[stepKey];

  const stepConfig = useMemo<
    {
      icon: keyof typeof Ionicons.glyphMap;
      title: string;
      description: string;
      actionLabel: string;
      navigatePath?: string;
    }
  >(() => {
    switch (currentStep) {
      case 1:
        return {
          icon: "cloud-download-outline",
          title: "Import Offline Resources",
          description:
            "First, import the offline learning resources. Go to Settings and tap 'Import Offline Resources' to download all modules, lessons, and content onto your device.",
          actionLabel: completedSteps.step1 ? "Continue" : "Go to Import",
          navigatePath: "/settings",
        };
      case 2:
        return {
          icon: "person-circle-outline",
          title: "Create Your Profile",
          description:
            "Next, fill out your student profile with all required fields. Go to Settings and open the Profile form to add your first name, last name, birthdate, home address, grade level, and student photo.",
          actionLabel: completedSteps.step2 ? "Continue" : "Go to Profile",
          navigatePath: "/settings",
        };
      case 3:
        return {
          icon: "layers-outline",
          title: "Open Module List",
          description:
            "Explore the modules available in the app. From the home screen, tap on the 'Modules' section to see all available learning modules.",
          actionLabel: completedSteps.step3 ? "Continue" : "Go to Modules",
          navigatePath: "/module",
        };
      case 4:
        return {
          icon: "book-outline",
          title: "Select a Module Lesson",
          description:
            "On the Modules page, tap on a module to expand it, then select a lesson from the list to start learning.",
          actionLabel: completedSteps.step4 ? "Continue" : "Go to Lessons",
          navigatePath: "/lesson",
        };
      case 5:
        return {
          icon: "information-circle-outline",
          title: "View Lesson Details",
          description:
            "On the Lesson page, tap the 'View' button on a lesson to open its detail modal. This shows lesson info, content list, and links.",
          actionLabel: completedSteps.step5 ? "Continue" : "Got It",
        };
      case 6:
        return {
          icon: "document-text-outline",
          title: "Explore Lesson Contents",
          description:
            "Inside the lesson detail modal, scroll through the Lesson Contents section. Each content card shows objectives and a 'View Content' button.",
          actionLabel: completedSteps.step6 ? "Continue" : "Got It",
        };
      case 7:
        return {
          icon: "ellipse-outline",
          title: "Visit Content Info",
          description:
            "Tap 'View Content' on a lesson content card to navigate to the Content Info screen. Here you'll see detailed information about the selected content.",
          actionLabel: completedSteps.step7 ? "Continue" : "Got It",
          navigatePath: "/content-info",
        };
      case 8:
        return {
          icon: "checkmark-circle-outline",
          title: "Complete Exercises",
          description:
            "On the Content Info screen, review the objective content and try out the exercises. Answer the questions to test your understanding.",
          actionLabel: completedSteps.step8 ? "Continue" : "Got It",
        };
      case 9:
        return {
          icon: "stats-chart-outline",
          title: "Track Your Progress",
          description:
            "View your job sheet on the Content Info screen and check your performance on the Home screen. The performance section shows your activity and progress over time.",
          actionLabel: completedSteps.step9 ? "Finish" : "Got It",
        };
      default:
        return {
          icon: "checkmark-circle-outline",
          title: "Onboarding Complete!",
          description:
            "You've completed the onboarding tour. Explore the app and start learning!",
          actionLabel: "Continue to Home",
        };
    }
  }, [currentStep, completedSteps]);

  const handleAction = useCallback(() => {
    if (isCurrentStepDone) {
      if (currentStep === TOTAL_STEPS) {
        handleComplete();
      } else {
        if (stepConfig.navigatePath) {
          router.push({
            pathname: stepConfig.navigatePath as any,
            params: { userId: String(userId) },
          });
        }
        onNext();
      }
    } else {
      handlers[handlerKey]?.();
    }
  }, [
    isCurrentStepDone,
    currentStep,
    stepConfig.navigatePath,
    userId,
    handlers,
    handlerKey,
    onNext,
    handleComplete,
  ]);

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? "#1e1e23" : "#ffffff" },
          ]}
        >
          <View style={styles.progressContainer}>
            <Text style={[styles.stepIndicator, { color: theme.textSecondary }]}>
              Step {currentStep} of {TOTAL_STEPS}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentStep / TOTAL_STEPS) * 100}%`,
                    backgroundColor: PRIMARY,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: isDark
                    ? "rgba(91, 236, 19, 0.12)"
                    : "#f0fdf4",
                },
              ]}
            >
              <Ionicons name={stepConfig.icon} size={40} color={PRIMARY} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              {stepConfig.title}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {stepConfig.description}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={currentStep > 1 ? onPrev : handleSkip}
              style={[
                styles.outlineButton,
                { borderColor: isDark ? "#444" : "#e2e8f0" },
              ]}
            >
              <Text style={[styles.outlineButtonText, { color: theme.text }]}>
                {currentStep > 1 ? "Back" : "Skip"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAction}
              style={[
                styles.primaryButton,
                isLastStep && styles.primaryButtonWide,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Start Exploring" : stepConfig.actionLabel}
              </Text>
            </Pressable>
          </View>
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
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    gap: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 8,
  },
  content: {
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonWide: {
    flex: 2,
  },
  primaryButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },
});
