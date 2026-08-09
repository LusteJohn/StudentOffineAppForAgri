import { usePathname } from 'expo-router';
import { useThemeContext } from '@/contexts/theme-context';

export function useColorScheme() {
  const { effectiveColorScheme } = useThemeContext();
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  if (isAuthRoute) {
    return 'light';
  }
  return effectiveColorScheme;
}
