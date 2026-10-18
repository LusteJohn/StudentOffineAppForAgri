import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import {
  getStaffSession,
  listFaculty,
  listStudents,
  logoutStaff,
  registerFaculty,
  StaffUser,
  StudentWithRecords,
} from "@/lib/staff-api";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StudentCard({ student }: { student: StudentWithRecords }) {
  return (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{student.user.username}</Text>
      <Text style={styles.studentEmail}>
        {student.user.email} · user_id: {student.user.user_id}
      </Text>
      {Object.entries(student.records).map(([table, records]) => (
        <View key={table} style={{ marginTop: 10 }}>
          <Text style={styles.studentBody}>
            {table}: {records.length} record(s)
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  const [faculty, setFaculty] = useState<StaffUser[]>([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();
  const isCompact = width < 640;

  useEffect(() => {
    (async () => {
      try {
        const session = await getStaffSession();
        if (session.user.role !== "admin") {
          throw new Error("Admin access is required.");
        }
        setUser(session.user);
        setStudents((await listStudents()).students);
        setFaculty((await listFaculty()).faculty);
      } catch (value) {
        setError(
          value instanceof Error ? value.message : "Unable to load admin portal.",
        );
        router.replace("/auth/login" as Href);
      }
    })();
  }, []);

  const handleRegisterFaculty = async () => {
    setError("");
    setMessage("");
    try {
      await registerFaculty(form.username, form.email, form.password);
      setForm({ username: "", email: "", password: "" });
      setMessage("Faculty account registered.");
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to register faculty.",
      );
    }
  };

  const handleSignOut = async () => {
    await logoutStaff().catch(() => undefined);
    router.replace("/auth/login" as Href);
  };

  if (!user) {
    return (
      <View style={[styles.page, styles.center]}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.toolbar, isCompact && styles.toolbarCompact]}>
        <View>
          <Text style={styles.eyebrow}>AgriLearn staff portal</Text>
          <Text style={styles.title}>Admin dashboard</Text>
          <Text style={styles.muted}>
            {user.username} · {user.role}
          </Text>
        </View>
        <Pressable onPress={handleSignOut} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <StatCard value={String(students.length)} label="Students" />
        <StatCard value="Faculty" label="Account management" />
      </View>

      <View style={[styles.card, styles.wideCard]}>
        <View style={styles.toolbar}>
          <View>
            <Text style={styles.sectionTitle}>Faculty accounts</Text>
            <Text style={styles.formHint}>
              Manage staff access to the student learning portal.
            </Text>
          </View>
          <Pressable
            onPress={() => {}}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>+ Register faculty</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Register faculty member</Text>
          <Text style={styles.formHint}>
            Create a faculty account for the student learning portal.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChangeText={(value) =>
              setForm({ ...form, username: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Temporary password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          {!!error && <Text style={[styles.message, styles.messageError]}>{error}</Text>}
          {!!message && (
            <Text style={[styles.message, styles.messageSuccess]}>{message}</Text>
          )}
          <Pressable
            onPress={handleRegisterFaculty}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>Create faculty account</Text>
          </Pressable>
        </View>

        {faculty.length > 0 ? (
          faculty.map((f) => (
            <View key={f.user_id} style={styles.facultyRow}>
              <Text style={styles.facultyName}>{f.username}</Text>
              <Text style={styles.facultyEmail}>{f.email}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No faculty accounts registered yet.</Text>
        )}
      </View>

      <View style={[styles.card, styles.wideCard]}>
        <Text style={styles.sectionTitle}>Student learning records</Text>
        <Text style={styles.formHint}>
          Review records synchronized from the offline student application.
        </Text>
        <ScrollView>
          {students.length > 0 ? (
            students.map((student) => (
              <StudentCard key={student.user.user_id} student={student} />
            ))
          ) : (
            <Text style={styles.empty}>
              No student records have been synchronized yet.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f3f8ef",
    padding: 32,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    color: "#647565",
    fontSize: 16,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  toolbarCompact: {
    alignItems: "flex-start",
    flexWrap: "wrap",
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
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: 28,
    fontWeight: 700,
  },
  muted: {
    color: "#647565",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    backgroundColor: "#f1faed",
    borderWidth: 1,
    borderColor: "#dbead3",
    borderRadius: 10,
  },
  statValue: {
    color: "#3d8122",
    fontSize: 24,
    fontWeight: 800,
  },
  statLabel: {
    color: "#647565",
    fontSize: 13,
  },
  card: {
    width: "100%",
    padding: 24,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1,
    borderColor: "#dbead3",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  wideCard: {
    padding: 24,
  },
  sectionTitle: {
    margin: 0,
    marginBottom: 6,
    color: "#0f172a",
    fontSize: 20,
    fontWeight: 700,
  },
  formHint: {
    margin: 0,
    marginBottom: 18,
    color: "#647565",
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cbdccf",
    borderRadius: 8,
    backgroundColor: "#fbfef9",
    color: "#0f172a",
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "#4d9b2a",
    alignSelf: "flex-start",
  },
  secondaryButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#647565",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
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
  studentCard: {
    marginTop: 16,
    padding: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
  },
  studentName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: 700,
  },
  studentEmail: {
    color: "#475569",
    marginBottom: 8,
  },
  studentBody: {
    color: "#334155",
    lineHeight: 21,
  },
  facultyRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  facultyName: {
    color: "#0f172a",
    fontWeight: 700,
  },
  facultyEmail: {
    color: "#647565",
    fontSize: 13,
  },
  empty: {
    color: "#647565",
    fontSize: 14,
    fontStyle: "italic",
  },
});
