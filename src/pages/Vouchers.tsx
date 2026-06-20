import { useState } from 'react';
import { useVouchers } from '@/hooks/useVouchers';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Voucher } from '@/types';

export default function Vouchers() {
  const { vouchers, loading, addVoucher, updateVoucher, deleteVoucher } = useVouchers();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', type: 'percentage' as 'percentage' | 'nominal', value: 0,
    minPurchase: 0, maxDiscount: 0, quota: 0,
    expiresAt: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    status: 'active' as 'active' | 'inactive' | 'expired', applicableTo: 'all' as 'all' | 'category' | 'product',
  });

  const reset = () => setForm({ code: '', type: 'percentage', value: 0, minPurchase: 0, maxDiscount: 0, quota: 0, expiresAt: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'), status: 'active', applicableTo: 'all' });
  const openAdd = () => { reset(); setEditing(null); setShowForm(true); };
  const openEdit = (v: Voucher) => { setEditing(v); setForm({ code: v.code, type: v.type, value: v.value, minPurchase: v.minPurchase, maxDiscount: v.maxDiscount, quota: v.quota, expiresAt: format(new Date(v.expiresAt), 'yyyy-MM-dd'), status: v.status, applicableTo: v.applicableTo }); setShowForm(true); };

  const handleSubmit = async () => {
    const data = { ...form, code: form.code.toUpperCase(), expiresAt: new Date(form.expiresAt) };
    if (editing) await updateVoucher(editing.id, data);
    else await addVoucher(data);
    setShowForm(false); reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vouchers" description="Kelola kupon diskon" action={<Button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-blue-500"><Plus className="w-4 h-4 mr-2" /> Tambah Voucher</Button>} />

      <DataTable
        columns={[
          { key: 'code', header: 'Kode', cell: (v) => <span className="font-mono font-bold text-purple-600">{v.code}</span> },
          { key: 'type', header: 'Tipe', cell: (v) => <span className="text-sm">{v.type === 'percentage' ? 'Persen' : 'Nominal'}</span> },
          { key: 'value', header: 'Nilai', cell: (v) => <span className="text-sm font-medium">{v.type === 'percentage' ? `${v.value}%` : `Rp ${v.value?.toLocaleString('id-ID')}`}</span> },
          { key: 'min', header: 'Min. Beli', cell: (v) => <span className="text-sm">Rp {v.minPurchase?.toLocaleString('id-ID')}</span> },
          { key: 'usage', header: 'Penggunaan', cell: (v) => <span className="text-sm">{v.used || 0} / {v.quota || '∞'}</span> },
          { key: 'expires', header: 'Berlaku Sampai', cell: (v) => <span className="text-sm text-gray-500">{v.expiresAt ? format(new Date(v.expiresAt), 'dd MMM yyyy') : '-'}</span> },
          { key: 'status', header: 'Status', cell: (v) => <StatusBadge status={v.status} /> },
          { key: 'actions', header: '', className: 'w-24', cell: (v) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(v.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )},
        ]}
        data={vouchers}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); reset(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Voucher' : 'Tambah Voucher'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Kode Voucher *</Label><Input value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="HEMAT10" /></div>
              <div className="space-y-2"><Label>Tipe</Label>
                <Select value={form.type} onValueChange={(v: 'percentage' | 'nominal') => setForm(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="percentage">Persentase</SelectItem><SelectItem value="nominal">Nominal</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nilai Diskon *</Label><Input type="number" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Min. Pembelian</Label><Input type="number" value={form.minPurchase} onChange={e => setForm(prev => ({ ...prev, minPurchase: Number(e.target.value) }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Max. Diskon</Label><Input type="number" value={form.maxDiscount} onChange={e => setForm(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Kuota</Label><Input type="number" value={form.quota} onChange={e => setForm(prev => ({ ...prev, quota: Number(e.target.value) }))} placeholder="0 = unlimited" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Berlaku Sampai *</Label><Input type="date" value={form.expiresAt} onChange={e => setForm(prev => ({ ...prev, expiresAt: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={(v: 'active' | 'inactive') => setForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Aktif</SelectItem><SelectItem value="inactive">Nonaktif</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); reset(); }}>Batal</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-500">{editing ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteVoucher(deleteId); setDeleteId(null); } }} title="Hapus Voucher" description="Voucher ini akan dihapus permanen." />
    </div>
  );
}
