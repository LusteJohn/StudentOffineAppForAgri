import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import {
  getStaffSession,
  listStudents,
  logoutStaff,
  StaffUser,
  StudentWithRecords,
} from "@/lib/staff-api";

export default function FacultyPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const session = await getStaffSession();
        if (
          session.user.role !== "faculty" &&
          session.user.role !== "admin"
        ) {
          throw new Error("Faculty access is required.");
        }
        setUser(session.user);
        setStudents((await listStudents()).students);
      } catch (value) {
        setLoadError(
          value instanceof Error ? value.message : "Unable to load faculty portal.",
        );
        router.replace("/auth/login" as Href);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await logoutStaff().catch(() => undefined);
    router.replace("/auth/login" as Href);
  };

  if (!user || loading) {
    return (
      <View style={[styles.page, styles.center]}>
        <Text style={styles.loading}>
          {loading ? "Loading..." : loadError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.toolbar}>
        <View>
          <Text style={styles.eyebrow}>AgriLearn staff portal</Text>
          <Text style={styles.title}>Faculty dashboard</Text>
          <Text style={styles.muted}>
            {user.username} · {user.role}
          </Text>
        </View>
        <Pressable onPress={handleSignOut} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{String(students.length)}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>Reports</Text>
          <Text style={styles.statLabel}>Learning progress</Text>
        </View>
      </View>

      <View style={[styles.card, styles.wideCard]}>
        <Text style={styles.sectionTitle}>Student learning records</Text>
        <Text style={styles.formHint}>
          Review synchronized student profiles, activity scores, module progress,
          bookmarks, and achievements.
        </Text>
        <ScrollView>
          {students.length > 0 ? (
            students.map((student) => (
              <View
                key={student.user.user_id}
                style={styles.studentCard}
              >
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
  empty: {
    color: "#647565",
    fontSize: 14,
    fontStyle: "italic",
  },
});
