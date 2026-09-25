import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, DoorOpen, CalendarCheck, Wallet, Users, TrendingUp,
  ArrowRight, Plus, Eye
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { demoStats, demoBookings } from '../../data/demoData';

function LandlordDashboard() {
  const stats = demoStats.landlord;
  const recentBookings = demoBookings.slice(0, 5);

  const stats_cards = [
    { title: 'Total Hostels', value: stats.totalHostels, icon: Building2, color: 'blue' },
    { title: 'Total Rooms', value: stats.totalRooms, icon: DoorOpen, color: 'purple' },
    { title: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: TrendingUp, color: 'green', trend: 5 },
    { title: 'Monthly Earnings', value: formatCompactCurrency(stats.monthlyEarnings), icon: Wallet, color: 'yellow', trend: 12 },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: CalendarCheck, color: 'red' },
    { title: 'Total Tenants', value: stats.totalStudents, icon: Users, color: 'blue', trend: 8 },
  ];

  const bookingColumns = [
    {
      key: 'student',
      label: 'Tenant',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}>
            {b.student?.charAt(0) || 'U'}
          </div>
          <span className="font-medium" style={{ color: '#14213D' }}>{b.student}</span>
        </div>
      ),
    },
    { key: 'hostel', label: 'Hostel' },
    { key: 'room', label: 'Room' },
    {
      key: 'checkIn',
      label: 'Check-in',
      render: (b) => formatDate(b.checkIn),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (b) => (
        <span className="font-medium" style={{ color: '#14213D' }}>{formatCurrency(b.amount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (b) => {
        const variants = {
          pending: 'warning',
          confirmed: 'success',
          cancelled: 'danger',
          completed: 'info',
        };
        return <Badge variant={variants[b.status] || 'default'}>{b.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Dashboard</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>Welcome back! Here's your property overview.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/landlord/hostels/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          >
            <Plus size={18} />
            Add Hostel
          </Link>
          <Link
            to="/landlord/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors border"
            style={{ borderColor: '#D1D5DB', color: '#14213D', backgroundColor: '#F4F6F8' }}
          >
            <Eye size={18} />
            View Bookings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats_cards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#E9A23B' }}>Recent Bookings</h2>
            <p className="text-sm mt-1" style={{ color: '#4B5563' }}>Latest booking activity across your properties</p>
          </div>
          <Link
            to="/landlord/bookings"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: '#4A90D9' }}
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <Table
          columns={bookingColumns}
          data={recentBookings}
          emptyTitle="No bookings yet"
          emptyDescription="When tenants book your hostels, their bookings will appear here."
        />
      </div>
    </div>
  );
}

export default LandlordDashboard;