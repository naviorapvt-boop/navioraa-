import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  getIdTokenResult,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const OWNER_EMAIL = 'naviora.pvt@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getLoginErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  if (code.endsWith('/unauthorized-domain')) {
    return 'This website address is not authorized for Firebase sign-in. Add localhost or your live domain in Firebase Authentication settings.';
  }
  if (code.endsWith('/popup-blocked')) return 'Your browser blocked the Google sign-in window. Allow popups and try again.';
  if (code.endsWith('/popup-closed-by-user')) return 'Google sign-in was closed before it finished.';
  if (code.endsWith('/operation-not-allowed')) return 'Google sign-in is disabled. Enable Google in Firebase Authentication providers.';
  if (code.endsWith('/invalid-credential') || code.endsWith('/wrong-password') || code.endsWith('/user-not-found')) {
    return 'The email or password is incorrect. Check the team credentials and try again.';
  }
  if (code.endsWith('/network-request-failed')) return 'Network error while signing in. Check your connection and try again.';
  if (error instanceof Error && error.message) return error.message;
  return 'Sign-in failed. Check the account and try again.';
}

async function hasAdminAccess(user: User): Promise<boolean> {
  const token = await getIdTokenResult(user, true);
  const email = user.email?.trim().toLowerCase();
  const isPrimaryGoogle = email === OWNER_EMAIL &&
    user.emailVerified &&
    token.signInProvider === 'google.com';
  if (isPrimaryGoogle) return true;
  if (!email || !user.emailVerified || token.signInProvider !== 'password') return false;

  const [uidRecord, emailRecord] = await Promise.all([
    getDoc(doc(db, 'admins', user.uid)),
    getDoc(doc(db, 'admins', email))
  ]);
  const provisionedRecord = uidRecord.exists() ? uidRecord : emailRecord;
  return provisionedRecord.exists() &&
    provisionedRecord.data().active === true &&
    provisionedRecord.data().role === 'team_admin';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          setIsAdmin(await hasAdminAccess(currentUser));
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const authorized = await hasAdminAccess(res.user) &&
        res.user.email?.trim().toLowerCase() === OWNER_EMAIL &&
        (await getIdTokenResult(res.user)).signInProvider === 'google.com';
      if (!authorized) {
        await signOut(auth);
        throw new Error(`Google admin sign-in is reserved for ${OWNER_EMAIL}. Team members must use their assigned email and password.`);
      }
      setUser(res.user);
      setIsAdmin(true);
    } catch (error: unknown) {
      setAuthError(getLoginErrorMessage(error));
      throw error;
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      if (!(await hasAdminAccess(credential.user))) {
        await signOut(auth);
        throw new Error('This account is not enabled for the admin portal. Ask the primary admin to create your team access.');
      }
      setUser(credential.user);
      setIsAdmin(true);
    } catch (error: unknown) {
      setAuthError(getLoginErrorMessage(error));
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithGoogle,
        loginWithPassword,
        logout,
        authError,
        clearAuthError: () => setAuthError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
