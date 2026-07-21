import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CompetencyRecord, listCompetencies } from '@/lib/auth-api';

export default function ModuleScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [competencies, setCompetencies] = useState<CompetencyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingCompetency, setViewingCompetency] = useState<CompetencyRecord | null>(null);

  const loadCompetencies = async () => {
    setError('');
    try {
      const records = await listCompetencies();
      setCompetencies(records);
      setViewingCompetency((current) => current ?? records[0] ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load competencies.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const records = await listCompetencies();
        if (isMounted) {
          setCompetencies(records);
          setViewingCompetency(records[0] ?? null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load competencies.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCompetencies();
  };

  const handleViewCompetency = (competency: CompetencyRecord) => {
    setViewingCompetency(competency);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="code" themeColor="textSecondary">
            Competency Management
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Track outcomes, maintain records, and manage categories
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Records from the offline competency database.
          </ThemedText>

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : (
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View>
                  <ThemedText type="subtitle" style={styles.tableTitle}>
                    Competency List
                  </ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.tableSubtitle}>
                    Records from local storage
                  </ThemedText>
                </View>
                <Pressable onPress={handleRefresh} style={styles.refreshButton}>
                  <ThemedText style={styles.refreshButtonText}>{refreshing || loading ? 'Refreshing' : 'Refresh'}</ThemedText>
                </Pressable>
              </View>

              <View style={styles.tableHeader}>
                <ThemedText style={[styles.columnHeader, styles.idColumn]}>ID</ThemedText>
                <ThemedText style={[styles.columnHeader, styles.competencyColumn]}>Competency</ThemedText>
                <ThemedText style={[styles.columnHeader, styles.statusColumn]}>Status</ThemedText>
                <ThemedText style={[styles.columnHeader, styles.actionsColumn]}>Actions</ThemedText>
              </View>

              <ScrollView style={styles.tableBody}>
                {competencies.map((competency) => (
                  <View key={String(competency.competency_id)} style={styles.tableRow}>
                    <ThemedText style={[styles.cellText, styles.idColumn]}>#{String(competency.competency_id)}</ThemedText>
                    <View style={[styles.cellBlock, styles.competencyColumn]}>
                      <ThemedText style={styles.competencyName}>{competency.competency_name}</ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.metaText}>
                        Synced from local storage
                      </ThemedText>
                    </View>
                    <View style={[styles.statusColumn, styles.statusWrap]}>
                      <StatusPill status={competency.status} />
                    </View>
                    <View style={[styles.actionsColumn, styles.actionsWrap]}>
                      <Pressable onPress={() => handleViewCompetency(competency)} style={styles.viewButton}>
                        <ThemedText style={styles.viewButtonText}>View</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))}

                {!competencies.length ? (
                  <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                    No competencies available.
                  </ThemedText>
                ) : null}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="module" userId={activeUserId} />

      <Modal transparent animationType="fade" visible={viewModalVisible} onRequestClose={closeViewModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.viewModal}>
            <ThemedText type="subtitle">Competency Info</ThemedText>
            {viewingCompetency ? (
              <View style={styles.infoCard}>
                <InfoRow label="Competency" value={viewingCompetency.competency_name} />
                <InfoRow label="Sector" value={viewingCompetency.sector} />
                <InfoRow label="Qualification" value={viewingCompetency.qualification} />
                <InfoRow label="Status" value={viewingCompetency.status} />
              </View>
            ) : null}
            <Pressable onPress={closeViewModal} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.summaryLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.summaryValue}>{value}</ThemedText>
    </View>
  );
}

function StatusPill({ status }: { status: string }) {
  const isActive = status.toLowerCase() === 'active';

  return (
    <View style={[styles.statusPill, !isActive && styles.statusPillInactive]}>
      <ThemedText style={[styles.statusPillText, !isActive && styles.statusPillTextInactive]}>{status}</ThemedText>
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
  title: {
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  tableCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    padding: 16,
    gap: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tableTitle: {
    fontSize: 20,
  },
  tableSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  refreshButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#eaf1f7',
  },
  refreshButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  columnHeader: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableBody: {
    maxHeight: 420,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.16)',
  },
  cellText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  cellBlock: {
    gap: 4,
  },
  competencyName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusWrap: {
    alignItems: 'center',
  },
  actionsWrap: {
    alignItems: 'flex-end',
  },
  idColumn: {
    width: 78,
    paddingRight: 8,
  },
  competencyColumn: {
    flex: 1,
    paddingRight: 8,
  },
  statusColumn: {
    width: 92,
    paddingRight: 8,
  },
  actionsColumn: {
    width: 72,
  },
  emptyText: {
    paddingVertical: 18,
    textAlign: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
  },
  statusPillInactive: {
    backgroundColor: '#e2e8f0',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  statusPillTextInactive: {
    color: '#475569',
  },
  viewButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dbeafe',
  },
  viewButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  summaryRow: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: '#b91c1c',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
  },
  viewModal: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#f8fafc',
  },
  closeButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
