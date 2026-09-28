import React, { useState } from 'react';
import {
  User, Building2, Wallet, Shield, Bell, Camera, Check,
  AlertCircle, Eye, EyeOff, Smartphone, Mail, MessageSquare,
} from 'lucide-react';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function LandlordSettings() {
  const toast = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  /* ── Profile ── */
  const [profile, setProfile] = useState({
    name: user?.name || 'Landlord Name',
    email: user?.email || 'landlord@test.com',
    phone: '+254712345678',
    bio: 'Managing quality student accommodation across Kenya.',
  });

  /* ── Business ── */
  const [business, setBusiness] = useState({
    businessName: 'Green Valley Properties',
    businessId: 'KRA-PIN-123456789',
    location: 'Nairobi, Kenya',
    businessType: 'Individual',
    yearsInBusiness: '5',
  });

  /* ── Payouts ── */
  const [payouts, setPayouts] = useState({
    method: 'mpesa', // 'mpesa' | 'bank'
    mpesaNumber: '+254712345678',
    bankName: 'Equity Bank',
    accountNumber: '',
    accountName: '',
  });

  /* ── Security ── */
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFA: false,
  });
  const [showPasswords, setShowPasswords] = useState(false);

  /* ── Notifications ── */
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailPayments: true,
    emailReviews: false,
    smsBookings: true,
    smsMessages: false,
    smsPayments: true,
    pushAll: true,
  });

  const [saving, setSaving] = useState(false);

  const saveSection = async (section) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success(`${section} saved successfully`);
  };

  /* Password change validation */
  const handlePasswordChange = async () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (security.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password updated');
  };

  const inputClass =
    'w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Settings</h1>
        <p className="mt-1" style={{ color: '#4B5563' }}>
          Manage your account, business, and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="rounded-xl px-2 pt-2" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <Tabs
          tabs={[
            { id: 'profile', label: 'Profile' },
            { id: 'business', label: 'Business' },
            { id: 'payouts', label: 'Payouts' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ═══════════ PROFILE ═══════════ */}
      {activeTab === 'profile' && (
        <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <User size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Personal Profile</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold relative"
              style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
            >
              {profile.name.charAt(0)}
              <button
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: '#14213D', color: '#FFF' }}
                onClick={() => toast.info('Avatar upload coming soon')}
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#14213D' }}>{profile.name}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Phone Number</label>
              <PhoneInput
                international
                defaultCountry="KE"
                value={profile.phone}
                onChange={(v) => setProfile({ ...profile, phone: v || '' })}
                className="phone-input-custom"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell tenants a bit about yourself"
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <Button onClick={() => saveSection('Profile')} loading={saving}>
              Save Profile
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════ BUSINESS ═══════════ */}
      {activeTab === 'business' && (
        <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Building2 size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Business Information</h2>
          </div>

          <div className="p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)' }}>
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#4A90D9' }} />
            <p className="text-xs" style={{ color: '#14213D' }}>
              Verification documents can be uploaded after saving. Your business will be verified within 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Business Name</label>
              <input
                type="text"
                value={business.businessName}
                onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>ID / Registration Number</label>
              <input
                type="text"
                value={business.businessId}
                onChange={(e) => setBusiness({ ...business, businessId: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Business Type</label>
              <select
                value={business.businessType}
                onChange={(e) => setBusiness({ ...business, businessType: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              >
                <option>Individual</option>
                <option>Sole Proprietor</option>
                <option>Limited Company</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Years in Business</label>
              <input
                type="number"
                min="0"
                value={business.yearsInBusiness}
                onChange={(e) => setBusiness({ ...business, yearsInBusiness: e.target.value })}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Location</label>
              <input
                type="text"
                value={business.location}
                onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                placeholder="e.g., Nairobi, Kenya"
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <Button onClick={() => saveSection('Business information')} loading={saving}>
              Save Business Info
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════ PAYOUTS ═══════════ */}
      {activeTab === 'payouts' && (
        <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Wallet size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Payout Settings</h2>
          </div>

          {/* Method toggle */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#14213D' }}>
              Preferred Payout Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'Receive via mobile money' },
                { id: 'bank', label: 'Bank Transfer', icon: Building2, desc: 'Direct to your bank' },
              ].map((opt) => {
                const Icon = opt.icon;
                const isActive = payouts.method === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayouts({ ...payouts, method: opt.id })}
                    className="p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: isActive ? '#E9A23B' : '#E5E7EB',
                      backgroundColor: isActive ? 'rgba(233,162,59,0.08)' : '#FFFFFF',
                    }}
                  >
                    <Icon size={20} style={{ color: isActive ? '#E9A23B' : '#6B7280' }} />
                    <p className="mt-2 font-semibold text-sm" style={{ color: '#14213D' }}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* M-Pesa fields */}
          {payouts.method === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                M-Pesa Number
              </label>
              <PhoneInput
                international
                defaultCountry="KE"
                value={payouts.mpesaNumber}
                onChange={(v) => setPayouts({ ...payouts, mpesaNumber: v || '' })}
                className="phone-input-custom"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Payouts will be sent to this number. Confirm it's registered under your name.
              </p>
            </div>
          )}

          {/* Bank fields */}
          {payouts.method === 'bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Bank Name</label>
                <select
                  value={payouts.bankName}
                  onChange={(e) => setPayouts({ ...payouts, bankName: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                >
                  <option>Equity Bank</option>
                  <option>KCB Bank</option>
                  <option>Co-operative Bank</option>
                  <option>Absa Bank</option>
                  <option>NCBA Bank</option>
                  <option>Stanbic Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Account Number</label>
                <input
                  type="text"
                  value={payouts.accountNumber}
                  onChange={(e) => setPayouts({ ...payouts, accountNumber: e.target.value })}
                  placeholder="0123456789"
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Account Name</label>
                <input
                  type="text"
                  value={payouts.accountName}
                  onChange={(e) => setPayouts({ ...payouts, accountName: e.target.value })}
                  placeholder="Name as it appears on bank statement"
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <Button onClick={() => saveSection('Payout details')} loading={saving}>
              Save Payout Details
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════ SECURITY ═══════════ */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Password */}
          <div className="rounded-xl p-6 space-y-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <Shield size={18} style={{ color: '#14213D' }} />
              <h2 className="font-semibold" style={{ color: '#14213D' }}>Change Password</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                  New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: '#E9A23B' }}
              />
              <span className="text-sm text-gray-600">Show passwords</span>
            </label>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <Button onClick={handlePasswordChange} loading={saving}>
                Update Password
              </Button>
            </div>
          </div>

          {/* 2FA */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone size={16} style={{ color: '#14213D' }} />
                  <h3 className="font-semibold" style={{ color: '#14213D' }}>
                    Two-Factor Authentication
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account by requiring a code from your phone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSecurity({ ...security, twoFA: !security.twoFA });
                  toast.success(security.twoFA ? '2FA disabled' : '2FA enabled');
                }}
                className="relative flex-shrink-0 rounded-full transition-colors"
                style={{
                  width: 52,
                  height: 28,
                  backgroundColor: security.twoFA ? '#10B981' : '#D1D5DB',
                }}
              >
                <span
                  className="absolute top-0.5 rounded-full bg-white transition-all"
                  style={{
                    width: 24,
                    height: 24,
                    left: security.twoFA ? 26 : 2,
                  }}
                ></span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ NOTIFICATIONS ═══════════ */}
      {activeTab === 'notifications' && (
        <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Bell size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Notification Preferences</h2>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail size={16} style={{ color: '#14213D' }} />
              <h3 className="font-medium text-sm" style={{ color: '#14213D' }}>Email Notifications</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { key: 'emailBookings', label: 'New booking requests' },
                { key: 'emailMessages', label: 'New messages from tenants' },
                { key: 'emailPayments', label: 'Payments received' },
                { key: 'emailReviews', label: 'New reviews' },
              ].map((n) => (
                <NotificationRow
                  key={n.key}
                  label={n.label}
                  checked={notifications[n.key]}
                  onChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                />
              ))}
            </div>
          </div>

          {/* SMS */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} style={{ color: '#14213D' }} />
              <h3 className="font-medium text-sm" style={{ color: '#14213D' }}>SMS Notifications</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { key: 'smsBookings', label: 'New booking requests' },
                { key: 'smsMessages', label: 'New messages from tenants' },
                { key: 'smsPayments', label: 'Payments received' },
              ].map((n) => (
                <NotificationRow
                  key={n.key}
                  label={n.label}
                  checked={notifications[n.key]}
                  onChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                />
              ))}
            </div>
          </div>

          {/* Push */}
          <div className="pt-4 border-t border-gray-200">
            <NotificationRow
              label="Push notifications for all activity"
              checked={notifications.pushAll}
              onChange={(v) => setNotifications({ ...notifications, pushAll: v })}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <Button onClick={() => saveSection('Notification preferences')} loading={saving}>
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white border border-gray-200 cursor-pointer">
      <span className="text-sm" style={{ color: '#14213D' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 rounded-full transition-colors"
        style={{
          width: 44,
          height: 24,
          backgroundColor: checked ? '#E9A23B' : '#D1D5DB',
        }}
      >
        <span
          className="absolute top-0.5 rounded-full bg-white transition-all"
          style={{
            width: 20,
            height: 20,
            left: checked ? 22 : 2,
          }}
        ></span>
      </button>
    </label>
  );
}

export default LandlordSettings;