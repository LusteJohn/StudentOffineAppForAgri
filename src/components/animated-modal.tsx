import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, ViewStyle } from 'react-native';

type AnimatedModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  overlayStyle?: ViewStyle | ViewStyle[];
  useNativeDriver?: boolean;
};

export function AnimatedModal({
  visible,
  onRequestClose,
  children,
  overlayStyle,
  useNativeDriver = false,
}: AnimatedModalProps) {
  const backdropOpacity = useRef<Animated.Value>(new Animated.Value(0));
  const modalScale = useRef<Animated.Value>(new Animated.Value(0.98));
  const modalTranslateY = useRef<Animated.Value>(new Animated.Value(20));
  const isAnimating = useRef(false);

  useEffect(() => {
    if (visible && !isAnimating.current) {
      isAnimating.current = true;
      backdropOpacity.current.setValue(0);
      modalScale.current.setValue(0.98);
      modalTranslateY.current.setValue(20);

      Animated.parallel([
        Animated.timing(backdropOpacity.current, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(modalScale.current, {
          toValue: 1,
          duration: 250,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver,
        }),
        Animated.timing(modalTranslateY.current, {
          toValue: 0,
          duration: 250,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver,
        }),
      ]).start();
    }
  }, [visible, useNativeDriver]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: backdropOpacity.current },
          overlayStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: backdropOpacity.current,
              transform: [
                { translateY: modalTranslateY.current },
                { scale: modalScale.current },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export function StaggeredFadeInView({
  children,
  delay = 0,
  duration = 300,
  useNativeDriver = false,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  useNativeDriver?: boolean;
}) {
  const opacity = useRef<Animated.Value>(new Animated.Value(0));
  const translateY = useRef<Animated.Value>(new Animated.Value(10));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity.current, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(translateY.current, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver,
        }),
      ]),
    ]).start();
  }, [delay, duration, useNativeDriver]);

  return (
    <Animated.View style={{ opacity: opacity.current, transform: [{ translateY: translateY.current }] }}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    opacity: 0,
  },
});
