import { useState } from 'react';
import { useWithdraws } from '@/hooks/useWithdraws';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import type { WithdrawRequest } from '@/types';

export default function WithdrawRequests() {
  const { withdraws, loading, approveWithdraw, rejectWithdraw } = useWithdraws();
  const [statusFilter] = useState('all');
  const [detail, setDetail] = useState<WithdrawRequest | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pending = withdraws.filter(w => w.status === 'pending');
  const approved = withdraws.filter(w => w.status === 'approved');
  const rejected = withdraws.filter(w => w.status === 'rejected');
  const totalMonth = approved.reduce((s, w) => s + (w.amount || 0), 0);

  const filtered = statusFilter === 'all' ? withdraws : withdraws.filter(w => w.status === statusFilter);

  const handleApprove = async () => {
    if (!approveId) return;
    await approveWithdraw(approveId, 'admin');
    setApproveId(null);
    setDetail(null);
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    await rejectWithdraw(rejectId, rejectReason, 'admin');
    setRejectId(null);
    setRejectReason('');
    setDetail(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Withdraw Requests" description="Approve/reject penarikan saldo" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><DollarSign className="w-5 h-5 text-amber-600" /></div><div><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-bold">{pending.length}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Check className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xs text-gray-500">Approved</p><p className="text-xl font-bold">{approved.length}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><X className="w-5 h-5 text-red-600" /></div><div><p className="text-xs text-gray-500">Rejected</p><p className="text-xl font-bold">{rejected.length}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"><DollarSign className="w-5 h-5 text-purple-600" /></div><div><p className="text-xs text-gray-500">Total Approved</p><p className="text-xl font-bold">Rp {totalMonth.toLocaleString('id-ID')}</p></div></CardContent></Card>
      </div>

      <DataTable
        columns={[
          { key: 'user', header: 'User', cell: (w) => <div><p className="text-sm font-medium">{w.userName}</p><p className="text-xs text-gray-500">{w.userEmail}</p></div> },
          { key: 'amount', header: 'Jumlah', cell: (w) => <span className="text-sm font-bold">Rp {w.amount?.toLocaleString('id-ID')}</span> },
          { key: 'method', header: 'Metode', cell: (w) => <span className="text-sm">{w.method === 'bank_transfer' ? 'Bank Transfer' : 'E-Wallet'}</span> },
          { key: 'account', header: 'Rekening', cell: (w) => <div><p className="text-sm">{w.accountNumber}</p><p className="text-xs text-gray-500">{w.accountName}</p></div> },
          { key: 'date', header: 'Tanggal', cell: (w) => <span className="text-sm text-gray-500">{w.createdAt ? format(new Date(w.createdAt), 'dd MMM yyyy HH:mm') : '-'}</span> },
          { key: 'status', header: 'Status', cell: (w) => <StatusBadge status={w.status} pulse={w.status === 'pending'} /> },
          {
            key: 'actions', header: '', className: 'w-32',
            cell: (w) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8" onClick={() => setDetail(w)}>Detail</Button>
                {w.status === 'pending' && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => setApproveId(w.id)}><Check className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setRejectId(w.id)}><X className="w-4 h-4" /></Button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
      />

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail Withdraw</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-gray-500">User</Label><p className="text-sm font-medium">{detail.userName}</p></div>
                <div><Label className="text-xs text-gray-500">Jumlah</Label><p className="text-lg font-bold">Rp {detail.amount?.toLocaleString('id-ID')}</p></div>
                <div><Label className="text-xs text-gray-500">Metode</Label><p className="text-sm">{detail.method === 'bank_transfer' ? 'Bank Transfer' : 'E-Wallet'}</p></div>
                <div><Label className="text-xs text-gray-500">No. Rekening</Label><p className="text-sm">{detail.accountNumber}</p></div>
                <div><Label className="text-xs text-gray-500">Nama Pemilik</Label><p className="text-sm">{detail.accountName}</p></div>
                <div><Label className="text-xs text-gray-500">Status</Label><StatusBadge status={detail.status} /></div>
              </div>
              {detail.adminNote && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"><Label className="text-xs text-gray-500">Catatan Admin</Label><p className="text-sm">{detail.adminNote}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!approveId}
        onClose={() => setApproveId(null)}
        onConfirm={handleApprove}
        title="Approve Withdraw"
        description="Apakah Anda sudah transfer uang manual ke rekening user?"
        confirmText="Ya, Sudah Transfer"
        destructive={false}
      />

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={() => { setRejectId(null); setRejectReason(''); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tolak Withdraw</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alasan Penolakan *</Label>
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Berikan alasan..." />
            </div>
            <Button onClick={handleReject} variant="destructive" className="w-full" disabled={!rejectReason.trim()}>Tolak Withdraw</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
