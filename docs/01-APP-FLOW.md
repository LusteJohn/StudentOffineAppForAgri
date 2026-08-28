# StudentOfflineApp - App Flow Documentation

## Overview

StudentOfflineApp is an offline-first React Native (Expo) application for organic agriculture learning. The app operates entirely offline using a local SQLite database, with a Node.js backend available for API access.

## Application Entry Flow

```
App Launch
  │
  ▼
[index.tsx] ──► Redirect to /login
  │
  ▼
[login.tsx] ── Student Login
  │  ├── Hardware Back → Exit confirmation alert
  │  ├── Register link → /register
  │  └── Login success → /home?userId=X
  │
[register.tsx] ── Student Registration
  │  ├── Login link → /login
  │  └── Register success → /home?userId=X
  │
[home.tsx] ── Student Dashboard
  │  ├── Tutorial Overlay (first run only)
  │  ├── Continue Learning card → /content-info/[id]
  │  ├── Weekly Activity day tap → Daily Activity Modal
  │  ├── Module Progress bar tap → Module Progress Modal
  │  └── Bottom Nav → Module, Lesson, Achievement, Settings
  │
[module.tsx] ── Competency/Module Browser
  │  ├── Competency card → Detail Modal
  │  │              └── Start Module → /lesson?moduleId=X
  │  └── Bottom Nav
  │
[lesson.tsx] ── Lesson List
  │  ├── Expand module → see lessons
  │  ├── Lesson View button → Lesson Detail Modal
  │  │                    └── View Content (if unlocked) → /content-info/[id]
  │  └── Bottom Nav
  │
[content-info/index.tsx] ── Content Info List
  │  └── Lists grouped content info (browse only)
  │
[content-info/[id].tsx] ── Content Detail (Main Learning Screen)
  │  ├── Back → /lesson
  │  ├── Mark as Read → triggers achievement checks → Congrats Modal
  │  ├── Bookmark toggle
  │  ├── Exercise tab → answer questions → submit
  │  ├── Job Sheet tab → answer modal with images → submit
  │  ├── Performance tab → Yes/No checklist → submit
  │  └── Bottom Nav
  │
[achievement.tsx] ── Achievements Screen
  │  ├── Module / Lesson tabs
  │  ├── Expand achievements to see details
  │  └── Auto-awards achievements based on progress
  │
[settings.tsx] ── Settings Screen
  │  ├── Profile modal (create/update)
  │  ├── Import Resources → resetAndSeedLocalData()
  │  ├── Bookmarks list → Open → /content-info/[id]
  │  ├── Export Report → PDF generation & share
  │  ├── Theme toggle (Light/Dark/System)
  │  └── Logout → /login
```

## Screen-by-Screen Breakdown

### 1. Login Screen (`/login`)

**Purpose:** Authenticate students with email and password.

**User Interactions:**
- Enter email and password
- Toggle password visibility
- Submit login form
- Navigate to registration screen
- View default credentials helper

**Data Operations:**
- `loginStudent({ email, password })` - validates credentials
- Returns `AuthResponse` with user object on success

**Navigation Outcomes:**
- Success → `/home` with `userId` parameter
- Register link → `/register`

**Default Credentials:**
- Username: `student1`
- Email: `example@gmail.com`
- Password: `12345`

---

### 2. Registration Screen (`/register`)

**Purpose:** Create a new student account.

**User Interactions:**
- Enter username, email, and password
- Toggle password visibility
- Submit registration form
- Navigate to login screen

**Data Operations:**
- `registerStudent({ username, email, password })` - creates user
- Email uniqueness validation

**Navigation Outcomes:**
- Success → `/home` with `userId` parameter
- Login link → `/login`

---

### 3. Home Dashboard (`/home`)

**Purpose:** Main dashboard showing learning progress and navigation hub.

**User Interactions:**
- View Continue Learning cards (horizontal scroll)
- Tap summary stat cards (competencies, modules, lessons, contents)
- Tap days on Weekly Activity calendar
- Tap module progress bars for detailed view
- Tutorial overlay navigation (first run)
- Hardware back to exit app

