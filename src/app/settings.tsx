import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCustomAlert } from '@/lib/custom-alert';
import { useThemeContext } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/use-theme';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { InfoRow } from '@/components/info-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { resetAndSeedLocalData, getStudentReportData, StudentReportData, getSetting, setSetting, getStudentTutorialByUserId, updateStudentTutorial, createStudentTutorial } from '@/lib/auth-api';

let Print: any;
let Sharing: any;
try {
  Print = require('expo-print');
  Sharing = require('expo-sharing');
} catch {
  Print = null;
  Sharing = null;
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

  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState<StudentReportData | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const { showAlert } = useCustomAlert();
  const themeCtx = useThemeContext();
  const colors = useTheme();
  const isDark = colors.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    heroTitle: {
      color: '#ffffff',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.8)',
    },
    pageIntroTitle: {
      color: colors.text,
    },
    pageIntroText: {
      color: colors.textSecondary,
    },
    groupLabel: {
      color: colors.textSecondary,
    },
    sectionCard: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)',
    },
    sectionIconWrap: {
      backgroundColor: isDark ? 'rgba(91, 236, 19, 0.12)' : '#e7f8d5',
    },
    sectionIconWrapDanger: {
      backgroundColor: '#b91c1c',
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
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)',
    },
    primaryButton: {
      backgroundColor: isDark ? '#86efac' : '#55e10a',
    },
    primaryButtonText: {
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
    themeOption: {
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)',
    },
    themeOptionSelected: {
      backgroundColor: isDark ? '#86efac' : '#166534',
    },
  }), [colors, isDark]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const onboardingSetting = await getSetting('show_home_tutorial');
        if (isMounted) {
          setShowOnboarding(onboardingSetting === 'true');
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeUserId]);

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
          ${(() => {
            const chartLeft = 42;
            const chartRight = 478;
            const chartTop = 24;
            const chartBottom = 124;
            const steps = Math.max(data.weeklyActivity.length - 1, 1);
            const maxCount = Math.max(...data.weeklyActivity, 1);
            const niceMax = Math.max(Math.ceil(maxCount / 5) * 5, 5);
            const xAt = (i: number) => chartLeft + (i * ((chartRight - chartLeft) / steps));
            const yAt = (count: number) => chartBottom - ((count / niceMax) * (chartBottom - chartTop));
            const points = data.weeklyActivity.map((count, i) => `${xAt(i)},${yAt(count)}`);
            const linePoints = points.join(' ');
            const areaPath = `M ${chartLeft} ${chartBottom} L ${points.join(' L ')} L ${xAt(data.weeklyActivity.length - 1)} ${chartBottom} Z`;
            const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
              value: Math.round(niceMax * (1 - t)),
              y: chartBottom - t * (chartBottom - chartTop),
            }));
            return `
              <svg width="100%" height="170" viewBox="0 0 500 170" preserveAspectRatio="xMidYMid meet">
                ${ticks.map((tick) => `
                  <line x1="${chartLeft}" y1="${tick.y}" x2="${chartRight}" y2="${tick.y}" stroke="#e5e7eb" stroke-width="1" />
                  <text x="${chartLeft - 8}" y="${tick.y + 3}" text-anchor="end" font-size="9" fill="#6b7280">${tick.value}</text>
                `).join('')}
                <path d="${areaPath}" fill="#2563eb" fill-opacity="0.12" stroke="none" />
                <polyline fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${linePoints}" />
                ${data.weeklyActivity.map((count, i) => {
                  const x = xAt(i);
                  const y = yAt(count);
                  return `
                    <circle cx="${x}" cy="${y}" r="3.5" fill="#2563eb" stroke="#ffffff" stroke-width="1" />
                    <text x="${x}" y="${chartBottom + 14}" text-anchor="middle" font-size="10" fill="#6b7280">
                      ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] ?? ''}
                    </text>
                    <text x="${x}" y="${y - 8}" text-anchor="middle" font-size="9" fill="#374151" font-weight="600">${count}</text>
                  `;
                }).join('')}
                <line x1="${chartLeft}" y1="${chartTop}" x2="${chartLeft}" y2="${chartBottom}" stroke="#9ca3af" stroke-width="1" />
                <line x1="${chartLeft}" y1="${chartBottom}" x2="${chartRight}" y2="${chartBottom}" stroke="#9ca3af" stroke-width="1" />
                <text x="${(chartLeft + chartRight) / 2}" y="164" text-anchor="middle" font-size="9" fill="#6b7280">Day of Week</text>
                <text x="12" y="${(chartTop + chartBottom) / 2}" text-anchor="middle" font-size="9" fill="#6b7280" transform="rotate(-90 12 ${(chartTop + chartBottom) / 2})">Total Progress</text>
              </svg>
            `;
          })()}
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

            ${(() => {
              type AnswerGroup = {
                lesson_content_id: number | null;
                lesson_name: string | null;
                content_name: string | null;
                exercises: any[];
                jobSheets: any[];
                performance: any[];
              };

              const groupMap = new Map<string, AnswerGroup>();

              const pushAnswer = (bucket: 'exercises' | 'jobSheets' | 'performance') => (a: any) => {
                const lessonContentId = a.lesson_content_id ?? null;
                const key = lessonContentId == null ? 'none' : `lc-${lessonContentId}`;
                let group = groupMap.get(key);
                if (!group) {
                  group = {
                    lesson_content_id: lessonContentId,
                    lesson_name: a.lesson_name ?? null,
                    content_name: a.content_name ?? null,
                    exercises: [],
                    jobSheets: [],
                    performance: [],
                  };
                  groupMap.set(key, group);
                }
                group[bucket].push(a);
              };

              qaAnswers.forEach(pushAnswer('exercises'));
              jsAnswers.forEach(pushAnswer('jobSheets'));
              perfAnswers.forEach(pushAnswer('performance'));

              const groups = Array.from(groupMap.values()).sort((a, b) => (a.lesson_content_id ?? 0) - (b.lesson_content_id ?? 0));
              if (groups.length === 0) return '';

              return groups.map((group) => {
                const total = group.exercises.length + group.jobSheets.length + group.performance.length;
                const lessonLabel = group.lesson_name && group.lesson_name !== 'null' ? group.lesson_name : 'Unlinked Lesson';
                const contentLabel = group.content_name && group.content_name !== 'null' ? group.content_name : 'Unlinked Lesson Content';
                return `
                  <div class="module-group" style="page-break-inside: avoid;">
                    <div class="module-group-title">${lessonLabel} — ${contentLabel}</div>
                    <div class="record-sub" style="margin-bottom: 8px;">
                      Lesson Content ID: ${group.lesson_content_id == null ? 'n/a' : group.lesson_content_id} | Total Answers: ${total}
                    </div>

                    ${group.exercises.length > 0 ? `
                      <div style="font-size: 11px; font-weight: 700; color: #374151; margin: 6px 0 4px 0;">Exercise Answers (${group.exercises.length})</div>
                      ${group.exercises.map((item) => `
                        <div class="record">
                          <div class="record-title">${item.question_text || 'Question'}</div>
                          <div class="record-sub">${item.answer_text}</div>
                          <div class="record-meta"><span>Exercise</span><span>${new Date(item.created_at).toLocaleString()}</span></div>
                        </div>
                      `).join('')}
                    ` : ''}

                    ${group.jobSheets.length > 0 ? `
                      <div style="font-size: 11px; font-weight: 700; color: #374151; margin: 8px 0 4px 0;">Job Sheet Answers (${group.jobSheets.length})</div>
                      ${group.jobSheets.map((item) => `
                        <div class="record">
                          <div class="record-title">${item.job_title || 'Job Sheet'}</div>
                          <div class="record-sub">${item.answer_text}</div>
                          <div class="record-meta"><span>Job Sheet | Score: ${item.score ?? 0}/100</span><span>${new Date(item.created_at).toLocaleString()}</span></div>
                        </div>
                      `).join('')}
                    ` : ''}

                    ${group.performance.length > 0 ? `
                      <div style="font-size: 11px; font-weight: 700; color: #374151; margin: 8px 0 4px 0;">Performance Answers (${group.performance.length})</div>
                      ${group.performance.map((item) => `
                        <div class="record">
                          <div class="record-title">${item.performance_question || 'Performance Task'}</div>
                          <div class="record-sub">${item.performance_answer_text}</div>
                          <div class="record-meta"><span>Performance Task</span><span>${new Date(item.created_at).toLocaleString()}</span></div>
                        </div>
                      `).join('')}
                    ` : ''}
                  </div>
                `;
              }).join('');
            })()}

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

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={require('@/assets/images/setting_image.jpeg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, dynamicStyles.heroTitle]}>Settings</Text>
            <Text style={[styles.heroSubtitle, dynamicStyles.heroSubtitle]}>
              Everything on this page runs entirely on this device. Use Learning data to import the
              offline module content or export your progress as a PDF report, Preferences to tune the
              tutorial and light or dark appearance, and Session to sign out when you are done.
            </Text>
          </View>
        </View>

        <Text style={[styles.groupLabel, dynamicStyles.groupLabel]}>Learning data</Text>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="cloud-download-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>Offline resources</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Import module content</Text>
            </View>
          </View>
          <Text style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Downloads the default competencies, modules, lessons, exercises, job sheets and
            performance checklists onto this device for offline study.
          </Text>

          <Pressable
            onPress={handleImportResources}
            disabled={importing}
            style={({ pressed }) => [
              styles.primaryButton,
              dynamicStyles.primaryButton,
              importing && styles.primaryButtonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <Ionicons name="download-outline" size={18} color={isDark ? '#000000' : '#0f172a'} />
            <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
              {importing ? 'Importing...' : 'Import resources'}
            </Text>
          </Pressable>

          {message ? (
            <View
              style={[
                styles.statusBox,
                message.includes('Failed')
                  ? dynamicStyles.statusBoxError
                  : dynamicStyles.statusBoxSuccess,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  message.includes('Failed')
                    ? dynamicStyles.statusTextError
                    : dynamicStyles.statusTextSuccess,
                ]}>
                {message}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="document-text-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>Reports</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Export student report</Text>
            </View>
          </View>
          <Text style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Generates a PDF of your profile, answers, progress and achievements, then opens the share
            sheet so you can save or send it.
          </Text>

          <Pressable
            onPress={handleExportReport}
            disabled={exporting}
            style={({ pressed }) => [
              styles.primaryButton,
              dynamicStyles.primaryButton,
              exporting && styles.primaryButtonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <Ionicons name="share-outline" size={18} color={isDark ? '#000000' : '#0f172a'} />
            <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
              {exporting ? 'Generating report...' : 'Export student report'}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.groupLabel, dynamicStyles.groupLabel]}>Preferences</Text>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="school-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>Onboarding</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Tutorial guide</Text>
            </View>
          </View>
          <Text style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Show the step-by-step tutorial on the home page. Turning it on also restarts the guide
            from the beginning.
          </Text>

          <Pressable
            onPress={() => handleOnboardingToggle(!showOnboarding)}
            style={({ pressed }) => [
              styles.primaryButton,
              dynamicStyles.primaryButton,
              showOnboarding && styles.primaryButtonActive,
              pressed && styles.buttonPressed,
            ]}>
            <Ionicons
              name={showOnboarding ? 'checkmark-circle' : 'close-circle-outline'}
              size={18}
              color={isDark ? '#000000' : '#0f172a'}
            />
            <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
              {showOnboarding ? 'Enabled' : 'Disabled'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="contrast-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>Appearance</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Light or dark mode</Text>
            </View>
          </View>
          <Text style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Follow the device setting, or force light or dark for the whole app.
          </Text>

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

        <Text style={[styles.groupLabel, dynamicStyles.groupLabel]}>About</Text>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>Overview</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Agricultural Production Learning
              </Text>
            </View>
          </View>
          <Text style={[styles.sectionBody, dynamicStyles.sectionBody]}>
            Interactive learning modules for agricultural production, covering competencies, lessons,
            lesson content, exercises, job sheets and performance checklists to support student
            learning and assessment in the field.
          </Text>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="cube-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>App info</Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Version</Text>
            </View>
          </View>
          <View style={[styles.profileContainer, dynamicStyles.profileContainer]}>
            <InfoRow label="App Name" value="AgriLearn Student" />
            <InfoRow label="Version" value={appVersion} />
            <InfoRow label="Description" value="Agricultural production learning platform" />
          </View>
        </View>
      </ScrollView>
      <BottomNavbar activeTab="settings" userId={activeUserId} />
    </ThemedView>
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
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  heroContainer: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    gap: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  groupLabel: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  sectionCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    padding: 16,
    borderRadius: 16,
    gap: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  sectionIconWrapDanger: {
    backgroundColor: '#b91c1c',
  },
  buttonPressed: {
    opacity: 0.75,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    backgroundColor: 'transparent',
    padding: 14,
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 13,
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
    borderColor: 'rgba(148, 163, 184, 0.18)',
    backgroundColor: 'transparent',
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
