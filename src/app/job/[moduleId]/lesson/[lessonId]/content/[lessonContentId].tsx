import { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomNavbar } from '@/components/bottom-navbar';
import { Header } from '@/components/header';
import { ThemedView } from '@/components/themed-view';
import { JobSheetAnswerRecord, JobSheetRecord, LessonContentRecord, LessonRecord, ModuleRecord, createJobSheetAnswer, getModuleById, getLessonById, getLessonContentById, listJobSheetByLessonContentId, listJobSheetAnswersByUserAndJob } from '@/lib/auth-api';

const BACKGROUND_LIGHT = '#f6f8f6';

let ImagePicker: any = null;
try {
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}

export default function JobSheetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ moduleId?: string; lessonId?: string; lessonContentId?: string; userId?: string }>();
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);
  const lessonContentId = Number(params.lessonContentId);

  const [moduleItem, setModuleItem] = useState<ModuleRecord | null>(null);
  const [lessonItem, setLessonItem] = useState<LessonRecord | null>(null);
  const [contentItem, setContentItem] = useState<LessonContentRecord | null>(null);
  const [jobSheets, setJobSheets] = useState<JobSheetRecord[]>([]);
  const [answers, setAnswers] = useState<JobSheetAnswerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<JobSheetRecord | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const loadJobSheet = useCallback(async () => {
    setError('');
    setLoading(true);
    setAnswers([]);
    try {
      const [mod, lesson, content] = await Promise.all([
        getModuleById(moduleId),
        getLessonById(lessonId),
        getLessonContentById(lessonContentId),
      ]);
      setModuleItem(mod ?? null);
      setLessonItem(lesson ?? null);
      setContentItem(content ?? null);

      if (!mod || !lesson || !content) {
        setError('Module, lesson, or lesson content not found.');
        setLoading(false);
        return;
      }

      const sheets = await listJobSheetByLessonContentId(content.lesson_content_id);
      setJobSheets(sheets);

      const userId = Number(params.userId ?? '1');
      if (userId > 0 && sheets.length > 0) {
        const existingAnswers = await listJobSheetAnswersByUserAndJob(userId, sheets[0].job_id);
        setAnswers(existingAnswers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load job sheet.');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, params.userId]);

  useEffect(() => {
    if (Number.isInteger(moduleId) && Number.isInteger(lessonId) && Number.isInteger(lessonContentId) && moduleId > 0 && lessonId > 0 && lessonContentId > 0) {
      loadJobSheet();
    } else {
      Alert.alert('Select a lesson content first', 'Please select a module and lesson from the Lesson page before viewing the job sheet.');
      setError('Invalid module, lesson, or lesson content.');
      setLoading(false);
    }
  }, [moduleId, lessonId, lessonContentId, loadJobSheet]);

  const ensureJobSheetRecordsDir = async () => {
    const dir = `${FileSystem.documentDirectory}job_sheet_records`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  };

  const pickImages = async () => {
    if (!ImagePicker) {
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const assets = result.assets ?? [];
      const recordDir = await ensureJobSheetRecordsDir();
      const copiedUris: string[] = [];

      for (const asset of assets) {
        const ext = asset.uri.split('.').pop() ?? 'jpg';
        const fileName = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const destUri = `${recordDir}/${fileName}`;
        await FileSystem.copyAsync({ from: asset.uri, to: destUri });
        copiedUris.push(destUri);
      }

      setSelectedImages((prev) => [...prev, ...copiedUris]);
    }
  };

  const openAnswerModal = (sheet: JobSheetRecord) => {
    setSelectedSheet(sheet);
    setAnswerText('');
    setSelectedImages([]);
    setModalVisible(true);
  };

  const closeAnswerModal = () => {
    if (!submitting) {
      setModalVisible(false);
      setSelectedSheet(null);
      setAnswerText('');
      setSelectedImages([]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedSheet) {
      return;
    }

    const userId = Number(params.userId ?? '1');
    const trimmedAnswer = answerText.trim();

    if (!trimmedAnswer && selectedImages.length === 0) {
      Alert.alert('Answer required', 'Please enter a response or upload at least one image.');
      return;
    }

    let answerTextToSave = trimmedAnswer;
    if (selectedImages.length > 0) {
      const imagePaths = selectedImages.map((uri) => uri.replace(FileSystem.documentDirectory ?? '', ''));
      answerTextToSave = trimmedAnswer ? `${trimmedAnswer}\nImages: ${imagePaths.join(', ')}` : `Images: ${imagePaths.join(', ')}`;
    }

    Alert.alert(
      'Submit job sheet answer',
      'Are you sure you want to submit your job sheet response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSubmitting(true);
            try {
              await createJobSheetAnswer({
                job_id: selectedSheet.job_id,
                user_id: userId,
                answer_text: answerTextToSave,
              });
              Alert.alert('Submitted', 'Your job sheet answer has been saved.');
              closeAnswerModal();
              loadJobSheet();
            } catch (submitError) {
              Alert.alert('Submit failed', submitError instanceof Error ? submitError.message : 'Unable to submit job sheet answer.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <Header title="Job Sheet" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading job sheet...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load job sheet</Text>
            <Text style={styles.errorDescription}>{error}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>{moduleItem?.module_name}</Text>
              <Text style={styles.headerSubtitle}>{lessonItem?.lesson_name}</Text>
              {contentItem ? <Text style={styles.contentName}>{contentItem.content_name}</Text> : null}
            </View>

            {jobSheets.length > 0 ? (
              jobSheets.map((sheet) => {
                const hasAnswer = answers.some((answer) => answer.job_id === sheet.job_id);
                return (
                  <View key={sheet.job_id} style={styles.sheetCard}>
                    <Text style={styles.sheetTitle}>{sheet.job_title}</Text>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Objectives</Text>
                      <Text style={styles.sectionText}>{sheet.job_objectives}</Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Materials</Text>
                      <Text style={styles.sectionText}>{sheet.job_materials}</Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Steps</Text>
                      <Text style={styles.sectionText}>{sheet.job_steps}</Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Assessment Method</Text>
                      <Text style={styles.sectionText}>{sheet.job_assesment_method || '-'}</Text>
                    </View>
                    <Pressable
                      onPress={() => openAnswerModal(sheet)}
                      disabled={hasAnswer}
                      style={[styles.addAnswerButton, hasAnswer && styles.addAnswerButtonDisabled]}>
                      <Text style={styles.addAnswerButtonText}>{hasAnswer ? 'Answer Submitted' : 'Add Answer'}</Text>
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyBoxText}>No job sheet records found for this lesson content.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeAnswerModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Job Sheet Answer</Text>
            <Text style={styles.modalSubtitle}>{selectedSheet?.job_title}</Text>
            <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
              <TextInput
                style={styles.textInput}
                placeholder="Type your answer here..."
                value={answerText}
                onChangeText={setAnswerText}
                multiline
                textAlignVertical="top"
              />
              {ImagePicker ? (
                <Pressable onPress={pickImages} style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Upload Images</Text>
                </Pressable>
              ) : null}
              {selectedImages.length > 0 ? (
                <View style={styles.imagePreviewContainer}>
                  <Text style={styles.imagePreviewTitle}>Selected Images ({selectedImages.length})</Text>
                  {selectedImages.map((uri, index) => (
                    <Text key={index} style={styles.imagePreviewText} numberOfLines={1}>
                      {uri.split('/').pop()}
                    </Text>
                  ))}
                </View>
              ) : null}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable disabled={submitting} onPress={closeAnswerModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable disabled={submitting} onPress={handleSubmitAnswer} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavbar activeTab="job" userId={Number(params.userId ?? '1')} />
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
    gap: 16,
  },
  container: {
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  contentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    padding: 16,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
  },
  addAnswerButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  addAnswerButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  addAnswerButtonText: {
    color: '#ffffff',
    fontWeight: '700',
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
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyBoxText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '88%',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  modalScrollContent: {
    gap: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 97, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  uploadButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  imagePreviewContainer: {
    gap: 4,
  },
  imagePreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  imagePreviewText: {
    fontSize: 13,
    color: '#334155',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    color: '#000',
    fontWeight: '700',
  },
});
