import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Mail, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'

  useEffect(() => {
    // TODO: Replace with real API call in Phase 8
    // Verify token with backend
    const verify = async () => {
      try {
        // await authApi.verifyEmail(token);
        await new Promise((resolve) => setTimeout(resolve, 1400));
        // Simulate success if token exists and is not obviously invalid
        if (token && token !== 'invalid') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 144, 217, 0.15)' }}>
            <Mail size={32} style={{ color: '#4A90D9' }} className="animate-pulse" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B1F27' }}>Verifying your email</h1>
        <p className="text-sm text-gray-500 mb-8">Please wait a moment...</p>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#E9A23B' }}></div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle2 size={32} style={{ color: '#10B981' }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B1F27' }}>Email verified!</h1>
        <p className="text-sm text-gray-500 mb-8">
          Your email has been verified successfully. You can now sign in to your account.
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full font-semibold py-3 px-6 rounded-lg transition-colors"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C8862A'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E9A23B'}
        >
          Go to sign in
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
          <XCircle size={32} style={{ color: '#EF4444' }} />
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B1F27' }}>Verification failed</h1>
      <p className="text-sm text-gray-500 mb-8">
        This verification link is invalid or has expired. Please request a new one.
      </p>
      <div className="space-y-3">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full font-semibold py-3 px-6 rounded-lg transition-colors"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
        >
          Back to sign in
        </Link>
        <Link
          to="/register"
          className="flex items-center justify-center gap-2 w-full font-semibold py-3 px-6 rounded-lg transition-colors border-2"
          style={{ borderColor: '#E9A23B', color: '#14213D', backgroundColor: 'transparent' }}
        >
          Create a new account
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailPage;