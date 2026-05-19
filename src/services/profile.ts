import { apiRequest, apiRequestFull } from "./api-client";
import type {
  AuthUser,
  ProfileUpdateRequest,
  Note,
  NoteCreateRequest,
  NoteUpdateRequest,
  NotesFilter,
  ChangePasswordRequest,
} from "@/types";

export interface PaginatedNotes {
  notes: Note[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function updateProfile(data: ProfileUpdateRequest) {
  return apiRequest<{ user: AuthUser }>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordRequest) {
  return apiRequest<null>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getNotes(filters: NotesFilter): Promise<PaginatedNotes> {
  const params = new URLSearchParams();
  if (filters.page) {
    params.set("page", String(filters.page));
  }
  if (filters.limit) {
    params.set("limit", String(filters.limit));
  }
  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }
  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }
  if (filters.stockSymbol) {
    params.set("stockSymbol", filters.stockSymbol);
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  const qs = params.toString();
  const res = await apiRequestFull<Note[]>(`/notes${qs ? `?${qs}` : ""}`);
  return {
    notes: res.data || [],
    meta: res.meta || { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
}

export async function createNote(data: NoteCreateRequest) {
  return apiRequest<Note>("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateNote(id: string, data: NoteUpdateRequest) {
  return apiRequest<Note>(`/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteNote(id: string) {
  return apiRequest<null>(`/notes/${id}`, {
    method: "DELETE",
  });
}
