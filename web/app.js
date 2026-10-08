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

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.className = isError ? "error" : "message";
}

function setLoading(button, loading, label) {
  button.disabled = loading;
  button.textContent = loading ? "Please wait..." : label;
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

    Object.entries(records).forEach(([table, rows]) => {
      const title = document.createElement("h4");
      title.className = "table-title";
      title.textContent = `${table} (${rows.length})`;
      const details = document.createElement("pre");
      details.className = "record";
      details.textContent = JSON.stringify(rows, null, 2);
      student.append(title, details);
    });
    container.appendChild(student);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
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
    renderStudents(students, (await request("/api/staff/students")).students);
    document.querySelector("#staff-name").textContent =
      `${session.user.username} · ${session.user.role}`;
    const studentCount = document.querySelector("#student-count");
    if (studentCount) {
      studentCount.textContent = students.children.length;
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
        showMessage(message, "Faculty account registered.");
      } catch (error) {
        showMessage(message, error.message, true);
      } finally {
        setLoading(button, false, "Create faculty account");
      }
    });
  }
}

if (document.body.dataset.page === "login") {
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
  loadPortal();
}
