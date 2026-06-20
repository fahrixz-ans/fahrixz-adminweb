import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Mission, UserMission } from '@/types';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [submissions, setSubmissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'missions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          startDate: data.startDate?.toDate?.() || data.startDate,
          endDate: data.endDate?.toDate?.() || data.endDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Mission;
      });
      setMissions(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'user_missions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          startedAt: data.startedAt?.toDate?.() || data.startedAt,
          submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
          reviewedAt: data.reviewedAt?.toDate?.() || data.reviewedAt,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as UserMission;
      });
      setSubmissions(items);
      setSubmissionsLoading(false);
    });
    return unsub;
  }, []);

  const addMission = useCallback(async (mission: any) => {
    await addDoc(collection(db, 'missions'), {
      ...mission,
      participantCount: 0,
      completedCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateMission = useCallback(async (id: string, updates: any) => {
    await updateDoc(doc(db, 'missions', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteMission = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'missions', id));
  }, []);

  const approveSubmission = useCallback(async (submissionId: string, adminUid: string) => {
    await updateDoc(doc(db, 'user_missions', submissionId), {
      status: 'approved',
      reviewedAt: Timestamp.now(),
      reviewedBy: adminUid,
    });
  }, []);

  const rejectSubmission = useCallback(async (submissionId: string, reason: string, adminUid: string) => {
    await updateDoc(doc(db, 'user_missions', submissionId), {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: Timestamp.now(),
      reviewedBy: adminUid,
    });
  }, []);

  return {
    missions,
    submissions,
    loading,
    submissionsLoading,
    addMission,
    updateMission,
    deleteMission,
    approveSubmission,
    rejectSubmission,
  };
}
