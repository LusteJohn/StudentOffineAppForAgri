import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useCustomAlert } from '@/lib/custom-alert';

type BottomNavbarProps = {
  activeTab: 'home' | 'library' | 'lesson' | 'module-achievement' | 'content-info' | 'settings';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showAlert } = useCustomAlert();
  const isCompact = width < 390;

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

  const goModuleAchievement = () => {
    if (activeTab !== 'module-achievement') {
      router.replace({ pathname: '/module-achievement', params: { userId: String(userId) } });
    }
  };

  const goSettings = () => {
    if (activeTab !== 'settings') {
      router.replace({ pathname: '/settings', params: { userId: String(userId) } });
    }
  };

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.bar, isCompact ? styles.barCompact : styles.barWide]}>
          <Pressable onPress={goHome} style={[styles.tabButton, activeTab === 'home' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'home' ? '#000000' : '#5c6b61'}
            />
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
          </Pressable>

          <Pressable onPress={goLibrary} style={[styles.tabButton, activeTab === 'library' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'library' ? 'book' : 'book-outline'}
              size={22}
              color={activeTab === 'library' ? '#000000' : '#5c6b61'}
            />
            <Text style={[styles.tabLabel, activeTab === 'library' && styles.activeTabLabel]}>Library</Text>
          </Pressable>

          <Pressable onPress={goLesson} style={[styles.tabButton, activeTab === 'lesson' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'lesson' ? 'document' : 'document-outline'}
              size={22}
              color={activeTab === 'lesson' ? '#000000' : '#5c6b61'}
            />
            <Text style={[styles.tabLabel, activeTab === 'lesson' && styles.activeTabLabel]}>Lesson</Text>
          </Pressable>

          <Pressable onPress={goContentInfo} style={[styles.tabButton, activeTab === 'content-info' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'content-info' ? 'information-circle' : 'information-circle-outline'}
              size={22}
              color={activeTab === 'content-info' ? '#000000' : '#5c6b61'}
            />
             <Text style={[styles.tabLabel, activeTab === 'content-info' && styles.activeTabLabel]}>Content Info</Text>
          </Pressable>

          <Pressable onPress={goModuleAchievement} style={[styles.tabButton, activeTab === 'module-achievement' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'module-achievement' ? 'trophy' : 'trophy-outline'}
              size={22}
              color={activeTab === 'module-achievement' ? '#000000' : '#5c6b61'}
            />
            <Text style={[styles.tabLabel, activeTab === 'module-achievement' && styles.activeTabLabel]}>Achievements</Text>
          </Pressable>

          <Pressable onPress={goSettings} style={[styles.tabButton, activeTab === 'settings' && styles.activeTabButton]}>
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? '#000000' : '#5c6b61'}
            />
            <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeTabLabel]}>Settings</Text>
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 0,
  },
  bar: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    backgroundColor: '#ffffff',
    padding: 6,
    alignSelf: 'flex-start',
    shadowColor: '#0f172a',
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
    backgroundColor: '#55e10a',
    minWidth: 72,
    maxWidth: 120,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c6b61',
  },
  activeTabLabel: {
    color: '#000000',
  },
});
