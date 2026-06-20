import { useState } from 'react';
import { useMissions } from '@/hooks/useMissions';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Users, CheckCircle, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import type { Mission, MissionType } from '@/types';

const missionTypes: { value: MissionType; label: string }[] = [
  { value: 'order_count', label: 'Checkout X kali' },
  { value: 'order_amount', label: 'Total belanja Rp X' },
  { value: 'login_streak', label: 'Login X hari berturut-turut' },
  { value: 'share', label: 'Share produk X kali' },
  { value: 'review', label: 'Kasih review X kali' },
  { value: 'referral', label: 'Ajak X teman daftar' },
];

export default function Missions() {
  const { missions, loading, addMission, updateMission, deleteMission } = useMissions();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Mission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', type: 'order_count' as MissionType, target: 1,
    rewardPoints: 0, startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    duration: 24, maxParticipants: 0, status: 'active' as 'active' | 'inactive' | 'expired',
    requireUpload: false, requirePhone: false, requireEmail: true, terms: '',
  });

  const reset = () => setForm({ title: '', description: '', type: 'order_count', target: 1, rewardPoints: 0, startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'), duration: 24, maxParticipants: 0, status: 'active', requireUpload: false, requirePhone: false, requireEmail: true, terms: '' });
  const openAdd = () => { reset(); setEditing(null); setShowForm(true); };
  const openEdit = (m: Mission) => { setEditing(m); setForm({ title: m.title, description: m.description || '', type: m.type, target: m.target, rewardPoints: m.rewardPoints, startDate: format(new Date(m.startDate), 'yyyy-MM-dd'), endDate: format(new Date(m.endDate), 'yyyy-MM-dd'), duration: m.duration, maxParticipants: m.maxParticipants || 0, status: m.status, requireUpload: m.requireUpload, requirePhone: m.requirePhone, requireEmail: m.requireEmail, terms: m.terms || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    const data = { ...form, startDate: new Date(form.startDate), endDate: new Date(form.endDate), maxParticipants: form.maxParticipants || undefined };
    if (editing) await updateMission(editing.id, data);
    else await addMission(data);
    setShowForm(false); reset();
  };

  const totalParticipants = missions.reduce((s, m) => s + (m.participantCount || 0), 0);
  const totalCompleted = missions.reduce((s, m) => s + (m.completedCount || 0), 0);
  const avgRate = totalParticipants > 0 ? Math.round((totalCompleted / totalParticipants) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Missions" description="Kelola misi dan tantangan" action={<Button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-blue-500"><Plus className="w-4 h-4 mr-2" /> Tambah Misi</Button>} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"><Target className="w-5 h-5 text-purple-600" /></div><div><p className="text-xs text-gray-500">Misi Aktif</p><p className="text-xl font-bold">{missions.filter(m => m.status === 'active').length}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-gray-500">Total Peserta</p><p className="text-xl font-bold">{totalParticipants}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xs text-gray-500">Completion Rate</p><p className="text-xl font-bold">{avgRate}%</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-xs text-gray-500">Total Misi</p><p className="text-xl font-bold">{missions.length}</p></div></CardContent></Card>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Judul Misi', cell: (m: any) => <span className="font-medium">{m.title}</span> },
          { key: 'type', header: 'Tipe', cell: (m: any) => <span className="text-sm text-gray-500">{missionTypes.find(t => t.value === m.type)?.label || m.type}</span> },
          { key: 'target', header: 'Target', cell: (m: any) => <span className="text-sm">{m.target}</span> },
          { key: 'reward', header: 'Reward', cell: (m: any) => <span className="text-sm font-medium text-purple-600">{m.rewardPoints} koin</span> },
          { key: 'participants', header: 'Peserta', cell: (m: any) => <span className="text-sm">{m.participantCount || 0} / {m.completedCount || 0}</span> },
          { key: 'period', header: 'Periode', cell: (m: any) => <span className="text-xs text-gray-500">{m.startDate ? format(new Date(m.startDate), 'dd MMM') : '-'} - {m.endDate ? format(new Date(m.endDate), 'dd MMM yyyy') : '-'}</span> },
          { key: 'status', header: 'Status', cell: (m: any) => <StatusBadge status={m.status} /> },
          { key: 'actions', header: '', className: 'w-24', cell: (m: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(m.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )},
        ]}
        data={missions}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); reset(); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Misi' : 'Tambah Misi'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2"><Label>Judul Misi *</Label><Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Checkout 3 Kali" /></div>
            <div className="space-y-2"><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Tipe Misi</Label>
                <Select value={form.type} onValueChange={(v: MissionType) => setForm(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{missionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Target *</Label><Input type="number" value={form.target} onChange={e => setForm(prev => ({ ...prev, target: Number(e.target.value) }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Reward Poin</Label><Input type="number" value={form.rewardPoints} onChange={e => setForm(prev => ({ ...prev, rewardPoints: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Durasi (jam)</Label><Input type="number" value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Tanggal Mulai</Label><Input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tanggal Selesai</Label><Input type="date" value={form.endDate} onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Max Peserta (0 = unlimited)</Label><Input type="number" value={form.maxParticipants} onChange={e => setForm(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>Syarat & Ketentuan</Label><Textarea value={form.terms} onChange={e => setForm(prev => ({ ...prev, terms: e.target.value }))} /></div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Switch checked={form.requireUpload} onCheckedChange={v => setForm(prev => ({ ...prev, requireUpload: v }))} /><Label className="text-sm">Wajib Upload</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.requirePhone} onCheckedChange={v => setForm(prev => ({ ...prev, requirePhone: v }))} /><Label className="text-sm">Wajib Telepon</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); reset(); }}>Batal</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-500">{editing ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteMission(deleteId); setDeleteId(null); } }} title="Hapus Misi" description="Misi ini akan dihapus permanen." />
    </div>
  );
}
