import { useEffect, useState, useMemo } from 'react';
import {
  Search, Calendar, CheckCircle, XCircle, Clock,
  Eye, MapPin, User, AlertTriangle, Home
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { adminService } from '../../services/adminService';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_BADGE = {
  pending: { variant: 'warning', icon: Clock },
  confirmed: { variant: 'success', icon: CheckCircle },
  cancelled: { variant: 'danger', icon: XCircle },
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getBookings()
      .then((data) => { if (mounted) setBookings(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(
      `Booking ${newStatus}`,
      newStatus === 'cancelled' ? 'error' : 'success'
    );
    setSelected(null);
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.student.toLowerCase().includes(search.toLowerCase()) ||
        b.hostel.toLowerCase().includes(search.toLowerCase()) ||
        b.room.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const counts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }), [bookings]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Bookings</h1>
          <p className="text-[#5c6470] mt-1">Monitor all platform bookings</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
          <Calendar size={16} className="text-[#14213D]" />
          <span className="text-sm font-medium text-[#14213D]">{counts.all} total</span>
        </div>
      </div>

      {/* ═══════ FILTERS ═══════ */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by student, hostel, or room..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-[#F4F6F8] text-[#5c6470] hover:bg-[#E8ECF1]'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#5c6470]'
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════ TABLE ═══════ */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No bookings found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-[#5c6470] uppercase tracking-wider border-b border-[#E8ECF1]">
                  <th className="py-3 pr-4">Student</th>
                  <th className="py-3 px-4">Hostel</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F8]">
                {filtered.map((b) => {
                  const statusStyle = STATUS_BADGE[b.status] || STATUS_BADGE.pending;
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#FAFBFC] transition-colors cursor-pointer"
                      onClick={() => setSelected(b)}
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={b.student} size="md" />
                          <p className="font-medium text-[#14213D]">{b.student}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Home size={14} className="text-[#8f96a3]" />
                          <span className="text-sm text-[#14213D]">{b.hostel}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#5c6470]">{b.room}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="text-[#14213D]">
                            {new Date(b.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-[#8f96a3]">
                            → {new Date(b.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-[#E9A23B]">
                          ${b.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusStyle.variant}>
                          <StatusIcon size={12} className="mr-1" />
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div
                          className="flex justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelected(b)}
                            className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#5c6470] hover:text-[#14213D] transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ═══════ DETAILS MODAL ═══════ */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Booking Details"
        size="md"
      >
        {selected && (
          <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={selected.student} size="lg" />
                <div>
                  <p className="font-bold text-[#14213D]">{selected.student}</p>
                  <p className="text-sm text-[#5c6470]">Booking #{selected.id}</p>
                </div>
              </div>
              <Badge variant={STATUS_BADGE[selected.status].variant}>
                {selected.status}
              </Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <Home size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Hostel</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">{selected.hostel}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Room</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">{selected.room}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Check-in</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">
                  {new Date(selected.check_in).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Check-out</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">
                  {new Date(selected.check_out).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40 flex items-center justify-between">
              <p className="text-sm font-medium text-[#14213D]">Total Amount</p>
              <p className="text-2xl font-bold text-[#E9A23B]">${selected.amount}</p>
            </div>

            {/* Actions */}
            {selected.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="success"
                  fullWidth
                  icon={CheckCircle}
                  onClick={() => updateStatus(selected.id, 'confirmed')}
                >
                  Confirm
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  icon={XCircle}
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                >
                  Cancel
                </Button>
              </div>
            )}

            {selected.status === 'confirmed' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="danger"
                  fullWidth
                  icon={XCircle}
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                >
                  Cancel Booking
                </Button>
              </div>
            )}

            {selected.status === 'cancelled' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="secondary"
                  fullWidth
                  icon={CheckCircle}
                  onClick={() => updateStatus(selected.id, 'confirmed')}
                >
                  Restore Booking
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}

export default AdminBookings;