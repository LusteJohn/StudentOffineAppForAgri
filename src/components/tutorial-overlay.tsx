import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";

type TutorialOverlayProps = {
  visible: boolean;
  userId: number;
  onStep1Complete?: () => void;
  onStep2Complete?: () => void;
  onStep3Complete?: () => void;
  onCompleted?: () => void;
  onSkip?: () => void;
};

const PRIMARY = "#5bec13";

export function TutorialOverlay({
  visible,
  userId,
  onStep1Complete,
  onStep2Complete,
  onStep3Complete,
  onCompleted,
  onSkip,
}: TutorialOverlayProps) {
  const [step, setStep] = useState(1);
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  const handleNext = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStep1 = useCallback(() => {
    onStep1Complete?.();
    handleNext();
  }, [onStep1Complete, handleNext]);

  const handleStep2 = useCallback(() => {
    onStep2Complete?.();
    handleNext();
  }, [onStep2Complete, handleNext]);

  const handleStep3 = useCallback(() => {
    onStep3Complete?.();
    handleNext();
  }, [onStep3Complete, handleNext]);

  const handleComplete = useCallback(() => {
    onCompleted?.();
  }, [onCompleted]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return {
          icon: "cloud-download-outline" as const,
          title: "Import Offline Resources",
          description:
            "First, import the offline learning resources. Go to Settings and tap 'Import Offline Resources' to download all modules, lessons, and content onto your device.",
          actionLabel: "Go to Import",
          onAction: () => {
            handleStep1();
            router.push({
              pathname: "/settings",
              params: { userId: String(userId) },
            });
          },
        };
      case 2:
        return {
          icon: "person-circle-outline" as const,
          title: "Complete Your Profile",
          description:
            "Next, fill out your student profile with all required fields. Go to Settings and open the Profile form to add your first name, last name, birthdate, home address, grade level, and student photo.",
          actionLabel: "Go to Profile",
          onAction: () => {
            handleStep2();
            router.push({
              pathname: "/settings",
              params: { userId: String(userId) },
            });
          },
        };
      case 3:
        return {
          icon: "trophy-outline" as const,
          title: "Acquire Lesson Achievements",
          description:
            "Finally, learn how to earn achievements. Open any lesson content and mark it as 'Read' to track your progress. When all content in a lesson is read, you'll earn a lesson achievement. Complete all lessons in a module to earn a module achievement!",
          actionLabel: "Got It",
          onAction: () => {
            handleStep3();
          },
        };
      default:
        return {
          icon: "checkmark-circle-outline" as const,
          title: "Tutorial Complete!",
          description:
            "You've completed the tutorial. Explore the app and start learning!",
          actionLabel: "Continue to Home",
          onAction: handleComplete,
        };
    }
  };

  const stepData = renderStepContent();

  const handleBackPress = useCallback(() => {
    if (step > 1) {
      handleBack();
    } else {
      handleSkip();
    }
  }, [step, handleBack, handleSkip]);

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
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  s === step && styles.progressDotActive,
                  s < step && styles.progressDotCompleted,
                  {
                    backgroundColor:
                      s < step
                        ? PRIMARY
                        : s === step
                          ? PRIMARY
                          : isDark
                            ? "#444"
                            : "#e2e8f0",
                  },
                ]}
              />
            ))}
            <View
              style={[
                styles.progressLine,
                { backgroundColor: isDark ? "#333" : "#e2e8f0" },
              ]}
            />
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
              <Ionicons name={stepData.icon} size={40} color={PRIMARY} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              {stepData.title}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {stepData.description}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleBackPress}
              style={[
                styles.outlineButton,
                { borderColor: isDark ? "#444" : "#e2e8f0" },
              ]}
            >
              <Text style={[styles.outlineButtonText, { color: theme.text }]}>
                {step > 1 ? "Back" : "Skip"}
              </Text>
            </Pressable>
            <Pressable
              onPress={stepData.onAction}
              style={[
                styles.primaryButton,
                step === 3 && styles.primaryButtonWide,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {stepData.actionLabel}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotActive: {
    transform: [{ scale: 1.3 }],
  },
  progressDotCompleted: {
    transform: [{ scale: 1.3 }],
  },
  progressLine: {
    position: "absolute",
    left: "10%",
    right: "10%",
    height: 2,
    top: 4,
    zIndex: -1,
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
