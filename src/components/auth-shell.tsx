import { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <ThemedView style={styles.screen}>
      <View pointerEvents="none" style={styles.skyGlow} />
      <View pointerEvents="none" style={styles.fieldGlow} />
      <View pointerEvents="none" style={styles.overlayWash} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.heroBlock}>
          <View style={styles.logoFrame}>
            <Image source={require('../../assets/images/expo-logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.cardHeader}>
            <ThemedText type="code" themeColor="textSecondary" style={styles.eyebrow}>
              {eyebrow}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          </View>

          {children}

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

export function AuthLink({ children, onPress }: { children: ReactNode; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.linkPressable, pressed && styles.pressed]}>
      <ThemedText style={[styles.linkText, { color: theme.text }]}>{children}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#eef4ea',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
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
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  logo: {
    width: 156,
    height: 46,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    borderRadius: 32,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    backdropFilter: 'blur(14px)',
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
    color: '#ffffff',
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
