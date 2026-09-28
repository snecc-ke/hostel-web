import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Wallet, TrendingUp, Clock, CreditCard, Receipt, Download,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { demoBookings } from '../../data/demoData';

const PAGE_SIZE_OPTIONS = [15, 20];

const PAYMENT_METHODS = ['M-Pesa', 'Card', 'Bank Transfer'];
const STATUSES = ['completed', 'pending', 'failed', 'refunded'];

/* Generate mock payment records from demo bookings */
const generatePayments = () => {
  const payments = [];
  let id = 1000;

  demoBookings.forEach((b, i) => {
    // Each booking has a payment record
    let status = 'completed';
    if (b.status === 'pending') status = 'pending';
    else if (b.status === 'cancelled') status = 'refunded';
    else if (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'completed') status = 'completed';

    payments.push({
      id: id++,
      txnId: `TXN-${1000 + i}`,
      date: b.checkIn,
      tenant: b.student,
      hostel: b.hostel,
      room: b.room,
      amount: b.amount,
      method: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
      status,
      bookingId: b.id,
    });
  });

  // Add a couple of extra records for variety
  payments.push({
    id: id++,
    txnId: `TXN-${1000 + payments.length}`,
    date: '2026-09-15',
    tenant: 'Grace Njeri',
    hostel: 'Green Valley Hostel',
    room: 'S-105',
    amount: 45000,
    method: 'M-Pesa',
    status: 'failed',
    bookingId: null,
  });
  payments.push({
    id: id++,
    txnId: `TXN-${1000 + payments.length}`,
    date: '2026-09-10',
    tenant: 'Brian Otieno',
    hostel: 'Sunrise Hostel',
    room: 'BS-201',
    amount: 66000,
    method: 'Card',
    status: 'completed',
    bookingId: null,
  });

  return payments;
};

function Payments() {
  const [payments] = useState(generatePayments);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, pageSize]);

  /* Stats */
  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.status === 'completed');
    const pending = payments.filter((p) => p.status === 'pending');
    const thisMonth = payments.filter((p) => {
      const d = new Date(p.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    return {
      totalEarnings: completed.reduce((s, p) => s + p.amount, 0),
      thisMonth: thisMonth.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
      pendingPayouts: pending.reduce((s, p) => s + p.amount, 0),
      totalTransactions: payments.length,
    };
  }, [payments]);

  /* Tab counts */
  const counts = useMemo(() => ({
    all: payments.length,
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    refunded: payments.filter((p) => p.status === 'refunded').length,
  }), [payments]);

  /* Filter + search */
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchesTab = activeTab === 'all' || p.status === activeTab;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.txnId.toLowerCase().includes(q) ||
        p.tenant.toLowerCase().includes(q) ||
        p.hostel.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [payments, activeTab, search]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagePayments = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    {
      key: 'txnId',
      label: 'Transaction',
      render: (p) => (
        <div>
          <p className="font-mono text-xs font-medium" style={{ color: '#14213D' }}>
            {p.txnId}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(p.date)}</p>
        </div>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      render: (p) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
          >
            {p.tenant.charAt(0)}
          </div>
          <span className="text-sm" style={{ color: '#14213D' }}>{p.tenant}</span>
        </div>
      ),
    },
    { key: 'hostel', label: 'Hostel' },
    { key: 'room', label: 'Room' },
    {
      key: 'method',
      label: 'Method',
      render: (p) => (
        <span className="text-sm text-gray-600">{p.method}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (p) => (
        <span className="font-semibold" style={{ color: '#14213D' }}>
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => {
        const variants = {
          completed: 'success',
          pending: 'warning',
          failed: 'danger',
          refunded: 'info',
        };
        return <Badge variant={variants[p.status] || 'default'}>{p.status}</Badge>;
      },
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (p) => (
        <button
          onClick={(e) => { e.stopPropagation(); setViewTarget(p); }}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'rgba(74,144,217,0.12)', color: '#4A90D9' }}
          title="View receipt"
        >
          <Receipt size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Payments</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>
            Track your earnings and manage transactions
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8862A')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Earnings"
          value={formatCompactCurrency(stats.totalEarnings)}
          icon={Wallet}
          color="green"
          trend={12}
        />
        <StatCard
          title="This Month"
          value={formatCompactCurrency(stats.thisMonth)}
          icon={TrendingUp}
          color="blue"
          trend={8}
        />
        <StatCard
          title="Pending Payouts"
          value={formatCompactCurrency(stats.pendingPayouts)}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="rounded-xl px-2 pt-2" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'failed', label: 'Failed', count: counts.failed },
            { id: 'refunded', label: 'Refunded', count: counts.refunded },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Search */}
      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by transaction ID, tenant, hostel, or room..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={pagePayments}
        rowKey={(p) => p.id}
        emptyIcon={Receipt}
        emptyTitle={activeTab === 'all' ? 'No transactions yet' : `No ${activeTab} transactions`}
        emptyDescription="Payment records will appear here once tenants start paying."
      />

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded border border-gray-300 bg-white text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-white"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Payment Receipt"
        size="md"
      >
        {viewTarget && (
          <div className="space-y-5">
            {/* Header */}
            <div
              className="text-center p-5 rounded-xl"
              style={{ backgroundColor: '#F4F6F8' }}
            >
              <p className="text-xs uppercase tracking-wider text-gray-500">Amount Paid</p>
              <p className="text-3xl font-bold mt-1" style={{ color: '#14213D' }}>
                {formatCurrency(viewTarget.amount)}
              </p>
              <div className="mt-3">
                <Badge
                  variant={
                    { completed: 'success', pending: 'warning', failed: 'danger', refunded: 'info' }[viewTarget.status]
                  }
                >
                  {viewTarget.status}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail label="Transaction ID" value={viewTarget.txnId} mono />
              <Detail label="Date" value={formatDate(viewTarget.date)} />
              <Detail label="Tenant" value={viewTarget.tenant} />
              <Detail label="Hostel" value={viewTarget.hostel} />
              <Detail label="Room" value={viewTarget.room} />
              <Detail label="Method" value={viewTarget.method} />
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <Button variant="primary" icon={Download}>
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-sm font-medium ${mono ? 'font-mono' : ''}`} style={{ color: '#14213D' }}>
        {value || '—'}
      </p>
    </div>
  );
}

export default Payments;