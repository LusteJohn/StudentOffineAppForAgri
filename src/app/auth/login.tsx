import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { loginStaff } from "@/lib/staff-api";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await loginStaff(email.trim(), password);
      setMessage("Login successful. Redirecting...");
      setTimeout(() => {
        const route = result.user.role === "admin" ? "/admin" : "/faculty";
        router.replace(route as any);
      }, 500);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require("@/assets/images/background_image.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View pointerEvents="none" style={styles.overlayWash} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isCompact ? styles.scrollCompact : styles.scrollWide,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroBlock}>
            <View style={styles.brandMark}>
              <Text style={styles.brandEmoji}>🌱</Text>
            </View>
            <View style={styles.appNameWrap}>
              <Text style={styles.eyebrow}>AgriLearn</Text>
              <Text style={styles.appNameText}>
                Organic Agriculture Production Learning App
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.card,
              isCompact ? styles.cardCompact : styles.cardWide,
            ]}
          >
            <Text style={styles.eyebrowSmall}>Staff portal</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.formHint}>
              Sign in to manage student learning records and progress.
            </Text>

            <View style={styles.field}>
              <Text style={styles.inputLabel}>Email</Text>
              <View
                style={[styles.inputContainer, isDarkMode() && styles.inputContainerDark]}
              >
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3a4"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[styles.inputContainer, isDarkMode() && styles.inputContainerDark]}
              >
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3a4"
                  secureTextEntry={!isPasswordVisible}
                  style={[styles.input, styles.inputWithIcon]}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                  style={styles.passwordToggle}
                >
                  <Text style={styles.passwordToggleText}>
                    {isPasswordVisible ? "🙈" : "👁️"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={[styles.message, styles.messageError]}>{error}</Text> : null}
            {message ? <Text style={[styles.message, styles.messageSuccess]}>{message}</Text> : null}

            <Pressable
              disabled={loading}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.button,
                loading && styles.buttonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/" as any)}
              style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
            >
              <Text style={styles.linkText}>← Back to student login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function isDarkMode() {
  return false;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#f3f8ef",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  overlayWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  scrollCompact: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  scrollWide: {
    paddingHorizontal: 28,
  },
  heroBlock: {
    width: "100%",
    maxWidth: 460,
    alignItems: "center",
    marginBottom: 16,
  },
  brandMark: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    backgroundColor: "#4d9b2a",
    borderRadius: 14,
  },
  brandEmoji: {
    fontSize: 24,
  },
  appNameWrap: {
    marginTop: 12,
    alignItems: "center",
  },
  eyebrow: {
    margin: 0,
    marginBottom: 6,
    color: "#4d9b2a",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  appNameText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 460,
    borderRadius: 28,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 0.84)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  cardCompact: {
    padding: 18,
    borderRadius: 24,
  },
  cardWide: {
    padding: 24,
  },
  eyebrowSmall: {
    alignSelf: "flex-start",
    marginBottom: 4,
    color: "#4d9b2a",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 2,
    color: "#0f172a",
    fontSize: 32,
    fontWeight: 600,
    lineHeight: 44,
  },
  formHint: {
    margin: 0,
    marginBottom: 20,
    color: "#647565",
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    marginTop: 12,
    gap: 10,
  },
  inputLabel: {
    margin: 0,
    marginBottom: 6,
    fontWeight: 700,
    color: "#172b1b",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  inputContainerDark: {
    backgroundColor: "rgba(33, 34, 37, 0.9)",
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  inputIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "transparent",
    color: "#0f172a",
  },
  inputWithIcon: {
    paddingRight: 76,
  },
  passwordToggle: {
    position: "absolute",
    right: 6,
    top: "50%",
    padding: 6,
    transform: [{ translateY: "-50%" }],
    justifyContent: "center",
    alignItems: "center",
  },
  passwordToggleText: {
    fontSize: 18,
    lineHeight: 20,
  },
  message: {
    margin: 12,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  messageError: {
    color: "#b91c1c",
    backgroundColor: "#fff1f1",
  },
  messageSuccess: {
    color: "#27721e",
    backgroundColor: "#edf9e9",
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#55e10a",
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#000000",
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.75,
  },
  linkRow: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  linkText: {
    color: "#3d8122",
    fontSize: 14,
    fontWeight: 600,
  },
});
