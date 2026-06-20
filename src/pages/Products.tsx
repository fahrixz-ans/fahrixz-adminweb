import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';

const EMPTY_VARIANT: Omit<ProductVariant, 'id'> = {
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  status: 'active',
  digitalType: 'license_key',
};

export default function Products() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    basePrice: 0,
    status: 'active' as 'active' | 'inactive',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    images: [] as string[],
    variants: [] as ProductVariant[],
  });
  const [newVariant, setNewVariant] = useState<Omit<ProductVariant, 'id'>>({ ...EMPTY_VARIANT });
  const [showVariantForm, setShowVariantForm] = useState(false);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    return true;
  });

  const resetForm = () => {
    setFormData({
      name: '', slug: '', description: '', categoryId: '', basePrice: 0,
      status: 'active', featured: false, metaTitle: '', metaDescription: '',
      images: [], variants: [],
    });
    setEditingProduct(null);
    setShowVariantForm(false);
    setNewVariant({ ...EMPTY_VARIANT });
  };

  const openAdd = () => { resetForm(); setShowForm(true); };
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      status: product.status,
      featured: product.featured,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      images: product.images || [],
      variants: product.variants || [],
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
    };
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    setShowForm(false);
    resetForm();
  };

  const addVariant = () => {
    if (!newVariant.name) return;
    const variant: ProductVariant = { ...newVariant, id: crypto.randomUUID() };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, variant] }));
    setNewVariant({ ...EMPTY_VARIANT });
    setShowVariantForm(false);
  };

  const removeVariant = (id: string) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
  };

  const totalStock = (product: Product) =>
    product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  const stockStatus = (stock: number) => {
    if (stock >= 20) return { label: 'Aman', color: 'bg-emerald-100 text-emerald-700' as const };
    if (stock >= 10) return { label: 'Menipis', color: 'bg-yellow-100 text-yellow-700' as const };
    if (stock > 0) return { label: 'Segera', color: 'bg-orange-100 text-orange-700' as const };
    return { label: 'Habis', color: 'bg-red-100 text-red-700' as const };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produk"
        description="Kelola produk digital"
        action={
          <Button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Plus className="w-4 h-4 mr-2" /> Tambah Produk
          </Button>
        }
      />

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: 'image', header: '', className: 'w-12',
            cell: (p) => (
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400"><Eye className="w-4 h-4" /></div>
                )}
              </div>
            ),
          },
          { key: 'name', header: 'Nama Produk', cell: (p) => <span className="font-medium text-gray-900 dark:text-white">{p.name}</span> },
          { key: 'category', header: 'Kategori', cell: (p) => <span className="text-gray-500">{p.categoryName || '-'}</span> },
          { key: 'price', header: 'Harga', cell: (p) => <span>Rp {p.basePrice?.toLocaleString('id-ID')}</span> },
          {
            key: 'stock', header: 'Stok',
            cell: (p) => {
              const stock = totalStock(p);
              const s = stockStatus(stock);
              return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label} ({stock})</span>;
            },
          },
          { key: 'sold', header: 'Terjual', cell: (p) => <span>{p.soldCount || 0}</span> },
          { key: 'status', header: 'Status', cell: (p) => <StatusBadge status={p.status} /> },
          {
            key: 'actions', header: '', className: 'w-24',
            cell: (p) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteConfirm(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        searchable={false}
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Produk *</Label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData(prev => ({ ...prev, categoryId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Harga Dasar (Rp)</Label>
                <Input type="number" value={formData.basePrice} onChange={(e) => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={formData.status === 'active'} onCheckedChange={(v) => setFormData(prev => ({ ...prev, status: v ? 'active' : 'inactive' }))} />
                <Label>Aktif</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.featured} onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))} />
                <Label>Featured</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input value={formData.metaTitle} onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea value={formData.metaDescription} onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))} rows={2} />
            </div>

            {/* Variants */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Varian Produk ({formData.variants.length})</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowVariantForm(!showVariantForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Tambah Varian
                </Button>
              </div>

              {showVariantForm && (
                <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Nama Varian</Label><Input value={newVariant.name} onChange={e => setNewVariant(prev => ({ ...prev, name: e.target.value }))} placeholder="Contoh: 100 Diamond" /></div>
                    <div className="space-y-1"><Label className="text-xs">SKU</Label><Input value={newVariant.sku} onChange={e => setNewVariant(prev => ({ ...prev, sku: e.target.value }))} placeholder="SKU-001" /></div>
                    <div className="space-y-1"><Label className="text-xs">Harga (Rp)</Label><Input type="number" value={newVariant.price} onChange={e => setNewVariant(prev => ({ ...prev, price: Number(e.target.value) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Stok</Label><Input type="number" value={newVariant.stock} onChange={e => setNewVariant(prev => ({ ...prev, stock: Number(e.target.value) }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tipe Digital</Label>
                      <Select value={newVariant.digitalType} onValueChange={(v: ProductVariant['digitalType']) => setNewVariant(prev => ({ ...prev, digitalType: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="license_key">License Key</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="download_link">Download Link</SelectItem>
                          <SelectItem value="topup">Top Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select value={newVariant.status} onValueChange={(v: 'active' | 'inactive') => setNewVariant(prev => ({ ...prev, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={addVariant}>Simpan Varian</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowVariantForm(false)}>Batal</Button>
                  </div>
                </div>
              )}

              {formData.variants.length > 0 && (
                <div className="space-y-2">
                  {formData.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{v.name}</span>
                        <span className="text-gray-500">SKU: {v.sku}</span>
                        <span className="text-gray-500">Rp {v.price?.toLocaleString('id-ID')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${v.stock > 10 ? 'bg-emerald-100 text-emerald-700' : v.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          Stok: {v.stock}
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeVariant(v.id)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Batal</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-500">
              {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) { deleteProduct(deleteConfirm); setDeleteConfirm(null); } }}
        title="Hapus Produk"
        description="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
