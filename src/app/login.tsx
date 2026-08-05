import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useCustomAlert } from '@/lib/custom-alert';
import { useTheme } from '@/hooks/use-theme';

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
  const { showAlert } = useCustomAlert();
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
    },
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
    roleTabs: {
      backgroundColor: isDark ? 'rgba(33, 34, 37, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    },
    roleTab: {
      backgroundColor: isDark ? 'rgba(33, 34, 37, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    },
    roleTabActiveText: {
      color: isDark ? '#000000' : '#000000',
    },
    helperBox: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f8fff3',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.24)' : 'rgba(85, 225, 10, 0.18)',
    },
    helperTitle: {
      color: isDark ? theme.backgroundSelected : '#166534',
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
      const response = await loginStudent({ email, password });
      setMessage(response.message);
      showAlert('Login successful', `${response.user.username} is logged in as a student.`);
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
      title={<ThemedText type="subtitle" style={{ color: theme.text }}>Welcome back</ThemedText>}
      subtitle="">
      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={dynamicStyles.formTitle}>Access your learning portal</Text>
          <Text style={dynamicStyles.formHint}>Use your saved student account to continue where you left off.</Text>
        </View>

        <View style={styles.roleTabs}>
          <Pressable style={[styles.roleTab, styles.roleTabActive]}>
            <ThemedText style={styles.roleTabActiveText}>Student</ThemedText>
          </Pressable>
        </View>

        <View style={styles.field}>
          <View style={styles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Email address</Text>
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
            <Text style={dynamicStyles.inputLabel}>Password</Text>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Enter your password"
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

        <View style={dynamicStyles.helperBox}>
          <Text style={dynamicStyles.helperTitle}>Quick access</Text>
          <ThemedText themeColor="textSecondary" style={styles.helper}>
            Default account: student1 / example@gmail.com / 12345
          </ThemedText>
        </View>

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && styles.pressed]}>
          <ThemedText style={dynamicStyles.buttonText}>{loading ? 'Signing in...' : 'Login'}</ThemedText>
        </Pressable>

        <AuthLink onPress={() => router.push('/register')} textStyle={{ color: theme.text }}>Need an account? Register</AuthLink>
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
  field: {
    gap: 12,
  },
   inputGroup: {
    gap: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
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
  },
  roleTab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabActive: {
    backgroundColor: '#60ef12',
  },
  roleTabText: {
    color: '#334155',
    fontWeight: '600',
  },
  roleTabActiveText: {
    fontWeight: '700',
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
  helper: {
    fontSize: 13,
    lineHeight: 18,
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
  pressed: {
    opacity: 0.75,
  },
});
