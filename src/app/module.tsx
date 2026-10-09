import { useCallback, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { PreTestModal } from '@/components/pre-test';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { CompetencyRecord, ModuleRecord, listCompetencies, listModules, LessonRecord, LessonContentRecord, listLessons, listLessonContent, listLessonContentProgressByUser, LessonContentProgressRecord } from '@/lib/auth-api';

const moduleImages: Record<number, any> = {
  1: require('@/assets/learning_materials/modules/1/raise.jpeg'),
  2: require('@/assets/learning_materials/modules/2/vegetables.jpeg'),
  3: require('@/assets/learning_materials/modules/3/fertilizer.jpeg'),
  4: require('@/assets/learning_materials/modules/4/concoction.jpeg'),
};

const getModuleImage = (moduleId: number) => {
  return moduleImages[moduleId] ?? null;
};

const PRIMARY = '#5bec13';
const BACKGROUND_LIGHT = '#f6f8f6';

export default function ModuleScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [competencies, setCompetencies] = useState<CompetencyRecord[]>([]);
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [lessonContents, setLessonContents] = useState<LessonContentRecord[]>([]);
  const [lessonContentProgress, setLessonContentProgress] = useState<LessonContentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyRecord | null>(null);
  const [selectedModules, setSelectedModules] = useState<ModuleRecord[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [preTestModule, setPreTestModule] = useState<ModuleRecord | null>(null);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const theme = useTheme();
  const isDark = theme.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.backgroundElement,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.12)',
    },
    headerTitle: {
      color: theme.text,
    },
    headerIcon: {
      color: theme.text,
    },
    section: {
      marginTop: 20,
    },
    heroTitle: {
      color: '#ffffff',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.8)',
    },
    pageIntroTitle: {
      color: theme.text,
    },
    pageIntroText: {
      color: theme.textSecondary,
    },
    sectionCompact: {
      marginTop: 14,
      gap: 12,
    },
    card: {
      backgroundColor: theme.backgroundElement,
      shadowColor: isDark ? '#000000' : '#0f172a',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(148, 163, 184, 0.18)',
    },
    startButton: {
      borderColor: PRIMARY,
    },
    emptyState: {
      backgroundColor: theme.backgroundElement,
    },
    emptyStateText: {
      color: theme.textSecondary,
    },
    modalOverlay: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(2, 6, 23, 0.45)',
    },
    modalCard: {
      backgroundColor: theme.backgroundElement,
    },
    modalSection: {
      color: theme.text,
    },
    infoLabel: {
      color: theme.textSecondary,
    },
    infoValue: {
      color: theme.text,
    },
    moduleCard: {
      backgroundColor: theme.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(148, 163, 184, 0.2)',
    },
    cardTitle: {
      color: theme.text,
    },
    cardStatus: {
      color: theme.textSecondary,
    },
    cardStatusDivider: {
      color: theme.textSecondary,
    },
    cardChip: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.24)',
    },
    cardChipText: {
      color: theme.textSecondary,
    },
    cardThumbnail: {
      backgroundColor: isDark ? theme.backgroundSelected : '#e2e8f0',
    },
    cardThumbnailPlaceholder: {
      backgroundColor: isDark ? theme.backgroundSelected : '#e2e8f0',
    },
    moduleName: {
      color: theme.text,
    },
    moduleDescription: {
      color: theme.textSecondary,
    },
    moduleMetaLabel: {
      color: theme.textSecondary,
    },
    moduleMetaValue: {
      color: theme.text,
    },
    moduleSecondaryButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.2)',
    },
    moduleSecondaryButtonText: {
      color: theme.text,
    },
    modalHero: {
      backgroundColor: isDark ? theme.backgroundSelected : '#fef3c7',
    },
    modalTitle: {
      color: isDark ? '#67e8f9' : '#0e7490',
    },
    modalCloseText: {
      color: '#ffffff',
    },
    modulePrimaryButton: {
      backgroundColor: '#22c55e',
    },
    modulePrimaryButtonText: {
      color: '#ffffff',
    },
    noModuleCard: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f8fafc',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    noModuleText: {
      color: theme.textSecondary,
    },
  }), [theme, isDark]);

   const loadData = useCallback(async () => {
    setError('');
    try {
      const [competencyRecords, moduleRecords, lessonRecords, contentRecords, progressRecords] = await Promise.all([
        listCompetencies(),
        listModules(),
        listLessons(),
        listLessonContent(),
        listLessonContentProgressByUser(activeUserId),
      ]);
      setCompetencies(competencyRecords);
      setModules(moduleRecords);
      setLessons(lessonRecords);
      setLessonContents(contentRecords);
      setLessonContentProgress(progressRecords);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load competencies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeUserId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        if (isActive) {
          await loadData();
        }
      })();
      return () => {
        isActive = false;
      };
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const openCompetencyDetail = async (competency: CompetencyRecord) => {
    setSelectedCompetency(competency);
    setSelectedModules([]);
    setDetailVisible(true);
    try {
      const moduleRecords = await listModules();
      const filtered = moduleRecords.filter((m) => m.competency_id === competency.competency_id);
      setSelectedModules(filtered);
    } catch {
      setSelectedModules([]);
    }
  };

  const closeCompetencyDetail = () => {
    setDetailVisible(false);
    setSelectedCompetency(null);
    setSelectedModules([]);
  };

  // "Start" now opens the module pre-test instead of jumping straight to the
  // lesson page. The lesson page is only opened once the pre-test is submitted
  // (or skipped / when the module has no exercises at all).
  const handleModuleStart = (moduleItem: ModuleRecord) => {
    setDetailVisible(false);
    setPreTestModule(moduleItem);
  };

  const closePreTest = () => {
    setPreTestModule(null);
  };

  const handlePreTestComplete = () => {
    const moduleItem = preTestModule;
    setPreTestModule(null);
    if (!moduleItem) {
      return;
    }
    router.replace({
      pathname: '/lesson',
      params: {
        userId: String(activeUserId),
        moduleId: String(moduleItem.module_id),
      },
    });
  };

  const getModuleProgress = (moduleId: number) => {
    const readContentIds = new Set(
      lessonContentProgress
        .filter((p) => p.is_read)
        .map((p) => p.lesson_content_id),
    );
    const modLessons = lessons.filter((l) => l.module_id === moduleId);
    const modContents = lessonContents.filter((c) =>
      modLessons.some((ml) => ml.lesson_id === c.lesson_id),
    );
    const completed = modContents.filter((c) => readContentIds.has(c.lesson_content_id)).length;
    return {
      completed,
      total: modContents.length,
      percent: modContents.length > 0 ? Math.round((completed / modContents.length) * 100) : 0,
    };
  };

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Competency Library" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={require('@/assets/images/tools.jpeg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, dynamicStyles.heroTitle]}>Competency Library</Text>
            <Text style={[styles.heroSubtitle, dynamicStyles.heroSubtitle]}>
              Browse competencies and start learning
            </Text>
          </View>
        </View>

        <View style={[styles.section, isCompact && styles.sectionCompact]}>
            {competencies.map((competency) => {
              const competencyModule = modules.find((m) => m.competency_id === competency.competency_id) ?? null;
              const moduleProgress = getModuleProgress(competencyModule?.module_id ?? 0);
              const progressText = `${moduleProgress.completed}/${moduleProgress.total} (${moduleProgress.percent}%)`;

              return (
                <Pressable
                  key={competency.competency_id}
                  onPress={() => openCompetencyDetail(competency)}
                  style={({ pressed }) => [
                    styles.card,
                    styles.surfaceCard,
                    dynamicStyles.card,
                    isCompact && styles.cardCompact,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.cardMedia}>
                    {(() => {
                      const bgImage = getModuleImage(competencyModule?.module_id ?? 0) ?? (competencyModule?.thumbnail ? { uri: competencyModule.thumbnail } : null);
                      if (bgImage) {
                        return <Image source={bgImage} style={[styles.cardThumbnail, dynamicStyles.cardThumbnail]} resizeMode="cover" />;
                      }
                      return <View style={[styles.cardThumbnail, dynamicStyles.cardThumbnailPlaceholder]} />;
                    })()}
                  </View>

                  <View style={styles.cardContentOverlay}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]} numberOfLines={1}>
                      {competency.competency_name}
                    </Text>

                    <View style={styles.cardMetaLine}>
                      <Text style={[styles.cardStatus, dynamicStyles.cardStatus]} numberOfLines={1}>
                        {competency.sector}
                      </Text>
                      <Text style={[styles.cardStatusDivider, dynamicStyles.cardStatusDivider]}>•</Text>
                      <Text style={[styles.cardStatus, dynamicStyles.cardStatus]} numberOfLines={1}>
                        {competency.qualification}
                      </Text>
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.cardChip}>
                        <Text style={[styles.cardChipText, dynamicStyles.cardChipText]}>{progressText}</Text>
                      </View>

                      <View style={[styles.startButton, styles.startButtonGreen, isCompact && styles.startButtonCompact]}>
                        <Text style={styles.startButtonTextGreen}>View</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}

          {!competencies.length && !error ? (
            <View style={[styles.emptyState, dynamicStyles.emptyState]}>
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>
                {loading ? 'Loading competencies...' : 'No competencies available.'}
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={[styles.emptyState, dynamicStyles.emptyState]}>
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="library" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={detailVisible} onRequestClose={closeCompetencyDetail}>
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.modalCard, dynamicStyles.modalCard]}>
            <View style={[styles.modalHero, dynamicStyles.modalHero]}>
              {(() => {
                const heroImage = selectedModules.length > 0 ? getModuleImage(selectedModules[0].module_id) : null;
                if (heroImage) {
                  return <Image source={heroImage} style={styles.modalHeroImage} resizeMode="cover" />;
                }
                return null;
              })()}
              <Pressable onPress={closeCompetencyDetail} style={styles.modalCloseButton}>
                <Text style={[styles.modalCloseText, dynamicStyles.modalCloseText]}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>{selectedCompetency?.competency_name}</Text>

              <View style={styles.modalFeatureList}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Sector</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{selectedCompetency?.sector}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Qualification</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{selectedCompetency?.qualification}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>Status</Text>
                  <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{selectedCompetency?.status}</Text>
                </View>
              </View>

              <Text style={[styles.modalSection, dynamicStyles.modalSection]}>Modules</Text>
              <ScrollView
                style={styles.moduleList}
                contentContainerStyle={styles.moduleListContent}
                showsVerticalScrollIndicator={false}>
                {selectedModules.length > 0 ? (
                  selectedModules.map((moduleItem) => (
                    <View key={moduleItem.module_id} style={[styles.moduleCard, dynamicStyles.moduleCard]}>
                      <View style={styles.moduleInfo}>
                        <Text style={[styles.moduleName, dynamicStyles.moduleName]} numberOfLines={2}>
                          {moduleItem.module_name}
                        </Text>
                        <Text style={[styles.moduleDescription, dynamicStyles.moduleDescription]} numberOfLines={3}>
                          {moduleItem.description}
                        </Text>

                        <View style={styles.moduleMetaRow}>
                          <View style={styles.moduleMetaItem}>
                            <Text style={[styles.moduleMetaLabel, dynamicStyles.moduleMetaLabel]}>PDF</Text>
                            <Text style={[styles.moduleMetaValue, dynamicStyles.moduleMetaValue]} numberOfLines={1}>
                              {moduleItem.module_pdf}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.moduleCardActions}>
                        <Pressable
                          onPress={() => handleModuleStart(moduleItem)}
                          style={({ pressed }) => [
                            styles.modulePrimaryButton,
                            dynamicStyles.modulePrimaryButton,
                            pressed && styles.modulePrimaryButtonPressed,
                          ]}
                        >
                          <Text style={[styles.modulePrimaryButtonText, dynamicStyles.modulePrimaryButtonText]}>Start</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={[styles.noModuleCard, dynamicStyles.noModuleCard]}>
                    <Text style={[styles.noModuleText, dynamicStyles.noModuleText]}>No modules available for this competency.</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {preTestModule ? (
        <PreTestModal
          visible
          userId={activeUserId}
          moduleId={preTestModule.module_id}
          moduleName={preTestModule.module_name}
          onClose={closePreTest}
          onComplete={handlePreTestComplete}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    gap: 16,
  },
  pageIntro: {
    gap: 10,
  },
  pageIntroCompact: {
    gap: 8,
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
  pageIntroImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  pageIntroTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  pageIntroText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
  },
  sectionCompact: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  surfaceCard: {
    shadowColor: '#0f172a',
  },
  cardCompact: {
    padding: 8,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardMedia: {
    width: 76,
    height: 76,
  },
  cardThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  cardContentOverlay: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    flexShrink: 1,
  },
  cardStatusDivider: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  cardChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0,
  },
  startButtonGreen: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  startButtonTextGreen: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  startButtonCompact: {
    minHeight: 0,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHero: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeroImage: {
    width: '100%',
    height: '100%',
  },
  modalBody: {
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSection: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  modalFeatureList: {
    gap: 10,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  moduleList: {
    maxHeight: 260,
  },
  moduleListContent: {
    gap: 12,
  },
  moduleCard: {
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    padding: 14,
  },
  moduleInfo: {
    gap: 6,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  moduleDescription: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  moduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moduleMetaItem: {
    flex: 1,
    gap: 2,
  },
  moduleMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  moduleMetaValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  moduleCardActions: {
    marginTop: 4,
  },
 modulePrimaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0,
  },
  modulePrimaryButtonPressed: {
    opacity: 0.85,
  },
  modulePrimaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  noModuleCard: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  noModuleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
