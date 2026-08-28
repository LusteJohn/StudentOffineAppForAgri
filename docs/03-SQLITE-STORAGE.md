# StudentOfflineApp - SQLite Storage Documentation

## Overview

The app uses `expo-sqlite` to store all data locally in a SQLite database file on the mobile device. The database is designed for offline-first operation with no network connectivity required.

## Database Configuration

### Database File

| Property | Value |
|----------|-------|
| **Name** | `student-offline-auth.db` |
| **Location** | App's private data directory |
| **iOS Path** | `Documents/student-offline-auth.db` |
| **Android Path** | `data/data/<package>/student-offline-auth.db` |
| **Journal Mode** | WAL (Write-Ahead Logging) |
| **Library** | `expo-sqlite` (v57.0.1+) |

### Opening the Database

```typescript
import * as SQLite from 'expo-sqlite';

const databasePromise = SQLite.openDatabaseAsync("student-offline-auth.db");

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await databasePromise;
  await db.execAsync('PRAGMA journal_mode = WAL');
  return db;
}
```

### WAL Mode Benefits

- **Better concurrency:** Readers don't block writers
- **Improved performance:** Sequential writes instead of random writes
- **Crash resilience:** Automatic recovery from crashes

## Database Schema

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SQLite Database Schema                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────────┐
│    users     │────<│  student_info    │
│──────────────│  1:1│──────────────────│
│ user_id (PK) │     │ student_id (PK)  │
│ username     │     │ user_id (FK,UQ)  │
│ email (UQ)   │     │ first_name       │
│ password     │     │ middle_name      │
│ role         │     │ last_name        │
│ created_at   │     │ birthdate        │
└──────────────┘     │ home_address     │
      │              │ grade_level      │
      │              │ student_image    │
      │              └──────────────────┘
      │
      ├──<┌──────────────────┐
      │   │ question_answers │
      │   │──────────────────│
      │   │ answer_id (PK)   │
      │   │ question_id (FK) │
      │   │ user_id (FK)     │
      │   │ answer_text      │
      │   └──────────────────┘
      │
      ├──<┌───────────────────┐
      │   │ job_sheet_answers │
      │   │───────────────────│
      │   │ answer_id (PK)    │
      │   │ job_id (FK)       │
      │   │ user_id (FK)      │
      │   │ answer_text       │
      │   └───────────────────┘
      │
      ├──<┌──────────────────┐
      │   │ performance_answer│
      │   │──────────────────│
      │   │ performance_     │
      │   │   answer_id (PK) │
      │   │ performance_id(FK)│
      │   │ user_id (FK)     │
      │   │ performance_     │
      │   │   answer_text    │
      │   └──────────────────┘
      │
      ├──<┌────────────────────────┐
      │   │ lesson_content_progress │
      │   │────────────────────────│
      │   │ progress_lesson_id (PK) │
      │   │ lesson_content_id (FK)  │
      │   │ user_id (FK)            │
      │   │ is_read                 │
      │   │ read_at                 │
      │   └────────────────────────┘
      │
      ├──<┌────────────────────────┐
      │   │ lesson_content_bookmark │
      │   │────────────────────────│
      │   │ lesson_content_         │
      │   │   bookmark_id (PK)      │
      │   │ lesson_content_id (FK)  │
      │   │ user_id (FK)            │
      │   │ is_bookmark             │
      │   │ UNIQUE(user_id,         │
      │   │   lesson_content_id)    │
      │   └────────────────────────┘
      │
      ├──<┌────────────────────────┐
      │   │ student_lesson_         │
      │   │   achievement            │
      │   │────────────────────────│
      │   │ stud_lesson_            │
      │   │   achievement_id (PK)   │
      │   │ lesson_achievement_id   │
      │   │   (FK)                  │
      │   │ user_id (FK)            │
      │   │ UNIQUE(user_id,         │
      │   │   lesson_achievement_id)│
      │   └────────────────────────┘
      │
      └──<┌────────────────────────┐
          │ student_module_         │
          │   achievement            │
          │────────────────────────│
          │ stud_module_            │
          │   achievement_id (PK)   │
          │ module_achievement_id   │
          │   (FK)                  │
          │ user_id (FK)            │
          │ UNIQUE(user_id,         │
          │   module_achievement_id)│
          └────────────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  competencies    │────<│     modules      │
