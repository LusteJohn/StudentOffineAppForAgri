import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { getSetting, getStudentTutorialByUserId, createStudentTutorial } from '@/lib/auth-api';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface OnboardingContextValue {
  visible: boolean;
  currentStep: OnboardingStep;
  completedSteps: Record<number, boolean>;
  showOnboarding: boolean;
  showTutorial: () => void;
  hideTutorial: () => void;
  toggleOnboarding: (value: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  markStepComplete: (step: OnboardingStep) => void;
  resetTutorial: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children, userId }: { children: ReactNode; userId: number }) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const showSetting = await getSetting('show_onboarding_tutorial');
        if (isMounted) {
          setShowOnboarding(showSetting !== '0');
        }
      } catch {
        if (isMounted) {
          setShowOnboarding(true);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showOnboarding) return;
    let isMounted = true;
    (async () => {
      try {
        const existing = await getStudentTutorialByUserId(userId);
        if (!isMounted) return;
        if (existing) {
          setCompletedSteps({
            1: existing.step1_done === 1,
            2: existing.step2_done === 1,
            3: existing.step3_done === 1,
            4: existing.step4_done === 1,
            5: existing.step5_done === 1,
            6: existing.step6_done === 1,
            7: existing.step7_done === 1,
            8: existing.step8_done === 1,
            9: existing.step9_done === 1,
          });
          if (existing.completed !== 1) {
            setVisible(true);
            const nextStep = (Object.entries({
              1: existing.step1_done === 1,
              2: existing.step2_done === 1,
              3: existing.step3_done === 1,
              4: existing.step4_done === 1,
              5: existing.step5_done === 1,
              6: existing.step6_done === 1,
              7: existing.step7_done === 1,
              8: existing.step8_done === 1,
              9: existing.step9_done === 1,
            }).find(([_, done]) => !done)?. [0] ?? '1') as string;
            setCurrentStep(Number(nextStep) as OnboardingStep);
          }
        } else {
          await createStudentTutorial({
            user_id: userId,
            completed: false,
            step1_done: false,
            step2_done: false,
            step3_done: false,
            step4_done: false,
            step5_done: false,
            step6_done: false,
            step7_done: false,
            step8_done: false,
            step9_done: false,
          });
          if (isMounted) {
            setVisible(true);
            setCurrentStep(1);
          }
        }
      } catch {
        if (isMounted) {
          setVisible(true);
        }
      }
    })();
  }, [showOnboarding, userId]);

  const showTutorial = useCallback(() => setVisible(true), []);
  const hideTutorial = useCallback(() => setVisible(false), []);

  const toggleOnboarding = useCallback(async (value: boolean) => {
    setShowOnboarding(value);
    await getSetting('show_onboarding_tutorial');
    try {
      const { setSetting } = await import('@/lib/auth-api');
      await setSetting('show_onboarding_tutorial', value ? '1' : '0');
    } catch {
      // ignore
    }
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 9 ? (prev + 1) as OnboardingStep : prev));
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? (prev - 1) as OnboardingStep : prev));
  }, []);

  const markStepComplete = useCallback(async (stepNum: OnboardingStep) => {
    const stepKey = `step${stepNum}_done`;
    setCompletedSteps((prev) => ({ ...prev, [stepNum]: true }));
    try {
      const existing = await getStudentTutorialByUserId(userId);
      if (existing) {
        const { updateStudentTutorial } = await import('@/lib/auth-api');
        await updateStudentTutorial(existing.tutorial_id, { [stepKey]: 1 });
      }
    } catch {
      // ignore
    }
  }, [userId]);

  const resetTutorial = useCallback(async () => {
    setCurrentStep(1);
    setCompletedSteps({});
    setVisible(true);
    try {
      const existing = await getStudentTutorialByUserId(userId);
      if (existing) {
        const { updateStudentTutorial } = await import('@/lib/auth-api');
        await updateStudentTutorial(existing.tutorial_id, {
          completed: 0,
          step1_done: 0,
          step2_done: 0,
          step3_done: 0,
          step4_done: 0,
          step5_done: 0,
          step6_done: 0,
          step7_done: 0,
          step8_done: 0,
          step9_done: 0,
        });
      }
    } catch {
      // ignore
    }
  }, [userId]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      visible,
      currentStep,
      completedSteps,
      showOnboarding,
      showTutorial,
      hideTutorial,
      toggleOnboarding,
      goToNextStep,
      goToPrevStep,
      markStepComplete,
      resetTutorial,
    }),
    [visible, currentStep, completedSteps, showOnboarding, showTutorial, hideTutorial, toggleOnboarding, goToNextStep, goToPrevStep, markStepComplete, resetTutorial],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
