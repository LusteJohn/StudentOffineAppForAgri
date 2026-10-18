import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getStaffSession,
  listStudents,
  logoutStaff,
  StaffUser,
  StudentWithRecords,
} from "@/lib/staff-api";
import { StudentDetailModal } from "@/components/student-detail-modal";
import { useTheme } from "@/hooks/use-theme";

export default function FacultyPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentDetailVisible, setStudentDetailVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRecords | null>(null);
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  useEffect(() => {
    (async () => {
      setLoading(true);
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
        setError(
          value instanceof Error ? value.message : "Unable to load faculty portal.",
        );
        setTimeout(() => router.replace("/auth/login" as Href), 1500);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await logoutStaff().catch(() => undefined);
    router.replace("/auth/login" as Href);
  };

  if (loading || !user) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {error || "Loading faculty portal..."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(148, 163, 184, 0.18)",
            backgroundColor: theme.backgroundElement,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.eyebrow, { color: isDark ? "#86efac" : "#3d8122" }]}>
            AgriLearn Staff Portal
          </Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Faculty Dashboard
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {user.username} · {user.role}
          </Text>
        </View>
        <Pressable onPress={handleSignOut} style={styles.headerButton}>
          <Ionicons name="log-out-outline" size={20} color={theme.text} />
          <Text style={[styles.headerButtonText, { color: theme.text }]}>
            Sign out
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(148, 163, 184, 0.12)",
            },
          ]}
        >
          <Image
            source={require("@/assets/images/dashboard.jpeg")}
            style={styles.statImage}
            resizeMode="cover"
          />
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {students.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Students under your supervision
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(148, 163, 184, 0.12)",
            },
          ]}
        >
          <Image
            source={require("@/assets/images/setting_image.jpeg")}
            style={styles.statImage}
            resizeMode="cover"
          />
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: theme.text }]}>Reports</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Learning progress
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Student learning records
        </Text>
        <Text style={[styles.sectionHint, { color: theme.textSecondary }]}>
          Review synchronized student profiles, activity scores, module
          progress, bookmarks, and achievements.
        </Text>

        {students.length > 0 ? (
          students.map((student) => (
            <View
              key={student.user.user_id}
              style={[
                styles.studentCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(148, 163, 184, 0.12)",
                },
              ]}
            >
              <Text style={[styles.studentName, { color: theme.text }]}>
                {student.user.username}
              </Text>
              <Text style={[styles.studentEmail, { color: theme.textSecondary }]}>
                {student.user.email} · user_id: {student.user.user_id}
              </Text>
              {Object.entries(student.records).map(([table, records]) => (
                <View key={table} style={styles.studentRecordRow}>
                  <Text
                    style={[styles.studentRecordLabel, { color: theme.textSecondary }]}
                  >
                    {table}
                  </Text>
                  <Text style={[styles.studentRecordCount, { color: theme.text }]}>
                    {records.length} record(s)
                  </Text>
                </View>
              ))}
              <Pressable
                style={({ pressed }) => [
                  styles.viewRecordsButton,
                  pressed && styles.pressed,
                  { backgroundColor: isDark ? "rgba(91, 236, 19, 0.15)" : "#e4f8d6" },
                ]}
                onPress={() => {
                  setSelectedStudent(student);
                  setStudentDetailVisible(true);
                }}
              >
                <Ionicons name="open-outline" size={16} color={isDark ? "#86efac" : "#166534"} />
                <Text style={[styles.viewRecordsText, { color: isDark ? "#86efac" : "#166534" }]}>
                  View records
                </Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No student records have been synchronized yet.
          </Text>
        )}
      </ScrollView>

      <StudentDetailModal
        visible={studentDetailVisible}
        onClose={() => {
          setStudentDetailVisible(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 20,
    overflow: "hidden",
    padding: 4,
    marginBottom: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  statImage: {
    width: 120,
    height: 90,
  },
  statContent: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 14,
    marginBottom: 16,
  },
  studentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 700,
  },
  studentEmail: {
    fontSize: 13,
    marginBottom: 8,
  },
  studentRecordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  studentRecordLabel: {
    fontSize: 13,
  },
  studentRecordCount: {
    fontSize: 13,
    fontWeight: 600,
  },
  viewRecordsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  viewRecordsText: {
    fontSize: 13,
    fontWeight: 600,
  },
  pressed: {
    opacity: 0.75,
  },
  empty: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 24,
  },
});
