import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCustomAlert } from '@/lib/custom-alert';

type BottomNavbarProps = {
  activeTab: 'home' | 'library' | 'lesson' | 'achievement' | 'content-info' | 'settings';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showAlert } = useCustomAlert();
  const isCompact = width < 390;
  const theme = useTheme();

  const goHome = () => {
    if (activeTab !== 'home') {
      router.replace({ pathname: '/home', params: { userId: String(userId) } });
    }
  };

  const goLibrary = () => {
    if (activeTab !== 'library') {
      router.replace({ pathname: '/module', params: { userId: String(userId) } });
    }
  };

  const goLesson = () => {
    if (activeTab !== 'lesson') {
      router.replace({ pathname: '/lesson', params: { userId: String(userId) } });
    }
  };

  const goContentInfo = () => {
    if (activeTab !== 'content-info') {
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
    if (activeTab !== 'achievement') {
      router.replace({ pathname: '/achievement', params: { userId: String(userId) } });
    }
  };

  const goSettings = () => {
    if (activeTab !== 'settings') {
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.bar, isCompact ? styles.barCompact : styles.barWide, {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(92, 107, 97, 0.16)',
          shadowColor: isDark ? '#000000' : '#0f172a',
        }]}>
          <Pressable onPress={goHome} style={[styles.tabButton, activeTab === 'home' && styles.activeTabButton, activeTab === 'home' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'home' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel, { color: activeTab === 'home' ? activeTextColor : inactiveColor }]}>Home</Text>
          </Pressable>

          <Pressable onPress={goLibrary} style={[styles.tabButton, activeTab === 'library' && styles.activeTabButton, activeTab === 'library' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'library' ? 'book' : 'book-outline'}
              size={22}
              color={activeTab === 'library' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'library' && styles.activeTabLabel, { color: activeTab === 'library' ? activeTextColor : inactiveColor }]}>Library</Text>
          </Pressable>

          <Pressable onPress={goLesson} style={[styles.tabButton, activeTab === 'lesson' && styles.activeTabButton, activeTab === 'lesson' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'lesson' ? 'document' : 'document-outline'}
              size={22}
              color={activeTab === 'lesson' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'lesson' && styles.activeTabLabel, { color: activeTab === 'lesson' ? activeTextColor : inactiveColor }]}>Lesson</Text>
          </Pressable>

          <Pressable onPress={goContentInfo} style={[styles.tabButton, activeTab === 'content-info' && styles.activeTabButton, activeTab === 'content-info' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'content-info' ? 'information-circle' : 'information-circle-outline'}
              size={22}
              color={activeTab === 'content-info' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'content-info' && styles.activeTabLabel, { color: activeTab === 'content-info' ? activeTextColor : inactiveColor }]}>Content Info</Text>
          </Pressable>

          <Pressable onPress={goAchievement} style={[styles.tabButton, activeTab === 'achievement' && styles.activeTabButton, activeTab === 'achievement' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'achievement' ? 'trophy' : 'trophy-outline'}
              size={22}
              color={activeTab === 'achievement' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'achievement' && styles.activeTabLabel, { color: activeTab === 'achievement' ? activeTextColor : inactiveColor }]}>Achievements</Text>
          </Pressable>

          <Pressable onPress={goSettings} style={[styles.tabButton, activeTab === 'settings' && styles.activeTabButton, activeTab === 'settings' && { backgroundColor: activeColor }]}>
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? activeTextColor : inactiveColor}
            />
            <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeTabLabel, { color: activeTab === 'settings' ? activeTextColor : inactiveColor }]}>Settings</Text>
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
