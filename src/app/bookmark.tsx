import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCustomAlert } from '@/lib/custom-alert';
import { useTheme } from '@/hooks/use-theme';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  getLessonById,
  getLessonContentById,
  getModuleById,
  LessonContentBookmarkRecord,
  LessonContentRecord,
  LessonRecord,
  listLessonContentBookmarkByUser,
  ModuleRecord,
} from '@/lib/auth-api';

type BookmarkDetail = {
  bookmark: LessonContentBookmarkRecord;
  content: LessonContentRecord | null;
  lesson: LessonRecord | null;
  module: ModuleRecord | null;
};

export default function BookmarkScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = useMemo(() => {
    const parsed = Number(params.userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [params.userId]);

  const [bookmarks, setBookmarks] = useState<BookmarkDetail[]>([]);
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  const { showAlert } = useCustomAlert();
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const isDark = colors.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    sectionCard: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(92, 107, 97, 0.12)',
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
    bookmarkRow: {
      backgroundColor: colors.backgroundElement,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148, 163, 184, 0.12)',
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
    heroTitle: {
      color: '#ffffff',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.8)',
    },
    bookmarkCountBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    bookmarkCountText: {
      color: '#ffffff',
    },
    emptyStateText: {
      color: colors.textSecondary,
    },
    loadingText: {
      color: colors.textSecondary,
    },
  }), [colors, isDark]);

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

  return (
    <ThemedView style={[styles.screen, dynamicStyles.screen]}>
      <Header title="Bookmarks" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={require('@/assets/images/bookmark.jpeg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, dynamicStyles.heroTitle]}>Bookmarks</Text>
            <Text style={[styles.heroSubtitle, dynamicStyles.heroSubtitle]}>Your saved lesson content</Text>
            <View style={[styles.bookmarkCountBadge, dynamicStyles.bookmarkCountBadge]}>
              <Text style={[styles.bookmarkCountText, dynamicStyles.bookmarkCountText]}>{bookmarks.length} saved</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, dynamicStyles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, dynamicStyles.sectionIconWrap]}>
              <Ionicons name="bookmark" size={18} color={colors.text} />
            </View>
            <View style={styles.sectionHeaderText}>
              <ThemedText type="code" style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
                Library
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Bookmarked content
              </ThemedText>
            </View>
          </View>

          {bookmarksLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="bookmark-outline" size={40} color={isDark ? '#4b5563' : '#cbd5e1'} />
              <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading bookmarks...</Text>
            </View>
          ) : bookmarks.length > 0 ? (
            <View style={styles.bookmarkList}>
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
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={40} color="#94a3b8" />
              <ThemedText style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>No bookmarks yet</ThemedText>
              <ThemedText style={[styles.emptyStateSubtext, dynamicStyles.emptyStateText]}>Bookmark lesson content from the content info page to see it here</ThemedText>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNavbar activeTab="bookmark" userId={activeUserId} />
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
  bookmarkCountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  bookmarkCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    padding: 18,
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
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
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  bookmarkList: {
    gap: 10,
    marginTop: 4,
  },
  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
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
  emptyState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#64748b',
  },
});