│──────────────────│ 1:N │──────────────────│
│ competency_id(PK)│     │ module_id (PK)   │
│ competency_name  │     │ competency_id(FK)│
│ sector           │     │ module_name      │
│ qualification    │     │ description      │
│ status           │     │ module_pdf       │
│ created_at       │     │ thumbnail        │
│ updated_at       │     └────────┬─────────┘
└──────────────────┘              │
                                  │ 1:N
                                  ▼
                         ┌──────────────────┐
                         │     lessons      │
                         │──────────────────│
                         │ lesson_id (PK)   │
                         │ module_id (FK)   │
                         │ lesson_name      │
                         │ order_number     │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    │ 1:N         │ 1:N         │ 1:N
                    ▼             ▼             ▼
           ┌──────────────┐ ┌──────────┐ ┌──────────────┐
           │lesson_content│ │lesson_   │ │  lesson_     │
           │──────────────│ │  info    │ │  link        │
           │lesson_content│ │──────────│ │──────────────│
           │  _id (PK)    │ │lesson_   │ │lesson_link_  │
           │lesson_id(FK) │ │  info_id │ │  id (PK)     │
           │content_name  │ │  (PK)    │ │lesson_id(FK) │
           │objectives    │ │lesson_id │ │link          │
           └──────┬───────┘ │  (FK)    │ └──────────────┘
                  │         └──────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    │             │             │             │
    │ 1:N         │ 1:N         │ 1:N         │ 1:N
    ▼             ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│content_  │ │question_ │ │question_ │ │performance_  │
│  info    │ │  instruct│ │  content │ │  checklist   │
│──────────│ │──────────│ │──────────│ │──────────────│
│content_  │ │instruct_ │ │question_ │ │performance_  │
│  info_id │ │  id (PK) │ │  id (PK) │ │  id (PK)     │
│  (PK)    │ │lesson_   │ │lesson_   │ │lesson_       │
│lesson_   │ │content_id│ │content_id│ │content_id(FK)│
│content_id│ │  (FK)    │ │  (FK)    │ │performance_  │
│  (FK)    │ │question_ │ │question  │ │  question    │
│label     │ │  instruct│ │question_ │ │performance_  │
│description│ │question_ │ │  type    │ │  order       │
│images    │ │  title   │ │question_ │ └──────────────┘
└──────────┘ │question_ │ │  order   │
             │  label   │ └────┬─────┘
             └──────────┘      │ 1:N
                               ▼
                        ┌──────────────┐
                        │question_     │
                        │  choice      │
                        │──────────────│
                        │choice_id(PK) │
                        │question_id   │
                        │  (FK)        │
                        │choice_label  │
                        │choice_text   │
                        │is_correct    │
                        └──────────────┘

┌──────────────────┐     ┌────────────────────────┐
│  lesson_         │────<│ student_lesson_         │
│  achievement     │     │   achievement           │
│──────────────────│     │────────────────────────│
│ lesson_          │     │ stud_lesson_            │
│   achievement_id │     │   achievement_id (PK)   │
│   (PK)           │     │ lesson_achievement_id   │
│ lesson_id (FK)   │     │   (FK)                  │
│ name             │     │ user_id (FK)            │
│ badge_image      │     └────────────────────────┘
└──────────────────┘

┌──────────────────┐     ┌────────────────────────┐
│  module_         │────<│ student_module_         │
│  achievement     │     │   achievement           │
│──────────────────│     │────────────────────────│
│ module_          │     │ stud_module_            │
│   achievement_id │     │   achievement_id (PK)   │
│   (PK)           │     │ module_achievement_id   │
│ module_id (FK)   │     │   (FK)                  │
│ name             │     │ user_id (FK)            │
│ badge_image      │     └────────────────────────┘
└──────────────────┘

┌──────────────────┐
│  job_sheet       │
│──────────────────│
│ job_id (PK)      │
│ lesson_content_id│
│   (FK)           │
│ job_title        │
│ job_objectives   │
│ job_materials    │
│ job_steps        │
│ job_assesment_   │
│   method         │
└──────────────────┘

┌──────────────────┐
│  app_settings    │
│──────────────────│
│ setting_key (PK) │
│ setting_value    │
└──────────────────┘

