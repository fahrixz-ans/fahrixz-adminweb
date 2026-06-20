import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('isAdmin', '==', false),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as UserProfile;
      });
      setUsers(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: UserProfile['status']) => {
    await updateDoc(doc(db, 'users', userId), { status, updatedAt: new Date() });
  }, []);

  const adjustWallet = useCallback(async (userId: string, amount: number) => {
    const userRef = doc(db, 'users', userId);
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newBalance = user.walletBalance + amount;
    await updateDoc(userRef, {
      walletBalance: newBalance,
      updatedAt: new Date(),
    });
  }, [users]);

  return {
    users,
    loading,
    updateUserStatus,
    adjustWallet,
  };
}
