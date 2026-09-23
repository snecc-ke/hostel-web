import React from 'react';
import { Outlet } from 'react-router-dom';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import Header from '../components/layout/Header';

function LandlordLayout() {
  return (
    <div className="flex h-screen bg-bg">
      <LandlordSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LandlordLayout;