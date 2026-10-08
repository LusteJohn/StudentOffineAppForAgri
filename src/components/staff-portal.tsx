import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { StaffUser, logoutStaff } from "@/lib/staff-api";

export function StaffPortal({ user, children }: PropsWithChildren<{ user: StaffUser }>) {
  const signOut = async () => {
    await logoutStaff().catch(() => undefined);
    router.replace("/auth/login" as Href);
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Agriculture Learning Portal</Text>
          <Text style={styles.subtitle}>{user.username} · {user.role}</Text>
        </View>
        <Pressable onPress={signOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f8fafc", padding: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { color: "#0f172a", fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#64748b", marginTop: 4 },
  button: { backgroundColor: "#166534", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 11, marginBottom: 10, backgroundColor: "#fff" },
  heading: { color: "#0f172a", fontSize: 19, fontWeight: "700", marginBottom: 12 },
  body: { color: "#334155", lineHeight: 21 },
  record: { color: "#475569", fontFamily: "monospace", fontSize: 12, marginTop: 4 },
  error: { color: "#b91c1c", marginBottom: 10 },
  success: { color: "#166534", marginBottom: 10 },
});
