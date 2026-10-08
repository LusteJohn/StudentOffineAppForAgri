import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { getStaffSession, listStudents, StaffUser, StudentWithRecords } from "@/lib/staff-api";
import { StaffPortal, styles } from "@/components/staff-portal";

export default function FacultyPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [students, setStudents] = useState<StudentWithRecords[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const session = await getStaffSession();
        if (session.user.role !== "faculty" && session.user.role !== "admin") throw new Error();
        setUser(session.user);
        setStudents((await listStudents()).students);
      } catch {
        router.replace("/auth/login" as Href);
      }
    })();
  }, []);
  if (!user) return <View style={styles.page}><Text>Loading...</Text></View>;
  return <StaffPortal user={user}><ScrollView>
    <Text style={styles.heading}>Student records</Text>
    {students.map((student) => <View key={student.user.user_id} style={styles.card}>
      <Text style={styles.heading}>{student.user.username}</Text>
      <Text style={styles.body}>{student.user.email} · user_id: {student.user.user_id}</Text>
      {Object.entries(student.records).map(([table, records]) => <View key={table} style={{ marginTop: 10 }}>
        <Text style={styles.body}>{table}: {records.length} record(s)</Text>
        <Text selectable style={styles.record}>{JSON.stringify(records, null, 2)}</Text>
      </View>)}
    </View>)}
  </ScrollView></StaffPortal>;
}
