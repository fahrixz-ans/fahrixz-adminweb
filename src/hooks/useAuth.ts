import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAdminStore } from '@/stores/useAdminStore';
import type { AdminUser } from '@/types';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setAdmin, setAuthenticated, logout: storeLogout } = useAdminStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          if (userData?.isAdmin === true) {
            const adminUser: AdminUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || '',
              isAdmin: true,
              lastLogin: new Date(),
            };
            setAdmin(adminUser);
            setAuthenticated(true);
            setIsAdmin(true);
          } else {
            await signOut(auth);
            setAdmin(null);
            setAuthenticated(false);
            setIsAdmin(false);
          }
        } catch {
          await signOut(auth);
          setAdmin(null);
          setAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setAdmin(null);
        setAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setAdmin, setAuthenticated]);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData?.isAdmin !== true) {
        await signOut(auth);
        return 'Akses ditolak. Anda bukan admin.';
      }

      return null;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        return 'Email atau password salah.';
      }
      if (err.code === 'auth/invalid-credential') {
        return 'Email atau password salah.';
      }
      if (err.code === 'auth/too-many-requests') {
        return 'Terlalu banyak percobaan. Coba lagi nanti.';
      }
      return err.message || 'Terjadi kesalahan saat login.';
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    storeLogout();
  }, [storeLogout]);

  return { isAdmin, isLoading, login, logout };
}

export default useAuth;
