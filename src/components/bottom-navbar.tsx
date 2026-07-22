import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

type BottomNavbarProps = {
  activeTab: 'home' | 'profile' | 'module';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
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

  const goModule = () => {
    if (activeTab !== 'module') {
      router.replace({ pathname: '/module', params: { userId: String(userId) } });
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <Pressable onPress={goHome} style={[styles.tabButton, activeTab === 'home' && styles.activeTabButton]}>
          <ThemedText style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</ThemedText>
        </Pressable>

        <Pressable onPress={goProfile} style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}>
          <ThemedText style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Student Profile
          </ThemedText>
        </Pressable>

        <Pressable onPress={goModule} style={[styles.tabButton, activeTab === 'module' && styles.activeTabButton]}>
          <ThemedText style={[styles.tabLabel, activeTab === 'module' && styles.activeTabLabel]}>Module</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  bar: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: '#55e10a',
  },
  tabLabel: {
    fontWeight: '700',
    color: '#5c6b61',
  },
  activeTabLabel: {
    color: '#000000',
  },
});
