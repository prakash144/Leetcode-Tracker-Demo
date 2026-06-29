import type { Timestamp } from "firebase/firestore";

export interface Problem {
  problemId: string;
  title: string;
  link: string;
  difficulty: string;
  frequency: string;
  acceptanceRate: string | number;
  topicTag: string;
  topics: string[];
  company: string;
  list: string;
}

export interface UserProblemProgress {
  problemId: string;
  solved: boolean;
  attempted: boolean;
  bookmarked: boolean;
  inRevisionList: boolean;
  notes: string;
  solvedAt: Timestamp | null;
  attemptedAt: Timestamp | null;
  bookmarkedAt: Timestamp | null;
  revisionAddedAt: Timestamp | null;
  updatedAt: Timestamp;
}

export interface SerializableUserProblemProgress {
  problemId: string;
  solved: boolean;
  attempted: boolean;
  bookmarked: boolean;
  inRevisionList: boolean;
  notes: string;
}

export type ProgressMap = Record<string, UserProblemProgress>;

export interface AppUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt?: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}
