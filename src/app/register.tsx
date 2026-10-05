import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useCustomAlert } from '@/lib/custom-alert';
import { useTheme } from '@/hooks/use-theme';

import { AuthLink, AuthShell, AuthNotification } from '@/components/auth-shell';
import { ThemedText } from '@/components/themed-text';
import { registerStudent } from '@/lib/auth-api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { showAlert } = useCustomAlert();
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    formTitle: {
      color: theme.text,
    },
    formHint: {
      color: theme.textSecondary,
    },
    inputLabel: {
      color: theme.textSecondary,
    },
    inputContainer: {
      backgroundColor: isDark ? 'rgba(33, 34, 37, 0.9)' : 'rgba(255, 255, 255, 0.92)',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.22)',
    },
    input: {
      color: theme.text,
    },
    buttonText: {
      color: theme.text,
    },
    linkText: {
      color: theme.text,
    },
  }), [theme, isDark]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await registerStudent({ username, email, password });
      setMessage(response.message);
      showAlert('Registration complete', `${response.user.username} was saved as a student account.`);
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
      title={<ThemedText type="subtitle" style={{ color: theme.text }}>Create account</ThemedText>}
      subtitle="Register once and the account stays on this device for offline use.">
      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, dynamicStyles.formTitle]}>Set up your student profile</Text>
          <Text style={[styles.formHint, dynamicStyles.formHint]}>Create a local account to keep your progress and lessons ready offline.</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Username</Text>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                autoCapitalize="words"
                placeholder="Choose a username"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, dynamicStyles.input]}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Email address</Text>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, dynamicStyles.input]}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Password</Text>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Create a password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!isPasswordVisible}
                style={[styles.input, styles.inputWithIcon, dynamicStyles.input]}
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

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
          <ThemedText style={[styles.buttonText, dynamicStyles.buttonText]}>{loading ? 'Creating...' : 'Register'}</ThemedText>
        </Pressable>

        <AuthLink onPress={() => router.push('/login')} textStyle={{ color: theme.text }}>Already have an account? Login</AuthLink>
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
  },
  formHint: {
    fontSize: 13,
    lineHeight: 19,
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
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'transparent',
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
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
