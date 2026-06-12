export interface ProfileUpdateRequest {
  fullName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  stockSymbol?: string;
  noteDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCreateRequest {
  title: string;
  content: string;
  stockSymbol?: string;
  noteDate?: string;
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  stockSymbol?: string;
  noteDate?: string;
}

export interface NotesFilter {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  stockSymbol?: string;
  search?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ProfileTab = "info" | "notifications" | "guide" | "notes" | "password";

export interface GuideNode {
  id: string;
  label: string;
  icon: string;
  children?: GuideNode[];
  content?: GuideContent;
}

export interface GuideContent {
  characterName: string;
  message: string;
  example?: string;
  relatedSymbols?: string[];
}
