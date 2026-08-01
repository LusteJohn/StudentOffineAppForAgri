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
      subtitle="">
      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Access your learning portal</Text>
          <Text style={styles.formHint}>Use your saved student account to continue where you left off.</Text>
        </View>

        <View style={styles.roleTabs}>
          <Pressable style={[styles.roleTab, styles.roleTabActive]}>
            <ThemedText style={styles.roleTabActiveText}>Student</ThemedText>
          </Pressable>
        </View>

        <View style={styles.field}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor="#64748b"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                secureTextEntry={!isPasswordVisible}
                style={[styles.input, styles.inputWithIcon]}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setIsPasswordVisible((prev) => !prev)} style={styles.passwordToggle}>
                <Text style={styles.passwordToggleText}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {error ? <AuthNotification type="error" text={error} /> : null}
        {message ? <AuthNotification type="success" text={message} /> : null}

        <View style={styles.helperBox}>
          <Text style={styles.helperTitle}>Quick access</Text>
          <ThemedText themeColor="textSecondary" style={styles.helper}>
            Default account: student1 / example@gmail.com / 12345
          </ThemedText>
        </View>

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
          <ThemedText style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</ThemedText>
        </Pressable>

        <AuthLink onPress={() => router.push('/register')} textStyle={{ color: '#000000' }}>Need an account? Register</AuthLink>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  formPanel: {
    gap: 12,
  },
  formHeader: {
    gap: 4,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  formHint: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
  },
  field: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
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
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#102318',
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  passwordFieldWrap: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 8,
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
  helperBox: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#f8fff3',
    borderWidth: 1,
    borderColor: 'rgba(85, 225, 10, 0.18)',
    gap: 2,
  },
  helperTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  button: {
    marginTop: 4,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#55e10a',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
  },
  pressed: {
    opacity: 0.75,
  },
});
