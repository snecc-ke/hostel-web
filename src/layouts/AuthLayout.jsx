import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, Lock, MessageCircle } from 'lucide-react';

function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-navy">
      {/* Left Side - Form Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-navy">Hostel Hub</span>
          </Link>

          <Outlet />
        </div>
      </div>

      {/* Right Side - Brand Panel */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-info/10"></div>

        <div className="relative max-w-md">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full tracking-wider uppercase mb-4">
            Trusted Platform
          </span>
          <h2 className="text-4xl font-bold mb-5 leading-tight text-white">
            Find your perfect <span className="text-gold">student home</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed text-gray-300">
            Join thousands of students and landlords using Hostel Hub to make accommodation simple, safe, and secure.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold text-white">Verified Listings</p>
                <p className="text-sm text-gray-400">Every hostel is manually verified for safety</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold text-white">Secure Payments</p>
                <p className="text-sm text-gray-400">Your money is protected until check-in</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold text-white">Direct Communication</p>
                <p className="text-sm text-gray-400">Chat directly with hostel owners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;