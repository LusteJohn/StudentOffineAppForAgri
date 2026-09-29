import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCustomAlert } from '@/lib/custom-alert';
import { useThemeContext } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/use-theme';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createStudentProfile, getStudentProfileByUserId, resetAndSeedLocalData, StudentProfile, updateStudentProfile, listLessonContentBookmarkByUser, getLessonContentById, getLessonById, getModuleById, LessonContentBookmarkRecord, LessonContentRecord, LessonRecord, ModuleRecord, getStudentReportData, StudentReportData, getSetting, setSetting, getStudentTutorialByUserId, updateStudentTutorial, createStudentTutorial } from '@/lib/auth-api';

let Print: any;
let Sharing: any;
try {
  Print = require('expo-print');
  Sharing = require('expo-sharing');
} catch {
  Print = null;
  Sharing = null;
}

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

  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState<StudentReportData | null>(null);

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const { showAlert } = useCustomAlert();
  const themeCtx = useThemeContext();
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
    heroIcon: {
      color: colors.text,
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
    sectionIcon: {
      color: colors.text,
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
    profileLabel: {
      color: colors.textSecondary,
    },
    profileValue: {
      color: colors.text,
    },
    actionCard: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.05)' : '#f8fff3',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.12)' : 'rgba(92, 107, 97, 0.12)',
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    actionTitle: {
      color: colors.text,
    },
    actionDescription: {
      color: colors.textSecondary,
    },
    primaryButton: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    primaryButtonIcon: {
      color: isDark ? '#000000' : '#0f172a',
    },
    primaryButtonText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    bookmarkList: {
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    bookmarkRow: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148, 163, 184, 0.12)',
      shadowColor: isDark ? '#000000' : '#0f172a',
    },
    bookmarkContentName: {
      color: isDark ? '#86efac' : '#166534',
    },
    bookmarkLessonName: {
      color: colors.text,
    },
    bookmarkModuleName: {
      color: colors.textSecondary,
    },
    bookmarkOpenButton: {
      backgroundColor: isDark ? '#86efac' : '#5bec13',
    },
    bookmarkOpenButtonText: {
      color: isDark ? '#000000' : '#0f172a',
    },
    statusBoxSuccess: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#ecfdf5',
      borderColor: isDark ? 'rgba(91, 236, 19, 0.28)' : 'rgba(4, 120, 87, 0.18)',
    },
    statusBoxError: {
      backgroundColor: '#fef2f2',
      borderColor: 'rgba(185, 28, 28, 0.18)',
    },
    statusTextSuccess: {
      color: isDark ? '#86efac' : '#047857',
    },
    statusTextError: {
      color: '#b91c1c',
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
    modalCloseIcon: {
      color: colors.text,
    },
    input: {
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(92, 107, 97, 0.16)',
    },
    inputPlaceholder: {
      color: colors.textSecondary,
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
    dateTriggerIcon: {
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
     logoutButton: {
      backgroundColor: '#b91c1c',
    },
    logoutButtonText: {
      color: '#ffffff',
    },
    fieldLabel: {
      color: colors.textSecondary,
    },
    themeOption: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148, 163, 184, 0.16)',
    },
    themeOptionSelected: {
      backgroundColor: isDark ? '#86efac' : '#166534',
    },
    themeOptionIcon: {
      color: isDark ? (themeCtx.themeMode === 'light' ? '#eab308' : colors.text) : (themeCtx.themeMode === 'light' ? '#eab308' : '#0f172a'),
    },
    themeOptionText: {
      color: colors.text,
    },
    themeOptionTextSelected: {
      color: isDark ? '#000000' : '#ffffff',
    },
    themeOptionCheck: {
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
  }), [colors, isDark, themeCtx.themeMode]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const profileByUser = await getStudentProfileByUserId(activeUserId);
        if (isMounted) {
          setProfile(profileByUser ?? null);
        }
        const onboardingSetting = await getSetting('show_home_tutorial');
        if (isMounted) {
          setShowOnboarding(onboardingSetting === 'true');
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
    setImporting(true);
    setMessage('');
    try {
      const result = await resetAndSeedLocalData();
      if (result.alreadyImported) {
        setMessage(`Resources already imported. Found ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info, ${result.lessonInfo} lesson info, ${result.lessonLink} lesson links, ${result.questionInstruct} question instructions, ${result.questionContent} questions, ${result.questionChoice} choices, ${result.jobSheet} job sheets, ${result.performanceCheck} performance checklists, ${result.lessonAchievement} lesson achievements, and ${result.moduleAchievement} module achievements.`);
      } else {
        setMessage(`Import successful. Loaded ${result.competencies} competencies, ${result.modules} modules, ${result.lessons} lessons, ${result.lessonContents} lesson contents, ${result.contentInfo} content info, ${result.lessonInfo} lesson info, ${result.lessonLink} lesson links, ${result.questionInstruct} question instructions, ${result.questionContent} questions, ${result.questionChoice} choices, ${result.jobSheet} job sheets, ${result.performanceCheck} performance checklists, ${result.lessonAchievement} lesson achievements, and ${result.moduleAchievement} module achievements.`);
      }
    } catch (importError) {
      setMessage('Failed to import resources. Please try again.');
      if (importError instanceof Error) {
        showAlert('Import failed', importError.message);
      }
    } finally {
      setImporting(false);
    }
  };

  const handleOnboardingToggle = async (value: boolean) => {
    setShowOnboarding(value);
    await setSetting('show_home_tutorial', value ? 'true' : 'false');
    if (value) {
      try {
        const existing = await getStudentTutorialByUserId(activeUserId);
        if (existing) {
          await updateStudentTutorial(existing.tutorial_id, { completed: 0 });
        } else {
          await createStudentTutorial({ user_id: activeUserId, completed: false });
        }
      } catch {
        // ignore
      }
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const data = await getStudentReportData(activeUserId);
      setReportData(data);
      await generateAndShareReport(data);
    } catch (exportError) {
      showAlert(
        'Export failed',
        exportError instanceof Error ? exportError.message : 'Unable to generate report. Please try again.',
      );
    } finally {
      setExporting(false);
    }
  };

  const generateAndShareReport = async (data: StudentReportData) => {
    if (!Print || !Sharing) {
      showAlert(
        'Export unavailable',
        'PDF export requires expo-print and expo-sharing modules. Please rebuild the app after installing new dependencies: npx expo prebuild && npx expo run:android (or ios)',
      );
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const studentName = data.studentInfo
      ? [data.studentInfo.first_name, data.studentInfo.middle_name, data.studentInfo.last_name].filter(Boolean).join(' ')
      : 'Student';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Student Report - ${studentName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 24px; color: #1f2937; }
          h1 { font-size: 22px; margin-bottom: 4px; color: #111827; }
          h2 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
          .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f3f4f6; font-weight: 600; }
          tr:nth-child(even) { background: #f9fafb; }
          .meta { margin-bottom: 16px; }
          .meta-item { margin-bottom: 4px; font-size: 13px; }
          .meta-label { font-weight: 600; color: #4b5563; }
          .empty { color: #9ca3af; font-style: italic; }
          .record { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; font-size: 12px; background: #ffffff; }
          .record-title { font-weight: 600; color: #374151; margin-bottom: 2px; }
          .record-sub { color: #6b7280; margin-bottom: 4px; font-size: 11px; }
          .record-meta { display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
          .chart-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 16px; background: #ffffff; }
          .chart-bar-row { display: flex; align-items: flex-end; gap: 4px; height: 120px; margin-top: 8px; }
          .chart-bar { flex: 1; min-width: 12px; background: #2563eb; border-radius: 3px 3px 0 0; position: relative; min-height: 2px; }
          .chart-bar-label { position: absolute; bottom: -16px; left: 0; right: 0; text-align: center; font-size: 10px; color: #6b7280; transform: rotate(-35deg); transform-origin: left; white-space: nowrap; }
          .chart-bar-value { position: absolute; top: -14px; left: 0; right: 0; text-align: center; font-size: 10px; color: #374151; font-weight: 600; }
          .chart-day-label { position: absolute; bottom: -16px; left: 0; right: 0; text-align: center; font-size: 10px; color: #6b7280; }
          .module-progress-item { margin-bottom: 8px; }
          .module-progress-label { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 12px; font-weight: 600; }
          .module-progress-bar-container { width: 100%; height: 14px; background: #f3f4f6; border-radius: 7px; overflow: hidden; }
          .module-progress-bar { height: 100%; background: #2563eb; border-radius: 7px; }
          .module-group { margin-bottom: 16px; border-left: 3px solid #2563eb; padding-left: 12px; }
          .module-group-title { font-size: 13px; font-weight: 700; color: #1e40af; margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <h1>Student Report</h1>
        <div class="subtitle">Generated on ${now.toLocaleString()} | ${data.user?.username || '-'} (${data.user?.email || '-'})</div>

        <h2>Student Information</h2>
        ${data.studentInfo ? `
          <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px;">
            ${data.studentInfo.student_image ? `
              <img src="${data.studentInfo.student_image}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;" />
            ` : `
              <div style="width: 80px; height: 80px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; border: 2px solid #e5e7eb;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#9ca3af" stroke="#6b7280" stroke-width="2"/>
                  <path d="M20.59 20C20.59 20 16.73 23 12 23C7.27 23 3.41 20 3.41 20C3.41 17.95 4.99 16.11 7.76 15.33C6.68 14.49 6 13.32 6 12C6 10.9 6.31 9.88 6.87 9.05C5.12 8.36 4 6.82 4 5.11C4 3.48 5.34 2 7 2H21C22.66 2 24 3.48 24 5.11C24 6.82 22.88 8.36 22.13 9.05C22.69 9.88 23 10.9 23 12C23 13.32 22.32 14.49 21.24 15.33C24 16.11 24 17.95 20.59 20Z" fill="#9ca3af" stroke="#6b7280" stroke-width="2"/>
                </svg>
              </div>
            `}
            <div class="meta">
              <div class="meta-item"><span class="meta-label">Name:</span> ${data.studentInfo.first_name} ${data.studentInfo.middle_name || ''} ${data.studentInfo.last_name}</div>
              <div class="meta-item"><span class="meta-label">Grade Level:</span> ${data.studentInfo.grade_level}</div>
              <div class="meta-item"><span class="meta-label">Address:</span> ${data.studentInfo.home_address}</div>
              <div class="meta-item"><span class="meta-label">Email:</span> ${data.user?.email || '-'}</div>
              <div class="meta-item"><span class="meta-label">Birthdate:</span> ${data.studentInfo.birthdate}</div>
              <div class="meta-item"><span class="meta-label">Created:</span> ${new Date(data.studentInfo.created_at).toLocaleString()}</div>
              <div class="meta-item"><span class="meta-label">Updated:</span> ${new Date(data.studentInfo.updated_at).toLocaleString()}</div>
            </div>
          </div>
        ` : '<p class="empty">No student profile found.</p>'}

       <h2>Weekly Activity</h2>
      ${data.weeklyActivity.length === 7 && data.weeklyActivity.every((v) => v === 0) ? `
        <p class="empty">No activity recorded this week.</p>
      ` : `
        <div class="chart-box">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Weekly Activity (Questions, Job Sheets, Performance Tasks, Progress & Achievements)</div>
          <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="xMidYMid meet">
            <polyline fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"
              points="${data.weeklyActivity.map((count, i) => {
                const x = 30 + (i * (440 / 6));
                const maxCount = Math.max(...data.weeklyActivity, 1);
                const y = 130 - (count / maxCount) * 100;
                return `${x},${y}`;
              }).join(' ')}">
              <animate attributeName="stroke-dasharray" values="0 1000;1000 0" dur="1s" fill="freeze" />
            </polyline>
            ${data.weeklyActivity.map((count, i) => {
              const x = 30 + (i * (440 / 6));
              const maxCount = Math.max(...data.weeklyActivity, 1);
              const y = 130 - (count / maxCount) * 100;
              return `
                <circle cx="${x}" cy="${y}" r="3.5" fill="#2563eb" />
                <text x="${x}" y="145" text-anchor="middle" font-size="10" fill="#6b7280">
                  ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </text>
                ${count > 0 ? `<text x="${x}" y="${y - 10}" text-anchor="middle" font-size="9" fill="#374151" font-weight="600">${count}</text>` : ''}
              `;
            }).join('')}
            <line x1="30" y1="130" x2="470" y2="130" stroke="#d1d5db" stroke-width="1" />
          </svg>
        </div>
      `}

      <h2>Module Completion Overview</h2>
      ${data.moduleProgress.length > 0 ? `
        <div class="chart-box">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">Overall module progress</div>
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <svg width="140" height="140" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet">
              ${(() => {
                const totalItems = data.moduleProgress.length;
                const radius = 55;
                const centerX = 70;
                const centerY = 70;
                let offset = 0;
                let totalPct = 0;

                const slices = data.moduleProgress.map((m, i) => {
                  const pct = m.total > 0 ? (m.completed / m.total) : 0;
                  totalPct += pct;
                  if (pct === 0) {
                    return '';
                  }
                  const startAngle = (offset / totalItems) * 2 * Math.PI;
                  const endAngle = ((offset + pct) / totalItems) * 2 * Math.PI;
                  const x1 = centerX + radius * Math.sin(startAngle);
                  const y1 = centerY - radius * Math.cos(startAngle);
                  const x2 = centerX + radius * Math.sin(endAngle);
                  const y2 = centerY - radius * Math.cos(endAngle);
                  const largeArc = pct > 0.5 ? 1 : 0;
                  offset += pct;
                  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a3', '#f97316'];
                  const color = colors[i % colors.length];
                  return `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}" stroke="#ffffff" stroke-width="0.5"/>`;
                }).join('');
                return slices;
              })()}
              <circle cx="70" cy="70" r="30" fill="#f9fafb" />
              <text x="70" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="#111827" dy="0.3">
                ${Math.round(data.moduleProgress.reduce((s, m) => s + (m.total > 0 ? (m.completed / m.total) * 100 : 0), 0) / data.moduleProgress.length)}%
              </text>
            </svg>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${data.moduleProgress.map((m, i) => {
                const pct = m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0;
                const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a3', '#f97316'];
                const color = colors[i % colors.length];
                return `
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 11px;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>
                    <span style="font-weight: 600; min-width: 120px;">${m.module_name}</span>
                    <span style="color: #6b7280;">${pct}% (${m.completed}/${m.total})</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : '<p class="empty">No module data available.</p>'}

      ${(() => {
        const allModuleIds = data.allModules.map((m) => m.module_id);
        const lessonContentMap = new Map(data.allLessonContents.map((c) => [c.lesson_content_id, c]));
        const lessonMap = new Map(data.allLessons.map((l) => [l.lesson_id, l]));

        const getContentModuleId = (lessonContentId: number) => {
          const lc = lessonContentMap.get(lessonContentId);
          if (!lc) return null;
          const lesson = lessonMap.get(lc.lesson_id);
          return lesson ? lesson.module_id : null;
        };

        const getModuleInfo = (moduleId: number | null) => {
          if (moduleId == null) return { module_id: null, module_name: 'Unassigned' };
          const mod = data.allModules.find((m) => m.module_id === moduleId);
          return mod ? { module_id: moduleId, module_name: mod.module_name } : { module_id: moduleId, module_name: `Module #${moduleId}` };
        };

        const moduleIds = ['__unassigned__', ...allModuleIds];

        return moduleIds.map((rawModuleId) => {
          const moduleKey = String(rawModuleId);
          const isUnassigned = rawModuleId === '__unassigned__';

          const qaAnswers = data.questionAnswers.filter((a) => {
            if (isUnassigned) return a.module_id == null;
            return a.module_id === rawModuleId;
          });
          const jsAnswers = data.jobSheetAnswers.filter((a) => {
            if (isUnassigned) return a.module_id == null;
            return a.module_id === rawModuleId;
          });
          const perfAnswers = data.performanceAnswers.filter((a) => {
            if (isUnassigned) return a.module_id == null;
            return a.module_id === rawModuleId;
          });
          const lcpRecords = data.lessonContentProgress.filter((p) => {
            const modId = getContentModuleId(p.lesson_content_id);
            if (isUnassigned) return modId == null;
            return modId === rawModuleId;
          });
          const lcbRecords = data.lessonContentBookmarks.filter((b) => {
            const modId = getContentModuleId(b.lesson_content_id);
            if (isUnassigned) return modId == null;
            return modId === rawModuleId;
          });
          const lessonAchievements = data.studentLessonAchievements.filter((a) => {
            if (isUnassigned) return a.module_id == null;
            return a.module_id === rawModuleId;
          });
          const moduleAchievements = data.studentModuleAchievements.filter((a) => {
            if (isUnassigned) return a.module_id == null;
            return a.module_id === rawModuleId;
          });

          const totalRecords = qaAnswers.length + jsAnswers.length + perfAnswers.length + lcpRecords.length + lcbRecords.length + lessonAchievements.length + moduleAchievements.length;
          if (totalRecords === 0) return '';

          const moduleName = isUnassigned ? 'Unassigned' : getModuleInfo(rawModuleId as number).module_name;

          const progressReport = data.moduleProgress.find((m) => m.module_id === rawModuleId);
          const exerciseCount = qaAnswers.length;
          const jobSheetCount = jsAnswers.length;
          const perfCount = perfAnswers.length;
          const totalExercises = exerciseCount;
          const totalJobSheets = jobSheetCount;
          const totalPerf = perfCount;

          const exerciseRate = totalExercises > 0 ? 100 : 0;
          const jobSheetRate = totalJobSheets > 0 ? 100 : 0;
          const perfRate = totalPerf > 0 ? 100 : 0;

          const participationScores = [
            { label: 'Exercises', value: exerciseRate },
            { label: 'Job Sheets', value: jobSheetRate },
            { label: 'Performance Tasks', value: perfRate },
          ];
          const avgParticipation = Math.round((exerciseRate + jobSheetRate + perfRate) / 3);

          const getProgressColor = (pct: number) => {
            if (pct >= 75) return '#10b981';
            if (pct >= 50) return '#f59e0b';
            if (pct >= 25) return '#f97316';
            return '#ef4444';
          };

          const hasLowParticipation = avgParticipation < 75;

          return `
            <div style="page-break-before: always;">
              <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin-bottom: 4px;">${moduleName}</h2>

              <h3 style="font-size: 13px; color: #374151; margin: 14px 0 8px 0;">Module Participation</h3>
              <div style="margin-bottom: 6px; font-size: 11px; color: #6b7280; font-weight: 600;">
                Exercises / Questions Completion Rate
              </div>
              <div class="module-progress-bar-container">
                <div class="module-progress-bar" style="width: ${exerciseRate}%; background: ${getProgressColor(exerciseRate)};"></div>
              </div>
              <div style="margin-bottom: 10px; font-size: 10px; color: #9ca3af;">
                ${exerciseCount} answer${exerciseCount !== 1 ? 's' : ''} recorded
              </div>

              <div style="margin-bottom: 6px; font-size: 11px; color: #6b7280; font-weight: 600;">
                Job Sheets Completion Rate
              </div>
              <div class="module-progress-bar-container">
                <div class="module-progress-bar" style="width: ${jobSheetRate}%; background: ${getProgressColor(jobSheetRate)};"></div>
              </div>
              <div style="margin-bottom: 10px; font-size: 10px; color: #9ca3af;">
                ${jobSheetCount} answer${jobSheetCount !== 1 ? 's' : ''} recorded
              </div>

              <div style="margin-bottom: 6px; font-size: 11px; color: #6b7280; font-weight: 600;">
                Performance Tasks Completion Rate
              </div>
              <div class="module-progress-bar-container">
                <div class="module-progress-bar" style="width: ${perfRate}%; background: ${getProgressColor(perfRate)};"></div>
              </div>
              <div style="margin-bottom: 10px; font-size: 10px; color: #9ca3af;">
                ${perfCount} answer${perfCount !== 1 ? 's' : ''} recorded
              </div>

              <div style="display: flex; align-items: center; gap: 10px; margin-top: 12px; padding: 8px 12px; border-radius: 8px; background: ${hasLowParticipation ? '#fef2f2' : '#f0fdf4'};">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M9 16H15M9 8H15M21 12C21 17.5228 17.5228 21 12 21C6.47715 21 2 16.5228 2 12C2 7.47715 6.47715 3 12 3C17.5228 3 21 7.47715 21 12ZM12 7V13L16 15L17 14L13 11V7Z" fill="${hasLowParticipation ? '#ef4444' : '#16a34a'}" stroke="${hasLowParticipation ? '#ef4444' : '#16a34a'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span style="font-size: 12px; font-weight: 600; color: ${hasLowParticipation ? '#991b26' : '#16a34a'};">
                  Module Participation Score: <strong style="color: ${hasLowParticipation ? '#ef4444' : '#16a34a'};">${avgParticipation}%</strong>
                  ${hasLowParticipation ? '<span style="color: #ef4444; margin-left: 8px;">(Low participation in some categories - review required)</span>' : ''}
                </span>
              </div>
            </div>

            <h3 style="font-size: 13px; color: #374151; margin: 16px 0 8px 0;">Student Records</h3>

            ${qaAnswers.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Exercises / Questions (${qaAnswers.length})</div>
                ${qaAnswers.map(a => `
                  <div class="record">
                    <div class="record-title">${a.question_text || 'Question'}</div>
                    <div class="record-sub">${a.answer_text}</div>
                    <div class="record-meta"><span>Module: ${moduleName}</span><span>${new Date(a.created_at).toLocaleString()}</span></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${jsAnswers.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Job Sheet Answers (${jsAnswers.length})</div>
                ${jsAnswers.map(a => `
                  <div class="record">
                    <div class="record-title">${a.job_title || 'Job Sheet'}</div>
                    <div class="record-sub">${a.answer_text}</div>
                    <div class="record-meta"><span>Score: ${a.score ?? 0}/100</span><span>${new Date(a.created_at).toLocaleString()}</span></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${perfAnswers.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Performance Answers (${perfAnswers.length})</div>
                ${perfAnswers.map(a => `
                  <div class="record">
                    <div class="record-title">${a.performance_question || 'Performance Task'}</div>
                    <div class="record-sub">${a.performance_answer_text}</div>
                    <div class="record-meta"><span>Module: ${moduleName}</span><span>${new Date(a.created_at).toLocaleString()}</span></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${lcpRecords.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Lesson Content Progress (${lcpRecords.length})</div>
                ${lcpRecords.map(p => {
                  const lessonLabel = (p.lesson_name && p.lesson_name !== 'null') ? p.lesson_name : 'Lesson Content';
                  const contentLabel = (p.content_name && p.content_name !== 'null') ? p.content_name : 'Content';
                  return `
                    <div class="record">
                      <div class="record-title">${lessonLabel} — ${contentLabel}</div>
                      <div class="record-sub">${p.is_read ? '✓ Marked as read' : '✗ Not yet read'} ${p.read_at ? `| Read at: ${new Date(p.read_at).toLocaleString()}` : ''}</div>
                      <div class="record-meta"><span>${new Date(p.created_at).toLocaleString()}</span></div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

            ${lcbRecords.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Bookmarks (${lcbRecords.length})</div>
                ${lcbRecords.map(b => {
                  const lessonLabel = (b.lesson_name && b.lesson_name !== 'null') ? b.lesson_name : 'Lesson Content';
                  const contentLabel = (b.content_name && b.content_name !== 'null') ? b.content_name : 'Content';
                  return `
                    <div class="record">
                      <div class="record-title">${lessonLabel} — ${contentLabel}</div>
                      <div class="record-sub">${b.is_bookmark ? '✓ Bookmarked' : '✗ Unbookmarked'}</div>
                      <div class="record-meta"><span>${new Date(b.created_at).toLocaleString()}</span></div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

            ${lessonAchievements.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Lesson Achievements (${lessonAchievements.length})</div>
                ${lessonAchievements.map(a => `
                  <div class="record">
                    <div class="record-title">${a.achievement_name || 'Lesson Achievement'}</div>
                    <div class="record-meta"><span>${new Date(a.created_at).toLocaleString()}</span></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${moduleAchievements.length > 0 ? `
              <div class="module-group">
                <div class="module-group-title">Module Achievements (${moduleAchievements.length})</div>
                ${moduleAchievements.map(a => `
                  <div class="record">
                    <div class="record-title">${a.achievement_name || 'Module Achievement'}</div>
                    <div class="record-meta"><span>${new Date(a.created_at).toLocaleString()}</span></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          `;
        }).join('');
      })()}
       </body>
       </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Student Report - ${studentName}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (printError) {
      showAlert(
        'Export failed',
        'Unable to generate PDF. Please rebuild the app after installing new dependencies: npx expo prebuild && npx expo run:android (or ios)',
      );
    }
  };

  const profileDisplayName = profile
    ? [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ')
    : 'Create a student profile';

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Settings" />
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
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>No profile exists yet. Tap the button to insert your student information.</ThemedText>
          )}
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="cloud-download-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Device data
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Offline resources
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Manage offline resources stored on this device.</ThemedText>

          <View style={[styles.actionCard, dynamicStyles.actionCard]}>
            <View style={styles.actionHeader}>
              <View style={styles.actionTextWrap}>
                <ThemedText type="subtitle" style={[styles.actionTitle, dynamicStyles.actionTitle]}>
                  Import offline resources
                </ThemedText>
                <ThemedText style={[styles.actionDescription, dynamicStyles.actionDescription]}>
                   Replace the current local competency, module, lesson, lesson-content, content-info, lesson-info, lesson-link, question-instruct, question-content, question-choice, job-sheet, and performance-checklist data with the default offline dataset.
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={handleImportResources}
              disabled={importing}
              style={[styles.primaryButton, dynamicStyles.primaryButton, importing && styles.primaryButtonDisabled]}>
              <Ionicons name="download-outline" size={18} color={isDark ? '#000000' : '#0f172a'} />
              <ThemedText style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>{importing ? 'Importing...' : 'Import resources'}</ThemedText>
            </Pressable>

            {message ? (
              <View
                style={[
                  styles.statusBox,
                  message.includes('Failed')
                    ? dynamicStyles.statusBoxError
                    : dynamicStyles.statusBoxSuccess,
                ]}>
                <ThemedText
                  style={[
                    styles.statusText,
                    message.includes('Failed') ? dynamicStyles.statusTextError : dynamicStyles.statusTextSuccess,
                  ]}>
                  {message}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="bookmark-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Bookmarks
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Bookmarked lesson content
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Jump back to bookmarked lesson content.
          </ThemedText>

          {bookmarksLoading ? (
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Loading bookmarks...</ThemedText>
          ) : bookmarks.length > 0 ? (
            <View style={[styles.bookmarkList, dynamicStyles.bookmarkList]}>
              {bookmarks.map((item) => (
                  <View key={item.bookmark.lesson_content_bookmark_id} style={[styles.bookmarkRow, dynamicStyles.bookmarkRow]}>
                  <View style={styles.bookmarkTextGroup}>
                    <ThemedText style={[styles.bookmarkContentName, dynamicStyles.bookmarkContentName]}>
                      {item.content?.content_name || 'Unknown content'}
                    </ThemedText>
                    {item.lesson ? (
                      <ThemedText style={[styles.bookmarkLessonName, dynamicStyles.bookmarkLessonName]}>
                        {item.lesson.lesson_name}
                      </ThemedText>
                    ) : null}
                    {item.module ? (
                      <ThemedText style={[styles.bookmarkModuleName, dynamicStyles.bookmarkModuleName]}>
                        {item.module.module_name}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => navigateToBookmark(item.bookmark)}
                    style={[styles.bookmarkOpenButton, dynamicStyles.bookmarkOpenButton]}
                  >
                    <ThemedText style={[styles.bookmarkOpenButtonText, dynamicStyles.bookmarkOpenButtonText]}>Open</ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : bookmarksLoaded ? (
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>No bookmarks yet. Bookmark lesson content from the content info page.</ThemedText>
          ) : null}
         </View>

         <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
           <View style={styles.sectionHeader}>
             <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
               <Ionicons name="document-text-outline" size={18} color={colors.text} />
             </View>
             <View style={styles.sectionHeaderText}>
               <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                 Reports
               </ThemedText>
               <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                 Export student report
               </ThemedText>
             </View>
           </View>
           <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>
             Download a PDF report containing your student profile, answers, progress, bookmarks, and achievements.
           </ThemedText>

           <Pressable
             onPress={handleExportReport}
             disabled={exporting}
             style={[styles.primaryButton, dynamicStyles.primaryButton, exporting && styles.primaryButtonDisabled]}>
             <Ionicons name="download-outline" size={18} color={isDark ? '#000000' : '#0f172a'} />
             <ThemedText style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>{exporting ? 'Generating report...' : 'Export student report'}</ThemedText>
           </Pressable>
         </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                About
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Agricultural Production Learning
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            This application provides interactive learning modules for agricultural production, covering competencies, lessons, lesson content, exercises, job sheets, and performance checklists to support student learning and assessment.
          </ThemedText>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Developed for agricultural education and practical skill development in the field.
          </ThemedText>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Proposed by the student as a capstone project for the Bachelor of Science in Education, Major in Information and Communications Technology (ICT).
          </ThemedText>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="cube-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                App info
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Version
              </ThemedText>
            </View>
          </View>
          <View style={[styles.profileContainer, dynamicStyles.profileContainer]}>
            <ProfileRow label="App Name" value="AgriLearn Student" />
            <ProfileRow label="Version" value={appVersion} />
            <ProfileRow label="Description" value="Agricultural production learning platform" />
</View>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="school-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Onboarding
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Tutorial Guide
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Show the tutorial guide on the home page after login to help new students learn the app.</ThemedText>

          <Pressable
            onPress={() => handleOnboardingToggle(!showOnboarding)}
            style={[
              styles.primaryButton,
              dynamicStyles.primaryButton,
              showOnboarding && styles.primaryButtonActive,
            ]}>
            <Ionicons name={showOnboarding ? 'checkmark-circle-outline' : 'checkmark-circle'} size={18} color="#ffffff" />
            <ThemedText style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>{showOnboarding ? 'Enabled' : 'Disabled'}</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="moon-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Appearance
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Dark mode
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Choose how the app appearance adapts to light or dark mode.</ThemedText>

          <View style={styles.themeOptionGroup}>
            <ThemeOption
              label="Light"
              icon="sunny-outline"
              value="light"
              selected={themeCtx.themeMode === 'light'}
              onPress={() => themeCtx.setThemeMode('light')}
              isDark={isDark}
            />
            <ThemeOption
              label="Dark"
              icon="moon-outline"
              value="dark"
              selected={themeCtx.themeMode === 'dark'}
              onPress={() => themeCtx.setThemeMode('dark')}
              isDark={isDark}
            />
            <ThemeOption
              label="System"
               icon="contrast-outline"
              value="system"
              selected={themeCtx.themeMode === 'system'}
              onPress={() => themeCtx.setThemeMode('system')}
              isDark={isDark}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="log-out-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Session
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Logout
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>Logout from your current student account on this device.</ThemedText>

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            style={[styles.logoutButton, dynamicStyles.logoutButton, loggingOut && styles.logoutButtonDisabled]}>
            <Ionicons name="exit-outline" size={18} color="#ffffff" />
            <ThemedText style={[styles.logoutButtonText, dynamicStyles.logoutButtonText]}>{loggingOut ? 'Logging out...' : 'Logout'}</ThemedText>
          </Pressable>
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

      <BottomNavbar activeTab="settings" userId={activeUserId} />
    </ThemedView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';
  return (
    <View style={styles.profileRow}>
      <ThemedText type="code" style={[styles.profileLabel, { color: isDark ? theme.textSecondary : '#64748b' }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.profileValue, { color: theme.text }]}>{value}</ThemedText>
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
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';
  return (
    <View style={styles.dateAdjuster}>
      <ThemedText style={[styles.fieldLabel, { color: isDark ? theme.textSecondary : '#64748b' }]}>
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

function ThemeOption({ label, icon, value, selected, onPress, isDark }: {
  label: string;
  icon: string;
  value: string;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
}) {
  const theme = useTheme();
  const selectedBg = isDark ? '#86efac' : '#166534';
  const selectedText = isDark ? '#000000' : '#ffffff';
  const inactiveText = isDark ? theme.text : '#0f172a';
  const inactiveIcon = isDark ? theme.textSecondary : '#0f172a';
  return (
    <Pressable onPress={onPress} style={[styles.themeOption, selected && styles.themeOptionSelected, {
      backgroundColor: selected ? selectedBg : theme.backgroundElement,
      borderColor: selected ? selectedBg : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148, 163, 184, 0.16)'),
    }]}>
      <Ionicons name={icon as any} size={20} color={selected ? selectedText : inactiveIcon} />
      <ThemedText style={[
        styles.themeOptionText,
        selected && styles.themeOptionTextSelected,
        { color: selected ? selectedText : inactiveText },
      ]}>{label}</ThemedText>
      {selected ? <View style={[styles.themeOptionCheck, { backgroundColor: selectedText }]}><Ionicons name="checkmark" size={12} color={selected ? selectedBg : theme.text} /></View> : null}
    </Pressable>
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
  primaryButtonActive: {
    backgroundColor: '#3db708',
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
  themeOptionGroup: {
    gap: 8,
    marginTop: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    backgroundColor: '#ffffff',
  },
  themeOptionSelected: {
    backgroundColor: '#166534',
    borderColor: '#166534',
  },
  themeOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  themeOptionTextSelected: {
    color: '#ffffff',
  },
  themeOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
