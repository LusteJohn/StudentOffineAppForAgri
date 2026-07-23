import { useCallback, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { CompetencyRecord, ModuleRecord, listCompetencies, listModules } from '@/lib/auth-api';

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
        // no-op: surface a toast/snackbar here if you have one wired up
      });
    }
  };

  // Placeholder progress label until real progress-tracking data is available.
  // Swap this out for whatever field your backend uses (e.g. competency.progress_status).
  const getProgressLabel = (competency: CompetencyRecord) => {
    return competency.status.toLowerCase() === 'active' ? 'Not started' : 'Unavailable';
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Competency Library" userId={activeUserId} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          <Pressable style={styles.categoryTabActive}>
            <Text style={styles.categoryTabTextActive}>All</Text>
          </Pressable>
          <Pressable style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Agriculture</Text>
          </Pressable>
          <Pressable style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Active</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.section}>
          {competencies.map((competency) => {
            const competencyModule = modules.find((m) => m.competency_id === competency.competency_id) ?? null;

            return (
              <View key={competency.competency_id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardTextGroup}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {competency.competency_name}
                    </Text>
                    <Text style={styles.cardStatus}>{getProgressLabel(competency)}</Text>
                  </View>

                  {competencyModule?.thumbnail ? (
                    <Image
                      source={{ uri: competencyModule.thumbnail }}
                      style={styles.cardThumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.cardThumbnail, styles.cardThumbnailPlaceholder]} />
                  )}
                </View>

                <View style={styles.cardButtonRow}>
                  <Pressable
                    onPress={() => handleDownload(competencyModule)}
                    style={styles.downloadButton}
                  >
                    <Text style={styles.downloadIcon}>⬇</Text>
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => openCompetencyDetail(competency)}
                    style={styles.startButton}
                  >
                    <Text style={styles.startButtonText}>Start Module</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

          {!competencies.length && !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {loading ? 'Loading competencies...' : 'No competencies available.'}
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="library" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={detailVisible} onRequestClose={closeCompetencyDetail}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{selectedCompetency?.competency_name}</Text>
              <Pressable onPress={closeCompetencyDetail} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sector</Text>
                <Text style={styles.infoValue}>{selectedCompetency?.sector}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Qualification</Text>
                <Text style={styles.infoValue}>{selectedCompetency?.qualification}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{selectedCompetency?.status}</Text>
              </View>
            </View>

            <Text style={styles.modalSection}>Modules</Text>
            <ScrollView
              style={styles.moduleList}
              contentContainerStyle={styles.moduleListContent}
              showsVerticalScrollIndicator={false}>
              {selectedModules.length > 0 ? (
                selectedModules.map((moduleItem) => (
                  <View key={moduleItem.module_id} style={styles.moduleCard}>
                    <View style={styles.moduleCardHeader}>
                      <View style={styles.moduleInfo}>
                        <Text style={styles.moduleName}>{moduleItem.module_name}</Text>
                        <Text style={styles.moduleDescription} numberOfLines={3}>
                          {moduleItem.description}
                        </Text>
                      </View>
                      {moduleItem.thumbnail ? (
                        <Image
                          source={{ uri: moduleItem.thumbnail }}
                          style={styles.moduleThumbnail}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.moduleThumbnailPlaceholder} />
                      )}
                    </View>

                    <View style={styles.moduleCardBody}>
                      <View style={styles.moduleMetaRow}>
                        <View style={styles.moduleMetaItem}>
                          <Text style={styles.moduleMetaLabel}>PDF</Text>
                          <Text style={styles.moduleMetaValue} numberOfLines={1}>
                            {moduleItem.module_pdf}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.moduleCardActions}>
                      <Pressable onPress={() => {}} style={styles.moduleSecondaryButton}>
                        <Text style={styles.moduleSecondaryButtonText}>Download</Text>
                      </Pressable>
                      <Pressable onPress={() => {}} style={styles.modulePrimaryButton}>
                        <Text style={styles.modulePrimaryButtonText}>Start</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noModuleCard}>
                  <Text style={styles.noModuleText}>No modules available for this competency.</Text>
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
    backgroundColor: BACKGROUND_LIGHT,
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
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
    color: '#000000',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  categoryTabs: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
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
    color: '#64748b',
  },
  categoryTabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    marginTop: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
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
    color: '#000000',
    lineHeight: 22,
  },
  cardStatus: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  cardThumbnail: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  cardThumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#eef2f1',
  },
  downloadIcon: {
    fontSize: 14,
    color: '#0f172a',
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  startButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    backgroundColor: '#ffffff',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
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
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
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
    color: '#000000',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  modalSection: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
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
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#000000',
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
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  moduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  moduleInfo: {
    flex: 1,
    gap: 4,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 20,
  },
  moduleDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 18,
  },
  moduleThumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  moduleThumbnail: {
    width: 64,
    height: 64,
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
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  moduleMetaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
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
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  moduleSecondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  modulePrimaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: PRIMARY,
  },
  modulePrimaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  noModuleCard: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  noModuleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});
