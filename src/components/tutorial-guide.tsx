import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';

const PRIMARY = '#5bec13';

type TutorialGuideModalProps = {
  visible: boolean;
  onClose: () => void;
};

type TutorialStep = {
  step: number;
  title: string;
  description: string;
  imageNote: string;
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    step: 1,
    title: 'Import resources on setting page.',
    description:
      'Open the Settings page and tap "Import resources" to load all competencies, modules, lessons, exercises, job sheets and performance checklists onto this device.',
    imageNote: 'Settings page - Import resources button',
  },
  {
    step: 2,
    title: 'Add your profile so your progress is recorded.',
    description:
      'After importing resources, go to the Profile page and add your profile details. Your name, grade level and photo are stored with your answers and progress.',
    imageNote: 'Profile page - Student profile form',
  },
  {
    step: 3,
    title: 'Explore the Library page.',
    description:
      'Navigate the "Library" page where all the learning materials are located. Tapping "View" on a competency displays the module description, and tapping "Start" redirects you to the Lesson page.',
    imageNote: 'Library page - Competency list with View button',
  },
  {
    step: 4,
    title: 'Open a lesson from the Lesson page.',
    description:
      'The Lesson page lists all the lesson outcomes of the module. Tapping "View" on a specific lesson outcome displays the description, links and the list of lesson contents you can open.',
    imageNote: 'Lesson page - Lesson outcomes list',
  },
  {
    step: 5,
    title: 'Work on the Lesson Content page.',
    description:
      'The Lesson Content page displays the lesson content information together with its exercises, job sheet and performance tasks you can answer and submit. Scroll the Content Info section to find the "Mark as read" and "Bookmark" buttons.',
    imageNote: 'Lesson Content page - Content info with mark as read and bookmark',
  },
  {
    step: 6,
    title: 'Answer the Exercise section.',
    description:
      'The Exercise section varies by type: multiple choice, identification, true or false and enumeration. Read each question and submit your answer when you are done.',
    imageNote: 'Exercise section - Question types',
  },
  {
    step: 7,
    title: 'Submit your Job Sheet.',
    description:
      'In the Job Sheet section you answer by attaching one (1) image as evidence and writing a short text about the assessment you completed.',
    imageNote: 'Job Sheet section - Image upload and answer text',
  },
  {
    step: 8,
    title: 'Check your Performance.',
    description:
      'The Performance section lists the performance criteria. Go through each item and mark whether you followed the instruction while doing the task.',
    imageNote: 'Performance section - Performance checklist',
  },
  {
    step: 9,
    title: 'Revisit bookmarks from the Bookmark page.',
    description:
      'The Bookmark page lists every lesson content you bookmarked. Tapping an entry redirects you to the lesson content so you can continue where you left off.',
    imageNote: 'Bookmark page - Bookmarked lesson contents',
  },
  {
    step: 10,
    title: 'Track badges on the Achievement page.',
    description:
      'The Achievement page lists every module and lesson achievement you can claim by completing the lesson contents, lessons and modules.',
    imageNote: 'Achievement page - Module and lesson badges',
  },
  {
    step: 11,
    title: 'Export your progress as PDF.',
    description:
      'On the Settings page, tap "Export student report" to generate a PDF of your profile, answers, progress and achievements so you can save or share it.',
    imageNote: 'Settings page - Export student report',
  },
];

const CLOSING_MESSAGE =
  "That's all and I hope you follow the step and happy to learn on Organic Agriculture Production Learning App.";

export function TutorialGuideModal({ visible, onClose }: TutorialGuideModalProps) {
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';
  const [stepIndex, setStepIndex] = useState(0);

  const totalSteps = TUTORIAL_STEPS.length;
  const step = TUTORIAL_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

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
        description: {
          color: theme.textSecondary,
        },
        imagePlaceholder: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.28)',
        },
        imagePlaceholderTitle: {
          color: theme.text,
        },
        imagePlaceholderText: {
          color: theme.textSecondary,
        },
        counter: {
          color: theme.textSecondary,
        },
        stepLabel: {
          color: theme.text,
        },
        navButton: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
        },
        closeButton: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
        },
        primaryButton: {
          backgroundColor: isDark ? '#86efac' : PRIMARY,
        },
        primaryButtonText: {
          color: isDark ? '#000000' : '#0f172a',
        },
        dot: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : '#e2e8f0',
        },
        closingText: {
          color: theme.text,
        },
      }),
    [theme, isDark],
  );

  const handleNext = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleClose = useCallback(() => {
    setStepIndex(0);
    onClose();
  }, [onClose]);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, dynamicStyles.card]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.eyebrow, dynamicStyles.eyebrow]}>Guide</Text>
              <Text style={[styles.title, dynamicStyles.title]}>How to use the app</Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={[styles.closeButton, dynamicStyles.closeButton]}
              accessibilityRole="button"
              accessibilityLabel="Close tutorial guide"
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.counterRow}>
              <Text style={[styles.stepLabel, dynamicStyles.stepLabel]}>
                Step {step.step} of {totalSteps}
              </Text>
              <Text style={[styles.counter, dynamicStyles.counter]}>{step.title}</Text>
            </View>

            <View style={[styles.imagePlaceholder, dynamicStyles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={28} color={theme.textSecondary} />
              <Text style={[styles.imagePlaceholderTitle, dynamicStyles.imagePlaceholderTitle]}>
                Screenshot
              </Text>
              <Text style={[styles.imagePlaceholderText, dynamicStyles.imagePlaceholderText]}>
                {step.imageNote}
              </Text>
            </View>

            <Text style={[styles.description, dynamicStyles.description]}>{step.description}</Text>

            {isLastStep ? (
              <View style={styles.closingBox}>
                <Ionicons name="school-outline" size={18} color={PRIMARY} />
                <Text style={[styles.closingText, dynamicStyles.closingText]}>{CLOSING_MESSAGE}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.dotRow}>
            {TUTORIAL_STEPS.map((item, index) => (
              <View
                key={item.step}
                style={[
                  styles.dot,
                  dynamicStyles.dot,
                  index === stepIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handlePrev}
              disabled={isFirstStep}
              style={[
                styles.navButton,
                dynamicStyles.navButton,
                isFirstStep && styles.navButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Previous step"
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={isFirstStep ? theme.textSecondary : theme.text}
              />
              <Text
                style={[
                  styles.navButtonText,
                  { color: isFirstStep ? theme.textSecondary : theme.text },
                ]}
              >
                Previous
              </Text>
            </Pressable>

            {isLastStep ? (
              <Pressable
                onPress={handleClose}
                style={[styles.primaryButton, dynamicStyles.primaryButton]}
                accessibilityRole="button"
              >
                <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                  Got it
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleNext}
                style={[styles.navButton, dynamicStyles.navButton]}
                accessibilityRole="button"
                accessibilityLabel="Next step"
              >
                <Text style={[styles.navButtonText, { color: theme.text }]}>Next</Text>
                <Ionicons name="chevron-forward" size={22} color={theme.text} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    gap: 12,
  },
  counterRow: {
    gap: 2,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  counter: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  imagePlaceholder: {
    height: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  imagePlaceholderTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  closingBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  closingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: PRIMARY,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
  },
  navButtonDisabled: {
    opacity: 0.45,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
