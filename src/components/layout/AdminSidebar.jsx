import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, Users, CalendarCheck,
  AlertTriangle, CreditCard, Star, BarChart3, Settings, LogOut
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { path: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar() {
  return (
    <aside className="w-64 bg-navy flex flex-col">
      <div className="p-6 border-b border-navy-light">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
            <span className="text-navy font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Hostel Hub</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/15 text-gold border-l-2 border-gold'
                    : 'text-gray-300 hover:bg-navy-light hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-light">
        <button
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;