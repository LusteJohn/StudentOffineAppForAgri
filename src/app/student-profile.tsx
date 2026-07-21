import { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createStudentProfile, getStudentProfileByUserId, StudentProfile, updateStudentProfile } from '@/lib/auth-api';

export default function StudentProfileScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');

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
      setBirthdate('');
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

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="code" themeColor="textSecondary">
            Student profile
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            User #{activeUserId} profile
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Add your profile once, then update it anytime using the modal form.
          </ThemedText>

          {!profileLoaded ? (
            <ThemedText themeColor="textSecondary">Loading profile...</ThemedText>
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
            <ThemedText themeColor="textSecondary" style={styles.emptyState}>
              No profile exists yet. Tap Add Profile to insert your student information.
            </ThemedText>
          )}

          <Pressable onPress={openModal} style={styles.button}>
            <ThemedText style={styles.buttonText}>{profile ? 'Edit Profile' : 'Add Profile'}</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.replace({ pathname: '/home', params: { userId: String(activeUserId) } })}
            style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>Back to home</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle">{profile ? 'Update Profile' : 'Create Profile'}</ThemedText>
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
              <TextInput
                style={styles.input}
                placeholder="Birthdate (YYYY-MM-DD)"
                placeholderTextColor="#64748b"
                value={birthdate}
                onChangeText={setBirthdate}
              />
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
    </ThemedView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.profileLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.profileValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 36,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    padding: 24,
    borderRadius: 28,
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  title: {
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    marginTop: 8,
    lineHeight: 22,
  },
  profileContainer: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
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
    backgroundColor: '#0f172a',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButtonText: {
    fontWeight: '700',
    color: '#0f172a',
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
    backgroundColor: '#f8fafc',
  },
  modalScrollContent: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#ffffff',
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
    borderColor: 'rgba(148, 163, 184, 0.5)',
    backgroundColor: '#fff',
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0f172a',
  },
  cancelButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
