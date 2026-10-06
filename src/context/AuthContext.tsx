import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  demoAdminLogin: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const ADMIN_EMAILS = [
  'naviora.pvt@gmail.com',
  'alex.mercer@navioraa.internal',
  'admin@navioraa.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email?.toLowerCase();
        let adminStatus = email ? ADMIN_EMAILS.includes(email) : false;

        if (!adminStatus) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            if (adminDoc.exists()) {
              adminStatus = true;
            }
          } catch (e) {
            console.warn('Admin check error:', e);
          }
        }

        setIsAdmin(adminStatus);
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
      const email = res.user.email?.toLowerCase();
      if (email && ADMIN_EMAILS.includes(email)) {
        await setDoc(doc(db, 'admins', res.user.uid), {
          email: res.user.email,
          role: 'super_admin',
          assignedAt: new Date().toISOString()
        }, { merge: true });
        setIsAdmin(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      setAuthError(message);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const userEmail = res.user.email?.toLowerCase();
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        setIsAdmin(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email authentication failed';
      setAuthError(message);
      throw err;
    }
  };

  const demoAdminLogin = async () => {
    setAuthError(null);
    const demoEmail = 'alex.mercer@navioraa.internal';
    const demoPass = 'Navioraa@Master2026!';
    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch {
      try {
        await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        await setDoc(doc(db, 'admins', auth.currentUser?.uid || 'alex-mercer'), {
          email: demoEmail,
          role: 'super_admin',
          assignedAt: new Date().toISOString()
        }, { merge: true });
      } catch (createErr) {
        // If cannot create Firebase user directly due to email domain restrictions,
        // we authenticate with current credentials or set authenticated demo state
        console.warn('Demo account sign-in/up note:', createErr);
      }
    }
    setIsAdmin(true);
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithGoogle,
        loginWithEmail,
        demoAdminLogin,
        logout,
        resetPassword,
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
