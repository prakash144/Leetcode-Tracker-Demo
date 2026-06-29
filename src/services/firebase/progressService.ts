import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { requireDb } from "@/lib/firebase";
import type { ProgressMap, UserProblemProgress } from "@/lib/progressTypes";

const progressCollection = (uid: string) =>
  collection(requireDb(), "users", uid, "progress");

const progressDoc = (uid: string, problemId: string) =>
  doc(requireDb(), "users", uid, "progress", problemId);

const activityDoc = (uid: string, date: string) =>
  doc(requireDb(), "users", uid, "activity", date);

export const getUserProgress = async (uid: string): Promise<ProgressMap> => {
  const snapshot = await getDocs(progressCollection(uid));
  const progress: ProgressMap = {};

  snapshot.forEach((document) => {
    progress[document.id] = document.data() as UserProblemProgress;
  });

  return progress;
};

export const saveProblemProgress = async (
  uid: string,
  progress: Omit<UserProblemProgress, "updatedAt"> & { updatedAt?: unknown }
) => {
  await setDoc(
    progressDoc(uid, progress.problemId),
    {
      ...progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const updateProblemNotes = async (
  uid: string,
  problemId: string,
  notes: string
) => {
  await setDoc(
    progressDoc(uid, problemId),
    {
      problemId,
      notes,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const deleteProblemProgress = async (uid: string, problemId: string) => {
  await deleteDoc(progressDoc(uid, problemId));
};

export const updateDailyActivity = async (
  uid: string,
  date: string,
  updates: { solvedDelta?: number; attemptedDelta?: number }
) => {
  const payload: Record<string, unknown> = {
    date,
    updatedAt: serverTimestamp(),
  };

  if (updates.solvedDelta) {
    payload.solvedCount = increment(updates.solvedDelta);
  }

  if (updates.attemptedDelta) {
    payload.attemptedCount = increment(updates.attemptedDelta);
  }

  await setDoc(activityDoc(uid, date), payload, { merge: true });
};

export const updateProgressFields = async (
  uid: string,
  problemId: string,
  fields: Record<string, unknown>
) => {
  await updateDoc(progressDoc(uid, problemId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
};
