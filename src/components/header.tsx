import { useCallback, useState } from 'react';
import { Image, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { getUserById } from '@/lib/auth-api';

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
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();

  const loadUser = useCallback(async () => {
    try {
      const user = await getUserById(userId);
      if (user) {
        setEmail(user.email);
        setRole(user.role);
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
              <Text style={[styles.backButtonText, { color: textColor }]}>←</Text>
            </Pressable>
          ) : null}
          <Image source={require('../../assets/images/app_logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.meta}>
          <Text style={[styles.metaTitle, { color: textColor }]}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: secondaryTextColor }]} numberOfLines={1}>{email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: isDark ? '#2E3135' : '#e4f8d6' }]}>
              <Text style={[styles.roleText, { color: textColor }]}>{displayRole}</Text>
            </View>
            <Pressable onPress={() => router.replace({ pathname: '/settings', params: { userId: String(userId) } })} style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </Pressable>
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
  logo: {
    width: 32,
    height: 32,
  },
  meta: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    maxWidth: 140,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
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
