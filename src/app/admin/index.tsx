import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { getStaffSession, listStudents, registerFaculty, StaffUser, StudentWithRecords } from "@/lib/staff-api";
import { StaffPortal, styles } from "@/components/staff-portal";

function StudentCards({ students }: { students: StudentWithRecords[] }) {
  return <>{students.map((student) => (
    <View key={student.user.user_id} style={styles.card}>
      <Text style={styles.heading}>{student.user.username}</Text>
      <Text style={styles.body}>{student.user.email} · user_id: {student.user.user_id}</Text>
      {Object.entries(student.records).map(([table, records]) => (
        <View key={table} style={{ marginTop: 10 }}>
          <Text style={styles.body}>{table}: {records.length} record(s)</Text>
          <Text selectable style={styles.record}>{JSON.stringify(records, null, 2)}</Text>
        </View>
      ))}
    </View>
  ))}</>;
}

export default function AdminPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const session = await getStaffSession();
      if (session.user.role !== "admin") throw new Error("Admin access is required.");
      setUser(session.user);
      setStudents((await listStudents()).students);
    } catch (value) {
      router.replace("/auth/login" as Href);
      setError(value instanceof Error ? value.message : "Unable to load admin portal.");
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(""); setMessage("");
    try {
      await registerFaculty(form.username, form.email, form.password);
      setForm({ username: "", email: "", password: "" });
      setMessage("Faculty account registered.");
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to register faculty.");
    }
  };
  if (!user) return <View style={styles.page}><Text>Loading...</Text></View>;
  return <StaffPortal user={user}><ScrollView>
    <View style={styles.card}>
      <Text style={styles.heading}>Register faculty</Text>
      <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={(value) => setForm({ ...form, username: value })} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={form.email} onChangeText={(value) => setForm({ ...form, email: value })} />
      <TextInput style={styles.input} placeholder="Temporary password" secureTextEntry value={form.password} onChangeText={(value) => setForm({ ...form, password: value })} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!message && <Text style={styles.success}>{message}</Text>}
      <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>Create faculty account</Text></Pressable>
    </View>
    <Text style={styles.heading}>Students and synchronized records</Text>
    <StudentCards students={students} />
  </ScrollView></StaffPortal>;
}
