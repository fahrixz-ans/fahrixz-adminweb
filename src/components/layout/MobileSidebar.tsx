import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/stores/useAdminStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Ticket,
  Star,
  Target,
  ClipboardList,
  Wallet,
  DollarSign,
  Receipt,
  KeyRound,
  FileText,
  Settings,
  Coins,
  Store,
  X,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Produk', icon: Package, path: '/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Kategori', icon: Tags, path: '/categories' },
  { label: 'Voucher', icon: Ticket, path: '/vouchers' },
  { label: 'Reviews', icon: Star, path: '/reviews' },
  { label: 'Missions', icon: Target, path: '/missions' },
  { label: 'Submissions', icon: ClipboardList, path: '/missions/submissions' },
  { label: 'Wallets', icon: Wallet, path: '/wallets' },
  { label: 'Withdraw', icon: DollarSign, path: '/withdraws' },
  { label: 'Transaksi', icon: Receipt, path: '/transactions' },
  { label: 'Product Keys', icon: KeyRound, path: '/product-keys' },
  { label: 'Invoices', icon: FileText, path: '/invoices' },
  { label: 'Coin Settings', icon: Coins, path: '/coin-settings' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function MobileSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-black transform transition-transform duration-300 ease-in-out lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Fahri Xz Store</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Menu */}
      <nav className="overflow-y-auto py-4 h-[calc(100vh-64px)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200',
                isActive
                  ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-8 rounded-r-full bg-gradient-to-b from-purple-500 to-blue-500" />
              )}
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
