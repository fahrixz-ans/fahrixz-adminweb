import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@/types';

export default function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', status: 'active' as 'active' | 'inactive' });

  const reset = () => { setEditing(null); setForm({ name: '', slug: '', description: '', icon: '', status: 'active' }); };
  const openAdd = () => { reset(); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || '', icon: c.icon || '', status: c.status }); setShowForm(true); };

  const handleSubmit = async () => {
    const data = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') };
    if (editing) await updateCategory(editing.id, data);
    else await addCategory(data);
    setShowForm(false); reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kategori" description="Kelola kategori produk" action={<Button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-blue-500"><Plus className="w-4 h-4 mr-2" /> Tambah</Button>} />

      <DataTable
        columns={[
          { key: 'icon', header: 'Icon', cell: (c) => <span className="text-lg">{c.icon || '📁'}</span> },
          { key: 'name', header: 'Nama', cell: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'slug', header: 'Slug', cell: (c) => <span className="text-sm text-gray-500">{c.slug}</span> },
          { key: 'count', header: 'Produk', cell: (c) => <span className="text-sm">{c.productCount || 0}</span> },
          { key: 'status', header: 'Status', cell: (c) => <StatusBadge status={c.status} /> },
          { key: 'actions', header: '', className: 'w-24', cell: (c) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(c.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )},
        ]}
        data={categories}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); reset(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nama Kategori *</Label><Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={form.icon} onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))} placeholder="📱" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); reset(); }}>Batal</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-500">{editing ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCategory(deleteId); setDeleteId(null); } }} title="Hapus Kategori" description="Produk di kategori ini akan menjadi tanpa kategori. Lanjutkan?" />
    </div>
  );
}