**Data Operations:**
- `listCompetencies()` - load competency catalog
- `listModules()` - load module catalog
- `listLessons()` - load lesson catalog
- `listLessonContent()` - load content catalog
- `listPerformanceAnswersByUser(userId)` - user performance records
- `listQuestionAnswersByUser(userId)` - user quiz records
- `listLessonContentProgressByUser(userId)` - reading progress
- `getWeeklyActivity(userId)` - 7-day activity counts
- `getStudentTutorialByUserId(userId)` - tutorial state
- `listContinueLearning(userId)` - recently read + next content

**Navigation Outcomes:**
- Continue Learning card → `/content-info/[id]`
- Tutorial step actions → `/settings`
- Bottom nav → other main screens

---

### 4. Module Browser (`/module`)

**Purpose:** Browse competencies and modules, access learning materials.

**User Interactions:**
- Horizontal category scroll (All, Agriculture, Active)
- Tap competency card to view details
- Download module PDF
- Start module to view lessons
- Pull-to-refresh

**Data Operations:**
- `listCompetencies()` - load all competencies
- `listModules()` - load all modules
- Filter modules by competency_id when competency selected

**Navigation Outcomes:**
- Start Module → `/lesson` with `moduleId` parameter
- Bottom nav → other main screens

---

### 5. Lesson List (`/lesson`)

**Purpose:** Display lessons grouped by module with content access.

**User Interactions:**
- Expand/collapse module headers
- Tap lesson to view detail modal
- Navigate to content info (locked until previous content read)
- Pull-to-refresh

**Data Operations:**
- `listModules()` - load modules
- `listLessons()` - load all lessons
- `listLessonContentProgressByUser(userId)` - build progress map
- `listLessonContentByLessonId(lessonId)` - lesson contents
- `listLessonInfoByLessonId(lessonId)` - lesson info entries
- `listLessonLinkByLessonId(lessonId)` - external links

**Content Unlock Logic:**
- Content items are locked sequentially
- Previous content must be marked as read to unlock next
- Progress tracked via `lesson_content_progress` table

**Navigation Outcomes:**
- View Content → `/content-info/[id]` with content ID
- Bottom nav → other main screens

---

### 6. Content Info List (`/content-info`)

**Purpose:** Browse all content info records grouped by module and lesson.

**User Interactions:**
- Scroll through grouped content info items
- View content labels and descriptions

**Data Operations:**
- `listModules()` - load modules for grouping
- `listLessons()` - load lessons for grouping
- `listContentInfo()` - load all content info
- `listLessonContent()` - load lesson contents for grouping

---

### 7. Content Detail (`/content-info/[id]`)

**Purpose:** Main learning screen with content display, exercises, job sheets, and performance checklists.

**User Interactions:**
- View content info with images (horizontal scroll)
- Mark content as Read/Unread
- Bookmark/unbookmark content
- Switch tabs: Content | Exercise | Job Sheet | Performance
- Exercise tab: answer MCQ, true/false, enumeration, identification questions
- Job Sheet tab: view job sheet, add text answer, upload images
- Performance tab: select Yes/No for checklist items
- Submit answers

**Data Operations:**

*Content Loading:*
- `getLessonContentById(lessonContentId)` - main content
- `getLessonById(lessonId)` - lesson info
- `getModuleById(moduleId)` - module info
- `listContentInfoByLessonContentId(lessonContentId)` - content sheets
- `listLessonContentProgressByUserAndLessonContent(userId, lessonContentId)` - read status
- `listLessonContentBookmarkByUserAndLessonContent(userId, lessonContentId)` - bookmark status
- `checkLessonAchieved(lessonId)` - auto-award lesson achievement
- `checkModuleAchieved(moduleId)` - auto-award module achievement

*Exercise Tab:*
- `listQuestionInstructByLessonContentId(lessonContentId)` - instructions
- `listQuestionContentByLessonContentId(lessonContentId)` - questions
- `listQuestionChoiceByQuestionId(questionId)` - choices
- `listQuestionAnswersByUserAndQuestions(userId, questionIds)` - existing answers
- `createQuestionAnswer(payload)` / `createQuestionAnswersBatch(payload)` - save answers

*Job Sheet Tab:*
- `listJobSheetByLessonContentId(lessonContentId)` - job sheets
- `listJobSheetAnswersByUser(userId)` - existing answers
- `createJobSheetAnswer(payload)` - save answer with image