┌──────────────────┐
│ student_tutorials│
│──────────────────│
│ tutorial_id (PK) │
│ user_id (FK, UQ) │
│ completed        │
│ step1_done       │
│ step2_done       │
│ step3_done       │
└──────────────────┘
```

## Complete Table Schemas

### 1. users

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INTEGER | PRIMARY KEY, NOT NULL | Unique user identifier |
| username | TEXT | NOT NULL | Student username |
| email | TEXT | NOT NULL, UNIQUE | Student email address |
| password | TEXT | NOT NULL | Password (plaintext in frontend) |
| role | TEXT | NOT NULL | User role (e.g., "student") |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |

---

### 2. student_info

```sql
CREATE TABLE IF NOT EXISTS student_info (
  student_id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  home_address TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  student_image TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| student_id | INTEGER | PRIMARY KEY, NOT NULL | Unique profile identifier |
| user_id | INTEGER | NOT NULL, UNIQUE, FK | Reference to users table |
| first_name | TEXT | NOT NULL | Student first name |
| middle_name | TEXT | - | Student middle name (optional) |
| last_name | TEXT | NOT NULL | Student last name |
| birthdate | TEXT | NOT NULL | Date of birth (ISO 8601) |
| home_address | TEXT | NOT NULL | Home address |
| grade_level | TEXT | NOT NULL | Grade level |
| student_image | TEXT | - | Profile photo URI (optional) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 3. competencies

```sql
CREATE TABLE IF NOT EXISTS competencies (
  competency_id INTEGER PRIMARY KEY NOT NULL,
  competency_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  qualification TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| competency_id | INTEGER | PRIMARY KEY, NOT NULL | Unique competency identifier |
| competency_name | TEXT | NOT NULL | Competency name |
| sector | TEXT | NOT NULL | Industry sector |
| qualification | TEXT | NOT NULL | Qualification title |
| status | TEXT | NOT NULL | Status (Active/Inactive) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 4. modules

```sql
CREATE TABLE IF NOT EXISTS modules (
  module_id INTEGER PRIMARY KEY NOT NULL,
  competency_id INTEGER NOT NULL,
  module_name TEXT NOT NULL,
  description TEXT NOT NULL,
  module_pdf TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (competency_id) REFERENCES competencies(competency_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| module_id | INTEGER | PRIMARY KEY, NOT NULL | Unique module identifier |
| competency_id | INTEGER | NOT NULL, FK | Reference to competencies |
| module_name | TEXT | NOT NULL | Module name |
| description | TEXT | NOT NULL | Module description |
| module_pdf | TEXT | NOT NULL | PDF resource URL |
| thumbnail | TEXT | NOT NULL | Thumbnail image URI |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 5. lessons

```sql
CREATE TABLE IF NOT EXISTS lessons (
  lesson_id INTEGER PRIMARY KEY NOT NULL,
  module_id INTEGER NOT NULL,
  lesson_name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (module_id) REFERENCES modules(module_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_id | INTEGER | PRIMARY KEY, NOT NULL | Unique lesson identifier |
| module_id | INTEGER | NOT NULL, FK | Reference to modules |
| lesson_name | TEXT | NOT NULL | Lesson name |
| order_number | INTEGER | NOT NULL | Display order |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 6. lesson_content

```sql
CREATE TABLE IF NOT EXISTS lesson_content (
  lesson_content_id INTEGER PRIMARY KEY NOT NULL,
  lesson_id INTEGER NOT NULL,
  content_name TEXT NOT NULL,
  objectives TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_content_id | INTEGER | PRIMARY KEY, NOT NULL | Unique content identifier |
| lesson_id | INTEGER | NOT NULL, FK | Reference to lessons |
| content_name | TEXT | NOT NULL | Content name |
| objectives | TEXT | NOT NULL | Learning objectives |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 7. content_info

```sql
CREATE TABLE IF NOT EXISTS content_info (
  content_info_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| content_info_id | INTEGER | PRIMARY KEY, NOT NULL | Unique info identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| label | TEXT | NOT NULL | Info label/title |
| description | TEXT | NOT NULL | Info description |
| images | TEXT | NOT NULL | Image path/URL |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 8. lesson_info

```sql
CREATE TABLE IF NOT EXISTS lesson_info (
  lesson_info_id INTEGER PRIMARY KEY NOT NULL,
  lesson_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  content TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_info_id | INTEGER | PRIMARY KEY, NOT NULL | Unique info identifier |
| lesson_id | INTEGER | NOT NULL, FK | Reference to lessons |
| label | TEXT | NOT NULL | Info label |
| content | TEXT | - | Info content (optional) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 9. lesson_link

```sql
CREATE TABLE IF NOT EXISTS lesson_link (
  lesson_link_id INTEGER PRIMARY KEY NOT NULL,
  lesson_id INTEGER NOT NULL,
  link TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_link_id | INTEGER | PRIMARY KEY, NOT NULL | Unique link identifier |
| lesson_id | INTEGER | NOT NULL, FK | Reference to lessons |
| link | TEXT | NOT NULL | External URL |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 10. question_instruct

```sql
CREATE TABLE IF NOT EXISTS question_instruct (
  instruct_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  question_instruction TEXT NOT NULL,
  question_title TEXT NOT NULL,
  question_label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| instruct_id | INTEGER | PRIMARY KEY, NOT NULL | Unique instruction identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| question_instruction | TEXT | NOT NULL | Instruction text |
| question_title | TEXT | NOT NULL | Question title |
| question_label | TEXT | NOT NULL | Question label |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 11. question_content

```sql
CREATE TABLE IF NOT EXISTS question_content (
  question_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| question_id | INTEGER | PRIMARY KEY, NOT NULL | Unique question identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| question | TEXT | NOT NULL | Question text |
| question_type | TEXT | NOT NULL | Type: multiple_choice, true_or_false, enumeration, identification |
| question_order | INTEGER | NOT NULL | Display order |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 12. question_choice

```sql
CREATE TABLE IF NOT EXISTS question_choice (
  choice_id INTEGER PRIMARY KEY NOT NULL,
  question_id INTEGER NOT NULL,
  choice_label TEXT NOT NULL,
  choice_text TEXT NOT NULL,
  is_correct TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES question_content(question_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| choice_id | INTEGER | PRIMARY KEY, NOT NULL | Unique choice identifier |
| question_id | INTEGER | NOT NULL, FK | Reference to question_content |
| choice_label | TEXT | NOT NULL | Choice label (A, B, C, etc.) |
| choice_text | TEXT | NOT NULL | Choice text |
| is_correct | TEXT | NOT NULL | "correct" for right answer, or answer text for enumeration/identification |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 13. job_sheet

```sql
CREATE TABLE IF NOT EXISTS job_sheet (
  job_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  job_title TEXT NOT NULL,
  job_objectives TEXT NOT NULL,
  job_materials TEXT NOT NULL,
  job_steps TEXT NOT NULL,
  job_assesment_method TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| job_id | INTEGER | PRIMARY KEY, NOT NULL | Unique job sheet identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| job_title | TEXT | NOT NULL | Job sheet title |
| job_objectives | TEXT | NOT NULL | Learning objectives |
| job_materials | TEXT | NOT NULL | Required materials |
| job_steps | TEXT | NOT NULL | Procedure steps |
| job_assesment_method | TEXT | NOT NULL | Assessment method |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 14. question_answers

```sql
CREATE TABLE IF NOT EXISTS question_answers (
  answer_id INTEGER PRIMARY KEY NOT NULL,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES question_content(question_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| answer_id | INTEGER | PRIMARY KEY, NOT NULL | Unique answer identifier |
| question_id | INTEGER | NOT NULL, FK | Reference to question_content |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| answer_text | TEXT | NOT NULL | Student's answer |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 15. job_sheet_answers

```sql
CREATE TABLE IF NOT EXISTS job_sheet_answers (
  answer_id INTEGER PRIMARY KEY NOT NULL,
  job_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES job_sheet(job_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| answer_id | INTEGER | PRIMARY KEY, NOT NULL | Unique answer identifier |
| job_id | INTEGER | NOT NULL, FK | Reference to job_sheet |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| answer_text | TEXT | NOT NULL | Student's answer (may include image URIs) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 16. performance_checklist

```sql
CREATE TABLE IF NOT EXISTS performance_checklist (
  performance_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  performance_question TEXT NOT NULL,
  performance_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| performance_id | INTEGER | PRIMARY KEY, NOT NULL | Unique checklist item identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| performance_question | TEXT | NOT NULL | Checklist question |
| performance_order | INTEGER | NOT NULL | Display order |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 17. performance_answer

```sql
CREATE TABLE IF NOT EXISTS performance_answer (
  performance_answer_id INTEGER PRIMARY KEY NOT NULL,
  performance_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  performance_answer_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (performance_id) REFERENCES performance_checklist(performance_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| performance_answer_id | INTEGER | PRIMARY KEY, NOT NULL | Unique answer identifier |
| performance_id | INTEGER | NOT NULL, FK | Reference to performance_checklist |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| performance_answer_text | TEXT | NOT NULL | "Yes" or "No" |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 18. lesson_content_progress

```sql
CREATE TABLE IF NOT EXISTS lesson_content_progress (
  progress_lesson_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  read_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| progress_lesson_id | INTEGER | PRIMARY KEY, NOT NULL | Unique progress identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| is_read | INTEGER | NOT NULL, DEFAULT 0 | 0 = unread, 1 = read |
| read_at | TEXT | NOT NULL | Timestamp when marked as read |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 19. lesson_content_bookmark

```sql
CREATE TABLE IF NOT EXISTS lesson_content_bookmark (
  lesson_content_bookmark_id INTEGER PRIMARY KEY NOT NULL,
  lesson_content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_bookmark INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE(user_id, lesson_content_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_content_bookmark_id | INTEGER | PRIMARY KEY, NOT NULL | Unique bookmark identifier |
| lesson_content_id | INTEGER | NOT NULL, FK | Reference to lesson_content |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| is_bookmark | INTEGER | NOT NULL, DEFAULT 0 | 0 = not bookmarked, 1 = bookmarked |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Constraint:** UNIQUE(user_id, lesson_content_id) - one bookmark per content per user

---

### 20. module_achievement

```sql
CREATE TABLE IF NOT EXISTS module_achievement (
  module_achievement_id INTEGER PRIMARY KEY NOT NULL,
  module_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  badge_image TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (module_id) REFERENCES modules(module_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| module_achievement_id | INTEGER | PRIMARY KEY, NOT NULL | Unique achievement identifier |
| module_id | INTEGER | NOT NULL, FK | Reference to modules |
| name | TEXT | NOT NULL | Achievement name |
| badge_image | TEXT | NOT NULL | Badge image path |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 21. lesson_achievement

```sql
CREATE TABLE IF NOT EXISTS lesson_achievement (
  lesson_achievement_id INTEGER PRIMARY KEY NOT NULL,
  lesson_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  badge_image TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lesson_achievement_id | INTEGER | PRIMARY KEY, NOT NULL | Unique achievement identifier |
| lesson_id | INTEGER | NOT NULL, FK | Reference to lessons |
| name | TEXT | NOT NULL | Achievement name |
| badge_image | TEXT | NOT NULL | Badge image path |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

### 22. student_lesson_achievement

```sql
CREATE TABLE IF NOT EXISTS student_lesson_achievement (
  stud_lesson_achievement_id INTEGER PRIMARY KEY NOT NULL,
  lesson_achievement_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lesson_achievement_id) REFERENCES lesson_achievement(lesson_achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE(user_id, lesson_achievement_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| stud_lesson_achievement_id | INTEGER | PRIMARY KEY, NOT NULL | Unique record identifier |
| lesson_achievement_id | INTEGER | NOT NULL, FK | Reference to lesson_achievement |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Constraint:** UNIQUE(user_id, lesson_achievement_id) - one achievement per user

---

### 23. student_module_achievement

```sql
CREATE TABLE IF NOT EXISTS student_module_achievement (
  stud_module_achievement_id INTEGER PRIMARY KEY NOT NULL,
  module_achievement_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (module_achievement_id) REFERENCES module_achievement(module_achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE(user_id, module_achievement_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| stud_module_achievement_id | INTEGER | PRIMARY KEY, NOT NULL | Unique record identifier |
| module_achievement_id | INTEGER | NOT NULL, FK | Reference to module_achievement |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Constraint:** UNIQUE(user_id, module_achievement_id) - one achievement per user

---

### 24. app_settings

```sql
CREATE TABLE IF NOT EXISTS app_settings (
  setting_key TEXT PRIMARY KEY NOT NULL,
  setting_value TEXT NOT NULL
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| setting_key | TEXT | PRIMARY KEY, NOT NULL | Setting identifier (e.g., "theme_mode") |
| setting_value | TEXT | NOT NULL | Setting value (e.g., "light", "dark", "system") |

---

### 25. student_tutorials

```sql
CREATE TABLE IF NOT EXISTS student_tutorials (
  tutorial_id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  step1_done INTEGER NOT NULL DEFAULT 0,
  step2_done INTEGER NOT NULL DEFAULT 0,
  step3_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE(user_id)
)
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| tutorial_id | INTEGER | PRIMARY KEY, NOT NULL | Unique tutorial identifier |
| user_id | INTEGER | NOT NULL, FK, UNIQUE | Reference to users |
| completed | INTEGER | NOT NULL, DEFAULT 0 | Overall completion flag |
| step1_done | INTEGER | NOT NULL, DEFAULT 0 | Step 1 completion flag |
| step2_done | INTEGER | NOT NULL, DEFAULT 0 | Step 2 completion flag |
| step3_done | INTEGER | NOT NULL, DEFAULT 0 | Step 3 completion flag |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

---

## Data Types

### SQLite Type Affinity

| SQLite Type | Usage | Example Columns |
|-------------|-------|-----------------|
| `INTEGER PRIMARY KEY` | Auto-incrementing IDs | user_id, student_id, competency_id, etc. |
| `INTEGER NOT NULL DEFAULT 0` | Boolean flags | is_read, is_bookmark, completed, step*_done |
| `INTEGER NOT NULL` | Numeric values | order_number, question_order, performance_order |
| `TEXT NOT NULL` | Required strings | names, emails, descriptions, timestamps |
| `TEXT` | Optional strings | middle_name, student_image, content |

### Date Storage

All timestamps stored as TEXT in ISO 8601 format:
```typescript
new Date().toISOString() // "2024-01-15T10:30:00.000Z"
```

### Boolean Storage

Booleans stored as INTEGER:
- `0` = false/unread/not bookmarked
- `1` = true/read/bookmarked

## Index Usage

SQLite automatically creates indexes for:
- All `PRIMARY KEY` columns (implicit clustered index)
- All `UNIQUE` constraints (implicit unique index)

**No explicit `CREATE INDEX` statements** in the codebase. This is acceptable for the expected single-user, small-dataset use case.

## Foreign Key Relationships

| Child Table | Column | Parent Table | Parent Column |
|-------------|--------|--------------|---------------|
| student_info | user_id | users | user_id |
| modules | competency_id | competencies | competency_id |
| lessons | module_id | modules | module_id |
| lesson_content | lesson_id | lessons | lesson_id |
| content_info | lesson_content_id | lesson_content | lesson_content_id |
| lesson_info | lesson_id | lessons | lesson_id |
| lesson_link | lesson_id | lessons | lesson_id |
| question_instruct | lesson_content_id | lesson_content | lesson_content_id |
| question_content | lesson_content_id | lesson_content | lesson_content_id |
| question_choice | question_id | question_content | question_id |
| job_sheet | lesson_content_id | lesson_content | lesson_content_id |
| question_answers | question_id | question_content | question_id |
| question_answers | user_id | users | user_id |
| job_sheet_answers | job_id | job_sheet | job_id |
| job_sheet_answers | user_id | users | user_id |
| performance_checklist | lesson_content_id | lesson_content | lesson_content_id |
| performance_answer | performance_id | performance_checklist | performance_id |
| performance_answer | user_id | users | user_id |
| lesson_content_progress | lesson_content_id | lesson_content | lesson_content_id |
| lesson_content_progress | user_id | users | user_id |
| lesson_content_bookmark | lesson_content_id | lesson_content | lesson_content_id |
| lesson_content_bookmark | user_id | users | user_id |
| module_achievement | module_id | modules | module_id |
| lesson_achievement | lesson_id | lessons | lesson_id |
| student_lesson_achievement | lesson_achievement_id | lesson_achievement | lesson_achievement_id |
| student_lesson_achievement | user_id | users | user_id |
| student_module_achievement | module_achievement_id | module_achievement | module_achievement_id |
| student_module_achievement | user_id | users | user_id |
| student_tutorials | user_id | users | user_id |

## UNIQUE Constraints

| Table | Columns | Purpose |
|-------|---------|---------|
| users | email | One account per email |
| student_info | user_id | One profile per user |
| lesson_content_bookmark | (user_id, lesson_content_id) | One bookmark per content per user |
| student_lesson_achievement | (user_id, lesson_achievement_id) | One achievement per user |
| student_module_achievement | (user_id, module_achievement_id) | One achievement per user |
| student_tutorials | user_id | One tutorial record per user |

## Database File Lifecycle

1. **First Launch:** Database file created, tables created, seed data inserted
2. **Subsequent Launches:** Database opened, migrations checked, data preserved
3. **Data Import:** User can re-seed curriculum data via Settings (preserves user data)
4. **App Uninstall:** Database file deleted with app data

## Storage Location by Platform

| Platform | Path |
|----------|------|
| iOS | `Documents/student-offline-auth.db` |
| Android | `data/data/com.thy.johnmark23.StudentOfflineApp/student-offline-auth.db` |
| Web | Not supported (SQLite plugin not available) | 