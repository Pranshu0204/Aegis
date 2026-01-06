export enum Role {
  PATIENT = 'PATIENT',
  CLINICIAN = 'CLINICIAN',
  CAREGIVER = 'CAREGIVER'
}

export enum ModuleId {
  TRIAGE = 'TRIAGE',
  DISCHARGE = 'DISCHARGE',
  INTAKE = 'INTAKE',
  CAREGIVER = 'CAREGIVER',
  CHATBOT = 'CHATBOT',
  LIVE = 'LIVE'
}

export type Language = 'English' | 'Hindi' | 'Spanish' | 'French' | 'Arabic' | 'Mandarin' | 'German' | 'Italian' | 'Portuguese';
export type Theme = 'light' | 'dark';

export interface AppState {
  currentModule: ModuleId;
  userRole: Role;
  language: Language;
  theme: Theme;
  apiKey?: string;
}

export interface FileAttachment {
  file: File;
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  attachments?: FileAttachment[];
  isThinking?: boolean;
}