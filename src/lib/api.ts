const API_BASE = "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

// Auth
export const api = {
  register: (data: { fullName: string; matricNumber: string; level: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { matricNumber: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  getProfile: () => request<any>("/users/profile"),

  // Admin
  getAllUsers: () => request<any[]>("/admin/users"),
  promoteUser: (userId: string) =>
    request("/admin/promote/" + userId, { method: "PUT" }),
  getDashboardStats: () =>
    request<{ totalUsers: number; totalStudents: number; totalAdmins: number; totalCBT: number; totalPastQuestions: number; totalTutorials: number; totalAnnouncements: number }>("/admin/stats"),

  // CBT
  getCBTQuestions: (course?: string) =>
    request<any[]>(`/cbt/questions${course ? `?course=${course}` : ""}`),
  addCBTQuestion: (data: any) =>
    request("/cbt/questions", { method: "POST", body: JSON.stringify(data) }),
  updateCBTQuestion: (id: string, data: any) =>
    request(`/cbt/questions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCBTQuestion: (id: string) =>
    request(`/cbt/questions/${id}`, { method: "DELETE" }),

  // Tutorials
  getTutorials: () => request<any[]>("/tutorials"),
  addTutorial: (data: any) =>
    request("/tutorials", { method: "POST", body: JSON.stringify(data) }),
  updateTutorial: (id: string, data: any) =>
    request(`/tutorials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTutorial: (id: string) =>
    request(`/tutorials/${id}`, { method: "DELETE" }),

  // Past Questions
  getPastQuestions: () => request<any[]>("/past-questions"),
  addPastQuestion: (data: any) =>
    request("/past-questions", { method: "POST", body: JSON.stringify(data) }),
  deletePastQuestion: (id: string) =>
    request(`/past-questions/${id}`, { method: "DELETE" }),

  // Projects
  getProjects: () => request<any[]>("/projects"),
  addProject: (data: any) =>
    request("/projects", { method: "POST", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request(`/projects/${id}`, { method: "DELETE" }),

  // Announcements
  getAnnouncements: () => request<any[]>("/announcements"),
  addAnnouncement: (data: any) =>
    request("/announcements", { method: "POST", body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) =>
    request(`/announcements/${id}`, { method: "DELETE" }),

  // Q&A
  getQA: () => request<any[]>("/qa"),
  postQuestion: (data: { title: string; body: string }) =>
    request("/qa", { method: "POST", body: JSON.stringify(data) }),
  deleteQuestion: (id: string) =>
    request(`/qa/${id}`, { method: "DELETE" }),
  toggleLike: (id: string) =>
    request(`/qa/${id}/like`, { method: "PUT" }),
  addComment: (id: string, text: string) =>
    request(`/qa/${id}/comments`, { method: "POST", body: JSON.stringify({ text }) }),
  deleteComment: (questionId: string, commentId: string) =>
    request(`/qa/${questionId}/comments/${commentId}`, { method: "DELETE" }),
};
