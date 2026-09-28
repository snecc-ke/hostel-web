import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import Header from '../components/layout/Header';

function LandlordLayout() {
  const location = useLocation();

  // Desktop: collapsed state (narrow) vs expanded (wide)
  const [collapsed, setCollapsed] = useState(false);

  // Mobile: sidebar hidden by default, slides in as overlay
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0 transition-all duration-300">
        <LandlordSidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
            <LandlordSidebar collapsed={false} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar with hamburger */}
        <div className="flex items-center bg-black">
          {/* Desktop hamburger */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-12 h-12 ml-3 my-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-12 h-12 ml-3 my-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <Header />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LandlordLayout;