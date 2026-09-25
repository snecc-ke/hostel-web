import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Users, CalendarCheck, Star, Building2,
  BarChart3, Wallet,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatCurrency';
import { demoHostels, demoStats } from '../../data/demoData';

/* ── Demo analytics data ── */
const REVENUE_DATA = [
  { month: 'Jan', revenue: 320000, occupancy: 62 },
  { month: 'Feb', revenue: 385000, occupancy: 68 },
  { month: 'Mar', revenue: 420000, occupancy: 72 },
  { month: 'Apr', revenue: 398000, occupancy: 70 },
  { month: 'May', revenue: 455000, occupancy: 76 },
  { month: 'Jun', revenue: 512000, occupancy: 81 },
  { month: 'Jul', revenue: 548000, occupancy: 84 },
  { month: 'Aug', revenue: 520000, occupancy: 80 },
  { month: 'Sep', revenue: 585000, occupancy: 86 },
];

const BOOKING_STATUS_DATA = [
  { name: 'Confirmed', value: 58, color: '#10B981' },
  { name: 'Pending', value: 22, color: '#F59E0B' },
  { name: 'Completed', value: 15, color: '#4A90D9' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
];

const TOP_HOSTELS_DATA = [
  { name: 'Green Valley', bookings: 45, revenue: 675000 },
  { name: 'Sunrise Hostel', bookings: 32, revenue: 384000 },
  { name: 'Lakeview', bookings: 28, revenue: 490000 },
  { name: 'Riverside', bookings: 12, revenue: 144000 },
];

const ROOM_TYPE_DATA = [
  { type: 'Single Room', count: 37, color: '#14213D' },
  { type: 'Bedsitter', count: 20, color: '#E9A23B' },
];

function Analytics() {
  const [timeRange, setTimeRange] = useState('12m');

  const stats = demoStats.landlord;

  /* Filter data by time range */
  const rangedData = useMemo(() => {
    const map = { '3m': 3, '6m': 6, '12m': REVENUE_DATA.length };
    const count = map[timeRange] || REVENUE_DATA.length;
    return REVENUE_DATA.slice(-count);
  }, [timeRange]);

  /* Range buttons config */
  const ranges = [
    { id: '3m', label: 'Last 3 Months' },
    { id: '6m', label: 'Last 6 Months' },
    { id: '12m', label: 'Last 12 Months' },
  ];

  /* Format money for Y-axis */
  const moneyTick = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Analytics</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>
            Insights about your properties and performance
          </p>
        </div>

        {/* Time range selector */}
        <div className="inline-flex rounded-lg p-1" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: timeRange === r.id ? '#E9A23B' : 'transparent',
                color: timeRange === r.id ? '#14213D' : '#6B7280',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={TrendingUp}
          color="green"
          trend={4}
        />
        <StatCard
          title="Total Revenue"
          value={formatCompactCurrency(stats.monthlyEarnings)}
          icon={Wallet}
          color="yellow"
          trend={12}
        />
        <StatCard
          title="Active Bookings"
          value={stats.pendingBookings + 45}
          icon={CalendarCheck}
          color="blue"
          trend={8}
        />
        <StatCard
          title="Average Rating"
          value="4.5"
          icon={Star}
          color="purple"
          trend={2}
        />
      </div>

      {/* Revenue + Occupancy (full width) */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} style={{ color: '#14213D' }} />
          <h2 className="font-semibold" style={{ color: '#14213D' }}>Revenue & Occupancy Trend</h2>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={rangedData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E9A23B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E9A23B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={moneyTick} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(val, name) =>
                  name === 'revenue' ? [formatCurrency(val), 'Revenue'] : [`${val}%`, 'Occupancy']
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E9A23B"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#4A90D9"
                strokeWidth={2}
                fill="url(#occupancyGrad)"
                name="Occupancy %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bookings by Status - Donut */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Bookings by Status</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={BOOKING_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {BOOKING_STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val) => [`${val} bookings`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hostels - Horizontal Bar */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} style={{ color: '#14213D' }} />
            <h2 className="font-semibold" style={{ color: '#14213D' }}>Top Performing Hostels</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={TOP_HOSTELS_DATA} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={moneyTick} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#E9A23B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Room Type Distribution */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} style={{ color: '#14213D' }} />
          <h2 className="font-semibold" style={{ color: '#14213D' }}>Room Type Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROOM_TYPE_DATA.map((rt) => {
            const total = ROOM_TYPE_DATA.reduce((s, r) => s + r.count, 0);
            const pct = Math.round((rt.count / total) * 100);
            return (
              <div key={rt.type} className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rt.color }}
                    ></span>
                    <span className="font-medium text-sm" style={{ color: '#14213D' }}>
                      {rt.type}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#14213D' }}>
                    {rt.count} rooms · {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: rt.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Analytics;