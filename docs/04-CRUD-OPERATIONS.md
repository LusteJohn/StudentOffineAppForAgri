# StudentOfflineApp - CRUD Operations Documentation

## Overview

This document details all Create, Read, Update, and Delete (CRUD) operations available in the app. The frontend uses SQLite via `expo-sqlite`, while the backend uses JSON file storage.

## API Function Reference

### Legend

| Symbol | Meaning |
|--------|---------|
| **C** | Create operation |
| **R** | Read operation |
| **U** | Update operation |
| **D** | Delete operation |

---

## 1. Authentication & Users

### 1.1 registerStudent (C)

Create a new student account.

```typescript
async function registerStudent(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse>
```

**Validation:**
- `username`, `email`, `password` required (non-empty after trim)
- Email normalized to lowercase
- Email uniqueness checked via `findUserByEmail()`

**Process:**
1. Check if email already exists
2. Generate `user_id` via `COALESCE(MAX(user_id), 0) + 1`
3. Insert into `users` table
4. Return sanitized user object (password stripped)

**Response:**
```typescript
{
  message: "Student registered successfully.",
  user: {
    user_id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
  }
}
```

**Errors:**
- `"Username, email, and password are required."`
- `"A student account with that email already exists."`

---

### 1.2 loginStudent (R)

Authenticate a student.

```typescript
async function loginStudent(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse>
```

**Validation:**
- `email` and `password` required
- Password compared as plaintext

**Process:**
1. Find user by email
2. Verify password match
3. Return sanitized user object

**Response:**
```typescript
{
  message: "Login successful.",
  user: {
    user_id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
  }
}
```

**Errors:**
- `"Email and password are required."`
- `"Invalid student credentials."`

---

### 1.3 getUserById (R)

Get user by ID.

```typescript
async function getUserById(userId: number): Promise<StoredStudentUser | null>
```

**Query:**
```sql
SELECT * FROM users WHERE user_id = ?
```

---

### 1.4 getSetting (R)

Get app setting value.

```typescript
async function getSetting(key: string): Promise<string | null>
```

**Query:**
```sql
SELECT setting_value FROM app_settings WHERE setting_key = ?
```

---

### 1.5 setSetting (C/U)

Set app setting value (insert or replace).

```typescript
async function setSetting(key: string, value: string): Promise<void>
```

**Query:**
```sql
INSERT OR REPLACE INTO app_settings (setting_key, setting_value) VALUES (?, ?)
```

---

## 2. Student Profile

### 2.1 createStudentProfile (C)

Create student profile.

```typescript
async function createStudentProfile(payload: Omit<StudentProfile, "student_id" | "created_at" | "updated_at">): Promise<StudentProfile>
```

**Validation:**
- `user_id` must be positive integer
- `first_name`, `last_name`, `birthdate`, `home_address`, `grade_level` required
- `middle_name`, `student_image` nullable
- All text fields trimmed

