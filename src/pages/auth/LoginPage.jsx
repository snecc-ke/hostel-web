import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authApi.login(formData.email, formData.password);
      const user = data.user || JSON.parse(localStorage.getItem('user') || '{}');

      // Update AuthContext
      login(user, data);

      // Route by role
      const redirectMap = {
        tenant: '/tenant/dashboard',
        landlord: '/landlord/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirectMap[user.role] || '/');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B1F27' }}>Welcome back</h1>
        <p className="text-gray-500">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1B1F27' }}>Email address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@gmail.com"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1B1F27' }}>Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
              style={{ accentColor: '#E9A23B' }}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-medium hover:opacity-80 transition-colors" style={{ color: '#4A90D9' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C8862A'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E9A23B'}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold transition-colors" style={{ color: '#4A90D9' }}>
          Create one now
        </Link>
      </p>

      {/* Dev hint — remove before launch */}
      <div className="mt-6 p-3 rounded-lg text-xs text-gray-500" style={{ backgroundColor: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)' }}>
        <p className="font-semibold mb-1" style={{ color: '#14213D' }}>Test accounts:</p>
        <p>tenant@test.com · landlord@test.com · admin@test.com</p>
        <p>Password for all: <span className="font-mono">Test1234!</span></p>
      </div>
    </div>
  );
}

export default LoginPage;