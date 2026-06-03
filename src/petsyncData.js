import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const hasFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_AUTH_DOMAIN &&
    import.meta.env.VITE_PROJECT_ID &&
    import.meta.env.VITE_STORAGE_BUCKET &&
    import.meta.env.VITE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_APP_ID
);

export const loadCollection = async (collectionName, fallback = []) => {
  if (!hasFirebaseConfig) {
    return fallback;
  }

  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const data = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    return data.length > 0 ? data : fallback;
  } catch (error) {
    console.warn(`Unable to load ${collectionName} from Firebase`, error);
    return fallback;
  }
};

export const saveDocument = async (collectionName, data) => {
  if (!hasFirebaseConfig) {
    console.warn(`Firebase env vars are missing. ${collectionName} was not saved.`);
    return null;
  }

  try {
    const document = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });

    return document.id;
  } catch (error) {
    console.warn(`Unable to save ${collectionName} to Firebase`, error);
    return null;
  }
};
