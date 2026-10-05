import { useEffect, useState, useCallback } from 'react';
import { Animated, BackHandler, Easing, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCustomAlert } from '@/lib/custom-alert';

type BottomNavbarProps = {
  activeTab?: 'home' | 'library' | 'lesson' | 'achievement' | 'content-info' | 'settings' | 'profile' | 'bookmark';
  userId: number;
};

export function BottomNavbar({ activeTab, userId }: BottomNavbarProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showAlert } = useCustomAlert();
  const isCompact = width < 390;
  const isNarrow = width < 360;
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const panelAnim = useState(() => new Animated.Value(0))[0];

  type TabKey = 'home' | 'library' | 'lesson' | 'content-info' | 'achievement' | 'settings' | 'profile' | 'bookmark';
  type IconName = React.ComponentProps<typeof Ionicons>['name'];

  const getActiveTab = (): TabKey => {
    if (activeTab) return activeTab;
    if (pathname === '/home') return 'home';
    if (pathname === '/module') return 'library';
    if (pathname === '/lesson') return 'lesson';
    if (pathname === '/achievement') return 'achievement';
    if (pathname === '/settings') return 'settings';
    if (pathname === '/profile') return 'profile';
    if (pathname === '/bookmark') return 'bookmark';
    if (pathname.startsWith('/content-info')) return 'content-info';
    return 'home';
  };

  const currentTab = getActiveTab();

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

  const goProfile = () => {
    if (pathname !== '/profile') {
      router.push({ pathname: '/profile', params: { userId: String(userId) } });
    }
  };

  const goBookmarks = () => {
    if (pathname !== '/bookmark') {
      router.push({ pathname: '/bookmark', params: { userId: String(userId) } });
    }
  };

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace({ pathname: '/login' });
          },
        },
      ]
    );
  };

  const isDark = theme === Colors.dark;
  const activeColor = '#55e10a';
  const inactiveColor = isDark ? '#B0B4BA' : '#5c6b61';
  const activeTextColor = isDark ? '#ffffff' : '#000000';

  const closePanel = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    Animated.timing(panelAnim, {
      toValue: expanded ? 1 : 0,
      duration: expanded ? 220 : 160,
      easing: expanded ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, panelAnim]);

  useEffect(() => {
    if (!expanded) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closePanel();
      return true;
    });
    return () => subscription.remove();
  }, [expanded, closePanel]);


  const primaryTabs: { key: TabKey; label: string; icon: IconName; activeIcon: IconName; onPress: () => void }[] = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home', onPress: goHome },
    { key: 'library', label: 'Library', icon: 'book-outline', activeIcon: 'book', onPress: goLibrary },
    { key: 'lesson', label: 'Lesson', icon: 'document-outline', activeIcon: 'document', onPress: goLesson },
  ];

  const overflowTabs: { key: TabKey; label: string; icon: IconName; activeIcon: IconName; onPress: () => void }[] = [
    { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person', onPress: goProfile },
    { key: 'bookmark', label: 'Bookmarks', icon: 'bookmark-outline', activeIcon: 'bookmark', onPress: goBookmarks },
    { key: 'content-info', label: 'Content Info', icon: 'information-circle-outline', activeIcon: 'information-circle', onPress: goContentInfo },
    { key: 'achievement', label: 'Achievements', icon: 'trophy-outline', activeIcon: 'trophy', onPress: goAchievement },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings', onPress: goSettings },
  ];

  return (
    <View style={[styles.wrap, {
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 16),
      backgroundColor: 'transparent',
    }]}>
      <Pressable
        style={styles.backdrop}
        onPress={closePanel}
        pointerEvents={expanded ? 'auto' : 'none'}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[
          styles.panel,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(92, 107, 97, 0.16)',
            shadowColor: isDark ? '#000000' : '#0f172a',
            bottom: barHeight + Math.max(insets.bottom, 16) + 18,
            opacity: barHeight > 0 ? panelAnim : 0,
            transform: [
              { translateY: panelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
              { scale: panelAnim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
            ],
          },
        ]}
      >
        <Text style={[styles.panelTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>More</Text>
        <View style={styles.panelGrid}>
          {overflowTabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  closePanel();
                  tab.onPress();
                }}
                style={({ pressed }) => [
                  styles.panelItem,
                  isNarrow && styles.panelItemNarrow,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(148, 163, 184, 0.2)',
                  },
                  isActive && { backgroundColor: activeColor, borderColor: activeColor },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={isNarrow ? 18 : 20}
                  color={isActive ? activeTextColor : inactiveColor}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.panelItemLabel, isNarrow && styles.panelItemLabelNarrow, { color: isActive ? activeTextColor : inactiveColor }]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => {
              closePanel();
              handleLogout();
            }}
            style={({ pressed }) => [
              styles.panelItem,
              isNarrow && styles.panelItemNarrow,
              {
                backgroundColor: '#b91c1c',
                borderColor: '#b91c1c',
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="log-out-outline" size={isNarrow ? 18 : 20} color="#ffffff" />
            <Text numberOfLines={1} style={[styles.panelItemLabel, isNarrow && styles.panelItemLabelNarrow, { color: '#ffffff' }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <View
          onLayout={(event) => setBarHeight(event.nativeEvent.layout.height)}
          style={[styles.bar, isCompact ? styles.barCompact : styles.barWide, {
          backgroundColor: theme.backgroundElement,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(92, 107, 97, 0.16)',
          shadowColor: isDark ? '#000000' : '#0f172a',
        }]}>
          {primaryTabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={tab.onPress}
                style={[
                  styles.tabButton,
                  isCompact && styles.tabButtonCompact,
                  isActive && styles.activeTabButton,
                  isActive && { backgroundColor: activeColor },
                ]}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={isNarrow ? 20 : 22}
                  color={isActive ? activeTextColor : inactiveColor}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    isNarrow && styles.tabLabelNarrow,
                    isActive && styles.activeTabLabel,
                    { color: isActive ? activeTextColor : inactiveColor },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            style={[
              styles.addButton,
              isNarrow && styles.addButtonNarrow,
              {
                backgroundColor: expanded ? 'rgba(85, 225, 10, 0.18)' : 'transparent',
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(92, 107, 97, 0.16)',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Close more menu' : 'Open more menu'}
          >
            <Ionicons name={expanded ? 'close' : 'add'} size={isNarrow ? 20 : 22} color={inactiveColor} />
          </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    padding: 6,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    zIndex: 20,
  },
  barCompact: {
    paddingHorizontal: 4,
    gap: 4,
  },
  barWide: {
    paddingHorizontal: 8,
  },
  tabButton: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 6,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 3,
  },
  tabButtonCompact: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  activeTabButton: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabLabelNarrow: {
    fontSize: 11,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    position: 'absolute',
    left: 12,
    right: 12,
    maxWidth: 360,
    alignSelf: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 8,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    zIndex: 10,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  panelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  panelItem: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 80,
    minHeight: 68,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  panelItemNarrow: {
    minWidth: 68,
    minHeight: 60,
    paddingVertical: 8,
  },
  panelItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  panelItemLabelNarrow: {
    fontSize: 10,
  },
  addButton: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonNarrow: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
  },
});
