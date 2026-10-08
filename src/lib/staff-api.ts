export type StaffUser = {
  user_id: number;
  username: string;
  email: string;
  role: "admin" | "faculty";
  created_at: string;
};

export type StudentWithRecords = {
  user: {
    user_id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
  };
  records: Record<string, Record<string, unknown>[]>;
};

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://studentoffineappforagri.onrender.com";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const body = (await response.json()) as { message?: string } & T;
  if (!response.ok) {
    throw new Error(body.message || "Request failed.");
  }
  return body;
}

export function loginStaff(email: string, password: string) {
  return request<{ user: StaffUser }>("/api/staff/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getStaffSession() {
  return request<{ user: StaffUser }>("/api/staff/me");
}

export function logoutStaff() {
  return request<{ message: string }>("/api/staff/logout", { method: "POST" });
}

export function registerFaculty(username: string, email: string, password: string) {
  return request<{ user: StaffUser }>("/api/admin/faculty", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function listStudents() {
  return request<{ students: StudentWithRecords[] }>("/api/staff/students");
}
