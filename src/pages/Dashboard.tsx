import { useNavigate } from 'react-router-dom';
import { useStats } from '@/hooks/useStats';
import { useOrders } from '@/hooks/useOrders';
import { useWithdraws } from '@/hooks/useWithdraws';
import { useMissions } from '@/hooks/useMissions';
import { useProducts } from '@/hooks/useProducts';
import StatsCards from '@/components/charts/StatsCards';
import StatusBadge from '@/components/shared/StatusBadge';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading, revenueChart, ordersChart, salesByCategory, daysRange, setDaysRange } = useStats();
  const { orders } = useOrders();
  const { withdraws } = useWithdraws();
  const { submissions } = useMissions();
  const { products } = useProducts();

  const lowStockProducts = products.filter(p => {
    const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
    return totalStock < 10 && p.status === 'active';
  }).slice(0, 5);

  const recentOrders = orders.slice(0, 8);
  const pendingWithdraws = withdraws.filter(w => w.status === 'pending').slice(0, 5);
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').slice(0, 5);

  const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview bisnis Fahri Xz Store"
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Grafik Pendapatan</CardTitle>
              <div className="flex gap-1">
                {[7, 30, 90].map((d) => (
                  <Button
                    key={d}
                    variant={daysRange === d ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setDaysRange(d)}
                  >
                    {d} Hari
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `Rp${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Order per Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ordersChart.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Penjualan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="sales"
                  nameKey="category"
                >
                  {salesByCategory.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Semua stok aman</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product: any) => {
                  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                      onClick={() => navigate(`/products?edit=${product.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.categoryName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${totalStock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                          {totalStock} unit
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Order Terbaru</CardTitle>
            <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => navigate('/orders')}>
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Order ID</th>
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Customer</th>
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Produk</th>
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Total</th>
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada order</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="py-3 px-2 text-sm font-medium text-purple-600">{order.orderId}</td>
                      <td className="py-3 px-2 text-sm text-gray-900 dark:text-white">{order.userName}</td>
                      <td className="py-3 px-2 text-sm text-gray-500">{order.items?.[0]?.productName || '-'}</td>
                      <td className="py-3 px-2 text-sm font-medium">Rp {order.totalAmount?.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-2"><StatusBadge status={order.status} pulse={order.status === 'pending' || order.status === 'processing'} /></td>
                      <td className="py-3 px-2 text-sm text-gray-500">
                        {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row: Withdraws & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Withdraw Requests */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Withdraw Pending</CardTitle>
              <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => navigate('/withdraws')}>
                Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingWithdraws.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Tidak ada withdraw pending</p>
            ) : (
              <div className="space-y-3">
                {pendingWithdraws.map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{w.userName}</p>
                      <p className="text-xs text-gray-500">{w.method === 'bank_transfer' ? 'Bank Transfer' : 'E-Wallet'} - {w.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Rp {w.amount?.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Mission Submissions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Submission Misi Pending</CardTitle>
              <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => navigate('/missions/submissions')}>
                Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Tidak ada submission pending</p>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.userName}</p>
                      <p className="text-xs text-gray-500">{s.missionTitle}</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate('/missions/submissions')}>
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
