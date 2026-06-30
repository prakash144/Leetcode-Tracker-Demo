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

export type ProgressMap = Record<string, UserProblemProgress>;

export interface CustomList {
  id: string;
  name: string;
  description: string;
  problemIds: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp;
}


