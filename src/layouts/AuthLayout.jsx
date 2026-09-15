import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">Hostel Hub</span>
          </Link>
          
          <Outlet />
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-4">
            Find your perfect student accommodation
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students who have found their ideal hostel through Hostel Hub.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold">Verified Listings</p>
                <p className="text-blue-100 text-sm">All hostels are verified for your safety</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold">Secure Payments</p>
                <p className="text-blue-100 text-sm">Your money is protected until check-in</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold">Direct Communication</p>
                <p className="text-blue-100 text-sm">Chat directly with hostel owners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;