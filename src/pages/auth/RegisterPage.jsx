import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  GraduationCap, Building2,
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { authApi } from '../../services/authApi';

const API_BASE_URL = 'http://localhost:8000/api/v1';

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function StrengthBar({ password }) {
  const score = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#EAB308', '#10B981'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i <= score ? colors[score] : '#D1D5DB' }}
          />
        ))}
      </div>
      <p className="text-xs mt-1" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { role, setRole } = useOutletContext();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', university: '', studentId: '',
    businessName: '', businessId: '', agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.phone || formData.phone.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    if (getStrength(formData.password) < 2) {
      setError('Password must be at least 8 characters and contain uppercase, number, and symbol');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
        ...(role === 'tenant' && {
          university: formData.university || null,
          student_id: formData.studentId || null,
        }),
        ...(role === 'landlord' && {
          business_name: formData.businessName,
          business_id: formData.businessId,
        }),
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* STEP 1: Role selection */
  if (!role) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B1F27' }}>Join Hostel Hub</h1>
          <p className="text-gray-500">Choose how you want to use the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tenant */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-all hover:border-[#E9A23B] hover:shadow-md flex flex-col">
            <div className="flex justify-center mb-3">
              <GraduationCap size={36} style={{ color: '#14213D' }} />
            </div>
            <h3 className="text-center font-bold text-lg" style={{ color: '#1B1F27' }}>Tenant</h3>
            <p className="text-center text-sm text-gray-500 mt-1 mb-4">Find and book accommodation</p>
            <button
              type="button"
              onClick={() => setRole('tenant')}
              className="mt-auto w-full py-2 rounded-lg font-semibold transition-colors border-2"
              style={{ borderColor: '#E9A23B', color: '#14213D', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Continue
            </button>
          </div>

          {/* Landlord */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-all hover:border-[#E9A23B] hover:shadow-md flex flex-col">
            <div className="flex justify-center mb-3">
              <Building2 size={36} style={{ color: '#14213D' }} />
            </div>
            <h3 className="text-center font-bold text-lg" style={{ color: '#1B1F27' }}>Landlord</h3>
            <p className="text-center text-sm text-gray-500 mt-1 mb-4">List and manage hostels</p>
            <button
              type="button"
              onClick={() => setRole('landlord')}
              className="mt-auto w-full py-2 rounded-lg font-semibold transition-colors border-2"
              style={{ borderColor: '#E9A23B', color: '#14213D', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Continue
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#4A90D9' }}>Sign in</Link>
        </p>
      </div>
    );
  }

  /* STEP 2: Form */
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1B1F27' }}>
          Create your {role === 'tenant' ? 'tenant' : 'landlord'} account
        </h1>
        <p className="text-sm text-gray-500">Fill in your details to get started</p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="you@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Phone Number</label>
          <PhoneInput
            international
            defaultCountry="KE"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v || '' })}
            className="phone-input-custom"
          />
        </div>

        {role === 'tenant' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>
                University Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text" name="university" value={formData.university} onChange={handleChange}
                placeholder="University of Nairobi"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>
                Student ID <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text" name="studentId" value={formData.studentId} onChange={handleChange}
                placeholder="e.g., S1234567"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
              />
            </div>
          </>
        )}

        {role === 'landlord' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Business Name</label>
              <input
                type="text" name="businessName" value={formData.businessName} onChange={handleChange} required
                placeholder="Green Valley Properties"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>ID / Registration Number</label>
              <input
                type="text" name="businessId" value={formData.businessId} onChange={handleChange} required
                placeholder="e.g., KRA PIN or national ID"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'} name="password"
              value={formData.password} onChange={handleChange} required
              placeholder="Create a strong password"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <StrengthBar password={formData.password} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B1F27' }}>Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'} name="confirmPassword"
              value={formData.confirmPassword} onChange={handleChange} required
              placeholder="Repeat your password"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-gray-300" style={{ accentColor: '#E9A23B' }}
          />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <Link to="/terms" className="font-medium" style={{ color: '#4A90D9' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="font-medium" style={{ color: '#4A90D9' }}>Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit" disabled={loading}
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold" style={{ color: '#4A90D9' }}>Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;