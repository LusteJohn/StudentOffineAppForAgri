import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCustomAlert } from '@/lib/custom-alert';

type BottomNavbarProps = {
  activeTab?: 'home' | 'library' | 'lesson' | 'achievement' | 'content-info' | 'settings';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showAlert } = useCustomAlert();
  const isCompact = width < 390;
  const theme = useTheme();

  const getActiveTab = (): 'home' | 'library' | 'lesson' | 'achievement' | 'content-info' | 'settings' => {
    if (activeTab) return activeTab;
    if (pathname === '/home') return 'home';
    if (pathname === '/module') return 'library';
    if (pathname === '/lesson') return 'lesson';
    if (pathname === '/achievement') return 'achievement';
    if (pathname === '/settings') return 'settings';
    if (pathname.startsWith('/content-info')) return 'content-info';
    return 'home';
  };

  const currentTab = getActiveTab();
  const scrollRef = useRef<ScrollView>(null);
  const tabOrder: ('home' | 'library' | 'lesson' | 'content-info' | 'achievement' | 'settings')[] = ['home', 'library', 'lesson', 'content-info', 'achievement', 'settings'];
  const tabIndex = tabOrder.indexOf(currentTab);

  useEffect(() => {
    if (scrollRef.current && tabIndex >= 0) {
      const estimatedTabWidth = isCompact ? 76 : 90;
      const targetOffset = tabIndex * estimatedTabWidth;
      scrollRef.current.scrollTo({ x: Math.max(0, targetOffset), animated: true });
    }
  }, [currentTab, tabIndex, isCompact]);

  const goHome = () => {
    if (currentTab !== 'home') {
      router.replace({ pathname: '/home', params: { userId: String(userId) } });
    }
  };

  const goLibrary = () => {
    if (currentTab !== 'library') {
      router.replace({ pathname: '/module', params: { userId: String(userId) } });
    }
  };

  const goLesson = () => {
    if (currentTab !== 'lesson') {
      router.replace({ pathname: '/lesson', params: { userId: String(userId) } });
    }
  };

  const goContentInfo = () => {
    if (currentTab !== 'content-info') {
      showAlert(
        'Select a lesson first',
        'Please select a module and lesson from the Lesson page before viewing the content info.',
        [
          {
            text: 'OK',
            onPress: () => router.replace({ pathname: '/lesson', params: { userId: String(userId) } }),
          },
        ]
      );
    }
  };

  const goAchievement = () => {
    if (currentTab !== 'achievement') {
      router.replace({ pathname: '/achievement', params: { userId: String(userId) } });
    }
  };

  const goSettings = () => {
    if (currentTab !== 'settings') {
      router.replace({ pathname: '/settings', params: { userId: String(userId) } });
    }
  };

  const isDark = theme === Colors.dark;
  const activeColor = '#55e10a';
  const inactiveColor = isDark ? '#B0B4BA' : '#5c6b61';
  const activeTextColor = isDark ? '#ffffff' : '#000000';

  return (
    <View style={[styles.wrap, {
      paddingTop: Math.max(insets.top, 8),
      paddingBottom: Math.max(insets.bottom, 16),
      backgroundColor: 'transparent',
    }]}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.bar, isCompact ? styles.barCompact : styles.barWide, {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(92, 107, 97, 0.16)',
          shadowColor: isDark ? '#000000' : '#0f172a',
        }]}>
          <Pressable onPress={goHome} style={[styles.tabButton, currentTab === 'home' && styles.activeTabButton, currentTab === 'home' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={currentTab === 'home' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'home' && styles.activeTabLabel, { color: currentTab === 'home' ? activeTextColor : inactiveColor }]}>Home</Text>
          </Pressable>

          <Pressable onPress={goLibrary} style={[styles.tabButton, currentTab === 'library' && styles.activeTabButton, currentTab === 'library' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'library' ? 'book' : 'book-outline'}
              size={22}
              color={currentTab === 'library' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'library' && styles.activeTabLabel, { color: currentTab === 'library' ? activeTextColor : inactiveColor }]}>Library</Text>
          </Pressable>

          <Pressable onPress={goLesson} style={[styles.tabButton, currentTab === 'lesson' && styles.activeTabButton, currentTab === 'lesson' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'lesson' ? 'document' : 'document-outline'}
              size={22}
              color={currentTab === 'lesson' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'lesson' && styles.activeTabLabel, { color: currentTab === 'lesson' ? activeTextColor : inactiveColor }]}>Lesson</Text>
          </Pressable>

          <Pressable onPress={goContentInfo} style={[styles.tabButton, currentTab === 'content-info' && styles.activeTabButton, currentTab === 'content-info' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'content-info' ? 'information-circle' : 'information-circle-outline'}
              size={22}
              color={currentTab === 'content-info' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'content-info' && styles.activeTabLabel, { color: currentTab === 'content-info' ? activeTextColor : inactiveColor }]}>Content Info</Text>
          </Pressable>

          <Pressable onPress={goAchievement} style={[styles.tabButton, currentTab === 'achievement' && styles.activeTabButton, currentTab === 'achievement' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'achievement' ? 'trophy' : 'trophy-outline'}
              size={22}
              color={currentTab === 'achievement' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'achievement' && styles.activeTabLabel, { color: currentTab === 'achievement' ? activeTextColor : inactiveColor }]}>Achievements</Text>
          </Pressable>

          <Pressable onPress={goSettings} style={[styles.tabButton, currentTab === 'settings' && styles.activeTabButton, currentTab === 'settings' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={currentTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={currentTab === 'settings' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, currentTab === 'settings' && styles.activeTabLabel, { color: currentTab === 'settings' ? activeTextColor : inactiveColor }]}>Settings</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  scrollContent: {
    flexGrow: 0,
  },
  bar: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    padding: 6,
    alignSelf: 'flex-start',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  barCompact: {
    paddingHorizontal: 4,
    gap: 4,
  },
  barWide: {
    paddingHorizontal: 8,
  },
  tabButton: {
    minWidth: 72,
    maxWidth: 120,
    paddingHorizontal: 12,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 4,
  },
  activeTabButton: {
    minWidth: 72,
    maxWidth: 120,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
