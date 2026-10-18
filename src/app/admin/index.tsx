import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  deleteFaculty,
  getStaffSession,
  listFaculty,
  listStudents,
  logoutStaff,
  registerFaculty,
  StaffUser,
  StudentWithRecords,
} from "@/lib/staff-api";
import { StudentDetailModal } from "@/components/student-detail-modal";
import { useCustomAlert } from "@/lib/custom-alert";
import { useTheme } from "@/hooks/use-theme";

type AdminNavItem = "dashboard" | "faculty";

export default function AdminPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  const [faculty, setFaculty] = useState<StaffUser[]>([]);
  const [activeNav, setActiveNav] = useState<AdminNavItem>("dashboard");
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentDetailVisible, setStudentDetailVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRecords | null>(null);
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";
  const { showAlert } = useCustomAlert();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getStaffSession();
      if (session.user.role !== "admin") {
        throw new Error("Admin access is required.");
      }
      setUser(session.user);
      setStudents((await listStudents()).students);
      setFaculty((await listFaculty()).faculty);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to load admin portal.");
      setTimeout(() => router.replace("/auth/login" as Href), 1500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegister = async () => {
    setError("");
    setMessage("");
    try {
      await registerFaculty(form.username, form.email, form.password);
      setForm({ username: "", email: "", password: "" });
      setMessage("Faculty account registered.");
      setFaculty((await listFaculty()).faculty);
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to register faculty.",
      );
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteFaculty(userId);
      setFaculty((prev) => prev.filter((f) => f.user_id !== userId));
      setMessage("Faculty account deleted.");
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to delete faculty.",
      );
    }
  };

  const handleSignOut = async () => {
    showAlert(
      "Sign out",
      "Are you sure you want to sign out of the admin portal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await logoutStaff().catch(() => undefined);
            router.replace("/auth/login" as Href);
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading || !user) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {error || "Loading admin portal..."}
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
            Admin Dashboard
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

      <View style={styles.navRow}>
        <Pressable
          onPress={() => {
            setActiveNav("dashboard");
          }}
          style={[
            styles.navTab,
            activeNav === "dashboard" && styles.navTabActive,
            {
              backgroundColor: activeNav === "dashboard"
                ? (isDark ? "rgba(91, 236, 19, 0.15)" : "#e4f8d6")
                : theme.backgroundElement,
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(148, 163, 184, 0.12)",
            },
          ]}
        >
          <Ionicons
            name={activeNav === "dashboard" ? "home" : "home-outline"}
            size={20}
            color={activeNav === "dashboard" ? "#166534" : theme.textSecondary}
          />
          <Text
            style={[
              styles.navTabLabel,
              activeNav === "dashboard" && styles.navTabActiveLabel,
              { color: activeNav === "dashboard" ? "#166534" : theme.textSecondary },
            ]}
          >
            Dashboard
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveNav("faculty");
          }}
          style={[
            styles.navTab,
            activeNav === "faculty" && styles.navTabActive,
            {
              backgroundColor: activeNav === "faculty"
                ? (isDark ? "rgba(91, 236, 19, 0.15)" : "#e4f8d6")
                : theme.backgroundElement,
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(148, 163, 184, 0.12)",
            },
          ]}
        >
          <Ionicons
            name={activeNav === "faculty" ? "people" : "people-outline"}
            size={20}
            color={activeNav === "faculty" ? "#166534" : theme.textSecondary}
          />
          <Text
            style={[
              styles.navTabLabel,
              activeNav === "faculty" && styles.navTabActiveLabel,
              { color: activeNav === "faculty" ? "#166534" : theme.textSecondary },
            ]}
          >
            Faculty Mgmt
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeNav === "dashboard" && (
          <>
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
                  Registered students
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Student learning records
            </Text>
            <Text style={[styles.sectionHint, { color: theme.textSecondary }]}>
              Records synchronized from the offline student application.
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
                       <Text style={[styles.studentRecordLabel, { color: theme.textSecondary }]}>
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
          </>
        )}

        {activeNav === "faculty" && (
          <>
            <View style={styles.facultyHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Faculty accounts
              </Text>
              <Pressable
                onPress={() => {
                  setForm({ username: "", email: "", password: "" });
                  setMessage("");
                  setError("");
                  setModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                  { backgroundColor: isDark ? "#86efac" : "#55e10a" },
                ]}
              >
                <Ionicons name="add" size={20} color={isDark ? "#000000" : "#0f172a"} />
                <Text style={[styles.addButtonText, { color: isDark ? "#000000" : "#0f172a" }]}>
                  Add faculty
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.sectionHint, { color: theme.textSecondary }]}>
              Manage staff access to the student learning portal.
            </Text>

            {!!message && (
              <View style={[styles.notification, styles.successNotification, { backgroundColor: isDark ? "rgba(34, 197, 94, 0.12)" : "#ecfdf5", borderColor: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(4, 120, 87, 0.18)" }]}>
                <Text style={styles.notificationText}>{message}</Text>
              </View>
            )}

            {faculty.length > 0 ? (
              <View style={[styles.tableCard, { backgroundColor: theme.backgroundElement, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 163, 184, 0.12)" }]}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { color: theme.textSecondary }]}>ID</Text>
                  <Text style={[styles.tableHeaderCell, { color: theme.textSecondary }]}>Username</Text>
                  <Text style={[styles.tableHeaderCell, { color: theme.textSecondary }]}>Email</Text>
                  <Text style={[styles.tableHeaderCell, { color: theme.textSecondary }]}>Created</Text>
                  <Text style={[styles.tableHeaderCell, { color: theme.textSecondary }]}>Actions</Text>
                </View>
                {faculty.map((f) => (
                  <View
                    key={f.user_id}
                    style={[
                      styles.tableRow,
                      { borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 163, 184, 0.08)" },
                    ]}
                  >
                    <Text style={[styles.tableCell, { color: theme.textSecondary }]}>{f.user_id}</Text>
                    <Text style={[styles.tableCell, { color: theme.text }]}>{f.username}</Text>
                    <Text style={[styles.tableCell, { color: theme.textSecondary }]}>{f.email}</Text>
                    <Text style={[styles.tableCell, { color: theme.textSecondary }]}>
                      {new Date(f.created_at).toLocaleDateString()}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(f.user_id)}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Ionicons name="trash-outline" size={18} color="#b91c1c" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                No faculty accounts registered yet.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(2, 6, 23, 0.45)" }]}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 163, 184, 0.12)",
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Register faculty member
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </Pressable>
            </View>
            <Text style={[styles.formHint, { color: theme.textSecondary }]}>
              Create a faculty account for staff access.
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "rgba(33, 34, 37, 0.9)" : "#fbfef9",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.18)",
                  color: theme.text,
                },
              ]}
              placeholder="Username"
              placeholderTextColor={theme.textSecondary}
              value={form.username}
              onChangeText={(value) => setForm({ ...form, username: value })}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "rgba(33, 34, 37, 0.9)" : "#fbfef9",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.18)",
                  color: theme.text,
                },
              ]}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={theme.textSecondary}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "rgba(33, 34, 37, 0.9)" : "#fbfef9",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.18)",
                  color: theme.text,
                },
              ]}
              placeholder="Temporary password"
              secureTextEntry
              placeholderTextColor={theme.textSecondary}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            {!!error && <Text style={[styles.errorText]}>{error}</Text>}
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed, { backgroundColor: theme.backgroundElement, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.12)" }]}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  await handleRegister();
                  if (!error) {
                    setModalVisible(false);
                  }
                }}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.pressed,
                  { backgroundColor: isDark ? "#86efac" : "#55e10a" },
                ]}
              >
                <Text style={[styles.saveButtonText, { color: isDark ? "#000000" : "#0f172a" }]}>
                  Create account
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  navRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  navTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  navTabActive: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  navTabLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  navTabActiveLabel: {
    color: "#166534",
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
  facultyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.75,
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
  tableCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  deleteButton: {
    padding: 6,
  },
  notification: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  successNotification: {},
  notificationText: {
    fontSize: 14,
    fontWeight: 600,
  },
  empty: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  modalClose: {
    padding: 4,
  },
  formHint: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 600,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 700,
  },
});
