import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: The app uses the configured firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const functions = getFunctions(app, 'us-east1');

const createTeamAdminCall = httpsCallable<
  { email: string; password: string; displayName: string },
  { email: string; displayName: string }
>(functions, 'createTeamAdmin');
const sendPasswordResetCall = httpsCallable<{ email: string }, { sent: boolean }>(functions, 'sendPasswordReset');

export async function createTeamAdmin(email: string, password: string, displayName: string) {
  return createTeamAdminCall({ email, password, displayName });
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetCall({ email });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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

export function handleFirestoreError(_error: unknown, operationType: OperationType, _path: string | null) {
  console.error('Data operation failed:', operationType);
  throw new Error('We could not complete your request. Please try again.');
}

// Connection check on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'siteSettings', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or network restricted.");
    }
  }
}

testConnection();
