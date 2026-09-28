import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, Building2, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminService } from '../../services/adminService';

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminService.getAnalytics(),
      adminService.getDashboard(),
    ])
      .then(([analyticsData, statsData]) => {
        if (!mounted) return;
        setAnalytics(analyticsData);
        setStats(statsData);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Analytics</h1>
        <p className="text-[#5c6470] mt-1">
          Platform overview — users, hostels, revenue, and growth trends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          icon={Users}
          color="navy"
          trend={8}
          subtitle={`${stats.users.students} students · ${stats.users.landlords} landlords`}
        />
        <StatCard
          title="Hostels Registered"
          value={stats.hostels.total}
          icon={Building2}
          color="gold"
          trend={12}
          subtitle={`${stats.hostels.verified} verified · ${stats.hostels.pending} pending`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.revenue.monthly / 1000).toFixed(1)}K`}
          icon={DollarSign}
          color="green"
          trend={stats.revenue.growth}
          subtitle="This month"
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings.total}
          icon={TrendingUp}
          color="sky"
          trend={5}
          subtitle={`${stats.bookings.active} active`}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#14213D]">Revenue Trend</h2>
            <p className="text-sm text-[#5c6470] mt-0.5">Monthly revenue for the last 6 months</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
            <ArrowUpRight size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              +{stats.revenue.growth}%
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E9A23B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#E9A23B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#8f96a3"
                style={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#8f96a3"
                style={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14213D',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 13,
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E9A23B"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two-column: User Growth + Hostel Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#14213D]">User Growth</h2>
            <p className="text-sm text-[#5c6470] mt-0.5">Active users over time</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#8f96a3"
                  style={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#8f96a3"
                  style={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                  }}
                  formatter={(value) => [value.toLocaleString(), 'Users']}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4A90D9"
                  strokeWidth={3}
                  dot={{ fill: '#4A90D9', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hostel Registrations (uses monthlyRevenue as placeholder) */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#14213D]">Hostel Registrations</h2>
            <p className="text-sm text-[#5c6470] mt-0.5">New hostels added each month</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#8f96a3"
                  style={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#8f96a3"
                  style={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                  }}
                  formatter={(value) => [Math.round(value / 20), 'Hostels']}
                />
                <Bar
                  dataKey="users"
                  fill="#E9A23B"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5c6470]">Student : Landlord Ratio</p>
              <p className="text-2xl font-bold text-[#14213D] mt-2">
                {Math.round(stats.users.students / stats.users.landlords)}:1
              </p>
              <p className="text-xs text-[#8f96a3] mt-1">
                {stats.users.students} students · {stats.users.landlords} landlords
              </p>
            </div>
            <div className="w-12 h-12 bg-[#14213D]/8 rounded-xl flex items-center justify-center">
              <Users className="text-[#14213D]" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5c6470]">Average Hostel Price</p>
              <p className="text-2xl font-bold text-[#14213D] mt-2">
                ${stats.hostels.avg_price}
              </p>
              <p className="text-xs text-[#8f96a3] mt-1">per month across all hostels</p>
            </div>
            <div className="w-12 h-12 bg-[#E9A23B]/15 rounded-xl flex items-center justify-center">
              <Building2 className="text-[#d98a25]" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5c6470]">Verification Rate</p>
              <p className="text-2xl font-bold text-[#14213D] mt-2">
                {Math.round((stats.hostels.verified / stats.hostels.total) * 100)}%
              </p>
              <p className="text-xs text-[#8f96a3] mt-1">
                {stats.hostels.verified} of {stats.hostels.total} verified
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminAnalytics;