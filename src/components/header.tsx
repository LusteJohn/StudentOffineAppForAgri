import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{displayRole}</Text>
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
    gap: 4,
  },
  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
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
});