*Performance Tab:*
- `listPerformanceCheckByLessonContentId(lessonContentId)` - checklist items
- `listPerformanceAnswersByUser(userId)` - existing answers
- `createPerformanceAnswer(payload)` - save answer

**Navigation Outcomes:**
- Back button → `/lesson`
- Congrats modal → achievement awarded

---

### 8. Achievement Screen (`/achievement`)

**Purpose:** Display module and lesson badges, auto-award achievements.

**User Interactions:**
- Switch between Module and Lesson tabs
- Expand achievement cards to see associated items
- View acquired/not-acquired status

**Data Operations:**
- `listModuleAchievements()` - module badge catalog
- `listLessonAchievements()` - lesson badge catalog
- `listLessonContentProgressByUser(userId)` - check completion
- `listStudentLessonAchievementByUser(userId)` - earned lesson badges
- `listStudentModuleAchievementByUser(userId)` - earned module badges
- `createStudentLessonAchievement(payload)` - auto-award lesson badge
- `createStudentModuleAchievement(payload)` - auto-award module badge

**Achievement Auto-Award Logic:**
- Lesson Achievement: All lesson contents in a lesson are read
- Module Achievement: All lessons in a module are complete (all contents read)

---

### 9. Settings Screen (`/settings`)

**Purpose:** Profile management, data import/export, theme settings, logout.

**User Interactions:**
- View/edit profile (name, birthdate, address, grade level, photo)
- Import offline resources (re-seed database)
- Export student report (PDF)
- View bookmarks, navigate to content
- Toggle theme mode (Light/Dark/System)
- Logout

**Data Operations:**
- `getStudentProfileByUserId(userId)` - load profile
- `createStudentProfile(payload)` - create profile
- `updateStudentProfile(studentId, payload)` - update profile
- `listLessonContentBookmarkByUser(userId)` - load bookmarks
- `resetAndSeedLocalData()` - re-import all seed data
- `getStudentReportData(userId)` - aggregate report data
- `setSetting('theme_mode', mode)` - save theme preference

**Navigation Outcomes:**
- Bookmark Open → `/content-info/[id]`
- Logout → `/login`

---

## Bottom Navigation Structure

| Tab | Icon | Route | Description |
|-----|------|-------|-------------|
| Home | home | `/home` | Dashboard with progress |
| Library | book | `/module` | Module/competency browser |
| Lesson | list | `/lesson` | Lesson list |
- | bookmark | Alert → `/lesson` | Content Info (requires lesson selection) |
| Achievements | trophy | `/achievement` | Achievement badges |
| Settings | settings | `/settings` | Settings and profile |

---

## Tutorial Onboarding Flow

**Trigger:** First-time app launch (tutorial not completed)

**Steps:**
1. **Import Offline Resources** - Directs user to Settings to import data
2. **Complete Your Profile** - Directs user to Settings to create profile
3. **Acquire Lesson Achievements** - Encourages completing lessons
4. **Tutorial Complete** - Marks tutorial as finished

**Data Operations:**
- `getStudentTutorialByUserId(userId)` - check tutorial state
- `createStudentTutorial(payload)` - create tutorial record
- `updateStudentTutorial(tutorialId, payload)` - update step completion

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React Native)               │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ Screens │  │Components│  │Contexts │  │  Hooks  │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│       └────────────┴────────────┴────────────┘         │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │ auth-api  │                        │
│                    │  (72 API  │                        │
│                    │ functions)│                        │
│                    └─────┬─────┘                        │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │  expo-    │                        │
│                    │  sqlite   │                        │
│                    └─────┬─────┘                        │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  SQLite DB  │
                    │student-     │
                    │offline-     │
                    │auth.db      │
                    └─────────────┘
```

---

## Key Architectural Patterns

1. **Offline-First:** All data stored locally in SQLite; no network calls required
2. **File-Based Routing:** Expo Router with Stack navigation
3. **UserId Propagation:** User ID passed as route parameter to all screens
4. **Theme System:** Custom theme context with light/dark/system modes
5. **Dynamic Styles:** Per-screen styles generated via `useMemo` + `StyleSheet.create`
6. **Singleton Database:** Single async SQLite connection shared across all functions
7. **Idempotent Seeding:** Default data inserted only if not already present
