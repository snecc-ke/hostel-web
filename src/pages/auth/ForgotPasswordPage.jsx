import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with real API call in Phase 8
      // await authApi.forgotPassword(email);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 144, 217, 0.15)' }}>
            <CheckCircle2 size={32} style={{ color: '#4A90D9' }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#1B1F27' }}>Check your email</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          We've sent a password reset link to <span className="font-medium" style={{ color: '#14213D' }}>{email}</span>.
          Follow the link in the email to reset your password.
        </p>
        <p className="text-xs text-gray-400 text-center mb-6">
          Didn't get the email? Check your spam folder or try again in a few minutes.
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition-colors border-2"
          style={{ borderColor: '#E9A23B', color: '#14213D', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={18} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B1F27' }}>Forgot password?</h1>
        <p className="text-gray-500">Enter your email and we'll send you a link to reset it.</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
            />
          </div>
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
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#4A90D9' }}
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;