const API_URL = window.STAFF_API_URL || "https://studentoffineappforagri.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Request failed.");
  }

  return body;
}

function displayLabel(key) {
  return key
    .replace(/_id$/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.className = isError ? "error" : "message";
}

function setLoading(button, loading, label) {
  button.disabled = loading;
  button.textContent = loading ? "Please wait..." : label;
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    const input = document.querySelector(toggle.dataset.passwordToggle);
    if (!input) return;
    toggle.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      toggle.textContent = showing ? "Show" : "Hide";
      toggle.setAttribute("aria-label", `${showing ? "Show" : "Hide"} password`);
    });
  });
}

function percentForCorrect(count) {
  return ({ 0: 0, 1: 10, 2: 40, 3: 60, 4: 80, 5: 100 }[count] ?? Math.round((count / 5) * 100));
}

function progressBar(label, percent, detail = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "progress-item";
  wrapper.innerHTML = `
    <div class="progress-header">
      <span>${escapeHtml(label)}</span>
      <strong>${percent}%</strong>
    </div>
    <div class="progress-track"><span style="width: ${Math.max(0, Math.min(100, percent))}%"></span></div>
    ${detail ? `<small class="muted">${escapeHtml(detail)}</small>` : ""}
  `;
  return wrapper;
}

function renderReportSummary(student, records) {
  const report = document.createElement("div");
  report.className = "report-summary";
  const progressRows = records.lesson_content_progress || [];
  const bookmarks = new Set(
    (records.lesson_content_bookmark || [])
      .filter((row) => Number(row.is_bookmark) === 1)
      .map((row) => String(row.lesson_content_id)),
  );
  const moduleMap = new Map();
  progressRows.forEach((row) => {
    const module = row.module_name || "Module unavailable";
    if (!moduleMap.has(module)) moduleMap.set(module, { total: 0, completed: 0, bookmarked: 0 });
    const summary = moduleMap.get(module);
    summary.total += 1;
    summary.completed += Number(row.is_read) === 1 ? 1 : 0;
    summary.bookmarked += bookmarks.has(String(row.lesson_content_id)) ? 1 : 0;
  });
  const chart = document.createElement("div");
  chart.className = "module-progress-report";
  chart.innerHTML = "<h4 class=\"table-title\">Module progress report</h4>";
  if (!moduleMap.size) {
    chart.insertAdjacentHTML("beforeend", '<p class="muted">No lesson-content progress has been synchronized.</p>');
  }
  moduleMap.forEach((summary, module) => {
    const percent = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;
    const bookmarkPercent = summary.total ? Math.round((summary.bookmarked / summary.total) * 100) : 0;
    const moduleCard = document.createElement("div");
    moduleCard.className = "module-progress-item";
    const pie = document.createElement("div");
    pie.className = "progress-pie";
    pie.style.setProperty("--progress", `${percent}%`);
    pie.setAttribute("aria-label", `${module}: ${percent}% completed`);
    pie.innerHTML = `<span>${percent}%</span>`;
    moduleCard.appendChild(pie);
    const details = document.createElement("div");
    details.appendChild(progressBar(module, percent, `${summary.completed}/${summary.total} completed · ${bookmarkPercent}% bookmarked`));
    moduleCard.appendChild(details);
    chart.appendChild(moduleCard);
  });
  report.appendChild(chart);

  const activities = document.createElement("div");
  activities.className = "activity-report";
  activities.innerHTML = "<h4 class=\"table-title\">Activity scores</h4>";
  const grouped = new Map();
  const addActivity = (type, row, score) => {
    const key = `${type}:${row.lesson_content_id}`;
    if (!grouped.has(key)) grouped.set(key, { type, row, scores: [] });
    grouped.get(key).scores.push(score);
  };
  (records.question_answers || []).forEach((row) => addActivity("Questions", row, Number(row.activity_score) || 0));
  (records.job_sheet_answers || []).forEach((row) => addActivity("Job sheet", row, Number(row.activity_score) || 100));
  (records.performance_answer || []).forEach((row) => addActivity("Performance", row, String(row.performance_answer_text || "").trim().toLowerCase() === "yes" ? 100 : 0));
  grouped.forEach(({ type, row, scores }) => {
    const score = type === "Questions"
      ? percentForCorrect(scores.filter((value) => value === 100).length)
      : type === "Performance"
        ? scores.every((value) => value === 100) ? 100 : 0
      : Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
    const label = `${type} · ${row.content_name || "Content unavailable"}`;
    activities.appendChild(progressBar(label, score, `${row.module_name || "Module unavailable"} · ${row.lesson_name || "Lesson unavailable"}`));
  });
  if (!grouped.size) activities.insertAdjacentHTML("beforeend", '<p class="muted">No activity scores have been synchronized.</p>');
  report.appendChild(activities);
  student.appendChild(report);
}

