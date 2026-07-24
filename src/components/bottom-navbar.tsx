import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

type BottomNavbarProps = {
  activeTab: 'home' | 'profile' | 'library' | 'lesson' | 'content-info' | 'settings';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
  const insets = useSafeAreaInsets();

  const goHome = () => {
    if (activeTab !== 'home') {
      router.replace({ pathname: '/home', params: { userId: String(userId) } });
    }
  };

  const goProfile = () => {
    if (activeTab !== 'profile') {
      router.replace({ pathname: '/student-profile', params: { userId: String(userId) } });
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
      router.replace({ pathname: '/content-info', params: { userId: String(userId) } });
    }
  };

  const goSettings = () => {
    if (activeTab !== 'settings') {
      router.replace({ pathname: '/settings', params: { userId: String(userId) } });
    }
  };

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.bar}>
        <Pressable onPress={goHome} style={[styles.tabButton, activeTab === 'home' && styles.activeTabButton]}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#000000' : '#5c6b61'}
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
        </Pressable>

        <Pressable onPress={goProfile} style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? '#000000' : '#5c6b61'}
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>Profile</Text>
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

        <Pressable onPress={goSettings} style={[styles.tabButton, activeTab === 'settings' && styles.activeTabButton]}>
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={22}
            color={activeTab === 'settings' ? '#000000' : '#5c6b61'}
          />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeTabLabel]}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    backgroundColor: '#ffffff',
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 4,
  },
  activeTabButton: {
    backgroundColor: '#55e10a',
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
