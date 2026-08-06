import { DarkTheme, DefaultTheme, ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider as AppThemeProvider, useThemeContext } from '@/contexts/theme-context';
import { CustomAlertProvider } from '@/lib/custom-alert';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

const APP_NAME = 'Organic Agriculture Production Learning App';

function LoadingScreen() {
  const { effectiveColorScheme } = useThemeContext();
  const theme = useTheme();
  const isDark = effectiveColorScheme === 'dark';

  return (
    <View style={[styles.loadingContainer, { backgroundColor: isDark ? theme.background : '#ffffff' }]}>
      <Image source={require('@/assets/images/app.png')} style={styles.loadingLogo} resizeMode="contain" />
      <Text style={[styles.loadingAppName, { color: isDark ? theme.text : '#102318' }]}>{APP_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 120,
    height: 120,
  },
  loadingAppName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 28,
  },
});

function RootLayoutInner() {
  const { effectiveColorScheme, loading } = useThemeContext();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ExpoRouterThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CustomAlertProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CustomAlertProvider>
    </ExpoRouterThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
    </AppThemeProvider>
  );
}
