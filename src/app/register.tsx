import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AuthLink, AuthShell } from '@/components/auth-shell';
import { ThemedText } from '@/components/themed-text';
import { registerStudent } from '@/lib/auth-api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
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
      const response = await registerStudent({ username, email, password });
      setMessage(response.message);
      Alert.alert('Registration complete', `${response.user.username} was saved as a student account.`);
      router.replace({
        pathname: '/home',
        params: { userId: String(response.user.user_id) },
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="New student account"
      title="Create account"
      subtitle="Register once and the account stays on this device for offline use.">
      <View style={styles.field}>
        <TextInput
          autoCapitalize="words"
          placeholder="Username"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
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

      <Pressable
        disabled={loading}
        onPress={handleSubmit}
        style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
        <ThemedText style={styles.buttonText}>{loading ? 'Creating...' : 'Register'}</ThemedText>
      </Pressable>

      <AuthLink onPress={() => router.push('/login')}>Already have an account? Login</AuthLink>
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
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#55e10a',
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
  pressed: {
    opacity: 0.75,
  },
});
