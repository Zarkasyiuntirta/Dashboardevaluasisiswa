
export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

export interface User {
  username: string;
  role: Role;
  subject?: string; // For admins
  studentId?: string; // For students
}

export interface Attendance {
  present: number;
  permission: number;
  sick: number;
  totalSessions: number;
}

export interface Proactivity {
  initiative: number; // Inisiatif dalam belajar
  participation: number; // Partisipasi dalam diskusi
  discipline: number; // Kedisiplinan dan kesiapan belajar
}

export interface Assignments {
  responsibility: number; // Tanggung jawab terhadap tugas
  teamwork: number; // Kerjasama dalam kelompok
}

export interface Exams {
  uts1: number;
  uas1: number;
  uts2: number;
  uas2: number;
}

export interface Scores {
  attendance: Attendance;
  proactivity: Proactivity;
  assignments: Assignments;
  exams: Exams;
}

export interface Student {
  id: string;
  nim: string;
  name: string;
  photoUrl: string;
  scores: {
    [subject: string]: Scores;
  };
}
