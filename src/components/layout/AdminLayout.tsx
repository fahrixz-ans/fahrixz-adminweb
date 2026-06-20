import { Outlet } from 'react-router-dom';
import { useAdminStore } from '@/stores/useAdminStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileSidebar from './MobileSidebar';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
  const { sidebarCollapsed, sidebarOpen } = useAdminStore();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          'lg:ml-64',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => useAdminStore.getState().setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
