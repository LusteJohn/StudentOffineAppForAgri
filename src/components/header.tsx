import { useCallback, useState } from 'react';
import { Image, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { getUserById, getStudentProfileByUserId } from '@/lib/auth-api';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function Header({ title = 'AgriLearn', showBack = false, onBack }: HeaderProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string }>();
  const userId = Number(params.userId ?? '1');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();

  const loadUser = useCallback(async () => {
    try {
      const [user, profile] = await Promise.all([
        getUserById(userId),
        getStudentProfileByUserId(userId),
      ]);
      if (user) {
        setEmail(user.email);
        setRole(user.role);
      }
      if (profile) {
        const fullName = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ');
        setUserName(fullName);
      }
    } catch {
      // ignore header load errors
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Student';
  const displayName = userName || 'Student';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const isDark = theme.text === '#ffffff';
  const textColor = theme.text;
  const secondaryTextColor = theme.textSecondary;
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.12)';

  return (
    <View style={[styles.wrap, {
      backgroundColor: theme.backgroundElement,
      borderBottomColor: borderColor,
      paddingTop: Math.max(insets.top, 12),
      paddingBottom: 12,
    }]}>
      <View style={[styles.inner, isCompact ? styles.innerCompact : styles.innerWide]}>
        <View style={styles.leftArea}>
          {showBack ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={[styles.backButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>←</Text>
            </Pressable>
          ) : null}
          <View style={styles.logoFrame}>
            <Image source={require('../../assets/images/app.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.centerArea}>
            <Text style={[styles.metaTitle, { color: textColor }]}>{title}</Text>
            <Text style={[styles.userName, { color: textColor }]} numberOfLines={1}>{displayName}</Text>
            <Text style={[styles.userEmail, { color: secondaryTextColor }]} numberOfLines={1}>{email}</Text>
          </View>
        </View>
        <View style={styles.rightArea}>
          <Pressable onPress={() => router.replace({ pathname: '/settings', params: { userId: String(userId) } })} style={styles.profileButton}>
            <Ionicons name="person" size={24} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <View style={[styles.roleBadge, { backgroundColor: '#a8e6a2' }]}>
            <Text style={[styles.roleText, { color: '#2d5016' }]}>{displayRole}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  innerCompact: {
    alignItems: 'flex-start',
  },
  innerWide: {
    alignItems: 'center',
  },
  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  logoFrame: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 32,
    height: 32,
  },
  centerArea: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    gap: 2,
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
  },
  userEmail: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'left',
  },
  rightArea: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  profileButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
