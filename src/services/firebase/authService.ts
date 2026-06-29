import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type NextOrObserver,
  type User,
} from "firebase/auth";
import { googleProvider, requireAuth } from "@/lib/firebase";
import { upsertUserProfile } from "./userService";

export const subscribeToAuth = (observer: NextOrObserver<User>) => {
  const firebaseAuth = requireAuth();
  return onAuthStateChanged(firebaseAuth, observer);
};

export const signInWithGoogle = async () => {
  const firebaseAuth = requireAuth();
  await setPersistence(firebaseAuth, browserLocalPersistence);

  const result = await signInWithPopup(firebaseAuth, googleProvider);
  await upsertUserProfile(result.user);

  return result.user;
};

export const logout = async () => {
  const firebaseAuth = requireAuth();
  await signOut(firebaseAuth);
};
