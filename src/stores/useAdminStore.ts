import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, Notification } from '@/types';

interface AdminState {
  // Auth
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Theme
  darkMode: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setAdmin: (admin: AdminUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleSidebarCollapsed: () => void;
  setSidebarOpen: (value: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Auth
      admin: null,
      isAuthenticated: false,
      isLoading: true,
      
      // Sidebar
      sidebarOpen: false,
      sidebarCollapsed: false,
      
      // Theme
      darkMode: false,
      
      // Notifications
      notifications: [],
      unreadCount: 0,
      
      // Actions
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarOpen: (value) => set({ sidebarOpen: value }),
      
      toggleDarkMode: () => set((state) => {
        const newMode = !state.darkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newMode };
      }),
      
      setDarkMode: (value) => {
        set({ darkMode: value });
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        })),
      
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
      
      logout: () =>
        set({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
