import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Reviews() {
  const { reviews, loading, updateStatus, deleteReview } = useReviews();
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    return true;
  });

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderasi ulasan customer" />

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Bintang</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <DataTable
        columns={[
          { key: 'product', header: 'Produk', cell: (r) => <div><p className="text-sm font-medium">{r.productName}</p></div> },
          { key: 'customer', header: 'Customer', cell: (r) => <div><p className="text-sm">{r.userName}</p><p className="text-xs text-gray-500">{r.userEmail}</p></div> },
          { key: 'rating', header: 'Rating', cell: (r) => renderStars(r.rating) },
          { key: 'comment', header: 'Ulasan', cell: (r) => <p className="text-sm text-gray-600 max-w-xs truncate">{r.comment}</p> },
          { key: 'date', header: 'Tanggal', cell: (r) => <span className="text-sm text-gray-500">{r.createdAt ? format(new Date(r.createdAt), 'dd MMM yyyy') : '-'}</span> },
          { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions', header: '', className: 'w-36',
            cell: (r) => (
              <div className="flex gap-1">
                {r.status !== 'approved' && <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => updateStatus(r.id, 'approved')}><Check className="w-4 h-4" /></Button>}
                {r.status !== 'hidden' && <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" onClick={() => updateStatus(r.id, 'hidden')}><EyeOff className="w-4 h-4" /></Button>}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
      />

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteReview(deleteId); setDeleteId(null); } }} title="Hapus Review" description="Review ini akan dihapus permanen." />
    </div>
  );
}
