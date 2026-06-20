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
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';

const menuGroups = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Produk', icon: Package, path: '/products' },
      { label: 'Orders', icon: ShoppingCart, path: '/orders' },
      { label: 'Users', icon: Users, path: '/users' },
    ],
  },
  {
    title: 'Katalog',
    items: [
      { label: 'Kategori', icon: Tags, path: '/categories' },
      { label: 'Voucher', icon: Ticket, path: '/vouchers' },
      { label: 'Reviews', icon: Star, path: '/reviews' },
    ],
  },
  {
    title: 'Gamifikasi',
    items: [
      { label: 'Missions', icon: Target, path: '/missions' },
      { label: 'Submissions', icon: ClipboardList, path: '/missions/submissions' },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      { label: 'Wallets', icon: Wallet, path: '/wallets' },
      { label: 'Withdraw', icon: DollarSign, path: '/withdraws' },
      { label: 'Transaksi', icon: Receipt, path: '/transactions' },
    ],
  },
  {
    title: 'Digital',
    items: [
      { label: 'Product Keys', icon: KeyRound, path: '/product-keys' },
      { label: 'Invoices', icon: FileText, path: '/invoices' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { label: 'Coin Settings', icon: Coins, path: '/coin-settings' },
      { label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useAdminStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gray-900 dark:bg-black transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div
          className={cn(
            'flex items-center gap-3 overflow-hidden transition-all duration-300',
            sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm whitespace-nowrap">Fahri Xz Store</span>
        </div>
        <button
          onClick={toggleSidebarCollapsed}
          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {!sidebarCollapsed && (
              <p className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 relative',
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-purple-500 to-blue-500" />
                  )}
                  {isActive ? (
                    <div className="flex items-center gap-3 w-full rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-500/20 px-3 py-2">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
