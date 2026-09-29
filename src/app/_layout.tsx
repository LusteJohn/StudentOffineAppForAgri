import { DarkTheme, DefaultTheme, ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider as AppThemeProvider, useThemeContext } from '@/contexts/theme-context';
import { CustomAlertProvider } from '@/lib/custom-alert';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

const APP_NAME = 'Organic Agriculture Production Learning App';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image source={require('@/assets/images/app.png')} style={styles.loadingLogo} resizeMode="contain" />
      <Text style={styles.loadingAppName}>{APP_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
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
    color: '#0f172a',
  },
});

function RootLayoutInner() {
  const { loading } = useThemeContext();
  const resolvedColorScheme = useColorScheme();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ExpoRouterThemeProvider value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
