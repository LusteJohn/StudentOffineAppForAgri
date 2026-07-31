import { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createStudentProfile, getStudentProfileByUserId, resetAndSeedLocalData, StudentProfile, updateStudentProfile } from '@/lib/auth-api';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateOrToday(dateValue: string) {
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [homeAddress, setHomeAddress] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const profileByUser = await getStudentProfileByUserId(activeUserId);
        if (isMounted) {
          setProfile(profileByUser ?? null);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setProfileLoaded(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeUserId]);

  const openModal = () => {
    if (profile) {
      setFirstName(profile.first_name);
      setMiddleName(profile.middle_name || '');
      setLastName(profile.last_name);
      setBirthdate(profile.birthdate);
      setHomeAddress(profile.home_address);
      setGradeLevel(profile.grade_level);
    } else {
      setFirstName('');
      setMiddleName('');
      setLastName('');
      const today = new Date();
      setBirthdate(formatDate(today));
      setHomeAddress('');
      setGradeLevel('');
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    if (!saving) {
      setModalVisible(false);
    }
  };

  const openDatePicker = () => {
    const baseDate = parseDateOrToday(birthdate);
    setSelectedYear(baseDate.getFullYear());
    setSelectedMonth(baseDate.getMonth() + 1);
    setSelectedDay(baseDate.getDate());
    setDatePickerVisible(true);
  };

  const updateYear = (delta: number) => {
    const nextYear = clamp(selectedYear + delta, 1950, new Date().getFullYear());
    const maxDay = getDaysInMonth(nextYear, selectedMonth);
    setSelectedYear(nextYear);
    setSelectedDay((currentDay) => clamp(currentDay, 1, maxDay));
  };

  const updateMonth = (delta: number) => {
    const nextMonth = clamp(selectedMonth + delta, 1, 12);
    const maxDay = getDaysInMonth(selectedYear, nextMonth);
    setSelectedMonth(nextMonth);
    setSelectedDay((currentDay) => clamp(currentDay, 1, maxDay));
  };

  const updateDay = (delta: number) => {
    const maxDay = getDaysInMonth(selectedYear, selectedMonth);
    const nextDay = clamp(selectedDay, 1, maxDay);
    setSelectedDay(nextDay);
  };

  const applyPickedDate = () => {
    const pickedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    setBirthdate(formatDate(pickedDate));
    setDatePickerVisible(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      if (profile) {
        const updated = await updateStudentProfile(profile.student_id, {
          user_id: activeUserId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          birthdate,
          home_address: homeAddress,
          grade_level: gradeLevel,
        });
        setProfile(updated);
        Alert.alert('Profile updated', 'Your student profile was updated successfully.');
      } else {
        const created = await createStudentProfile({
          user_id: activeUserId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          birthdate,
          home_address: homeAddress,
          grade_level: gradeLevel,
        });
        setProfile(created);
        Alert.alert('Profile created', 'Your student profile was saved successfully.');
      }

      setModalVisible(false);
    } catch (error) {
      Alert.alert('Unable to save profile', error instanceof Error ? error.message : 'Please check your details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setLoggingOut(true);
            router.replace({ pathname: '/login' });
          },
        },
      ]
    );
  };

  const handleImportResources = async () => {
    Alert.alert(
      'Import offline resources',
      'This will replace your local competency, module, lesson, lesson-content, and content-info records with the default offline resources. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            setImporting(true);
            setMessage('');
            try {
              const result = await resetAndSeedLocalData();
               if (result.alreadyImported) {
                setMessage(
                  `Offline resources are already imported for this device. Currently stored: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, ${result.lessonLink} lesson link records, ${result.questionInstruct} question instructs, ${result.questionContent} questions, ${result.questionChoice} question choices, ${result.jobSheet} job sheets, and ${result.performanceCheck} performance checks.`
                );
              } else {
                setMessage(
                  `Import completed: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, ${result.lessonLink} lesson link records, ${result.questionInstruct} question instructs, ${result.questionContent} questions, ${result.questionChoice} question choices, ${result.jobSheet} job sheets, and ${result.performanceCheck} performance checks saved to this device.`
                );
              }
            } catch (importError) {
              setMessage(
                importError instanceof Error
                  ? importError.message
                  : 'Failed to import offline resources. Please try again.'
              );
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="code" style={{ color: '#000000' }}>
            Student profile
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: '#000000' }}>
            User #{activeUserId} profile
          </ThemedText>
          <ThemedText style={{ color: '#000000' }}>Add your profile once, then update it anytime using the modal form.</ThemedText>

          {!profileLoaded ? (
            <ThemedText style={{ color: '#000000' }}>Loading profile...</ThemedText>
          ) : profile ? (
            <View style={styles.profileContainer}>
              <ProfileRow label="Student ID" value={String(profile.student_id)} />
              <ProfileRow label="First Name" value={profile.first_name} />
              <ProfileRow label="Middle Name" value={profile.middle_name || '-'} />
              <ProfileRow label="Last Name" value={profile.last_name} />
              <ProfileRow label="Birthdate" value={profile.birthdate} />
              <ProfileRow label="Home Address" value={profile.home_address} />
              <ProfileRow label="Grade Level" value={profile.grade_level} />
              <ProfileRow label="Created At" value={new Date(profile.created_at).toLocaleString()} />
              <ProfileRow label="Updated At" value={new Date(profile.updated_at).toLocaleString()} />
            </View>
          ) : (
            <ThemedText style={{ color: '#000000' }}>No profile exists yet. Tap Add Profile to insert your student information.</ThemedText>
          )}

          <Pressable onPress={openModal} style={styles.button}>
            <ThemedText style={styles.buttonText}>{profile ? 'Edit Profile' : 'Add Profile'}</ThemedText>
          </Pressable>
        </View>

        <View style={styles.card}>
          <ThemedText type="code" style={{ color: '#000000' }}>
            Settings
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: '#000000' }}>
            Device data
          </ThemedText>
          <ThemedText style={{ color: '#000000' }}>Manage offline resources stored on this device.</ThemedText>

          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View>
                <ThemedText type="subtitle" style={[styles.actionTitle, { color: '#000000' }]}>
                  Import offline resources
                </ThemedText>
                <ThemedText style={[styles.actionDescription, { color: '#000000' }]}>
                  Replace the current local competency, module, lesson, lesson-content, content-info, lesson-info, lesson-link, question-instruct, question-content, and question-choice data with the default offline dataset.
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={handleImportResources}
              disabled={importing}
              style={[styles.primaryButton, importing && styles.primaryButtonDisabled]}>
              <ThemedText style={styles.primaryButtonText}>{importing ? 'Importing...' : 'Import resources'}</ThemedText>
            </Pressable>

            {message ? (
              <View
                style={[
                  styles.statusBox,
                  message.includes('Failed')
                    ? styles.statusBoxError
                    : styles.statusBoxSuccess,
                ]}>
                <ThemedText
                  style={[
                    styles.statusText,
                    message.includes('Failed') ? styles.statusTextError : styles.statusTextSuccess,
                  ]}>
                  {message}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText type="code" style={{ color: '#000000' }}>
            Logout
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: '#000000' }}>
            Session
          </ThemedText>
          <ThemedText style={{ color: '#000000' }}>Logout from your current student account on this device.</ThemedText>

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}>
            <ThemedText style={styles.logoutButtonText}>{loggingOut ? 'Logging out...' : 'Logout'}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle" style={{ color: '#000000' }}>{profile ? 'Update Profile' : 'Create Profile'}</ThemedText>
            <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#64748b"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Middle Name (optional)"
                placeholderTextColor="#64748b"
                value={middleName}
                onChangeText={setMiddleName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#64748b"
                value={lastName}
                onChangeText={setLastName}
              />
              <View style={styles.fieldBlock}>
                <ThemedText style={[styles.fieldLabel, { color: '#000000' }]}>
                  Birthdate
                </ThemedText>
                <Pressable onPress={openDatePicker} style={styles.dateTrigger}>
                  <ThemedText style={styles.dateTriggerText}>{birthdate || 'Select birthdate'}</ThemedText>
                </Pressable>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                multiline
                placeholder="Home Address"
                placeholderTextColor="#64748b"
                value={homeAddress}
                onChangeText={setHomeAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Grade Level (e.g., Grade 9)"
                placeholderTextColor="#64748b"
                value={gradeLevel}
                onChangeText={setGradeLevel}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable disabled={saving} onPress={closeModal} style={styles.cancelButton}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable disabled={saving} onPress={handleSaveProfile} style={styles.saveButton}>
                <ThemedText style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={datePickerVisible} onRequestClose={() => setDatePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dateModalCard}>
            <ThemedText type="subtitle" style={{ color: '#000000' }}>Select Birthdate</ThemedText>

            <View style={styles.dateRow}>
              <DateAdjuster label="Year" value={String(selectedYear)} onMinus={() => updateYear(-1)} onPlus={() => updateYear(1)} />
              <DateAdjuster
                label="Month"
                value={String(selectedMonth).padStart(2, '0')}
                onMinus={() => updateMonth(-1)}
                onPlus={() => updateMonth(1)}
              />
              <DateAdjuster
                label="Day"
                value={String(selectedDay).padStart(2, '0')}
                onMinus={() => updateDay(-1)}
                onPlus={() => updateDay(1)}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setDatePickerVisible(false)} style={styles.cancelButton}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={applyPickedDate} style={styles.saveButton}>
                <ThemedText style={styles.saveButtonText}>Use Date</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavbar activeTab="settings" userId={activeUserId} />
    </ThemedView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <ThemedText type="code" style={[styles.profileLabel, { color: '#000000' }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.profileValue, { color: '#000000' }]}>{value}</ThemedText>
    </View>
  );
}

