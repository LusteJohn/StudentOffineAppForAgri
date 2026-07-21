import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AuthLink, AuthShell } from '@/components/auth-shell';
import { ThemedText } from '@/components/themed-text';
import { loginStudent } from '@/lib/auth-api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await loginStudent({ email, password });
      setMessage(response.message);
      Alert.alert('Login successful', `${response.user.username} is logged in as a student.`);
      router.replace({
        pathname: '/home',
        params: { userId: String(response.user.user_id) },
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Student access"
      title="Welcome back"
      subtitle="Log in with your saved student account to continue offline access.">
      <View style={styles.field}>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email address"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="#64748b"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {message ? <ThemedText style={styles.success}>{message}</ThemedText> : null}

      <ThemedText themeColor="textSecondary" style={styles.helper}>
        Default account: student1 / example@gmail.com / 12345
      </ThemedText>

      <Pressable
        disabled={loading}
        onPress={handleSubmit}
        style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
        <ThemedText style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</ThemedText>
      </Pressable>

      <AuthLink onPress={() => router.push('/register')}>Need an account? Register</AuthLink>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 12,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
    marginTop: 4,
  },
  success: {
    color: '#047857',
    marginTop: 4,
  },
  helper: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});