function renderStudents(container, students) {
  container.replaceChildren();
  if (!students.length) {
    container.innerHTML = '<p class="muted">No student records have been synchronized yet.</p>';
    return;
  }

  students.forEach(({ user, records }) => {
    const student = document.createElement("section");
    student.className = "student";
    student.innerHTML = `
      <h3>${escapeHtml(user.username)}</h3>
      <p class="muted">${escapeHtml(user.email)} · user_id: ${escapeHtml(user.user_id)}</p>
    `;
    renderReportSummary(student, records);

    const sections = [
      {
        key: "student_info",
        title: "Student profile",
        columns: ["first_name", "middle_name", "last_name", "birthdate", "home_address", "grade_level"],
      },
      {
        key: "question_answers",
        title: "Question answers",
        location: true,
        columns: ["content_name", "question_text", "answer_text", "is_correct", "activity_score", "created_at"],
      },
      {
        key: "job_sheet_answers",
        title: "Job-sheet answers",
        location: true,
        columns: ["content_name", "job_title", "answer_text", "activity_score", "created_at"],
      },
      {
        key: "performance_answer",
        title: "Performance answers",
        location: true,
        columns: ["content_name", "performance_question", "performance_answer_text", "created_at"],
      },
      {
        key: "lesson_content_progress",
        title: "Lesson-content progress",
        columns: ["module_name", "lesson_name", "content_name", "is_read", "read_at", "updated_at"],
      },
      {
        key: "lesson_content_bookmark",
        title: "Bookmarked content",
        columns: ["module_name", "lesson_name", "content_name", "is_bookmark", "created_at"],
      },
      {
        key: "student_lesson_achievement",
        title: "Lesson achievements",
        columns: ["module_name", "lesson_name", "achievement_name", "created_at"],
      },
      {
        key: "student_module_achievement",
        title: "Module achievements",
        columns: ["module_name", "achievement_name", "created_at"],
      },
    ];

    sections.forEach(({ key, title, columns, location }) => {
      const rows = records[key] || [];
      if (!rows.length) return;
      const titleElement = document.createElement("h4");
      titleElement.className = "table-title";
      titleElement.textContent = `${title} (${rows.length})`;
      if (location) {
        const moduleName = rows[0].module_name || "Module unavailable";
        const lessonName = rows[0].lesson_name || "Lesson unavailable";
        const locationElement = document.createElement("p");
        locationElement.className = "record-location";
        locationElement.textContent = `${moduleName} · ${lessonName}`;
        student.append(titleElement, locationElement);
      } else {
        student.appendChild(titleElement);
      }
      const wrap = document.createElement("div");
      wrap.className = "table-wrap";
      const tableElement = document.createElement("table");
      tableElement.className = "data-table";
      const keys = columns.filter((key) => rows.some((row) => row[key] !== null && row[key] !== undefined && row[key] !== ""));
      tableElement.innerHTML = `<thead><tr>${keys.map((key) => `<th>${escapeHtml(displayLabel(key))}</th>`).join("")}</tr></thead>`;
      const body = document.createElement("tbody");
      rows.forEach((row) => {
        const tableRow = document.createElement("tr");
        keys.forEach((key) => {
          const cell = document.createElement("td");
          const value = row[key];
          cell.textContent = value === null || value === undefined
            ? ""
            : key === "created_at" || key === "updated_at"
              ? new Date(value).toLocaleString()
              : typeof value === "object" ? JSON.stringify(value) : String(value);
          tableRow.appendChild(cell);
        });
        body.appendChild(tableRow);
      });
      tableElement.appendChild(body);
      wrap.appendChild(tableElement);
      student.appendChild(wrap);
    });
    container.appendChild(student);
  });
}

