import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { requireDb } from "@/lib/firebase";

export const upsertUserProfile = async (user: User) => {
  const firestore = requireDb();
  const userRef = doc(firestore, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const timestamp = serverTimestamp();

  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      updatedAt: timestamp,
      lastLoginAt: timestamp,
      ...(!snapshot.exists() ? { createdAt: timestamp } : {}),
    },
    { merge: true }
  );
};
