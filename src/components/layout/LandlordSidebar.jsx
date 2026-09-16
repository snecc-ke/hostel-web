import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, DoorOpen, CalendarCheck,
  MessageSquare, CreditCard, Star, BarChart3, Settings, LogOut
} from 'lucide-react';

const menuItems = [
  { path: '/landlord/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/landlord/hostels', label: 'My Hostels', icon: Building2 },
  { path: '/landlord/rooms', label: 'Rooms', icon: DoorOpen },
  { path: '/landlord/bookings', label: 'Bookings', icon: CalendarCheck },
  { path: '/landlord/messages', label: 'Messages', icon: MessageSquare },
  { path: '/landlord/payments', label: 'Payments', icon: CreditCard },
  { path: '/landlord/reviews', label: 'Reviews', icon: Star },
  { path: '/landlord/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/landlord/settings', label: 'Settings', icon: Settings },
];

function LandlordSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Hostel Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Landlord Portal</p>
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
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default LandlordSidebar;