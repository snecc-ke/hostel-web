import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/layout/StudentSidebar';
import Header from '../components/layout/Header';

function StudentLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;