function renderFaculty(container, faculty) {
  container.replaceChildren();
  if (!faculty.length) {
    container.innerHTML = '<p class="muted">No faculty accounts found.</p>';
    return;
  }
  const tableElement = document.createElement("table");
  tableElement.className = "data-table";
  tableElement.innerHTML = `
    <thead><tr><th>User ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
    <tbody>${faculty.map((user) => `
      <tr>
        <td>${escapeHtml(user.user_id)}</td>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td><span class="badge">${escapeHtml(user.role)}</span></td>
        <td>${escapeHtml(new Date(user.created_at).toLocaleString())}</td>
      </tr>`).join("")}</tbody>`;
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  wrap.appendChild(tableElement);
  container.appendChild(wrap);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function setupStudentFilter(students, container) {
  const filter = document.querySelector("#student-filter");
  if (!filter) return;
  students.forEach(({ user }) => {
    const option = document.createElement("option");
    option.value = String(user.user_id);
    option.textContent = `User ID ${user.user_id} · ${user.username}`;
    filter.appendChild(option);
  });
  filter.addEventListener("change", () => {
    const selectedUserId = filter.value;
    const visibleStudents = selectedUserId
      ? students.filter(({ user }) => String(user.user_id) === selectedUserId)
      : students;
    renderStudents(container, visibleStudents);
    const count = document.querySelector("#student-count");
    if (count) count.textContent = visibleStudents.length;
  });
}

async function loadPortal() {
  const page = document.body.dataset.page;
  const message = document.querySelector("#message");
  const students = document.querySelector("#students");

  try {
    const session = await request("/api/staff/me");
    if (page === "admin" && session.user.role !== "admin") {
      throw new Error("Administrator access is required.");
    }
    const studentResults = (await request("/api/staff/students")).students;
    renderStudents(students, studentResults);
    setupStudentFilter(studentResults, students);
    document.querySelector("#staff-name").textContent =
      `${session.user.username} · ${session.user.role}`;
    const studentCount = document.querySelector("#student-count");
    if (studentCount) {
      studentCount.textContent = students.children.length;
    }
    if (page === "admin") {
      renderFaculty(document.querySelector("#faculty-list"), (await request("/api/admin/faculty")).faculty);
    }
  } catch (error) {
    window.location.href = "/staff/";
    return;
  }

  document.querySelector("#logout").addEventListener("click", async () => {
    await request("/api/staff/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/staff/";
  });

  if (page === "admin") {
    const modalBackdrop = document.querySelector("#faculty-modal");
    document.querySelector("#open-faculty-modal").addEventListener("click", () => {
      modalBackdrop.hidden = false;
      document.querySelector("#username").focus();
    });
    document.querySelector("#close-faculty-modal").addEventListener("click", () => {
      modalBackdrop.hidden = true;
    });
    modalBackdrop.addEventListener("click", (event) => {
      if (event.target === modalBackdrop) modalBackdrop.hidden = true;
    });
    document.querySelector("#faculty-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const formElement = event.currentTarget;
      const button = formElement.querySelector("button[type=submit]");
      const form = new FormData(formElement);
      setLoading(button, true, "Create faculty account");
      try {
        await request("/api/admin/faculty", {
          method: "POST",
          body: JSON.stringify({
            username: form.get("username"),
            email: form.get("email"),
            password: form.get("password"),
          }),
        });
        formElement.reset();
        modalBackdrop.hidden = true;
        showMessage(message, "Faculty account registered.");
        renderFaculty(document.querySelector("#faculty-list"), (await request("/api/admin/faculty")).faculty);
      } catch (error) {
        showMessage(message, error.message, true);
      } finally {
        setLoading(button, false, "Create faculty account");
      }
    });
  }
}

if (document.body.dataset.page === "login") {
  setupPasswordToggles();
  document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#message");
    const button = event.currentTarget.querySelector("button[type=submit]");
    const form = new FormData(event.currentTarget);
    showMessage(message, "Signing in securely...");
    setLoading(button, true, "Sign in");
    try {
      const result = await request("/api/staff/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      window.location.href = result.user.role === "admin" ? "/staff/admin.html" : "/staff/faculty.html";
    } catch (error) {
      showMessage(message, error.message, true);
      setLoading(button, false, "Sign in");
    }
  });
} else {
  setupPasswordToggles();
  loadPortal();
}
