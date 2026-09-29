import {useCallback, useMemo} from 'react';
import {TutorialOverlay} from '@/components/tutorial-overlay';
import {useOnboarding} from '@/contexts/onboarding-context';

export function GlobalTutorialOverlay() {
  const {
    visible,
    currentStep,
    completedSteps,
    markStepComplete,
    goToNextStep,
    goToPrevStep,
    hideTutorial,
    showOnboarding,
  } = useOnboarding();

  const completedStepsObj = useMemo(
    () => ({
      step1: !!completedSteps[1],
      step2: !!completedSteps[2],
      step3: !!completedSteps[3],
      step4: !!completedSteps[4],
      step5: !!completedSteps[5],
      step6: !!completedSteps[6],
      step7: !!completedSteps[7],
      step8: !!completedSteps[8],
      step9: !!completedSteps[9],
    }),
    [completedSteps],
  );

  const handlers = useMemo(
    () => ({
      onCompleteStep1: () => markStepComplete(1),
      onCompleteStep2: () => markStepComplete(2),
      onCompleteStep3: () => markStepComplete(3),
      onCompleteStep4: () => markStepComplete(4),
      onCompleteStep5: () => markStepComplete(5),
      onCompleteStep6: () => markStepComplete(6),
      onCompleteStep7: () => markStepComplete(7),
      onCompleteStep8: () => markStepComplete(8),
      onCompleteStep9: () => markStepComplete(9),
    }),
    [markStepComplete],
  );

  const handleCompleted = useCallback(() => {
    hideTutorial();
  }, [hideTutorial]);

  const handleSkip = useCallback(() => {
    hideTutorial();
  }, [hideTutorial]);

  if (!showOnboarding) return null;

  return (
    <TutorialOverlay
      visible={visible && currentStep <= 9}
      userId={1}
      currentStep={currentStep}
      completedSteps={completedStepsObj}
      handlers={handlers}
      onNext={goToNextStep}
      onPrev={goToPrevStep}
      onCompleted={handleCompleted}
      onSkip={handleSkip}
    />
  );
}
