import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-black border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search hostels, rooms, bookings..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-lg shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                </div>
                <div className="p-4 text-sm space-y-3">
                  <p className="text-gray-300">🔔 New booking request from John Doe</p>
                  <p className="text-gray-300">💬 New message from Jane Smith</p>
                  <p className="text-gray-300">💰 Payment received: KSh 5,000</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center font-semibold text-sm" style={{ color: '#14213D' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden md:block" />
            </button>

            {showProfile && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">
                  Account settings
                </button>
                <div className="border-t border-white/10"></div>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;