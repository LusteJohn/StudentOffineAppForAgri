import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCustomAlert } from '@/lib/custom-alert';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createStudentProfile, getStudentProfileByUserId, resetAndSeedLocalData, StudentProfile, updateStudentProfile, listLessonContentBookmarkByUser, getLessonContentById, getLessonById, getModuleById, LessonContentBookmarkRecord, LessonContentRecord, LessonRecord, ModuleRecord } from '@/lib/auth-api';

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

type BookmarkDetail = {
  bookmark: LessonContentBookmarkRecord;
  content: LessonContentRecord | null;
  lesson: LessonRecord | null;
  module: ModuleRecord | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

let appVersion = '1.0.0';
try {
  const Constants = require('expo-constants').Constants;
  appVersion = Constants?.manifest?.version || Constants?.expoVersion || '1.0.0';
} catch {
  appVersion = '1.0.0';
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
  const [bookmarks, setBookmarks] = useState<BookmarkDetail[]>([]);
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

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
  const [studentImage, setStudentImage] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const { showAlert } = useCustomAlert();

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

  const loadBookmarks = useCallback(async () => {
    setBookmarksLoading(true);
    setBookmarksLoaded(true);
    try {
      const bookmarkRecords = await listLessonContentBookmarkByUser(activeUserId);
      const detailList: BookmarkDetail[] = [];
      for (const bookmark of bookmarkRecords) {
        const content = await getLessonContentById(bookmark.lesson_content_id);
        const lesson = content ? await getLessonById(content.lesson_id) : null;
        const moduleRecord = lesson ? await getModuleById(lesson.module_id) : null;
        detailList.push({ bookmark, content, lesson, module: moduleRecord });
      }
      setBookmarks(detailList);
    } catch (bookmarkError) {
      setBookmarks([]);
      if (bookmarkError instanceof Error) {
        showAlert('Unable to load bookmarks', bookmarkError.message);
      }
    } finally {
      setBookmarksLoading(false);
    }
  }, [activeUserId, showAlert]);

  const navigateToBookmark = useCallback(
    (bookmark: LessonContentBookmarkRecord) => {
      router.replace({
        pathname: '/content-info/[id]',
        params: { id: String(bookmark.lesson_content_id), userId: String(activeUserId) },
      });
    },
     [activeUserId]
  );

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

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

  const handleLogout = () => {
    showAlert(
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
    showAlert(
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
                   `Offline resources are already imported for this device. Currently stored: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, ${result.lessonLink} lesson link records, ${result.questionInstruct} question instructs, ${result.questionContent} questions, ${result.questionChoice} question choices, ${result.jobSheet} job sheets, ${result.performanceCheck} performance checks, ${result.moduleAchievement} module achievements, and ${result.lessonAchievement} lesson achievements.`
                 );
               } else {
                 setMessage(
                   `Import completed: ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info records, ${result.lessonInfo} lesson info records, ${result.lessonLink} lesson link records, ${result.questionInstruct} question instructs, ${result.questionContent} questions, ${result.questionChoice} question choices, ${result.jobSheet} job sheets, ${result.performanceCheck} performance checks, ${result.moduleAchievement} module achievements, and ${result.lessonAchievement} lesson achievements saved to this device.`
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

  const profileDisplayName = profile
    ? [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ')
    : 'Create a student profile';

  return (
    <ThemedView style={styles.screen}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroCard, isCompact && styles.heroCardCompact]}>
          <View style={styles.heroContent}>
             <View style={styles.heroIconWrap}>
               {profile?.student_image ? (
                 <Image source={{ uri: profile.student_image }} style={styles.heroProfileImage} />
               ) : (
                 <Ionicons name="school-outline" size={24} color="#0f172a" />
               )}
             </View>
            <View style={styles.heroTextWrap}>
              <ThemedText type="code" style={styles.heroEyebrow}>
                Student profile
              </ThemedText>
              <ThemedText type="subtitle" style={styles.heroTitle}>
                {profileDisplayName}
              </ThemedText>
              <ThemedText style={styles.heroDescription}>
                {profile
                  ? `${profile.grade_level || 'Grade pending'} • ${profile.birthdate || 'Birthdate pending'}`
                  : 'Add your details once and keep your learning profile current.'}
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={openModal} style={styles.heroButton}>
            <Ionicons name={profile ? 'create-outline' : 'add-circle-outline'} size={18} color="#0f172a" />
            <ThemedText style={styles.heroButtonText}>{profile ? 'Edit profile' : 'Add profile'}</ThemedText>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="person-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                Profile
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Student details
              </ThemedText>
            </View>
          </View>

          {!profileLoaded ? (
            <ThemedText style={styles.sectionBody}>Loading profile...</ThemedText>
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
            <ThemedText style={styles.sectionBody}>No profile exists yet. Tap the button to insert your student information.</ThemedText>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="cloud-download-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                Device data
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Offline resources
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.sectionBody}>Manage offline resources stored on this device.</ThemedText>

          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View style={styles.actionTextWrap}>
                <ThemedText type="subtitle" style={styles.actionTitle}>
                  Import offline resources
                </ThemedText>
                <ThemedText style={styles.actionDescription}>
                   Replace the current local competency, module, lesson, lesson-content, content-info, lesson-info, lesson-link, question-instruct, question-content, question-choice, job-sheet, and performance-checklist data with the default offline dataset.
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={handleImportResources}
              disabled={importing}
              style={[styles.primaryButton, importing && styles.primaryButtonDisabled]}>
              <Ionicons name="download-outline" size={18} color="#0f172a" />
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

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="bookmark-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                Bookmarks
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Bookmarked lesson content
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.sectionBody}>
            Jump back to bookmarked lesson content.
          </ThemedText>

          {bookmarksLoading ? (
            <ThemedText style={styles.sectionBody}>Loading bookmarks...</ThemedText>
          ) : bookmarks.length > 0 ? (
            <View style={styles.bookmarkList}>
              {bookmarks.map((item) => (
                  <View key={item.bookmark.lesson_content_bookmark_id} style={styles.bookmarkRow}>
                  <View style={styles.bookmarkTextGroup}>
                    <ThemedText style={styles.bookmarkContentName}>
                      {item.content?.content_name || 'Unknown content'}
                    </ThemedText>
                    {item.lesson ? (
                      <ThemedText style={styles.bookmarkLessonName}>
                        {item.lesson.lesson_name}
                      </ThemedText>
                    ) : null}
                    {item.module ? (
                      <ThemedText style={styles.bookmarkModuleName}>
                        {item.module.module_name}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => navigateToBookmark(item.bookmark)}
                    style={styles.bookmarkOpenButton}
                  >
                    <ThemedText style={styles.bookmarkOpenButtonText}>Open</ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : bookmarksLoaded ? (
            <ThemedText style={styles.sectionBody}>No bookmarks yet. Bookmark lesson content from the content info page.</ThemedText>
          ) : null}
         </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="information-circle-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                About
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Agricultural Production Learning
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.sectionBody}>
            This application provides interactive learning modules for agricultural production, covering competencies, lessons, lesson content, exercises, job sheets, and performance checklists to support student learning and assessment.
          </ThemedText>
          <ThemedText style={styles.sectionBody}>
            Developed for agricultural education and practical skill development in the field.
          </ThemedText>
          <ThemedText style={styles.sectionBody}>
            Proposed by the student as a capstone project for the Bachelor of Science in Education, Major in Information and Communications Technology (ICT).
          </ThemedText>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="cube-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                App info
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Version
              </ThemedText>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <ProfileRow label="App Name" value="AgriLearn Student" />
            <ProfileRow label="Version" value={appVersion} />
            <ProfileRow label="Description" value="Agricultural production learning platform" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="log-out-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={styles.sectionEyebrow}>
                Session
              </ThemedText>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Logout
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.sectionBody}>Logout from your current student account on this device.</ThemedText>

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}>
            <Ionicons name="exit-outline" size={18} color="#ffffff" />
            <ThemedText style={styles.logoutButtonText}>{loggingOut ? 'Logging out...' : 'Logout'}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderContent}>
                <ThemedText type="code" style={styles.modalEyebrow}>
                  Profile form
                </ThemedText>
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  {profile ? 'Update profile' : 'Create profile'}
                </ThemedText>
              </View>
              <Pressable onPress={closeModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={18} color="#0f172a" />
              </Pressable>
            </View>
             <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
              <View style={styles.imageUploadBlock}>
                <ThemedText style={styles.fieldLabel}>Student Photo</ThemedText>
                <Pressable onPress={pickImage} style={styles.imageUploadButton}>
                  {studentImage ? (
                    <Image source={{ uri: studentImage }} style={styles.imagePreview} />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={24} color="#64748b" />
                      <ThemedText style={styles.imageUploadText}>Tap to upload</ThemedText>
                    </>
                  )}
                </Pressable>
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>First Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#64748b"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>Middle Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Middle Name (optional)"
                  placeholderTextColor="#64748b"
                  value={middleName}
                  onChangeText={setMiddleName}
                />
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>Last Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#64748b"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>Birthdate</ThemedText>
                <Pressable onPress={openDatePicker} style={styles.dateTrigger}>
                  <ThemedText style={styles.dateTriggerText}>{birthdate || 'Select birthdate'}</ThemedText>
                  <Ionicons name="calendar-outline" size={18} color="#0f172a" />
                </Pressable>
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>Home Address</ThemedText>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  multiline
                  placeholder="Home Address"
                  placeholderTextColor="#64748b"
                  value={homeAddress}
                  onChangeText={setHomeAddress}
                />
              </View>
              <View style={styles.fieldBlock}>
                <ThemedText style={styles.fieldLabel}>Grade Level</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Grade Level (e.g., Grade 9)"
                  placeholderTextColor="#64748b"
                  value={gradeLevel}
                  onChangeText={setGradeLevel}
                />
              </View>
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
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderContent}>
                <ThemedText type="code" style={styles.modalEyebrow}>
                  Calendar
                </ThemedText>
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  Select birthdate
                </ThemedText>
              </View>
              <Pressable onPress={() => setDatePickerVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={18} color="#0f172a" />
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
  profileRow: {
    gap: 4,
  },
  profileLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#64748b',
  },
  profileValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#0f172a',
  },
  actionCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.12)',
    backgroundColor: '#f8fff3',
    padding: 14,
    gap: 12,
  },
  actionHeader: {
    gap: 6,
  },
  actionTextWrap: {
    gap: 4,
  },
  actionTitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: '#55e10a',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: '#b91c1c',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  bookmarkList: {
    gap: 8,
    marginTop: 4,
  },
  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bookmarkTextGroup: {
    flex: 1,
    gap: 2,
  },
  bookmarkContentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  bookmarkLessonName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  bookmarkModuleName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  bookmarkOpenButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#5bec13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkOpenButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
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
