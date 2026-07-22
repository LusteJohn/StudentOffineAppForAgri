import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AuthLink, AuthShell, AuthNotification } from '@/components/auth-shell';
import { ThemedText } from '@/components/themed-text';
import { loginStudent } from '@/lib/auth-api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      title={<ThemedText type="subtitle" style={{ color: '#000000' }}>Welcome back</ThemedText>}
      subtitle="Log in with your saved student account to continue offline access.">
      <View style={styles.roleTabs}>
        <Pressable style={[styles.roleTab, styles.roleTabActive]}>
          <ThemedText style={styles.roleTabActiveText}>Student</ThemedText>
        </Pressable>
      </View>

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
        <View style={styles.passwordFieldWrap}>
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor="#64748b"
            secureTextEntry={!isPasswordVisible}
            style={[styles.input, { paddingRight: 44 }]}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setIsPasswordVisible((prev) => !prev)} style={styles.passwordToggle}>
            <Text style={styles.passwordToggleText}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        </View>
      </View>

      {error ? <AuthNotification type="error" text={error} /> : null}
      {message ? <AuthNotification type="success" text={message} /> : null}

      <ThemedText themeColor="textSecondary" style={styles.helper}>
        Default account: student1 / example@gmail.com / 12345
      </ThemedText>

      <Pressable
        disabled={loading}
        onPress={handleSubmit}
        style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
        <ThemedText style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</ThemedText>
      </Pressable>

      <AuthLink onPress={() => router.push('/register')} textStyle={{ color: '#000000' }}>Need an account? Register</AuthLink>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 12,
    gap: 12,
  },
  roleTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  roleTab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  roleTabActive: {
    backgroundColor: '#60ef12',
  },
  roleTabText: {
    color: '#334155',
    fontWeight: '600',
  },
  roleTabActiveText: {
    color: '#000000',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: '#102318',
  },
  passwordFieldWrap: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  passwordToggleText: {
    fontSize: 18,
    lineHeight: 20,
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
    color: '#000000',
    fontWeight: '700',
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
