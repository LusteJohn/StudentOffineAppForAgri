import { useCallback, useMemo, useState } from 'react';
import { Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { CompetencyRecord, ModuleRecord, listCompetencies, listModules } from '@/lib/auth-api';

const moduleImages: Record<number, any> = {
  1: require('@/assets/learning_materials/modules/1/raise.png'),
  2: require('@/assets/learning_materials/modules/2/vegetables.png'),
  3: require('@/assets/learning_materials/modules/3/fertilizer.jpg'),
  4: require('@/assets/learning_materials/modules/4/concoction.jpg'),
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyRecord | null>(null);
  const [selectedModules, setSelectedModules] = useState<ModuleRecord[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
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
    categoryTabs: {
      backgroundColor: theme.backgroundElement,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148, 163, 184, 0.12)',
    },
    categoryTabText: {
      color: theme.textSecondary,
    },
    categoryTabTextActive: {
      color: theme.text,
    },
    section: {
      marginTop: 20,
      gap: 16,
    },
    sectionCompact: {
      marginTop: 14,
      gap: 12,
    },
    card: {
      backgroundColor: theme.backgroundElement,
      shadowColor: isDark ? '#000000' : '#000000',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    cardTitle: {
      color: theme.text,
    },
    cardStatus: {
      color: theme.textSecondary,
    },
    cardThumbnail: {
      backgroundColor: isDark ? theme.backgroundSelected : '#e2e8f0',
    },
    downloadButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#eef2f1',
    },
    downloadIcon: {
      color: theme.text,
    },
    downloadButtonText: {
      color: theme.text,
    },
    startButton: {
      borderColor: PRIMARY,
      backgroundColor: theme.backgroundElement,
    },
    startButtonText: {
      color: theme.text,
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
    modalTitle: {
      color: theme.text,
    },
    modalCloseButton: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f1f5f9',
    },
    modalCloseText: {
      color: theme.text,
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
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
      shadowColor: isDark ? '#000000' : '#000000',
    },
    moduleName: {
      color: theme.text,
    },
    moduleDescription: {
      color: theme.textSecondary,
    },
    moduleThumbnailPlaceholder: {
      backgroundColor: isDark ? theme.backgroundSelected : '#e2e8f0',
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
    modulePrimaryButton: {
      backgroundColor: PRIMARY,
    },
    modulePrimaryButtonText: {
      color: theme.text,
    },
    noModuleCard: {
      backgroundColor: isDark ? theme.backgroundSelected : '#f8fafc',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.12)',
    },
    noModuleText: {
      color: theme.textSecondary,
    },
  }), [theme, isDark]);

  const handleModuleStart = (moduleItem: ModuleRecord) => {
    setDetailVisible(false);
    router.replace({
      pathname: '/lesson',
      params: {
        userId: String(activeUserId),
        moduleId: String(moduleItem.module_id),
      },
    });
  };

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [competencyRecords, moduleRecords] = await Promise.all([listCompetencies(), listModules()]);
      setCompetencies(competencyRecords);
      setModules(moduleRecords);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load competencies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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

  const handleDownload = (competencyModule: ModuleRecord | null) => {
    if (competencyModule?.module_pdf) {
      Linking.openURL(competencyModule.module_pdf).catch(() => {
        // no-op
      });
    }
  };

  const getProgressLabel = (competency: CompetencyRecord) => {
    return competency.status.toLowerCase() === 'active' ? 'Not started' : 'Unavailable';
  };

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Competency Library" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.categoryTabs, dynamicStyles.categoryTabs]}>
          <Pressable style={styles.categoryTabActive}>
            <Text style={[styles.categoryTabTextActive, dynamicStyles.categoryTabTextActive]}>All</Text>
          </Pressable>
          <Pressable style={styles.categoryTab}>
            <Text style={[styles.categoryTabText, dynamicStyles.categoryTabText]}>Agriculture</Text>
          </Pressable>
          <Pressable style={styles.categoryTab}>
            <Text style={[styles.categoryTabText, dynamicStyles.categoryTabText]}>Active</Text>
          </Pressable>
        </ScrollView>

        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          {competencies.map((competency) => {
            const competencyModule = modules.find((m) => m.competency_id === competency.competency_id) ?? null;

            return (
              <View key={competency.competency_id} style={[styles.card, styles.surfaceCard, isCompact && styles.cardCompact]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardTextGroup}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]} numberOfLines={2}>
                      {competency.competency_name}
                    </Text>
                    <Text style={[styles.cardStatus, dynamicStyles.cardStatus]}>{getProgressLabel(competency)}</Text>
                  </View>

                  {(() => {
                    const moduleImage = getModuleImage(competencyModule?.module_id ?? 0);
                    if (moduleImage) {
                      return <Image source={moduleImage} style={styles.cardThumbnail} resizeMode="cover" />;
                    }
                    if (competencyModule?.thumbnail) {
                      return <Image source={{ uri: competencyModule.thumbnail }} style={styles.cardThumbnail} resizeMode="cover" />;
                    }
                    return <View style={[styles.cardThumbnail, styles.cardThumbnailPlaceholder]} />;
                  })()}
                </View>

                <View style={styles.cardButtonRow}>
                  <Pressable
                    onPress={() => handleDownload(competencyModule)}
                    style={[styles.downloadButton, isCompact && styles.downloadButtonCompact]}
                  >
                    <Text style={styles.downloadIcon}>⬇</Text>
                    <Text style={[styles.downloadButtonText, dynamicStyles.downloadButtonText]}>Download</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => openCompetencyDetail(competency)}
                    style={[styles.startButton, isCompact && styles.startButtonCompact]}
                  >
                    <Text style={[styles.startButtonText, dynamicStyles.startButtonText]}>Start Module</Text>
                  </Pressable>
                </View>
              </View>
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
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>{selectedCompetency?.competency_name}</Text>
              <Pressable onPress={closeCompetencyDetail} style={[styles.modalCloseButton, dynamicStyles.modalCloseButton]}>
                <Text style={[styles.modalCloseText, dynamicStyles.modalCloseText]}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.infoCard}>
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
                       <Text style={[styles.moduleName, dynamicStyles.moduleName]}>{moduleItem.module_name}</Text>
                       <Text style={[styles.moduleDescription, dynamicStyles.moduleDescription]} numberOfLines={3}>
                         {moduleItem.description}
                       </Text>
                     </View>

                     {getModuleImage(moduleItem.module_id) ? (
                       <Image
                         source={getModuleImage(moduleItem.module_id)}
                         style={styles.moduleThumbnail}
                         resizeMode="cover"
                       />
                     ) : (
                       <View style={[styles.moduleThumbnailPlaceholder, dynamicStyles.moduleThumbnailPlaceholder]} />
                     )}

                     <View style={styles.moduleCardBody}>
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
                        <Pressable onPress={() => handleModuleStart(moduleItem)} style={[styles.modulePrimaryButton, dynamicStyles.modulePrimaryButton]}>
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
      </Modal>
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
  categoryTabs: {
    borderBottomWidth: 1,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: 4,
  },
  categoryTabActive: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY,
    marginRight: 4,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    gap: 16,
  },
  sectionCompact: {
    gap: 12,
  },
  card: {
    borderRadius: 22,
    padding: 16,
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTextGroup: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  cardStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  cardThumbnail: {
    width: 68,
    height: 68,
    borderRadius: 14,
  },
  cardThumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  surfaceCard: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardCompact: {
    padding: 14,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
  },
  downloadIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  downloadButtonCompact: {
    minHeight: 44,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  startButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  startButtonCompact: {
    minHeight: 44,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSection: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoCard: {
    gap: 10,
    paddingVertical: 4,
  },
  infoRow: {
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  moduleList: {
    maxHeight: 320,
  },
  moduleListContent: {
    gap: 12,
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  moduleInfo: {
    flex: 1,
    gap: 4,
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
  moduleThumbnailPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  moduleThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  moduleCardBody: {
    gap: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  moduleSecondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  moduleSecondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modulePrimaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
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
