import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../firebase-applet-config.json";

let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;
let isFirebaseConfigured = false;

// Safe lazy initialization check
if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "") {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // Replaced with PostgreSQL
    auth = getAuth(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;
    console.log("🔥 Firebase successfully initialized and configured!");
    
    // Firestore is no longer used, we are using PostgreSQL.
    // getFirestore and testConnection are removed to avoid network errors.
  } catch (error) {
    console.warn("⚠️ Firebase configuration error during initialization: ", error);
  }
} else {
  console.log("ℹ️ Running in Offline Local Storage Simulator Mode (No API Key provided in firebase-applet-config.json)");
}

export { app, db, auth, storage, isFirebaseConfigured };

// Custom Firestore Operation Types and Info conforming to skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
