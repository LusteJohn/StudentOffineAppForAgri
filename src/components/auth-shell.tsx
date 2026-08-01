import { Image, KeyboardAvoidingView, Platform, Pressable, ReactNode, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image as BlurImage } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  return (
    <ThemedView style={styles.screen}>
      <BlurImage source={require('../../assets/images/agriLearnSchool.png')} style={styles.backgroundImage} contentFit="cover" blurRadius={2} />
      <View pointerEvents="none" style={styles.skyGlow} />
      <View pointerEvents="none" style={styles.fieldGlow} />
      <View pointerEvents="none" style={styles.overlayWash} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}>
        <ScrollView contentContainerStyle={[styles.scrollContent, isCompact ? styles.scrollContentCompact : styles.scrollContentWide]} keyboardShouldPersistTaps="handled">
          <View style={styles.heroBlock}>
            <View style={styles.logoFrame}>
              <Image source={require('../../assets/images/app_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>

          <ThemedView type="backgroundElement" style={[styles.card, isCompact ? styles.cardCompact : styles.cardWide]}>
            <View style={styles.cardHeader}>
              <ThemedText type="code" themeColor="textSecondary" style={styles.eyebrow}>
                {eyebrow}
              </ThemedText>
              {title}
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            </View>

            {children}

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

export function AuthLink({ children, onPress, textStyle }: { children: ReactNode; onPress: () => void; textStyle?: object }) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.linkPressable, pressed && styles.pressed]}>
      <ThemedText style={[styles.linkText, { color: theme.text }, textStyle]}>{children}</ThemedText>
    </Pressable>
  );
}

export function AuthNotification({ type, text }: { type: 'success' | 'error'; text: string }) {
  return (
    <View style={[styles.notification, type === 'success' ? styles.successNotification : styles.errorNotification]}>
      <View style={[styles.notificationIndicator, type === 'success' ? styles.successIndicator : styles.errorIndicator]} />
      <Text style={[styles.notificationText, type === 'success' ? styles.successNotificationText : styles.errorNotificationText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  errorNotification: {
    backgroundColor: '#fef2f2',
    borderColor: 'rgba(185, 28, 28, 0.18)',
  },
  successNotification: {
    backgroundColor: '#ecfdf5',
    borderColor: 'rgba(4, 120, 87, 0.18)',
  },
  notificationIndicator: {
    width: 4,
    height: 16,
    borderRadius: 4,
  },
  errorIndicator: {
    backgroundColor: '#b91c1c',
  },
  successIndicator: {
    backgroundColor: '#047857',
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  errorNotificationText: {
    color: '#b91c1c',
  },
  successNotificationText: {
    color: '#047857',
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#eef4ea',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContentCompact: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  scrollContentWide: {
    paddingHorizontal: 28,
  },
  heroBlock: {
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoFrame: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#143610',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  logo: {
    width: 156,
    height: 46,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    borderRadius: 28,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  cardCompact: {
    padding: 18,
    borderRadius: 24,
  },
  cardWide: {
    padding: 24,
  },
  cardHeader: {
    gap: 8,
  },
  eyebrow: {
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 8,
    gap: 8,
  },
  skyGlow: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(104, 186, 78, 0.18)',
  },
  fieldGlow: {
    position: 'absolute',
    bottom: -130,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: 'rgba(82, 167, 54, 0.18)',
  },
  overlayWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  field: {
    marginTop: 12,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
    marginTop: 4,
  },
  success: {
    color: '#047857',
    marginTop: 4,
  },
  linkPressable: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
