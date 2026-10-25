import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  deleteUser,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testFirestoreConnection, sanitizeForFirestore } from '../firebase/config';
import { UserProfile } from '../types/fitness';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: (passwordForReauth?: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Clean up any legacy demo keys from localStorage
    localStorage.removeItem('glow_up_lab_demo_profile');

    // Configure local browser session persistence
    try {
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.warn('Firebase setPersistence warning:', err);
      });
    } catch (e) {
      console.warn('Could not set browser persistence:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.isAnonymous) {
        setUser(currentUser);
        await loadUserProfile(currentUser);
        testFirestoreConnection();
      } else if (currentUser && currentUser.isAnonymous) {
        try {
          await signOut(auth);
        } catch {
          // ignore
        }
        setUser(null);
        setProfile(null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (currentUser: User) => {
    const profilePath = `users/${currentUser.uid}/profile/main`;
    const profileRef = doc(db, 'users', currentUser.uid, 'profile', 'main');
    try {
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile((prev) => {
          if (prev?.displayName && !data.displayName) {
            return { ...data, displayName: prev.displayName };
          }
          return data;
        });
      } else {
        // Create initial private profile isolated to this user's UID
        const defaultName = currentUser.displayName
          ? currentUser.displayName.split(' ')[0]
          : '';
        const initialProfile: UserProfile = {
          uid: currentUser.uid,
          displayName: defaultName,
          email: currentUser.email || '',
          unitSystem: 'metric',
          defaultRestTime: 75,
          createdAt: new Date().toISOString(),
        };
        await setDoc(profileRef, initialProfile);
        setProfile((prev) => (prev?.displayName ? prev : initialProfile));
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('Glow Up Lab offline fallback for user profile');
        setProfile({
          uid: currentUser.uid,
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          unitSystem: 'metric',
          defaultRestTime: 75,
          createdAt: new Date().toISOString(),
        });
      } else {
        handleFirestoreError(error, OperationType.GET, profilePath);
      }
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      const errString = error instanceof Error ? error.message : String(error);
      setAuthError(errString);
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error: unknown) {
      const errString = error instanceof Error ? error.message : String(error);
      setAuthError(errString);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    const trimmedFirstname = displayName.trim();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        try {
          await updateProfile(cred.user, { displayName: trimmedFirstname });
        } catch (e) {
          console.warn('Could not update Auth user profile:', e);
        }

        const initialProfile: UserProfile = {
          uid: cred.user.uid,
          displayName: trimmedFirstname,
          email: email.trim(),
          unitSystem: 'metric',
          defaultRestTime: 75,
          createdAt: new Date().toISOString(),
        };
        const profilePath = `users/${cred.user.uid}/profile/main`;
        const profileRef = doc(db, 'users', cred.user.uid, 'profile', 'main');
        try {
          await setDoc(profileRef, initialProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, profilePath);
        }
        setUser(auth.currentUser || cred.user);
        setProfile(initialProfile);
      }
    } catch (error: unknown) {
      const errString = error instanceof Error ? error.message : String(error);
      setAuthError(errString);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: unknown) {
      const errString = error instanceof Error ? error.message : String(error);
      setAuthError(errString);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    setAuthError(null);
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = sanitizeForFirestore({ ...profile, ...updates, updatedAt: new Date().toISOString() });
    setProfile(updated);

    if (user) {
      const profilePath = `users/${user.uid}/profile/main`;
      const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
      try {
        await setDoc(profileRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, profilePath);
      }
    }
  };

  const deleteAccount = async (passwordForReauth?: string) => {
    const activeUser = auth.currentUser || user;
    if (!activeUser) return;
    const uid = activeUser.uid;

    // 1. If password is provided for re-authentication, re-authenticate first
    if (passwordForReauth && activeUser.email && auth.currentUser) {
      const credential = EmailAuthProvider.credential(activeUser.email, passwordForReauth);
      await reauthenticateWithCredential(auth.currentUser, credential);
    }

    // 2. Delete all user Firestore subcollections and documents
    const subcollections = [
      'workouts',
      'routines',
      'exercises',
      'favorites',
      'measurements',
      'weekly_plans',
      'profile',
    ];

    for (const sub of subcollections) {
      try {
        const snap = await getDocs(collection(db, 'users', uid, sub));
        await Promise.all(
          snap.docs.map((docSnap) => deleteDoc(doc(db, 'users', uid, sub, docSnap.id)))
        );
      } catch (err) {
        console.warn(`Could not delete subcollection ${sub}:`, err);
      }
    }

    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      console.warn('Could not delete root user document:', err);
    }

    // 3. Remove all local storage data belonging to the user
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('glow_up_lab_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Could not clear localStorage on account deletion:', e);
    }

    // 4. Delete the Firebase Auth user account
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (err: unknown) {
        const errCode = (err as { code?: string })?.code || '';
        const errMsg = err instanceof Error ? err.message : String(err);

        if (
          errCode === 'auth/requires-recent-login' ||
          errMsg.includes('requires-recent-login')
        ) {
          const isGoogleUser = auth.currentUser.providerData.some(
            (p) => p.providerId === 'google.com'
          );
          if (isGoogleUser) {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(auth.currentUser, provider);
            await deleteUser(auth.currentUser);
          } else {
            throw new Error('REQUIRES_PASSWORD_REAUTH');
          }
        } else {
          throw err;
        }
      }
    }

    // 5. Clear session and sign out
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        updateUserProfile,
        deleteAccount,
        isAuthenticated: !!user,
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
