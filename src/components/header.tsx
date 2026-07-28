import { useCallback, useState } from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.inner}>
        <View style={styles.leftArea}>
          {showBack ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
          ) : null}
          <Image source={require('../../assets/images/app_logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaTitle}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText} numberOfLines={1}>{email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{displayRole}</Text>
            </View>
            <Pressable onPress={() => router.replace({ pathname: '/student-profile', params: { userId: String(userId) } })} style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={24} color="#000000" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#000000',
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  meta: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
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
    color: '#475569',
    maxWidth: 140,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
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
