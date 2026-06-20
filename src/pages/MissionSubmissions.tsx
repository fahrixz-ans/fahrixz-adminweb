import { useState } from 'react';
import { useMissions } from '@/hooks/useMissions';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, Image } from 'lucide-react';
import { format } from 'date-fns';
import type { UserMission } from '@/types';

export default function MissionSubmissions() {
  const { submissions, submissionsLoading, approveSubmission, rejectSubmission } = useMissions();
  const [detail, setDetail] = useState<UserMission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const filtered = submissions;

  const handleApprove = async (id: string) => {
    await approveSubmission(id, 'admin');
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    await rejectSubmission(rejectingId, rejectReason, 'admin');
    setShowReject(false);
    setRejectReason('');
    setRejectingId(null);
  };

  const openReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setShowReject(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Mission Submissions" description="Review dan approve submission misi" />

      <DataTable
        columns={[
          { key: 'user', header: 'User', cell: (s) => <div><p className="text-sm font-medium">{s.userName}</p><p className="text-xs text-gray-500">{s.userEmail}</p></div> },
          { key: 'mission', header: 'Misi', cell: (s) => <span className="text-sm">{s.missionTitle}</span> },
          { key: 'proof', header: 'Bukti', cell: (s) => s.proofImage ? <Image className="w-5 h-5 text-purple-600" /> : <span className="text-xs text-gray-400">-</span> },
          { key: 'phone', header: 'Telepon', cell: (s) => <span className="text-sm text-gray-500">{s.phone || '-'}</span> },
          { key: 'date', header: 'Tanggal Submit', cell: (s) => <span className="text-sm text-gray-500">{s.submittedAt ? format(new Date(s.submittedAt), 'dd MMM yyyy HH:mm') : '-'}</span> },
          { key: 'status', header: 'Status', cell: (s) => <StatusBadge status={s.status} pulse={s.status === 'pending'} /> },
          {
            key: 'actions', header: '', className: 'w-36',
            cell: (s) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600" onClick={() => setDetail(s)}>Detail</Button>
                {s.status === 'pending' && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => handleApprove(s.id)}><Check className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => openReject(s.id)}><X className="w-4 h-4" /></Button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={submissionsLoading}
      />

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail Submission</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-gray-500">User</Label><p className="text-sm font-medium">{detail.userName}</p></div>
                <div><Label className="text-xs text-gray-500">Misi</Label><p className="text-sm font-medium">{detail.missionTitle}</p></div>
                <div><Label className="text-xs text-gray-500">Telepon</Label><p className="text-sm">{detail.phone || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Email</Label><p className="text-sm">{detail.email || '-'}</p></div>
              </div>
              {detail.proofImage && (
                <div><Label className="text-xs text-gray-500">Bukti</Label><img src={detail.proofImage} alt="Bukti" className="mt-1 max-w-full rounded-lg border" /></div>
              )}
              {detail.notes && (
                <div><Label className="text-xs text-gray-500">Catatan</Label><p className="text-sm">{detail.notes}</p></div>
              )}
              {detail.rejectionReason && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20"><Label className="text-xs text-red-500">Alasan Penolakan</Label><p className="text-sm text-red-600">{detail.rejectionReason}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showReject} onOpenChange={() => setShowReject(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tolak Submission</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alasan Penolakan *</Label>
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Berikan alasan penolakan..." />
            </div>
            <Button onClick={handleReject} variant="destructive" className="w-full" disabled={!rejectReason.trim()}>Tolak Submission</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
