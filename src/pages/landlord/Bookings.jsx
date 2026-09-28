import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, CalendarCheck, Check, X, LogIn, LogOut, Eye,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { demoBookings } from '../../data/demoData';

const PAGE_SIZE_OPTIONS = [15, 20];

const enrichBooking = (b) => ({
  id: b.id,
  student: b.student,
  studentEmail: `${b.student.toLowerCase().replace(/\s+/g, '.')}@test.com`,
  studentPhone: '+254712345678',
  hostel: b.hostel,
  room: b.room,
  checkIn: b.checkIn,
  checkOut: b.checkOut,
  amount: b.amount,
  status: b.status,
  createdAt: '2026-09-20',
});

function Bookings() {
  const toast = useToast();

  const [bookings, setBookings] = useState(() => demoBookings.map(enrichBooking));
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [actionTarget, setActionTarget] = useState(null);
  const [working, setWorking] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, pageSize]);

  const counts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    'checked-in': bookings.filter((b) => b.status === 'checked-in').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }), [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesTab = activeTab === 'all' || b.status === activeTab;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.student.toLowerCase().includes(q) ||
        b.room.toLowerCase().includes(q) ||
        b.hostel.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageBookings = filtered.slice((page - 1) * pageSize, page * pageSize);

  const performAction = async (booking, action) => {
    setWorking(true);
    await new Promise((r) => setTimeout(r, 600));

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== booking.id) return b;
        switch (action) {
          case 'approve':
            return { ...b, status: 'confirmed' };
          case 'reject':
            return { ...b, status: 'cancelled' };
          case 'check-in':
            return { ...b, status: 'checked-in' };
          case 'check-out':
            return { ...b, status: 'completed' };
          default:
            return b;
        }
      })
    );

    const messages = {
      approve: 'Booking approved',
      reject: 'Booking rejected',
      'check-in': 'Tenant checked in',
      'check-out': 'Tenant checked out',
    };
    toast.success(messages[action] || 'Booking updated');

    setWorking(false);
    setActionTarget(null);
  };

  const openAction = (booking, action) => setActionTarget({ booking, action });

  const actionLabels = {
    approve: { title: 'Approve booking?', message: 'The tenant will be notified and can proceed to check-in.', confirm: 'Approve', variant: 'primary' },
    reject: { title: 'Reject booking?', message: 'The tenant will be notified and refunded.', confirm: 'Reject', variant: 'danger' },
    'check-in': { title: 'Check in tenant?', message: 'Mark this tenant as checked in.', confirm: 'Check In', variant: 'primary' },
    'check-out': { title: 'Check out tenant?', message: 'Mark this tenant as checked out. The room will become vacant.', confirm: 'Check Out', variant: 'primary' },
  };

  const columns = [
    {
      key: 'student',
      label: 'Tenant',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
          >
            {b.student.charAt(0)}
          </div>
          <div>
            <p className="font-medium" style={{ color: '#14213D' }}>{b.student}</p>
            <p className="text-xs text-gray-500">{b.studentEmail}</p>
          </div>
        </div>
      ),
    },
    { key: 'hostel', label: 'Hostel' },
    { key: 'room', label: 'Room' },
    { key: 'checkIn', label: 'Check-in', render: (b) => formatDate(b.checkIn) },
    { key: 'checkOut', label: 'Check-out', render: (b) => formatDate(b.checkOut) },
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
          confirmed: 'info',
          'checked-in': 'success',
          completed: 'success',
          cancelled: 'danger',
        };
        const labels = {
          pending: 'Pending',
          confirmed: 'Confirmed',
          'checked-in': 'Checked-in',
          completed: 'Completed',
          cancelled: 'Cancelled',
        };
        return <Badge variant={variants[b.status] || 'default'}>{labels[b.status] || b.status}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (b) => (
        <div className="inline-flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setViewTarget(b); }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(74,144,217,0.12)', color: '#4A90D9' }}
            title="View"
          >
            <Eye size={14} />
          </button>
          {b.status === 'pending' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); openAction(b, 'approve'); }}
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                title="Approve"
              >
                <Check size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openAction(b, 'reject'); }}
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#DC2626' }}
                title="Reject"
              >
                <X size={14} />
              </button>
            </>
          )}
          {b.status === 'confirmed' && (
            <button
              onClick={(e) => { e.stopPropagation(); openAction(b, 'check-in'); }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
              title="Check In"
            >
              <LogIn size={14} />
            </button>
          )}
          {b.status === 'checked-in' && (
            <button
              onClick={(e) => { e.stopPropagation(); openAction(b, 'check-out'); }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(74,144,217,0.15)', color: '#4A90D9' }}
              title="Check Out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const action = actionTarget?.action;
  const actionConfig = action ? actionLabels[action] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Bookings</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>
            Review and manage booking requests across your properties
          </p>
        </div>
      </div>

      <div className="rounded-xl px-2 pt-2" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
            { id: 'checked-in', label: 'Checked-in', count: counts['checked-in'] },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tenant, room, or hostel..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Table
        columns={columns}
        data={pageBookings}
        rowKey={(b) => b.id}
        emptyIcon={CalendarCheck}
        emptyTitle={activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
        emptyDescription={
          activeTab === 'all'
            ? 'When tenants book your rooms, they will appear here.'
            : 'Nothing in this category right now.'
        }
      />

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

      <ConfirmDialog
        isOpen={!!actionTarget}
        onClose={() => !working && setActionTarget(null)}
        onConfirm={() => performAction(actionTarget.booking, action)}
        title={actionConfig?.title || ''}
        message={
          actionTarget
            ? `${actionConfig?.message || ''}\n\nTenant: ${actionTarget.booking.student}\nRoom: ${actionTarget.booking.room}`
            : ''
        }
        confirmLabel={actionConfig?.confirm || 'Confirm'}
        variant={actionConfig?.variant || 'primary'}
        loading={working}
      />

      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Booking Details"
        size="lg"
      >
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F4F6F8' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
              >
                {viewTarget.student.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: '#14213D' }}>{viewTarget.student}</p>
                <p className="text-sm text-gray-600">{viewTarget.studentEmail}</p>
                <p className="text-sm text-gray-600">{viewTarget.studentPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail label="Hostel" value={viewTarget.hostel} />
              <Detail label="Room" value={viewTarget.room} />
              <Detail label="Check-in" value={formatDate(viewTarget.checkIn)} />
              <Detail label="Check-out" value={formatDate(viewTarget.checkOut)} />
              <Detail label="Amount" value={formatCurrency(viewTarget.amount)} />
              <Detail
                label="Status"
                value={
                  <Badge
                    variant={
                      {
                        pending: 'warning',
                        confirmed: 'info',
                        'checked-in': 'success',
                        completed: 'success',
                        cancelled: 'danger',
                      }[viewTarget.status] || 'default'
                    }
                  >
                    {viewTarget.status}
                  </Badge>
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium" style={{ color: '#14213D' }}>{value || '—'}</p>
    </div>
  );
}

export default Bookings;