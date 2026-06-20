import { useState } from 'react';
import { useProductKeys } from '@/hooks/useProductKeys';
import { useProducts } from '@/hooks/useProducts';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Copy, Trash2 } from 'lucide-react';

export default function ProductKeys() {
  const { keys, loading, importKeys, deleteKey } = useProductKeys();
  const { products } = useProducts();
  const [showImport, setShowImport] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleImport = async () => {
    if (!selectedProduct || !keyInput.trim()) return;
    const product = products.find(p => p.id === selectedProduct);
    const variant = product?.variants?.find(v => v.id === selectedVariant);
    const keyList = keyInput.split('\n').map(k => k.trim()).filter(k => k);
    await importKeys(selectedProduct, product?.name || '', selectedVariant || undefined, variant?.name, keyList);
    setShowImport(false);
    setKeyInput('');
    setSelectedProduct('');
    setSelectedVariant('');
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      <PageHeader title="Product Keys" description="Kelola stock license key digital" action={<Button onClick={() => setShowImport(true)} className="bg-gradient-to-r from-purple-600 to-blue-500"><Plus className="w-4 h-4 mr-2" /> Import Keys</Button>} />

      <DataTable
        columns={[
          { key: 'product', header: 'Produk', cell: (k: any) => <div><p className="text-sm font-medium">{k.productName}</p>{k.variantName && <p className="text-xs text-gray-500">{k.variantName}</p>}</div> },
          { key: 'key', header: 'Key', cell: (k: any) => <span className="text-sm font-mono">{k.key?.slice(0, 12)}...</span> },
          { key: 'status', header: 'Status', cell: (k: any) => <StatusBadge status={k.status} /> },
          { key: 'customer', header: 'Customer', cell: (k: any) => <span className="text-sm text-gray-500">{k.customerName || '-'}</span> },
          {
            key: 'actions', header: '', className: 'w-24',
            cell: (k: any) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyKey(k.key, k.id)} title={copiedId === k.id ? 'Copied!' : 'Copy'}>
                  <Copy className={`w-4 h-4 ${copiedId === k.id ? 'text-emerald-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(k.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ),
          },
        ]}
        data={keys}
        loading={loading}
      />

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={() => { setShowImport(false); setKeyInput(''); setSelectedProduct(''); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Import Product Keys</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Produk *</Label>
              <Select value={selectedProduct} onValueChange={(v) => { setSelectedProduct(v); setSelectedVariant(''); }}>
                <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedProductData?.variants && selectedProductData.variants.length > 0 && (
              <div className="space-y-2"><Label>Varian</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger><SelectValue placeholder="Pilih varian (opsional)" /></SelectTrigger>
                  <SelectContent>
                    {selectedProductData.variants.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>License Keys * (satu per baris)</Label>
              <Textarea value={keyInput} onChange={e => setKeyInput(e.target.value)} rows={8} placeholder="XXXX-XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY-YYYY&#10;..." />
            </div>
            <p className="text-xs text-gray-500">{keyInput.split('\n').filter(k => k.trim()).length} keys akan diimport</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowImport(false); setKeyInput(''); setSelectedProduct(''); }}>Batal</Button>
            <Button onClick={handleImport} className="bg-gradient-to-r from-purple-600 to-blue-500" disabled={!selectedProduct || !keyInput.trim()}>
              Import Keys
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteKey(deleteId); setDeleteId(null); } }} title="Hapus Key" description="Key ini akan dihapus permanen." />
    </div>
  );
}
