import { DarkTheme, DefaultTheme, ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProvider as AppThemeProvider, useThemeContext } from '@/contexts/theme-context';
import { CustomAlertProvider } from '@/lib/custom-alert';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { effectiveColorScheme, loading } = useThemeContext();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
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
