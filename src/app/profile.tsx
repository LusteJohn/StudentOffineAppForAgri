import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCustomAlert } from '@/lib/custom-alert';
import { useTheme } from '@/hooks/use-theme';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { InfoRow } from '@/components/info-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createStudentProfile, getStudentProfileByUserId, updateStudentProfile, StudentProfile } from '@/lib/auth-api';

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

export default function ProfileScreen() {
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
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [homeAddress, setHomeAddress] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [studentImage, setStudentImage] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const { showAlert } = useCustomAlert();
  const colors = useTheme();
  const isDark = colors.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    heroCard: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.05)' : '#f8fff3',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.18)' : 'rgba(92, 107, 97, 0.16)',
      shadowColor: isDark ? '#000000' : '#000',
    },
    heroIconWrap: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.15)' : '#dff8c8',
    },
    heroEyebrow: {
      color: colors.textSecondary,
    },
    heroTitle: {
      color: colors.text,
    },
    heroDescription: {
      color: colors.textSecondary,
    },
    heroButton: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    heroButtonText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    sectionCard: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(92, 107, 97, 0.12)',
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    sectionIconWrap: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#f1f8e8',
    },
    sectionEyebrow: {
      color: colors.textSecondary,
    },
    sectionTitle: {
      color: colors.text,
    },
    sectionBody: {
      color: colors.textSecondary,
    },
    profileContainer: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.05)' : '#f8fff3',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.12)' : 'rgba(92, 107, 97, 0.14)',
    },
    modalOverlay: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(2, 6, 23, 0.45)',
    },
    modalCard: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(92, 107, 97, 0.12)',
    },
    dateModalCard: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(92, 107, 97, 0.12)',
    },
    modalEyebrow: {
      color: colors.textSecondary,
    },
    modalTitle: {
      color: colors.text,
    },
    modalCloseButton: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#f1f8e8',
    },
    input: {
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
    },
    imageUploadButton: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#f8fafc',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
    },
    imageUploadText: {
      color: colors.textSecondary,
    },
    dateTrigger: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
    },
    dateTriggerText: {
      color: colors.text,
    },
    adjusterControls: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.05)' : '#f8fff3',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
    },
    adjustButton: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.15)' : '#e7f8d5',
    },
    adjustButtonText: {
      color: colors.text,
    },
    adjustValue: {
      color: colors.text,
    },
    cancelButton: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.18)',
    },
    cancelButtonText: {
      color: colors.text,
    },
    saveButton: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    saveButtonText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    fieldLabel: {
      color: colors.textSecondary,
    },
  }), [colors, isDark]);

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
      setStudentImage(profile.student_image || null);
    } else {
      setFirstName('');
      setMiddleName('');
      setLastName('');
      const today = new Date();
      setBirthdate(formatDate(today));
      setHomeAddress('');
      setGradeLevel('');
      setStudentImage(null);
    }

    setModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setStudentImage(result.assets[0].uri);
      }
    } catch {
      showAlert('Image upload unavailable', 'The image picker is not available in your current environment.');
    }
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
    const nextDay = clamp(selectedDay + delta, 1, maxDay);
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
          student_image: studentImage,
        });
        setProfile(updated);
        showAlert('Profile updated', 'Your student profile was updated successfully.');
      } else {
        const created = await createStudentProfile({
          user_id: activeUserId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          birthdate,
          home_address: homeAddress,
          grade_level: gradeLevel,
          student_image: studentImage,
        });
        setProfile(created);
        showAlert('Profile created', 'Your student profile was saved successfully.');
      }

      setModalVisible(false);
    } catch (error) {
      showAlert('Unable to save profile', error instanceof Error ? error.message : 'Please check your details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const profileDisplayName = profile
    ? [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ')
    : 'Create a student profile';

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Student Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroCard, isCompact && styles.heroCardCompact, dynamicStyles.heroCard]}>
          <View style={styles.heroContent}>
            <View style={[styles.heroIconWrap, dynamicStyles.heroIconWrap]}>
              {profile?.student_image ? (
                <Image source={{ uri: profile.student_image }} style={styles.heroProfileImage} />
              ) : (
                <Ionicons name="school-outline" size={24} color={colors.text} />
              )}
            </View>
            <View style={styles.heroTextWrap}>
              <ThemedText type="code" style={[styles.heroEyebrow, dynamicStyles.heroEyebrow]}>
                Student profile
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.heroTitle, dynamicStyles.heroTitle]}>
                {profileDisplayName}
              </ThemedText>
              <ThemedText style={[styles.heroDescription, dynamicStyles.heroDescription]}>
                {profile
                  ? `${profile.grade_level || 'Grade pending'} • ${profile.birthdate || 'Birthdate pending'}`
                  : 'Add your details once and keep your learning profile current.'}
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={openModal} style={[styles.heroButton, dynamicStyles.heroButton]}>
            <Ionicons name={profile ? 'create-outline' : 'add-circle-outline'} size={18} color={isDark ? '#000000' : '#0f172a'} />
            <ThemedText style={[styles.heroButtonText, dynamicStyles.heroButtonText]}>{profile ? 'Edit profile' : 'Add profile'}</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="person-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Profile
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Student details
              </ThemedText>
            </View>
          </View>

          {!profileLoaded ? (
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Loading profile...</ThemedText>
          ) : profile ? (
            <View style={[styles.profileContainer, dynamicStyles.profileContainer]}>
              <InfoRow label="Student ID" value={String(profile.student_id)} />
              <InfoRow label="First Name" value={profile.first_name} />
              <InfoRow label="Middle Name" value={profile.middle_name || '-'} />
              <InfoRow label="Last Name" value={profile.last_name} />
              <InfoRow label="Birthdate" value={profile.birthdate} />
              <InfoRow label="Home Address" value={profile.home_address} />
              <InfoRow label="Grade Level" value={profile.grade_level} />
              <InfoRow label="Created At" value={new Date(profile.created_at).toLocaleString()} />
              <InfoRow label="Updated At" value={new Date(profile.updated_at).toLocaleString()} />
            </View>
          ) : (
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>No profile exists yet. Tap the button to insert your student information.</ThemedText>
          )}
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.modalCard, dynamicStyles.modalCard]}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderContent}>
                <ThemedText type="code" style={[styles.modalEyebrow, dynamicStyles.modalEyebrow]}>
                  Profile form
                </ThemedText>
                <ThemedText type="subtitle" style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                  {profile ? 'Update profile' : 'Create profile'}
                </ThemedText>
              </View>
              <Pressable onPress={closeModal} style={[styles.modalCloseButton, dynamicStyles.modalCloseButton]}>
                <Ionicons name="close" size={18} color={colors.text} />
              </Pressable>
            </View>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.imageUploadBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Student Photo</ThemedText>
                  <Pressable onPress={pickImage} style={[styles.imageUploadButton, dynamicStyles.imageUploadButton]}>
                    {studentImage ? (
                      <Image source={{ uri: studentImage }} style={styles.imagePreview} />
                    ) : (
                      <>
                        <Ionicons name="camera-outline" size={24} color={colors.textSecondary} />
                        <ThemedText style={[styles.imageUploadText, dynamicStyles.imageUploadText]}>Tap to upload</ThemedText>
                      </>
                    )}
                  </Pressable>
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>First Name</ThemedText>
                  <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="First Name"
                    placeholderTextColor={colors.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Middle Name</ThemedText>
                  <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="Middle Name (optional)"
                    placeholderTextColor={colors.textSecondary}
                    value={middleName}
                    onChangeText={setMiddleName}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Last Name</ThemedText>
                  <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="Last Name"
                    placeholderTextColor={colors.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Birthdate</ThemedText>
                  <Pressable onPress={openDatePicker} style={[styles.dateTrigger, dynamicStyles.dateTrigger]}>
                    <ThemedText style={[styles.dateTriggerText, dynamicStyles.dateTriggerText]}>{birthdate || 'Select birthdate'}</ThemedText>
                    <Ionicons name="calendar-outline" size={18} color={colors.text} />
                  </Pressable>
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Home Address</ThemedText>
                  <TextInput
                    style={[styles.input, styles.multilineInput, dynamicStyles.input]}
                    multiline
                    placeholder="Home Address"
                    placeholderTextColor={colors.textSecondary}
                    value={homeAddress}
                    onChangeText={setHomeAddress}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <ThemedText style={[styles.fieldLabel, dynamicStyles.fieldLabel]}>Grade Level</ThemedText>
                  <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="Grade Level (e.g., Grade 9)"
                    placeholderTextColor={colors.textSecondary}
                    value={gradeLevel}
                    onChangeText={setGradeLevel}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.modalActions}>
              <Pressable disabled={saving} onPress={closeModal} style={[styles.cancelButton, dynamicStyles.cancelButton]}>
                <ThemedText style={[styles.cancelButtonText, dynamicStyles.cancelButtonText]}>Cancel</ThemedText>
              </Pressable>
              <Pressable disabled={saving} onPress={handleSaveProfile} style={[styles.saveButton, dynamicStyles.saveButton]}>
                <ThemedText style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>{saving ? 'Saving...' : 'Save'}</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={datePickerVisible} onRequestClose={() => setDatePickerVisible(false)}>
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.dateModalCard, dynamicStyles.dateModalCard]}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderContent}>
                <ThemedText type="code" style={[styles.modalEyebrow, dynamicStyles.modalEyebrow]}>
                  Calendar
                </ThemedText>
                <ThemedText type="subtitle" style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                  Select birthdate
                </ThemedText>
              </View>
              <Pressable onPress={() => setDatePickerVisible(false)} style={[styles.modalCloseButton, dynamicStyles.modalCloseButton]}>
                <Ionicons name="close" size={18} color={colors.text} />
              </Pressable>
            </View>

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
              <Pressable onPress={() => setDatePickerVisible(false)} style={[styles.cancelButton, dynamicStyles.cancelButton]}>
                <ThemedText style={[styles.cancelButtonText, dynamicStyles.cancelButtonText]}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={applyPickedDate} style={[styles.saveButton, dynamicStyles.saveButton]}>
                <ThemedText style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>Use Date</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavbar activeTab="profile" userId={activeUserId} />
    </ThemedView>
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
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';
  return (
    <View style={styles.dateAdjuster}>
      <ThemedText type="code" style={[styles.fieldLabel, { color: isDark ? theme.textSecondary : '#64748b' }]}>
        {label}
      </ThemedText>
      <View style={[styles.adjusterControls, {
        backgroundColor: isDark ? 'rgba(91, 236, 19, 0.05)' : '#f8fff3',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
      }]}>
        <Pressable onPress={onMinus} style={[styles.adjustButton, { backgroundColor: isDark ? 'rgba(91, 236, 19, 0.15)' : '#e7f8d5' }]}>
          <ThemedText style={[styles.adjustButtonText, { color: theme.text }]}>-</ThemedText>
        </Pressable>
        <ThemedText style={[styles.adjustValue, { color: theme.text }]}>{value}</ThemedText>
        <Pressable onPress={onPlus} style={[styles.adjustButton, { backgroundColor: isDark ? 'rgba(91, 236, 19, 0.15)' : '#e7f8d5' }]}>
          <ThemedText style={[styles.adjustButtonText, { color: theme.text }]}>+</ThemedText>
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
    padding: 20,
    paddingBottom: 12,
    gap: 16,
  },
  heroCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    padding: 18,
    borderRadius: 24,
    gap: 14,
    backgroundColor: '#f8fff3',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heroCardCompact: {
    padding: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dff8c8',
    overflow: 'hidden',
  },
  heroProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  heroTextWrap: {
    flex: 1,
    gap: 2,
  },
  heroEyebrow: {
    color: '#64748b',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  heroTitle: {
    color: '#0f172a',
    fontSize: 18,
  },
  heroDescription: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 13,
    backgroundColor: '#55e10a',
  },
  heroButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  sectionCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    padding: 18,
    borderRadius: 24,
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.12)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e8',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionEyebrow: {
    color: '#64748b',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 16,
  },
  sectionBody: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  profileContainer: {
    marginTop: 2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.14)',
    backgroundColor: '#f8fff3',
    padding: 14,
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '88%',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.12)',
    flex: 1,
  },
  dateModalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 24,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.12)',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalHeaderContent: {
    flex: 1,
    gap: 2,
  },
  modalEyebrow: {
    color: '#64748b',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e8',
  },
  modalScrollContent: {
    gap: 12,
    paddingBottom: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  fieldBlock: {
    gap: 6,
  },
  imageUploadBlock: {
    gap: 8,
    marginBottom: 12,
  },
  imageUploadButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  imageUploadText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#64748b',
  },
  dateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.16)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  dateTriggerText: {
    fontSize: 15,
    color: '#102318',
    flex: 1,
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
    borderColor: 'rgba(92, 107, 97, 0.16)',
    borderRadius: 14,
    backgroundColor: '#f8fff3',
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
    backgroundColor: '#e7f8d5',
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
    minHeight: 84,
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
    backgroundColor: '#ffffff',
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
    color: '#0f172a',
    fontWeight: '700',
  },
});