**Query:**
```sql
INSERT INTO student_info (student_id, user_id, first_name, middle_name, last_name, birthdate, home_address, grade_level, student_image, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

**Constraint:** UNIQUE `user_id` (one profile per user)

**Errors:**
- `"A student profile already exists for this user."`

---

### 2.2 getStudentProfileByUserId (R)

Get student profile by user ID.

```typescript
async function getStudentProfileByUserId(userId: number): Promise<StudentProfile | null>
```

**Query:**
```sql
SELECT * FROM student_info WHERE user_id = ?
```

---

### 2.3 listStudentProfiles (R)

List all student profiles.

```typescript
async function listStudentProfiles(): Promise<StudentProfile[]>
```

**Query:**
```sql
SELECT * FROM student_info ORDER BY student_id ASC
```

---

### 2.4 updateStudentProfile (U)

Update student profile.

```typescript
async function updateStudentProfile(
  studentId: number,
  payload: Omit<StudentProfile, "student_id" | "created_at" | "updated_at">
): Promise<StudentProfile>
```

**Query:**
```sql
UPDATE student_info
SET first_name = ?, middle_name = ?, last_name = ?, birthdate = ?, home_address = ?, grade_level = ?, student_image = ?, updated_at = ?
WHERE student_id = ?
```

---

### 2.5 deleteStudentProfile (D)

Delete student profile.

```typescript
async function deleteStudentProfile(studentId: number): Promise<boolean>
```

**Query:**
```sql
DELETE FROM student_info WHERE student_id = ?
```

**Returns:** `true` if `changes > 0`

---

## 3. Curriculum Catalog (Read-Only)

### 3.1 Competencies

#### listCompetencies (R)

```typescript
async function listCompetencies(): Promise<CompetencyRecord[]>
```

**Query:**
```sql
SELECT * FROM competencies ORDER BY competency_id ASC
```

#### getModuleByCompetencyId (R)

```typescript
async function getModuleByCompetencyId(competencyId: number): Promise<ModuleRecord[]>
```

**Query:**
```sql
SELECT * FROM modules WHERE competency_id = ? ORDER BY module_id ASC
```

---

### 3.2 Modules

#### listModules (R)

```typescript
async function listModules(): Promise<ModuleRecord[]>
```

**Query:**
```sql
SELECT * FROM modules ORDER BY module_id ASC
```

#### getModuleById (R)

```typescript
async function getModuleById(moduleId: number): Promise<ModuleRecord | null>
```

**Query:**
```sql
SELECT * FROM modules WHERE module_id = ?
```

---

### 3.3 Lessons

#### listLessons (R)

```typescript
async function listLessons(): Promise<LessonRecord[]>
```

**Query:**
```sql
SELECT * FROM lessons ORDER BY lesson_id ASC
```

#### getLessonsByModuleId (R)

```typescript
async function getLessonsByModuleId(moduleId: number): Promise<LessonRecord[]>
```

**Query:**
```sql
SELECT * FROM lessons WHERE module_id = ? ORDER BY order_number ASC
```

#### getLessonById (R)

```typescript
async function getLessonById(lessonId: number): Promise<LessonRecord | null>
```

**Query:**
```sql
SELECT * FROM lessons WHERE lesson_id = ?
```

---

### 3.4 Lesson Content

#### listLessonContent (R)

```typescript
async function listLessonContent(): Promise<LessonContentRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content ORDER BY lesson_content_id ASC
```

#### listLessonContentByLessonId (R)

```typescript
async function listLessonContentByLessonId(lessonId: number): Promise<LessonContentRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content WHERE lesson_id = ? ORDER BY lesson_content_id ASC
```

#### getLessonContentById (R)

```typescript
async function getLessonContentById(lessonContentId: number): Promise<LessonContentRecord | null>
```

**Query:**
```sql
SELECT * FROM lesson_content WHERE lesson_content_id = ?
```

---

### 3.5 Content Info

#### listContentInfo (R)

```typescript
async function listContentInfo(): Promise<ContentInfoRecord[]>
```

**Query:**
```sql
SELECT * FROM content_info ORDER BY content_info_id ASC
```

#### listContentInfoByLessonContentId (R)

```typescript
async function listContentInfoByLessonContentId(lessonContentId: number): Promise<ContentInfoRecord[]>
```

**Query:**
```sql
SELECT * FROM content_info WHERE lesson_content_id = ? ORDER BY content_info_id ASC
```

#### getContentInfoById (R)

```typescript
async function getContentInfoById(contentInfoId: number): Promise<ContentInfoRecord | null>
```

**Query:**
```sql
SELECT * FROM content_info WHERE content_info_id = ?
```

---

### 3.6 Lesson Info

#### listLessonInfoByLessonId (R)

```typescript
async function listLessonInfoByLessonId(lessonId: number): Promise<LessonInfoRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_info WHERE lesson_id = ? ORDER BY lesson_info_id ASC
```

---

### 3.7 Lesson Links

#### listLessonLinkByLessonId (R)

```typescript
async function listLessonLinkByLessonId(lessonId: number): Promise<LessonLinkRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_link WHERE lesson_id = ? ORDER BY lesson_link_id ASC
```

---

### 3.8 Questions

#### listQuestionInstructByLessonContentId (R)

```typescript
async function listQuestionInstructByLessonContentId(lessonContentId: number): Promise<QuestionInstructRecord[]>
```

**Query:**
```sql
SELECT * FROM question_instruct WHERE lesson_content_id = ? ORDER BY instruct_id ASC
```

#### listQuestionContentByLessonContentId (R)

```typescript
async function listQuestionContentByLessonContentId(lessonContentId: number): Promise<QuestionContentRecord[]>
```

**Query:**
```sql
SELECT * FROM question_content WHERE lesson_content_id = ? ORDER BY question_order ASC
```

#### listQuestionChoiceByQuestionId (R)

```typescript
async function listQuestionChoiceByQuestionId(questionId: number): Promise<QuestionChoiceRecord[]>
```

**Query:**
```sql
SELECT * FROM question_choice WHERE question_id = ? ORDER BY choice_id ASC
```

---

### 3.9 Job Sheets

#### listJobSheetByLessonContentId (R)

```typescript
async function listJobSheetByLessonContentId(lessonContentId: number): Promise<JobSheetRecord[]>
```

**Query:**
```sql
SELECT * FROM job_sheet WHERE lesson_content_id = ? ORDER BY job_id ASC
```

#### getJobSheetByLessonContentId (R)

```typescript
async function getJobSheetByLessonContentId(lessonContentId: number): Promise<JobSheetRecord | null>
```

**Query:**
```sql
SELECT * FROM job_sheet WHERE lesson_content_id = ? LIMIT 1
```

---

### 3.10 Performance Checklists

#### listPerformanceCheckByLessonContentId (R)

```typescript
async function listPerformanceCheckByLessonContentId(lessonContentId: number): Promise<PerformanceCheckRecord[]>
```

**Query:**
```sql
SELECT * FROM performance_checklist WHERE lesson_content_id = ? ORDER BY performance_order ASC
```

---

## 4. Question Answers

### 4.1 createQuestionAnswer (C)

Create a single question answer (with upsert).

```typescript
async function createQuestionAnswer(payload: {
  question_id: number;
  user_id: number;
  answer_text: string;
}): Promise<QuestionAnswerRecord>
```

**Validation:**
- `question_id` > 0
- `answer_text` non-empty after trim

**Process:**
1. Check if `(question_id, user_id)` combination exists
2. If exists: UPDATE existing record
3. If not exists: INSERT new record

**Query (Insert):**
```sql
INSERT INTO question_answers (answer_id, question_id, user_id, answer_text, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?)
```

**Query (Update):**
```sql
UPDATE question_answers SET answer_text = ?, updated_at = ?
WHERE question_id = ? AND user_id = ?
```

---

### 4.2 createQuestionAnswersBatch (C)

Create multiple question answers in batch.

```typescript
async function createQuestionAnswersBatch(payload: {
  user_id: number;
  answers: { question_id: number; answer_text: string }[];
}): Promise<QuestionAnswerRecord[]>
```

**Process:**
- Loops through each answer
- For each: checks if exists → UPDATE if found, INSERT if new

---

### 4.3 listQuestionAnswers (R)

```typescript
async function listQuestionAnswers(): Promise<QuestionAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM question_answers ORDER BY answer_id ASC
```

---

### 4.4 listQuestionAnswersByUser (R)

```typescript
async function listQuestionAnswersByUser(userId: number): Promise<QuestionAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM question_answers WHERE user_id = ? ORDER BY answer_id ASC
```

---

### 4.5 listQuestionAnswersByUserAndQuestions (R)

```typescript
async function listQuestionAnswersByUserAndQuestions(
  userId: number,
  questionIds: number[]
): Promise<QuestionAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM question_answers
WHERE user_id = ? AND question_id IN (?,?,?,...)
ORDER BY answer_id ASC
```

---

## 5. Job Sheet Answers

### 5.1 createJobSheetAnswer (C)

Create job sheet answer.

```typescript
async function createJobSheetAnswer(payload: {
  job_id: number;
  user_id: number;
  answer_text: string;
}): Promise<JobSheetAnswerRecord>
```

**Validation:**
- `job_id` > 0, `user_id` > 0
- `answer_text` non-empty after trim
- `(job_id, user_id)` must be unique

**Query:**
```sql
INSERT INTO job_sheet_answers (answer_id, job_id, user_id, answer_text, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?)
```

**Errors:**
- `"An answer for this job sheet already exists."`

---

### 5.2 listJobSheetAnswersByUser (R)

```typescript
async function listJobSheetAnswersByUser(userId: number): Promise<JobSheetAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM job_sheet_answers WHERE user_id = ? ORDER BY answer_id ASC
```

---

### 5.3 listJobSheetAnswersByUserAndJob (R)

```typescript
async function listJobSheetAnswersByUserAndJob(
  userId: number,
  jobId: number
): Promise<JobSheetAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM job_sheet_answers WHERE user_id = ? AND job_id = ?
```

---

## 6. Performance Answers

### 6.1 createPerformanceAnswer (C)

Create performance checklist answer.

```typescript
async function createPerformanceAnswer(payload: {
  performance_id: number;
  user_id: number;
  performance_answer_text: string;
}): Promise<void>
```

**Validation:**
- `performance_id` > 0, `user_id` > 0
- `performance_answer_text` non-empty

**Query:**
```sql
INSERT INTO performance_answer (performance_answer_id, performance_id, user_id, performance_answer_text, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?)
```

---

### 6.2 listPerformanceAnswersByUser (R)

```typescript
async function listPerformanceAnswersByUser(userId: number): Promise<PerformanceAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM performance_answer WHERE user_id = ? ORDER BY performance_answer_id ASC
```

---

### 6.3 listPerformanceAnswersByUserAndPerformance (R)

```typescript
async function listPerformanceAnswersByUserAndPerformance(
  userId: number,
  performanceId: number
): Promise<PerformanceAnswerRecord[]>
```

**Query:**
```sql
SELECT * FROM performance_answer WHERE user_id = ? AND performance_id = ?
```

---

## 7. Lesson Content Progress

### 7.1 createLessonContentProgress (C)

Mark lesson content as read.

```typescript
async function createLessonContentProgress(payload: {
  lesson_content_id: number;
  user_id: number;
  is_read: boolean;
}): Promise<void>
```

**Query:**
```sql
INSERT INTO lesson_content_progress (progress_lesson_id, lesson_content_id, user_id, is_read, read_at, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?)
```

---

### 7.2 updateLessonContentProgress (U)

Update progress status.

```typescript
async function updateLessonContentProgress(
  progressLessonId: number,
  payload: { is_read: boolean }
): Promise<void>
```

**Query:**
```sql
UPDATE lesson_content_progress
SET is_read = ?, read_at = ?, updated_at = ?
WHERE progress_lesson_id = ?
```

---

### 7.3 listLessonContentProgressByUser (R)

```typescript
async function listLessonContentProgressByUser(userId: number): Promise<LessonContentProgressRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content_progress WHERE user_id = ? ORDER BY progress_lesson_id ASC
```

---

### 7.4 listLessonContentProgressByLessonContent (R)

```typescript
async function listLessonContentProgressByLessonContent(
  lessonContentId: number
): Promise<LessonContentProgressRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content_progress WHERE lesson_content_id = ?
```

---

### 7.5 listLessonContentProgressByUserAndLessonContent (R)

```typescript
async function listLessonContentProgressByUserAndLessonContent(
  userId: number,
  lessonContentId: number
): Promise<LessonContentProgressRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content_progress WHERE user_id = ? AND lesson_content_id = ?
```

---

## 8. Lesson Content Bookmarks

### 8.1 createLessonContentBookmark (C)

Create bookmark.

```typescript
async function createLessonContentBookmark(payload: {
  lesson_content_id: number;
  user_id: number;
  is_bookmark: boolean;
}): Promise<void>
```

**Query:**
```sql
INSERT INTO lesson_content_bookmark (lesson_content_bookmark_id, lesson_content_id, user_id, is_bookmark, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?)
```

**Constraint:** UNIQUE(user_id, lesson_content_id)

---

### 8.2 updateLessonContentBookmark (U)

Update bookmark status.

```typescript
async function updateLessonContentBookmark(
  lessonContentBookmarkId: number,
  payload: { is_bookmark: boolean }
): Promise<void>
```

**Query:**
```sql
UPDATE lesson_content_bookmark SET is_bookmark = ?, updated_at = ?
WHERE lesson_content_bookmark_id = ?
```

---

### 8.3 listLessonContentBookmarkByUser (R)

```typescript
async function listLessonContentBookmarkByUser(userId: number): Promise<LessonContentBookmarkRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content_bookmark WHERE user_id = ? AND is_bookmark = 1
ORDER BY lesson_content_bookmark_id ASC
```

---

### 8.4 listLessonContentBookmarkByUserAndLessonContent (R)

```typescript
async function listLessonContentBookmarkByUserAndLessonContent(
  userId: number,
  lessonContentId: number
): Promise<LessonContentBookmarkRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_content_bookmark WHERE user_id = ? AND lesson_content_id = ?
```

---

## 9. Achievements

### 9.1 Achievement Catalog

#### listModuleAchievements (R)

```typescript
async function listModuleAchievements(): Promise<ModuleAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM module_achievement ORDER BY module_achievement_id ASC
```

#### listModuleAchievementsByModule (R)

```typescript
async function listModuleAchievementsByModule(moduleId: number): Promise<ModuleAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM module_achievement WHERE module_id = ?
```

#### listLessonAchievements (R)

```typescript
async function listLessonAchievements(): Promise<LessonAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_achievement ORDER BY lesson_achievement_id ASC
```

#### listLessonAchievementsByLesson (R)

```typescript
async function listLessonAchievementsByLesson(lessonId: number): Promise<LessonAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM lesson_achievement WHERE lesson_id = ?
```

#### getLessonAchievementById (R)

```typescript
async function getLessonAchievementById(achievementId: number): Promise<LessonAchievementRecord | null>
```

**Query:**
```sql
SELECT * FROM lesson_achievement WHERE lesson_achievement_id = ?
```

---

### 9.2 Student Lesson Achievements

#### createStudentLessonAchievement (C)

```typescript
async function createStudentLessonAchievement(payload: {
  lesson_achievement_id: number;
  user_id: number;
}): Promise<StudentLessonAchievementRecord>
```

**Query:**
```sql
INSERT INTO student_lesson_achievement (stud_lesson_achievement_id, lesson_achievement_id, user_id, created_at, updated_at)
VALUES (?, ?, ?, ?, ?)
```

**Constraint:** UNIQUE(user_id, lesson_achievement_id)

---

#### listStudentLessonAchievementByUser (R)

```typescript
async function listStudentLessonAchievementByUser(userId: number): Promise<StudentLessonAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM student_lesson_achievement WHERE user_id = ?
ORDER BY stud_lesson_achievement_id ASC
```

---

#### listStudentLessonAchievementByUserAndLessonAchievement (R)

```typescript
async function listStudentLessonAchievementByUserAndLessonAchievement(
  userId: number,
  lessonAchievementId: number
): Promise<StudentLessonAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM student_lesson_achievement WHERE user_id = ? AND lesson_achievement_id = ?
```

---

#### deleteStudentLessonAchievement (D)

```typescript
async function deleteStudentLessonAchievement(studId: number): Promise<void>
```

**Query:**
```sql
DELETE FROM student_lesson_achievement WHERE stud_lesson_achievement_id = ?
```

---

### 9.3 Student Module Achievements

#### createStudentModuleAchievement (C)

```typescript
async function createStudentModuleAchievement(payload: {
  module_achievement_id: number;
  user_id: number;
}): Promise<StudentModuleAchievementRecord>
```

**Query:**
```sql
INSERT INTO student_module_achievement (stud_module_achievement_id, module_achievement_id, user_id, created_at, updated_at)
VALUES (?, ?, ?, ?, ?)
```

**Constraint:** UNIQUE(user_id, module_achievement_id)

---

#### listStudentModuleAchievementByUser (R)

```typescript
async function listStudentModuleAchievementByUser(userId: number): Promise<StudentModuleAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM student_module_achievement WHERE user_id = ?
ORDER BY stud_module_achievement_id ASC
```

---

#### listStudentModuleAchievementByUserAndModuleAchievement (R)

```typescript
async function listStudentModuleAchievementByUserAndModuleAchievement(
  userId: number,
  moduleAchievementId: number
): Promise<StudentModuleAchievementRecord[]>
```

**Query:**
```sql
SELECT * FROM student_module_achievement WHERE user_id = ? AND module_achievement_id = ?
```

---

## 10. Tutorials

### 10.1 createStudentTutorial (C)

```typescript
async function createStudentTutorial(payload: {
  user_id: number;
  completed?: boolean;
  step1_done?: boolean;
  step2_done?: boolean;
  step3_done?: boolean;
}): Promise<StudentTutorialRecord>
```

**Query:**
```sql
INSERT INTO student_tutorials (tutorial_id, user_id, completed, step1_done, step2_done, step3_done, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

**Constraint:** UNIQUE(user_id)

---

### 10.2 getStudentTutorialByUserId (R)

```typescript
async function getStudentTutorialByUserId(userId: number): Promise<StudentTutorialRecord | null>
```

**Query:**
```sql
SELECT * FROM student_tutorials WHERE user_id = ?
```

---

### 10.3 listStudentTutorialByUser (R)

```typescript
async function listStudentTutorialByUser(userId: number): Promise<StudentTutorialRecord[]>
```

**Query:**
```sql
SELECT * FROM student_tutorials WHERE user_id = ?
```

---

### 10.4 updateStudentTutorial (U)

```typescript
async function updateStudentTutorial(
  tutorialId: number,
  payload: Partial<Omit<StudentTutorialRecord, "tutorial_id" | "created_at" | "updated_at">>
): Promise<void>
```

**Query:**
```sql
UPDATE student_tutorials
SET [completed = ?,] [step1_done = ?,] [step2_done = ?,] [step3_done = ?,] updated_at = ?
WHERE tutorial_id = ?
```

---

## 11. Reports & Analytics

### 11.1 getStudentReportData (R)

Aggregate all user data for PDF export.

```typescript
async function getStudentReportData(userId: number): Promise<StudentReportData>
```

**Queries (12 parallel):**
1. User info
2. Student profile
3. Question answers JOIN question_content
4. Job sheet answers JOIN job_sheet
5. Performance answers JOIN performance_checklist
6. Lesson content progress JOIN lesson_content + lessons
7. Bookmarks JOIN lesson_content + lessons
8. Lesson achievements JOIN lesson_achievement
9. Module achievements JOIN module_achievement
10. All modules
11. All lessons
12. All lesson contents

**Response:**
```typescript
{
  user: StudentUser | null;
  studentInfo: StudentProfile | null;
  questionAnswers: (QuestionAnswerRecord & { question_text: string })[];
  jobSheetAnswers: (JobSheetAnswerRecord & { job_title: string })[];
  performanceAnswers: (PerformanceAnswerRecord & { performance_question: string })[];
  lessonContentProgress: (LessonContentProgressRecord & { content_name: string; lesson_name: string })[];
  lessonContentBookmarks: (LessonContentBookmarkRecord & { content_name: string; lesson_name: string })[];
  studentLessonAchievements: (StudentLessonAchievementRecord & { achievement_name: string })[];
  studentModuleAchievements: (StudentModuleAchievementRecord & { achievement_name: string })[];
  weeklyActivity: number[];
  moduleProgress: ModuleProgressReport[];
}
```

---

### 11.2 getWeeklyActivity (R)

Get 7-day activity counts (Mon-Sun).

```typescript
async function getWeeklyActivity(userId: number): Promise<number[]>
```

**Query:**
```sql
SELECT COUNT(*) as count, strftime('%w', created_at) as day_of_week
FROM (
  SELECT created_at FROM question_answers WHERE user_id = ?
  UNION ALL
  SELECT created_at FROM job_sheet_answers WHERE user_id = ?
  UNION ALL
  SELECT created_at FROM performance_answer WHERE user_id = ?
  UNION ALL
  SELECT created_at FROM lesson_content_progress WHERE user_id = ?
  UNION ALL
  SELECT created_at FROM student_lesson_achievement WHERE user_id = ?
  UNION ALL
  SELECT created_at FROM student_module_achievement WHERE user_id = ?
)
WHERE created_at BETWEEN ? AND ?
GROUP BY day_of_week
```

**Returns:** Array of 7 integers [Mon, Tue, Wed, Thu, Fri, Sat, Sun]

---

### 11.3 getDailyActivity (R)

Get categorized activity records for a specific day.

```typescript
async function getDailyActivity(
  userId: number,
  dateStr: string
): Promise<DailyActivityRecord[]>
```

**Queries (7 separate):**
1. Question answers
2. Job sheet answers
3. Performance answers
4. Lesson content progress
5. Bookmarks
6. Lesson achievements
7. Module achievements

**Response:**
```typescript
[
  { type: "quiz", title: "Question answered", created_at: "..." },
  { type: "job_sheet", title: "Job sheet completed", created_at: "..." },
  { type: "performance", title: "Performance check", created_at: "..." },
  { type: "progress", title: "Content read", created_at: "..." },
  { type: "bookmark", title: "Content bookmarked", created_at: "..." },
  { type: "lesson_achievement", title: "Lesson badge earned", created_at: "..." },
  { type: "module_achievement", title: "Module badge earned", created_at: "..." }
]
```

---

### 11.4 listContinueLearning (R)

Get last read content + next unread content.

```typescript
async function listContinueLearning(userId: number): Promise<ContinueLearningRecord[]>
```

**Query:**
```sql
SELECT
  lcp.lesson_content_id,
  lc.lesson_id,
  l.module_id,
  lc.content_name,
  lcp.read_at,
  lcp.updated_at,
  CASE WHEN next.lesson_content_id IS NOT NULL THEN 1 ELSE 0 END as has_next,
  next.lesson_content_id as next_content_id,
  next.content_name as next_content_name
FROM lesson_content_progress lcp
JOIN lesson_content lc ON lc.lesson_content_id = lcp.lesson_content_id
JOIN lessons l ON l.lesson_id = lc.lesson_id
LEFT JOIN lesson_content next ON next.lesson_id = lc.lesson_id
  AND next.lesson_content_id = (
    SELECT MIN(lc2.lesson_content_id) FROM lesson_content lc2
    WHERE lc2.lesson_id = lc.lesson_id AND lc2.lesson_content_id > lc.lesson_content_id
    AND lc2.lesson_content_id NOT IN (
      SELECT lesson_content_id FROM lesson_content_progress
      WHERE user_id = ? AND is_read = 1
    )
  )
WHERE lcp.user_id = ? AND lcp.is_read = 1
ORDER BY lcp.updated_at DESC
```

---

## 12. Data Import/Reset

### 12.1 resetAndSeedLocalData (C/D)

Full reset and re-seed of curriculum data.

```typescript
async function resetAndSeedLocalData(): Promise<SeedResult>
```

**Process:**
1. Read existing data from 15 tables
2. Check if all default records exist
3. If all exist: return `{ alreadyImported: true }`
4. If any missing: DELETE all, re-insert defaults

**Tables Affected:**
- `competencies`, `modules`, `lessons`, `lesson_content`
- `content_info`, `lesson_info`, `lesson_link`
- `question_instruct`, `question_content`, `question_choice`
- `job_sheet`, `performance_checklist`
- `module_achievement`, `lesson_achievement`
- `student_lesson_achievement`

**Tables Preserved:**
- `users`, `student_info`, `question_answers`, `job_sheet_answers`
- `performance_answer`, `lesson_content_progress`, `lesson_content_bookmark`
- `student_tutorials`, `student_module_achievement`, `app_settings`

---

## CRUD Summary Table

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| users | registerStudent | loginStudent, getUserById | - | - |
| student_info | createStudentProfile | getStudentProfileByUserId, listStudentProfiles | updateStudentProfile | deleteStudentProfile |
| competencies | (seed) | listCompetencies | - | - |
| modules | (seed) | listModules, getModuleById, getModuleByCompetencyId | - | - |
| lessons | (seed) | listLessons, getLessonById, getLessonsByModuleId | - | - |
| lesson_content | (seed) | listLessonContent, getLessonContentById, listLessonContentByLessonId | - | - |
| content_info | (seed) | listContentInfo, getContentInfoById, listContentInfoByLessonContentId | - | - |
| lesson_info | (seed) | listLessonInfoByLessonId | - | - |
| lesson_link | (seed) | listLessonLinkByLessonId | - | - |
| question_instruct | (seed) | listQuestionInstructByLessonContentId | - | - |
| question_content | (seed) | listQuestionContentByLessonContentId | - | - |
| question_choice | (seed) | listQuestionChoiceByQuestionId | - | - |
| job_sheet | (seed) | listJobSheetByLessonContentId, getJobSheetByLessonContentId | - | - |
| performance_checklist | (seed) | listPerformanceCheckByLessonContentId | - | - |
| question_answers | createQuestionAnswer, createQuestionAnswersBatch | listQuestionAnswers, listQuestionAnswersByUser, listQuestionAnswersByUserAndQuestions | (upsert) | - |
| job_sheet_answers | createJobSheetAnswer | listJobSheetAnswersByUser, listJobSheetAnswersByUserAndJob | - | - |
| performance_answer | createPerformanceAnswer | listPerformanceAnswersByUser, listPerformanceAnswersByUserAndPerformance | - | - |
| lesson_content_progress | createLessonContentProgress | listLessonContentProgressByUser, listLessonContentProgressByUserAndLessonContent | updateLessonContentProgress | - |
| lesson_content_bookmark | createLessonContentBookmark | listLessonContentBookmarkByUser, listLessonContentBookmarkByUserAndLessonContent | updateLessonContentBookmark | - |
| module_achievement | (seed) | listModuleAchievements, listModuleAchievementsByModule | - | - |
| lesson_achievement | (seed) | listLessonAchievements, listLessonAchievementsByLesson, getLessonAchievementById | - | - |
| student_lesson_achievement | createStudentLessonAchievement | listStudentLessonAchievementByUser, listStudentLessonAchievementByUserAndLessonAchievement | - | deleteStudentLessonAchievement |
| student_module_achievement | createStudentModuleAchievement | listStudentModuleAchievementByUser, listStudentModuleAchievementByUserAndModuleAchievement | - | - |
| app_settings | setSetting | getSetting | setSetting | - |
| student_tutorials | createStudentTutorial | getStudentTutorialByUserId, listStudentTutorialByUser | updateStudentTutorial | - |

---

## Error Handling Patterns

### Frontend

```typescript
try {
  await ensureDatabase();
  // ... operation
} catch (error) {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error('An unexpected error occurred.');
}
```

### Backend

```javascript
try {
  const result = await model.create(data);
  sendJson(res, 201, { message: 'Created', data: result });
} catch (error) {
  if (error.message.includes('already exists')) {
    sendJson(res, 409, { message: error.message });
  } else if (error.message.includes('required')) {
    sendJson(res, 400, { message: error.message });
  } else {
    sendJson(res, 500, { message: 'Internal server error' });
  }
}
```

---

## Validation Rules

| Entity | Required Fields | Constraints |
|--------|-----------------|-------------|
| User | username, email, password | Email unique |
| StudentProfile | user_id, first_name, last_name, birthdate, home_address, grade_level | user_id unique |
| QuestionAnswer | question_id, user_id, answer_text | (question_id, user_id) unique |
| JobSheetAnswer | job_id, user_id, answer_text | (job_id, user_id) unique |
| PerformanceAnswer | performance_id, user_id, performance_answer_text | (performance_id, user_id) unique |
| LessonContentProgress | lesson_content_id, user_id, is_read | (lesson_content_id, user_id) unique |
| LessonContentBookmark | lesson_content_id, user_id, is_bookmark | (user_id, lesson_content_id) unique |
| StudentLessonAchievement | lesson_achievement_id, user_id | (user_id, lesson_achievement_id) unique |
| StudentModuleAchievement | module_achievement_id, user_id | (user_id, module_achievement_id) unique |
| StudentTutorial | user_id | user_id unique |

---

## Transaction Usage

**Frontend:** No explicit transactions. Each CRUD operation is a single `db.runAsync()` call. WAL journal mode enabled for better concurrency.

**Backend:** No transactions. JSON file reads/writes are atomic per file.

---

## Batch Operations

| Operation | Location | Details |
|-----------|----------|---------|
| createQuestionAnswersBatch | Frontend | Iterates answers array; upsert for each |
| resetAndSeedLocalData | Frontend | Deletes all reference data, re-inserts 14 datasets |
| getStudentReportData | Frontend | 12 parallel SELECT queries with JOINs |
| getWeeklyActivity | Frontend | 6 UNION ALL queries |
| getDailyActivity | Frontend | 7 separate queries (one per activity type) |
