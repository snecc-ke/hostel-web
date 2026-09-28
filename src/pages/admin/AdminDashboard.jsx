import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building2, CalendarCheck, DollarSign,
  AlertTriangle, ShieldCheck, Star, TrendingUp,
  ArrowRight, CheckCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getDashboard()
      .then((data) => { if (mounted) setStats(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-[#F4F6F8] rounded-2xl p-10 text-center border border-[#E8ECF1]">
        <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
        <h2 className="text-lg font-semibold text-[#14213D] mb-1">Couldn't load dashboard</h2>
        <p className="text-sm text-[#5c6470]">{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ═══════════ PAGE HEADER ═══════════ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Dashboard</h1>
          <p className="text-[#5c6470] mt-1">Platform overview and key metrics</p>
        </div>
        <div className="text-sm text-[#8f96a3]">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* ═══════════ STATS ROW — 4 CARDS ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          icon={Users}
          color="navy"
          trend={8}
        />
        <StatCard
          title="Total Hostels"
          value={stats.hostels.total}
          icon={Building2}
          color="gold"
          trend={12}
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings.total}
          icon={CalendarCheck}
          color="sky"
          trend={5}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.revenue.monthly / 1000).toFixed(0)}K`}
          icon={DollarSign}
          color="green"
          trend={stats.revenue.growth}
        />
      </div>

      {/* ═══════════ TWO-COLUMN: BREAKDOWN + ATTENTION ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Platform Breakdown */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#14213D]">Platform Breakdown</h2>
            <span className="text-xs text-[#8f96a3] uppercase tracking-wide">
              Live snapshot
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Students */}
            <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[#14213D]" />
                <p className="text-xs font-medium text-[#5c6470] uppercase tracking-wide">
                  Students
                </p>
              </div>
              <p className="text-2xl font-bold text-[#14213D]">
                {stats.users.students.toLocaleString()}
              </p>
            </div>

            {/* Landlords */}
            <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-[#14213D]" />
                <p className="text-xs font-medium text-[#5c6470] uppercase tracking-wide">
                  Landlords
                </p>
              </div>
              <p className="text-2xl font-bold text-[#14213D]">
                {stats.users.landlords}
              </p>
            </div>

            {/* Verified Hostels */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                  Verified Hostels
                </p>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {stats.hostels.verified}
              </p>
            </div>

            {/* Pending */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-[#d98a25]" />
                <p className="text-xs font-medium text-[#b86a1c] uppercase tracking-wide">
                  Pending Review
                </p>
              </div>
              <p className="text-2xl font-bold text-[#b86a1c]">
                {stats.hostels.pending}
              </p>
            </div>
          </div>

          {/* Booking breakdown bar */}
          <div className="mt-6 pt-6 border-t border-[#F4F6F8]">
            <p className="text-xs font-medium text-[#5c6470] uppercase tracking-wide mb-3">
              Booking Activity
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-[#5c6470] mb-1">
                  <span>Active</span>
                  <span className="font-semibold text-[#14213D]">{stats.bookings.active}</span>
                </div>
                <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E9A23B] to-[#d98a25]"
                    style={{
                      width: `${(stats.bookings.active / stats.bookings.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#5c6470] mb-1">
                  <span>Completed</span>
                  <span className="font-semibold text-[#14213D]">{stats.bookings.completed}</span>
                </div>
                <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${(stats.bookings.completed / stats.bookings.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#5c6470] mb-1">
                  <span>Cancelled</span>
                  <span className="font-semibold text-[#14213D]">{stats.bookings.cancelled}</span>
                </div>
                <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${(stats.bookings.cancelled / stats.bookings.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Needs Attention */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#E9A23B]/15 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-[#d98a25]" size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#14213D]">Needs Attention</h2>
          </div>

          <div className="space-y-3">
            {/* Verifications */}
            <Link
              to="/admin/verifications"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F4F6F8] hover:bg-[#E8ECF1] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#E8ECF1]">
                  <ShieldCheck size={16} className="text-[#E9A23B]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#14213D]">Verifications</p>
                  <p className="text-xs text-[#5c6470]">Hostels pending review</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">{stats.hostels.pending}</Badge>
                <ArrowRight size={14} className="text-[#8f96a3] group-hover:text-[#E9A23B] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>

            {/* Disputes */}
            <Link
              to="/admin/disputes"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F4F6F8] hover:bg-[#E8ECF1] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#E8ECF1]">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#14213D]">Open Disputes</p>
                  <p className="text-xs text-[#5c6470]">Awaiting resolution</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="danger">2</Badge>
                <ArrowRight size={14} className="text-[#8f96a3] group-hover:text-[#E9A23B] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>

            {/* Reviews */}
            <Link
              to="/admin/reviews"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F4F6F8] hover:bg-[#E8ECF1] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#E8ECF1]">
                  <Star size={16} className="text-[#4A90D9]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#14213D]">Pending Reviews</p>
                  <p className="text-xs text-[#5c6470]">Waiting moderation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">2</Badge>
                <ArrowRight size={14} className="text-[#8f96a3] group-hover:text-[#E9A23B] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>

          {/* Small progress */}
          <div className="mt-6 pt-6 border-t border-[#F4F6F8]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#5c6470] uppercase tracking-wide">
                Platform Health
              </p>
              <span className="text-xs font-semibold text-emerald-600">Good</span>
            </div>
            <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-emerald-400 to-emerald-600" />
            </div>
            <p className="text-xs text-[#8f96a3] mt-2">
              85% of users verified
            </p>
          </div>
        </Card>
      </div>

      {/* ═══════════ QUICK ACTIONS ═══════════ */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#14213D]">Quick Actions</h2>
          <span className="text-xs text-[#8f96a3]">Common tasks</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/admin/verifications"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#14213D] text-white hover:bg-[#1f2d4d] transition-colors group"
          >
            <ShieldCheck size={22} className="text-[#E9A23B] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Review Hostels</span>
          </Link>
          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#14213D] text-[#14213D] hover:bg-[#14213D] hover:text-white transition-colors group"
          >
            <Users size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
          <Link
            to="/admin/disputes"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#E9A23B] text-[#14213D] hover:bg-[#d98a25] transition-colors group"
          >
            <AlertTriangle size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Handle Disputes</span>
          </Link>
          <Link
            to="/admin/analytics"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8ECF1] text-[#14213D] hover:bg-[#F4F6F8] transition-colors group"
          >
            <TrendingUp size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">View Analytics</span>
          </Link>
        </div>
      </Card>

    </div>
  );
}

export default AdminDashboard;