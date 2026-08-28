# StudentOfflineApp - Data Importation Documentation

## Overview

The app imports and seeds curriculum data into a local SQLite database on first launch. Data importation occurs through two mechanisms: automatic seeding on database creation and manual re-import via the Settings screen.

## Data Import Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Data Import Sources                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────┐     │
│  │ Frontend Seeds  │    │      Backend Seed Scripts     │     │
│  │ (TypeScript)    │    │       (JavaScript)           │     │
│  └────────┬────────┘    └─────────────┬────────────────┘     │
│           │                           │                      │
│  ┌────────┴────────┐    ┌─────────────┴────────────────┐     │
│  │ auth-api.ts     │    │ backend/scripts/*.js          │     │
│  │ - DEFAULT_*     │    │ - seed-competencies.js        │     │
│  │   constants     │    │ - seed-module.js              │     │
│  │ (inline)        │    │ - seed-lesson.js              │     │
│  │                 │    │ - seed-lesson-content.js      │     │
│  │ content-info-   │    │ - seed-content-info.js        │     │
│  │ seed.ts         │    │ - seed-question-*.js          │     │
│  │ question-*.ts   │    │ - seed-performance-check.js   │     │
│  │ performance-    │    │ - seed-module-achievement.js  │     │
│  │ check-seed.ts   │    │ - seed-lesson-achievement.js  │     │
│  └────────┬────────┘    └─────────────┬────────────────┘     │
│           │                           │                      │
│           ▼                           ▼                      │
│  ┌─────────────────┐    ┌─────────────────────────────┐     │
│  │   SQLite DB     │    │     JSON File Storage       │     │
│  │ student-        │    │ backend/src/data/*.json     │     │
│  │ offline-        │    │                             │     │
│  │ auth.db         │    │                             │     │
│  └─────────────────┘    └─────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Seed Data Sources

### Frontend Seed Files (TypeScript)

| File | Export | Entity | Count |
|------|--------|--------|-------|
| `src/lib/auth-api.ts` | `DEFAULT_STUDENT_ACCOUNT` | users | 1 |
| `src/lib/auth-api.ts` | `DEFAULT_COMPETENCIES` | competencies | 4 |
| `src/lib/auth-api.ts` | `DEFAULT_MODULES` | modules | 4 |
| `src/lib/auth-api.ts` | `DEFAULT_LESSONS` | lessons | 13 |
| `src/lib/auth-api.ts` | `DEFAULT_LESSON_CONTENTS` | lesson_content | 56 |
| `src/lib/auth-api.ts` | `DEFAULT_LESSON_INFO` | lesson_info | 39 |
| `src/lib/auth-api.ts` | `DEFAULT_LESSON_LINKS` | lesson_link | 12 |
| `src/lib/auth-api.ts` | `DEFAULT_JOB_SHEET` | job_sheet | 37 |
| `src/lib/auth-api.ts` | `DEFAULT_MODULE_ACHIEVEMENT` | module_achievement | 5 |
| `src/lib/auth-api.ts` | `DEFAULT_LESSON_ACHIEVEMENT` | lesson_achievement | 13 |
| `src/lib/content-info-seed.ts` | `DEFAULT_CONTENT_INFO` | content_info | 669 |
| `src/lib/question-instruct-seed.ts` | `DEFAULT_QUESTION_INSTRUCT` | question_instruct | 59 |
| `src/lib/question-content-seed.ts` | `DEFAULT_QUESTION_CONTENT` | question_content | 279 |
| `src/lib/question-choice-seed.ts` | `DEFAULT_QUESTION_CHOICE` | question_choice | 518 |
| `src/lib/performance-check-seed.ts` | `DEFAULT_PERFORMANCE_CHECK` | performance_checklist | 202 |

**Total Frontend Seed Records: 1,699+**

### Backend Seed Scripts (JavaScript)

| Script | Entity | Storage |
|--------|--------|---------|
| `seed-competencies.js` | competencies | `data/competencies.json` |
| `seed-module.js` | modules | `data/modules.json` |
| `seed-lesson.js` | lessons | `data/lessons.json` |
| `seed-lesson-content.js` | lesson_content | `data/lesson-content.json` |
| `seed-lesson-info.js` | lesson_info | `data/lesson-info.json` |
| `seed-lesson-link.js` | lesson_link | `data/lesson-link.json` |
| `seed-content-info.js` | content_info | `data/content-information.json` |
| `seed-question-instruct.js` | question_instruct | `data/question-instruction.json` |
| `seed-question-content.js` | question_content | `data/question-content.json` |
| `seed-question-choices.js` | question_choice | `data/question-choice.json` |
| `seed-content-job-sheet.js` | job_sheet | `data/job-sheet.json` |
| `seed-performance-check.js` | performance_checklist | `data/performance-checklist.json` |
| `seed-module-achievement.js` | module_achievement | `data/module-achievement.json` |
| `seed-lesson-achievement.js` | lesson_achievement | `data/lesson-achievement.json` |

## Database Initialization Flow

### `ensureDatabase()` Function

Called automatically on every API invocation to guarantee database readiness:

```typescript
async function ensureDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await databasePromise;

  // 1. Enable WAL journal mode
  await db.execAsync('PRAGMA journal_mode = WAL');

  // 2. Create all 25 tables (CREATE TABLE IF NOT EXISTS)
  for (const ddl of TABLE_DDL) {
    await db.execAsync(ddl);
  }

  // 3. Run migrations
  await migrateLegacyTables(db);

  // 4. Seed default data (idempotent)
  await seedDefaultStudentAccount(db);
  await seedDefaultCompetencies(db);
  await seedDefaultModules(db);
  await seedDefaultLessons(db);
  await seedDefaultLessonContents(db);
  await seedDefaultLessonAchievements(db);
  await seedDefaultModuleAchievements(db);

  return db;
}
```

### Initialization Steps

1. **Open Database:** `SQLite.openDatabaseAsync("student-offline-auth.db")`
2. **WAL Mode:** Enable Write-Ahead Logging for better concurrency
3. **Create Tables:** Execute 25 `CREATE TABLE IF NOT EXISTS` statements
4. **Run Migrations:** Check and fix legacy schema issues
5. **Seed Data:** Insert default records if not already present

## Seeding Order (Hierarchical Dependency)

```
1. Competencies (4)           → Root level
2. Modules (4)                → Depends on competencies
3. Lessons (13)               → Depends on modules
4. Lesson Contents (56)       → Depends on lessons
5. Content Info (669)         → Depends on lesson contents
6. Lesson Info (39)           → Depends on lessons
7. Lesson Links (12)          → Depends on lessons
8. Question Instructions (59) → Depends on lesson contents
9. Question Content (279)     → Depends on lesson contents
10. Question Choices (518)    → Depends on question content
11. Job Sheets (37)           → Depends on lesson contents
12. Performance Checklists (202) → Depends on lesson contents
13. Module Achievements (5)   → Depends on modules
14. Lesson Achievements (13)   → Depends on lessons
```

## Manual Data Import (Settings Screen)

### `resetAndSeedLocalData()` Function

Triggered when user taps "Import Resources" in Settings screen.

### Import Process Flow

```
1. Read existing data from all tables
          │
          ▼
2. Check if all default records already exist
          │
          ├── Yes → Return { alreadyImported: true }
          │
          ▼ No
3. DELETE all data from 15 tables
   (reverse dependency order)
          │
          ▼
4. Reset sqlite_sequence counters
          │
          ▼
5. INSERT all default data
   (forward dependency order)
          │
          ▼
6. Return { alreadyImported: false, counts: {...} }
```

### Idempotency Check

The function checks if ALL default records exist before importing:

| Entity | Match Method |
|--------|--------------|
| Competencies | `competency_name` (case-insensitive) |
| Modules | `module_name` (case-insensitive) |
| Lessons | `lesson_name` (case-insensitive) |
| Lesson Contents | `content_name` (case-insensitive) |
| Content Info | `content_info_id` |
| Lesson Info | `lesson_info_id` |
| Lesson Links | `lesson_link_id` |
| Question Instructions | `instruct_id` |
| Question Content | `question_id` |
| Question Choices | `choice_id` |
| Job Sheets | `job_id` |
| Performance Checklists | `performance_id` |
| Module Achievements | `module_achievement_id` |
| Lesson Achievements | `lesson_achievement_id` |

### Data Loss Warning

When `alreadyImported` is `false`, the function **permanently deletes** all data in 15 tables:

**Cleared Tables:**
- `competencies`, `modules`, `lessons`, `lesson_content`
- `content_info`, `lesson_info`, `lesson_link`
- `question_instruct`, `question_content`, `question_choice`
- `job_sheet`, `performance_checklist`
- `module_achievement`, `lesson_achievement`
- `student_lesson_achievement`

**Preserved Tables (NOT cleared):**
- `users` - Student accounts
- `student_info` - Profile data
- `question_answers` - Quiz answers
- `job_sheet_answers` - Job sheet submissions
- `performance_answer` - Performance submissions
- `lesson_content_progress` - Reading progress
- `lesson_content_bookmark` - Bookmarks
- `student_tutorials` - Tutorial state
- `student_module_achievement` - Earned module badges
- `app_settings` - Theme preferences

## Migration Logic

### `student_lesson_achievement` Migration

```typescript
// Check if table exists with old schema
const tableInfo = await db.getAllAsync(
  "PRAGMA table_info(student_lesson_achievement)"
);

// If user_id column missing, drop and recreate
const hasUserId = tableInfo.some(col => col.name === 'user_id');
if (!hasUserId) {
  await db.execAsync('DROP TABLE IF EXISTS student_lesson_achievement');
}
```

### `modules.module_pdf` Migration

```typescript
try {
  await db.execAsync(
    'ALTER TABLE modules ADD COLUMN module_pdf TEXT DEFAULT ""'
  );
} catch (e) {
  // Column already exists - ignore error
}
```

## Seed Data Structure Examples

### Competency

```typescript
{
  competency_id: 1,
  competency_name: "Organic Agriculture",
  sector: "Agriculture",
  qualification: "Organic Agriculture Production NC II",
  status: "Active",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Module

```typescript
{
  module_id: 1,
  competency_id: 1,
  module_name: "Produce Organic Vegetables",
  description: "Learn to produce organic vegetables...",
  module_pdf: "",
  thumbnail: "assets/module_images/M1/thumbnail.png",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Lesson

```typescript
{
  lesson_id: 1,
  module_id: 1,
  lesson_name: "Introduction to Organic Farming",
  order_number: 1,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Lesson Content

```typescript
{
  lesson_content_id: 1,
  lesson_id: 1,
  content_name: "What is Organic Agriculture?",
  objectives: "Define organic agriculture...",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Question Content (with choices cross-reference)

```typescript
{
  question_id: 1,
  lesson_content_id: 1,
  question: "What is the primary goal of organic farming?",
  question_type: "multiple_choice",
  question_order: 1,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}

// Corresponding choices
{
  choice_id: 1,
  question_id: 1,
  choice_label: "A",
  choice_text: "Maximize yield using chemicals",
  is_correct: ""
}
{
  choice_id: 2,
  question_id: 1,
  choice_label: "B",
  choice_text: "Produce food sustainably",
  is_correct: "correct"
}
```

### Question Types

| Type | Description | Answer Storage |
|------|-------------|----------------|
| `multiple_choice` | Select one from choices | Choice with `is_correct === "correct"` |
| `true_or_false` | True or False | Choice with `is_correct === "correct"` |
| `enumeration` | List items | `is_correct` field contains answer text |
| `identification` | Single answer | `is_correct` field contains answer text |

## Data Import Return Value

```typescript
{
  competencies: 4,
  modules: 4,
  lessons: 13,
  lessonContents: 56,
  contentInfo: 669,
  lessonInfo: 39,
  lessonLink: 12,
  questionInstruct: 59,
  questionContent: 279,
  questionChoice: 518,
  jobSheet: 37,
  performanceCheck: 202,
  moduleAchievement: 5,
  lessonAchievement: 13,
  questionAnswers: 0,
  alreadyImported: boolean  // true if data already present
}
```

## Backend Seeding

Backend uses incremental idempotent seeding via individual scripts:

```javascript
// Pattern used in all backend seed scripts
const existingRecords = await model.list();
const existingIds = new Set(existingRecords.map(r => r.id_field));

for (const seedItem of SEED_DATA) {
  if (existingIds.has(seedItem.id_field)) {
    continue; // Skip existing records
  }
  await model.create(seedItem);
}
```

### Running Backend Seeds

```bash
# Only seed:competencies is registered in package.json
npm run seed:competencies

# Other seeds must be run directly
node scripts/seed-module.js
node scripts/seed-lesson.js
node scripts/seed-content-info.js
# etc.
```

## Entity Relationship Summary

```
Competency (1) ──────── (1) Module (1) ──────── (N) Lesson
                                           │            │
                                           │            ├── (N) Lesson Content
                                           │            │         │
                                           │            │         ├── (N) Content Info
                                           │            │         ├── (N) Question Instruct
                                           │            │         ├── (N) Question Content (1) ── (N) Question Choice
                                           │            │         ├── (N) Job Sheet
                                           │            │         └── (N) Performance Checklist
                                           │            │
                                           │            ├── (N) Lesson Info
                                           │            ├── (N) Lesson Link
                                           │            └── (N) Lesson Achievement
                                           │
                                           └── (N) Module Achievement
```
