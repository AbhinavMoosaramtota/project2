export interface User {
  email: string;
  password: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}