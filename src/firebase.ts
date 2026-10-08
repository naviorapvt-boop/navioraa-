import { getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { deleteDoc, doc, getDocFromServer, setDoc, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp({
  ...firebaseConfig,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain
});

// CRITICAL: The app uses the configured firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function createTeamAdmin(email: string, password: string, displayName: string) {
  const owner = auth.currentUser;
  const ownerEmail = owner?.email?.trim().toLowerCase();
  if (!owner || ownerEmail !== 'naviora.pvt@gmail.com' || !owner.emailVerified) {
    throw new Error('Only the verified primary Google admin can create team accounts.');
  }

  const ownerToken = await owner.getIdTokenResult(true);
  if (ownerToken.signInProvider !== 'google.com') {
    throw new Error('Sign in with the primary Google account before creating team accounts.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const teamApp = getApps().find(existingApp => existingApp.name === 'navioraa-team-provisioning')
    || initializeApp(firebaseConfig, 'navioraa-team-provisioning');
  const teamAuth = getAuth(teamApp);
  let newUser;

  try {
    const credential = await createUserWithEmailAndPassword(teamAuth, normalizedEmail, password);
    newUser = credential.user;
    await updateProfile(newUser, { displayName: displayName.trim() });
    await sendEmailVerification(newUser);

    const adminRecord = {
      uid: newUser.uid,
      email: normalizedEmail,
      displayName: displayName.trim(),
      role: 'team_admin',
      authType: 'password',
      active: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      createdBy: ownerEmail
    };
    await Promise.all([
      setDoc(doc(db, 'admins', newUser.uid), adminRecord),
      setDoc(doc(db, 'admins', normalizedEmail), adminRecord)
    ]);
    await signOut(teamAuth);
    return { email: normalizedEmail };
  } catch (error) {
    if (newUser) {
      await Promise.allSettled([
        deleteDoc(doc(db, 'admins', newUser.uid)),
        deleteDoc(doc(db, 'admins', normalizedEmail))
      ]);
      if (teamAuth.currentUser?.uid === newUser.uid) {
        await deleteUser(newUser).catch(() => undefined);
      }
    }
    throw error;
  }
}

export async function revokeTeamAdminAccess(email: string, uid?: string) {
  const owner = auth.currentUser;
  if (!owner || owner.email?.trim().toLowerCase() !== 'naviora.pvt@gmail.com' || !owner.emailVerified) {
    throw new Error('Only the verified primary admin can revoke team access.');
  }
  const token = await owner.getIdTokenResult(true);
  if (token.signInProvider !== 'google.com') {
    throw new Error('Sign in with the primary Google account to revoke team access.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  await Promise.all([
    deleteDoc(doc(db, 'admins', normalizedEmail)),
    ...(uid ? [deleteDoc(doc(db, 'admins', uid))] : [])
  ]);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
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
