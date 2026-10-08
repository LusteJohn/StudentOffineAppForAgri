import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { loginStaff } from "@/lib/staff-api";
import { styles } from "@/components/staff-portal";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async () => {
    setError("");
    try {
      const { user } = await loginStaff(email.trim(), password);
      router.replace((user.role === "admin" ? "/admin" : "/faculty") as Href);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to sign in.");
    }
  };

  return (
    <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
      <View style={[styles.card, { width: "100%", maxWidth: 460 }]}>
        <Text style={styles.heading}>Staff sign in</Text>
        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={submit} style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}
