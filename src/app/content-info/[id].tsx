import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Asset } from 'expo-asset';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { ContentInfoRecord, LessonContentRecord, LessonRecord, ModuleRecord, getLessonById, getModuleById, getLessonContentById, listContentInfoByLessonContentId } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

export default function ContentInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const lessonContentId = Number(params.id);

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(null);
  const [contentInfos, setContentInfos] = useState<ContentInfoRecord[]>([]);
  const [imageUris, setImageUris] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const resolveAssetUri = async (assetPath: string): Promise<string | null> => {
    try {
      if (assetPath.startsWith('file://') || assetPath.startsWith('http')) {
        return assetPath;
      }
      const normalized = assetPath.replace(/^assets\//, '');
      const encoded = encodeURI(normalized);
      const asset = Asset.fromURI(`asset:///${encoded}`);
      await asset.downloadAsync();
      return asset.localUri ?? null;
    } catch {
      return null;
    }
  };

  const loadContentInfo = useCallback(async () => {
    setError('');
    setLoading(true);
    setImageUris({});
    try {
      const lessonContent = await getLessonContentById(lessonContentId);
      if (!lessonContent) {
        setError('Lesson content not found.');
        setLoading(false);
        return;
      }
      setContentItem(lessonContent);

      const lesson = await getLessonById(lessonContent.lesson_id);
      const moduleRecord = lesson ? await getModuleById(lesson.module_id) : null;
      const infos = await listContentInfoByLessonContentId(lessonContent.lesson_content_id);

      setLessonItem(lesson ?? null);
      setModuleItem(moduleRecord ?? null);
      setContentInfos(infos);

      const uris: Record<number, string> = {};
      for (const info of infos) {
        if (info.images) {
          const uri = await resolveAssetUri(info.images);
          if (uri) {
            uris[info.content_info_id] = uri;
          }
        }
      }
      setImageUris(uris);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load content info.');
    } finally {
      setLoading(false);
    }
  }, [lessonContentId]);

  useEffect(() => {
    if (Number.isInteger(lessonContentId) && lessonContentId > 0) {
      loadContentInfo();
    } else {
      setError('Invalid content ID.');
      setLoading(false);
    }
  }, [lessonContentId, loadContentInfo]);

  return (
    <ThemedView style={styles.screen}>
      <Header title="Content Info" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading content info...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load content info</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>
                {moduleItem?.module_name} {' > '} {lessonItem?.lesson_name} {' > '} {contentItem?.content_name}
              </Text>
            </View>

            {contentInfos.length > 0 ? (
              contentInfos.map((info) => (
                <View key={info.content_info_id} style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Label</Text>
                  <Text style={styles.infoValue}>{info.label}</Text>

                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{info.description}</Text>

                  {imageUris[info.content_info_id] ? (
                    <Image source={{ uri: imageUris[info.content_info_id] }} style={styles.infoImage} resizeMode="contain" />
                  ) : null}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No content info available for this lesson content.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="content-info" userId={1} />
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
    gap: 16,
  },
  breadcrumb: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  breadcrumbText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    lineHeight: 18,
  },
  contentContainer: {
    gap: 12,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 20,
  },
  infoImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.18)',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  errorTitle: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
  },
  errorDescription: {
    color: '#b91c1c',
    fontSize: 13,
    lineHeight: 18,
  },
});
