import { createContext, useCallback, useContext, useState, useRef, ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  cancelable?: boolean;
  onDismiss?: () => void;
};

type AlertState = {
  title: string;
  message?: string;
  buttons: AlertButton[];
  options?: AlertOptions;
  visible: boolean;
};

type CustomAlertContextType = {
  showAlert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => Promise<number | undefined>;
};

const CustomAlertContext = createContext<CustomAlertContextType | undefined>(undefined);

function getButtonStyle(style?: AlertButton['style']) {
  switch (style) {
    case 'destructive':
      return { textColor: '#b91c1c', backgroundColor: '#fef2f2' };
    case 'cancel':
      return { textColor: '#475569', backgroundColor: '#f1f5f9' };
    default:
      return { textColor: '#ffffff', backgroundColor: '#5bec13' };
  }
}

export function CustomAlertProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    title: '',
    buttons: [],
    visible: false,
  });
  const resolveRef = useRef<((index: number | undefined) => void) | null>(null);

  const showAlert = useCallback(
    (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
      const resolvedButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
      setAlertState({ title, message, buttons: resolvedButtons, options, visible: true });
      return new Promise<number | undefined>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    []
  );

  const handleDismiss = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleBackdropPress = useCallback(() => {
    if (alertState.options?.cancelable) {
      resolveRef.current?.(undefined);
      resolveRef.current = null;
      alertState.options?.onDismiss?.();
      handleDismiss();
    }
  }, [alertState, handleDismiss]);

  const handleButtonPress = useCallback(
    (button: AlertButton, index: number) => {
      button.onPress?.();
      resolveRef.current?.(index);
      resolveRef.current = null;
      handleDismiss();
    },
    [handleDismiss]
  );

  return (
    <CustomAlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={alertState.visible}
        onRequestClose={handleBackdropPress}
      >
        <Pressable
          style={styles.overlay}
          onPress={handleBackdropPress}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.alertTitle}>{alertState.title}</Text>
            {alertState.message ? (
              <Text style={styles.alertMessage}>{alertState.message}</Text>
            ) : null}
            <View style={styles.buttonRow}>
              {alertState.buttons.map((button, index) => {
                const { textColor, backgroundColor } = getButtonStyle(button.style);
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleButtonPress(button, index)}
                    style={[styles.alertButton, { backgroundColor }]}
                  >
                    <Text style={[styles.alertButtonText, { color: textColor }]}>
                      {button.text || 'OK'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within a CustomAlertProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  alertButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
