import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { InfoRow } from "@/components/info-row";
import { StudentWithRecords } from "@/lib/staff-api";

type StudentDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  student: StudentWithRecords | null;
};

function formatDate(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString();
    }
    return value;
  }
  return String(value);
}

function formatDateTime(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
    return value;
  }
  return String(value);
}

function displayLabel(key: string): string {
  return key
    .replace(/_id$/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function percentForCorrect(count: number): number {
  return ({ 0: 0, 1: 10, 2: 40, 3: 60, 4: 80, 5: 100 } as Record<number, number>)[count] ?? Math.round((count / 5) * 100);
}

type ModuleProgress = {
  moduleName: string;
  total: number;
  completed: number;
  bookmarked: number;
};

type ModuleActivity = {
  type: string;
  label: string;
  moduleName: string;
  lessonName: string;
  score: number;
};

function computeModuleProgress(
  records: Record<string, Record<string, unknown>[]>,
): ModuleProgress[] {
  const progressRows = records.lesson_content_progress || [];
  const bookmarks = new Set(
    (records.lesson_content_bookmark || [])
      .filter((row) => Number(row.is_bookmark) === 1)
      .map((row) => String(row.lesson_content_id)),
  );

  const moduleMap = new Map<string, ModuleProgress>();
  progressRows.forEach((row) => {
    const module = String(row.module_name || "Module unavailable");
    if (!moduleMap.has(module)) {
      moduleMap.set(module, { moduleName: module, total: 0, completed: 0, bookmarked: 0 });
    }
    const summary = moduleMap.get(module)!;
    summary.total += 1;
    summary.completed += Number(row.is_read) === 1 ? 1 : 0;
    if (bookmarks.has(String(row.lesson_content_id))) {
      summary.bookmarked += 1;
    }
  });

  return Array.from(moduleMap.values());
}

function computeActivities(
  records: Record<string, Record<string, unknown>[]>,
): ModuleActivity[] {
  const grouped = new Map<
    string,
    { type: string; label: string; moduleName: string; lessonName: string; scores: number[] }
  >();

  const addActivity = (type: string, row: Record<string, unknown>, score: number) => {
    const lessonContentId = String(row.lesson_content_id ?? "");
    const key = `${type}:${lessonContentId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        type,
        label: String(row.content_name || "Content unavailable"),
        moduleName: String(row.module_name || "Module unavailable"),
        lessonName: String(row.lesson_name || "Lesson unavailable"),
        scores: [],
      });
    }
    grouped.get(key)!.scores.push(score);
  };

  (records.question_answers || []).forEach((row) => {
    addActivity("Questions", row, Number(row.activity_score) || 0);
  });
  (records.job_sheet_answers || []).forEach((row) => {
    addActivity("Job sheet", row, Number(row.activity_score) || 0);
  });
  (records.performance_answer || []).forEach((row) => {
    const text = String(row.performance_answer_text || "").trim().toLowerCase();
    addActivity("Performance", row, text === "yes" ? 100 : 0);
  });

  const result: ModuleActivity[] = [];
  grouped.forEach(({ type, label, moduleName, lessonName, scores }) => {
    let score: number;
    if (type === "Questions") {
      score = percentForCorrect(scores.filter((value) => value === 100).length);
    } else if (type === "Performance") {
      score = scores.every((value) => value === 100) ? 100 : 0;
    } else {
      score = Math.round(scores.reduce((sum, value) => sum + value, 0) / Math.max(scores.length, 1));
    }
    result.push({ type, label: `${type} · ${label}`, moduleName, lessonName, score });
  });

  return result;
}

type RecordTableSection = {
  key: string;
  title: string;
  columns: string[];
  groupByModule?: boolean;
};

const recordSections: RecordTableSection[] = [
  {
    key: "question_answers",
    title: "Question answers",
    columns: ["module_name", "lesson_name", "content_name", "question_text", "answer_text", "is_correct", "activity_score", "created_at"],
    groupByModule: true,
  },
  {
    key: "job_sheet_answers",
    title: "Job-sheet answers",
    columns: ["module_name", "lesson_name", "content_name", "job_title", "answer_text", "activity_score", "created_at"],
    groupByModule: true,
  },
  {
    key: "performance_answer",
    title: "Performance answers",
    columns: ["module_name", "lesson_name", "content_name", "performance_question", "performance_answer_text", "created_at"],
    groupByModule: true,
  },
  {
    key: "lesson_content_progress",
    title: "Lesson-content progress",
    columns: ["module_name", "lesson_name", "content_name", "is_read", "read_at", "updated_at"],
    groupByModule: true,
  },
  {
    key: "lesson_content_bookmark",
    title: "Bookmarked content",
    columns: ["module_name", "lesson_name", "content_name", "is_bookmark", "created_at"],
    groupByModule: true,
  },
  {
    key: "student_lesson_achievement",
    title: "Lesson achievements",
    columns: ["module_name", "lesson_name", "achievement_name", "created_at"],
    groupByModule: true,
  },
  {
    key: "student_module_achievement",
    title: "Module achievements",
    columns: ["module_name", "achievement_name", "created_at"],
    groupByModule: false,
  },
];

function formatCellValue(value: unknown, key: string): string {
  if (value === null || value === undefined) return "";
  if (key === "created_at" || key === "updated_at" || key === "read_at") {
    return formatDateTime(value);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function StudentDetailModal({ visible, onClose, student }: StudentDetailModalProps) {
  const theme = useTheme();
  const isDark = theme.text === "#ffffff";

  if (!student) return null;

  const records = student.records;
  const moduleProgress = computeModuleProgress(records);
  const activities = computeActivities(records);
  const hasStudentInfo = (records.student_info || []).length > 0;
  const studentInfo = hasStudentInfo ? records.student_info![0] : null;

  const allModules = new Set<string>();
  moduleProgress.forEach((item) => allModules.add(item.moduleName));
  activities.forEach((item) => allModules.add(item.moduleName));

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: isDark ? "rgba(0, 0, 0, 0.55)" : "rgba(2, 6, 23, 0.55)" }]}>
        <View style={[styles.modalCard, { backgroundColor: theme.backgroundElement, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 163, 184, 0.12)" }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Student learning records
            </Text>
            <Pressable onPress={onClose} style={styles.modalClose}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.profileCard, { backgroundColor: isDark ? "rgba(33, 34, 37, 0.9)" : "#fbfef9", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.12)" }]}>
              <View style={styles.profileHeader}>
                <View style={[styles.profileAvatar, { backgroundColor: isDark ? "rgba(91, 236, 19, 0.15)" : "#e4f8d6" }]}>
                  <Ionicons name="person" size={28} color={isDark ? "#86efac" : "#166534"} />
                </View>
                <View style={styles.profileIdentity}>
                  <Text style={[styles.profileName, { color: theme.text }]}>
                    {student.user.username}
                  </Text>
                  <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                    {student.user.email}
                  </Text>
                  <Text style={[styles.profileUserId, { color: theme.textSecondary }]}>
                    user_id: {student.user.user_id}
                  </Text>
                </View>
              </View>

              {hasStudentInfo ? (
                <View style={styles.infoGrid}>
                  {studentInfo?.first_name ? <InfoRow label="First name" value={String(studentInfo.first_name)} /> : null}
                  {studentInfo?.middle_name ? <InfoRow label="Middle name" value={String(studentInfo.middle_name)} /> : null}
                  {studentInfo?.last_name ? <InfoRow label="Last name" value={String(studentInfo.last_name)} /> : null}
                  {studentInfo?.birthdate ? <InfoRow label="Birthdate" value={formatDate(studentInfo.birthdate)} /> : null}
                  {studentInfo?.home_address ? <InfoRow label="Home address" value={String(studentInfo.home_address)} /> : null}
                  {studentInfo?.grade_level ? <InfoRow label="Grade level" value={String(studentInfo.grade_level)} /> : null}
                </View>
              ) : (
                <Text style={[styles.muted, { color: theme.textSecondary }]}>
                  No student profile data has been synchronized.
                </Text>
              )}
            </View>

            {moduleProgress.length > 0 && (
              <View style={styles.reportSection}>
                <Text style={[styles.reportTitle, { color: theme.text }]}>
                  Module progress report
                </Text>
                {moduleProgress.map((item) => {
                  const percent = item.total ? Math.round((item.completed / item.total) * 100) : 0;
                  const bookmarkPercent = item.total ? Math.round((item.bookmarked / item.total) * 100) : 0;
                  return (
                    <View key={item.moduleName} style={styles.progressBarRow}>
                      <View style={styles.progressBarHeader}>
                        <Text style={[styles.progressBarLabel, { color: theme.text }]}>
                          {item.moduleName}
                        </Text>
                        <Text style={[styles.progressBarPercent, { color: theme.text }]}>
                          {percent}%
                        </Text>
                      </View>
                      <View style={[styles.progressTrack, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }]}>
                        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: isDark ? "#86efac" : "#55e10a" }]} />
                      </View>
                      <Text style={[styles.progressDetail, { color: theme.textSecondary }]}>
                        {item.completed}/{item.total} completed · {bookmarkPercent}% bookmarked
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {activities.length > 0 && (
              <View style={styles.reportSection}>
                <Text style={[styles.reportTitle, { color: theme.text }]}>
                  Activity scores
                </Text>
                {activities.map((activity, index) => (
                  <View key={index} style={styles.progressBarRow}>
                    <View style={styles.progressBarHeader}>
                      <Text style={[styles.progressBarLabel, { color: theme.text }]}>
                        {activity.label}
                      </Text>
                      <Text style={[styles.progressBarPercent, { color: theme.text }]}>
                        {activity.score}%
                      </Text>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }]}>
                      <View style={[styles.progressFill, { width: `${activity.score}%`, backgroundColor: isDark ? "#86efac" : "#55e10a" }]} />
                    </View>
                    <Text style={[styles.progressDetail, { color: theme.textSecondary }]}>
                      {activity.moduleName} · {activity.lessonName}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {allModules.size > 0 && (
              <View style={styles.reportSection}>
                <Text style={[styles.reportTitle, { color: theme.text }]}>
                  Modules in this report
                </Text>
                <View style={styles.moduleList}>
                  {Array.from(allModules).map((moduleName) => (
                    <View
                      key={moduleName}
                      style={[
                        styles.moduleItem,
                        { backgroundColor: isDark ? "rgba(33, 34, 37, 0.9)" : "#f8fff3", borderColor: isDark ? "rgba(91, 236, 19, 0.18)" : "rgba(85, 225, 10, 0.16)" },
                      ]}
                    >
                      <Ionicons name="leaf-outline" size={16} color={isDark ? "#86efac" : "#55e10a"} />
                      <Text style={[styles.moduleItemText, { color: theme.text }]}>{moduleName}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {recordSections.map((section) => {
              const rows = records[section.key] || [];
              if (!rows.length) return null;

              const visibleColumns = section.columns.filter((col) =>
                rows.some((row) => row[col] !== null && row[col] !== undefined && row[col] !== ""),
              );

              const groupedRows = section.groupByModule
                ? (() => {
                    const groups = new Map<string, Record<string, unknown>[]>();
                    rows.forEach((row) => {
                      const moduleName = String(row.module_name || "Module unavailable");
                      if (!groups.has(moduleName)) groups.set(moduleName, []);
                      groups.get(moduleName)!.push(row);
                    });
                    return groups;
                  })()
                : null;

              return (
                <View key={section.key} style={styles.recordSection}>
                  <Text style={[styles.recordSectionTitle, { color: theme.text }]}>
                    {section.title} ({rows.length})
                  </Text>
                  {section.groupByModule ? (
                    Array.from(groupedRows?.entries() || []).map(([moduleName, moduleRows]) => (
                      <View
                        key={moduleName}
                        style={[
                          styles.moduleGroup,
                          {
                            backgroundColor: isDark ? "rgba(33, 34, 37, 0.5)" : "#f8fff3",
                            borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(148, 163, 184, 0.06)",
                          },
                        ]}
                      >
                        <Text style={[styles.moduleGroupName, { color: isDark ? "#86efac" : "#166534" }]}>
                          {moduleName}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View style={styles.table}>
                            <View
                              style={[styles.tableHeader, { borderBottomColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 163, 184, 0.18)" }]}
                            >
                              {visibleColumns.map((col) => (
                                <Text
                                  key={col}
                                  style={[styles.tableHeaderCell, { color: theme.textSecondary, minWidth: 120 }]}
                                >
                                  {displayLabel(col)}
                                </Text>
                              ))}
                            </View>
                            {moduleRows.map((row, rowIndex) => (
                              <View
                                key={rowIndex}
                                style={[styles.tableRow, { borderBottomColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(148, 163, 184, 0.04)" }]}
                              >
                                {visibleColumns.map((col) => (
                                  <Text key={col} style={[styles.tableCell, { color: theme.text, minWidth: 120 }]}>
                                    {formatCellValue(row[col], col)}
                                  </Text>
                                ))}
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    ))
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.table}>
                        <View
                          style={[styles.tableHeader, { borderBottomColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 163, 184, 0.18)" }]}
                        >
                          {visibleColumns.map((col) => (
                            <Text
                              key={col}
                              style={[styles.tableHeaderCell, { color: theme.textSecondary, minWidth: 120 }]}
                            >
                              {displayLabel(col)}
                            </Text>
                          ))}
                        </View>
                        {rows.map((row, rowIndex) => (
                          <View
                            key={rowIndex}
                            style={[styles.tableRow, { borderBottomColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(148, 163, 184, 0.04)" }]}
                          >
                            {visibleColumns.map((col) => (
                              <Text key={col} style={[styles.tableCell, { color: theme.text, minWidth: 120 }]}>
                                {formatCellValue(row[col], col)}
                              </Text>
                            ))}
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>
              );
            })}

            {!hasStudentInfo &&
              moduleProgress.length === 0 &&
              activities.length === 0 &&
              recordSections.every((section) => !(records[section.key] || []).length) && (
              <Text style={[styles.muted, { color: theme.textSecondary, textAlign: "center", paddingVertical: 20 }]}>
                No detailed records have been synchronized for this student yet.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "85%",
    borderRadius: 24,
    padding: 20,
    gap: 16,
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
  profileCard: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIdentity: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 19,
    fontWeight: 700,
  },
  profileEmail: {
    fontSize: 13,
  },
  profileUserId: {
    fontSize: 12,
  },
  infoGrid: {
    gap: 10,
  },
  reportSection: {
    gap: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  progressBarRow: {
    gap: 6,
  },
  progressBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  progressBarPercent: {
    fontSize: 13,
    fontWeight: 700,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
    minWidth: 2,
  },
  progressDetail: {
    fontSize: 11,
  },
  moduleList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moduleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  moduleItemText: {
    fontSize: 13,
    fontWeight: 600,
  },
  recordSection: {
    gap: 10,
  },
  recordSectionTitle: {
    fontSize: 14,
    fontWeight: 700,
  },
  moduleGroup: {
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  moduleGroupName: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tableCell: {
    fontSize: 13,
    paddingHorizontal: 8,
  },
  muted: {
    fontSize: 14,
  },
});
