export enum UserRole {
  ADMIN = 'ADMIN',
  FACILITATOR = 'FACILITATOR',
  STUDENT = 'STUDENT'
}

export enum CohortRole {
  FACILITATOR = 'FACILITATOR',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

export enum AssignmentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  studentInviteLink: string;
  facilitatorInviteLink: string;
  isActive: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: AssignmentStatus;
  cohortId: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  githubUrl?: string;
  files: string[];
  grade?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  cohortId: string;
  solved: boolean;
  views: number;
  createdAt: string;
}

export interface Attendance {
  id: string;
  cohortId: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}
