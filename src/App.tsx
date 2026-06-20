import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/layout/AdminLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Users from '@/pages/Users';
import Categories from '@/pages/Categories';
import Vouchers from '@/pages/Vouchers';
import Reviews from '@/pages/Reviews';
import Missions from '@/pages/Missions';
import MissionSubmissions from '@/pages/MissionSubmissions';
import Wallets from '@/pages/Wallets';
import WithdrawRequests from '@/pages/WithdrawRequests';
import Transactions from '@/pages/Transactions';
import ProductKeys from '@/pages/ProductKeys';
import Invoices from '@/pages/Invoices';
import CoinSettings from '@/pages/CoinSettings';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-gray-900">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full bg-white/20" />
          <Skeleton className="h-32 w-full bg-white/20" />
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="missions" element={<Missions />} />
          <Route path="missions/submissions" element={<MissionSubmissions />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="withdraws" element={<WithdrawRequests />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="product-keys" element={<ProductKeys />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="coin-settings" element={<CoinSettings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
