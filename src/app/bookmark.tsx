import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  const isDark = colors.text === '#ffffff';

  const dynamicStyles = useMemo(() => StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <ThemedText style={[styles.sectionBody, dynamicStyles.sectionBody]}>No bookmarks yet. Bookmark lesson content from the content info page.</ThemedText>
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
    backgroundColor: '#edf4ea',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 12,
    gap: 16,
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
});