function DateAdjuster({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.dateAdjuster}>
      <ThemedText style={[styles.fieldLabel, { color: '#000000' }]}>
        {label}
      </ThemedText>
      <View style={styles.adjusterControls}>
        <Pressable onPress={onMinus} style={styles.adjustButton}>
          <ThemedText style={styles.adjustButtonText}>-</ThemedText>
        </Pressable>
        <ThemedText style={styles.adjustValue}>{value}</ThemedText>
        <Pressable onPress={onPlus} style={styles.adjustButton}>
          <ThemedText style={styles.adjustButtonText}>+</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#edf4ea',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 12,
    gap: 16,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    padding: 18,
    borderRadius: 24,
    gap: 12,
    backgroundColor: 'transparent',
  },
  profileContainer: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 14,
    gap: 10,
  },
  profileRow: {
    gap: 4,
  },
  profileLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  profileValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  actionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    padding: 16,
    gap: 12,
  },
  actionHeader: {
    gap: 6,
  },
  actionTitle: {
    fontSize: 18,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#55e10a',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#b91c1c',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  statusBox: {
    borderRadius: 16,
    padding: 12,
    gap: 6,
    borderWidth: 1,
  },
  statusBoxSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: 'rgba(4, 120, 87, 0.18)',
  },
  statusBoxError: {
    backgroundColor: '#fef2f2',
    borderColor: 'rgba(185, 28, 28, 0.18)',
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusTextSuccess: {
    color: '#047857',
    fontWeight: '600',
  },
  statusTextError: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '88%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  dateModalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  modalScrollContent: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dateTrigger: {
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  dateTriggerText: {
    fontSize: 15,
    color: '#102318',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateAdjuster: {
    flex: 1,
    gap: 8,
  },
  adjusterControls: {
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  adjustButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 35, 24, 0.08)',
  },
  adjustButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#102318',
  },
  adjustValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102318',
  },
  multilineInput: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#55e10a',
  },
  cancelButtonText: {
    color: '#102318',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});
