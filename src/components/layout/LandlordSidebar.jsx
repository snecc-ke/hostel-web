import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, DoorOpen, CalendarCheck,
  MessageSquare, CreditCard, Star, BarChart3, Settings, LogOut,
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

function useLoopTypewriter(text, typeSpeed = 100, eraseSpeed = 50, pauseMs = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    let timer;
    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('erasing'), 100);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), eraseSpeed);
      } else {
        timer = setTimeout(() => setPhase('typing'), 400);
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, text, typeSpeed, eraseSpeed, pauseMs]);

  return displayed;
}

function LandlordSidebar({ collapsed = false }) {
  const title = useLoopTypewriter('Hostel Hub', 100, 50, 2000);

  return (
    <aside
      className="bg-black flex flex-col h-full transition-all duration-300"
      style={{ width: collapsed ? 72 : 256 }}
    >
      {/* Logo */}
      <div
        className="border-b border-white/10 transition-all duration-300"
        style={{ padding: collapsed ? '1rem 0.5rem' : '1.5rem 1.5rem' }}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-lg" style={{ color: '#14213D' }}>H</span>
          </div>
          {!collapsed && (
            <div className="min-h-[2.5rem] overflow-hidden">
              <h1 className="text-base font-bold text-white whitespace-nowrap">
                {title}
                <span
                  className="inline-block w-[2px] h-[1em] align-middle ml-0.5 animate-blink"
                  style={{ backgroundColor: '#E9A23B' }}
                />
              </h1>
              <p className="text-xs text-gray-400 whitespace-nowrap">Landlord Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 py-4 space-y-1 overflow-y-auto"
        style={{ padding: collapsed ? '1rem 0.5rem' : '1rem' }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/20 text-gold border-l-2 border-gold font-semibold'
                    : 'text-gray-400 border-l-2 border-transparent hover:bg-white/5 hover:text-white font-medium'
                } ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className="flex-shrink-0"
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="border-t border-white/10"
        style={{ padding: collapsed ? '0.5rem' : '1rem' }}
      >
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 w-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors ${
            collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
          }`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default LandlordSidebar;