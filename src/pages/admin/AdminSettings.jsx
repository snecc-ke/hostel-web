import { useState } from 'react';
import {
  Save, Bell, Shield, Globe, Mail, Lock,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

function AdminSettings() {
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    platformName: 'Hostel Hub',
    supportEmail: 'support@hostelhub.com',
    supportPhone: '+254 700 000 000',
    commissionRate: 5,
  });

  const [toggles, setToggles] = useState({
    emailNotifications: true,
    autoApproveHostels: false,
    allowNewRegistrations: true,
    maintenanceMode: false,
    twoFactorAuth: false,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    showToast('Settings saved successfully');
  };

  const TOGGLE_ITEMS = [
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Send email updates for new registrations and bookings',
      icon: Bell,
    },
    {
      key: 'autoApproveHostels',
      label: 'Auto-Approve Hostels',
      description: 'Automatically approve new hostel listings without review',
      icon: Shield,
    },
    {
      key: 'allowNewRegistrations',
      label: 'Allow New Registrations',
      description: 'Let new students and landlords sign up',
      icon: Globe,
    },
    {
      key: 'maintenanceMode',
      label: 'Maintenance Mode',
      description: 'Put the platform in read-only mode for maintenance',
      icon: AlertTriangle,
      danger: true,
    },
    {
      key: 'twoFactorAuth',
      label: 'Two-Factor Authentication',
      description: 'Require 2FA for all admin accounts',
      icon: Lock,
    },
  ];

  return (
    <div className="space-y-6">

      {toast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-800 animate-fade-in">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Settings</h1>
          <p className="text-[#5c6470] mt-1">Configure platform preferences</p>
        </div>
        <Button variant="accent" icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* PLATFORM INFO */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#14213D]/8 rounded-lg flex items-center justify-center">
            <Globe size={20} className="text-[#14213D]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#14213D]">Platform Information</h2>
            <p className="text-xs text-[#5c6470]">Basic settings and contact info</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Platform Name"
            value={form.platformName}
            onChange={(e) => setForm({ ...form, platformName: e.target.value })}
          />
          <Input
            label="Support Email"
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
          />
          <Input
            label="Support Phone"
            value={form.supportPhone}
            onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
          />
          <Input
            label="Commission Rate (%)"
            type="number"
            value={form.commissionRate}
            onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
            helperText="Percentage taken from each booking"
          />
        </div>
      </Card>

      {/* TOGGLES */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#E9A23B]/15 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-[#d98a25]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#14213D]">Platform Controls</h2>
            <p className="text-xs text-[#5c6470]">Toggle features on or off</p>
          </div>
        </div>

        <div className="space-y-1">
          {TOGGLE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isOn = toggles[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-[#F4F6F8] transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.danger ? 'bg-red-50' : 'bg-[#F4F6F8]'
                  }`}>
                    <Icon
                      size={18}
                      className={item.danger ? 'text-red-500' : 'text-[#14213D]'}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#14213D]">{item.label}</p>
                      {item.danger && <Badge variant="danger">Danger</Badge>}
                    </div>
                    <p className="text-xs text-[#5c6470] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggle(item.key)}
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative ${
                    isOn ? 'bg-[#E9A23B]' : 'bg-[#D1D5DB]'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      isOn ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* DANGER ZONE */}
      <Card className="!border-red-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
            <p className="text-xs text-[#5c6470]">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
            <div>
              <p className="font-medium text-[#14213D]">Clear All Cache</p>
              <p className="text-xs text-[#5c6470] mt-0.5">
                Force refresh all data on the platform
              </p>
            </div>
            <Button variant="danger" size="sm">Clear</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
            <div>
              <p className="font-medium text-[#14213D]">Reset Platform Data</p>
              <p className="text-xs text-[#5c6470] mt-0.5">
                Delete all users, hostels, and bookings. Cannot be undone.
              </p>
            </div>
            <Button variant="danger" size="sm">Reset</Button>
          </div>
        </div>
      </Card>

      {/* SAVE BAR */}
      <div className="flex items-center justify-end gap-3 p-4 rounded-xl bg-white border border-[#E8ECF1] sticky bottom-4 shadow-sm">
        <Button variant="ghost" size="md">Cancel</Button>
        <Button variant="accent" icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default AdminSettings;