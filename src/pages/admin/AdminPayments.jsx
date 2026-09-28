import { useEffect, useState, useMemo } from 'react';
import {
  Search, DollarSign, CheckCircle, Clock, XCircle,
  Eye, Download, CreditCard, Smartphone, Building,
  TrendingUp, Calendar
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import { adminService } from '../../services/adminService';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
];

const STATUS_BADGE = {
  completed: { variant: 'success', icon: CheckCircle },
  pending: { variant: 'warning', icon: Clock },
  failed: { variant: 'danger', icon: XCircle },
};

const METHOD_ICON = {
  'M-Pesa': Smartphone,
  'Card': CreditCard,
  'Bank Transfer': Building,
};

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getPayments()
      .then((data) => { if (mounted) setPayments(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refundPayment = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'refunded' } : p))
    );
    showToast('Payment refunded');
    setSelected(null);
  };

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch = p.user.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const counts = useMemo(() => ({
    all: payments.length,
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  }), [payments]);

  const totalAmount = useMemo(() => {
    return payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Payments</h1>
          <p className="text-[#5c6470] mt-1">Track all platform transactions</p>
        </div>
        <Button variant="secondary" icon={Download} size="sm">
          Export CSV
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Collected"
          value={`$${totalAmount.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend={12}
        />
        <StatCard
          title="Successful Payments"
          value={counts.completed}
          icon={CheckCircle}
          color="navy"
        />
        <StatCard
          title="Pending / Failed"
          value={counts.pending + counts.failed}
          icon={Clock}
          color="gold"
        />
      </div>

      {/* TABLE */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by user..."
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
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#5c6470]'
                  }`}>
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No payments found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => { setSearch(''); setStatusFilter('all'); }}
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-[#5c6470] uppercase tracking-wider border-b border-[#E8ECF1]">
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F8]">
                {filtered.map((p) => {
                  const statusStyle = STATUS_BADGE[p.status] || STATUS_BADGE.pending;
                  const StatusIcon = statusStyle.icon;
                  const MethodIcon = METHOD_ICON[p.method] || CreditCard;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FAFBFC] transition-colors cursor-pointer"
                      onClick={() => setSelected(p)}
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.user} size="md" />
                          <p className="font-medium text-[#14213D]">{p.user}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MethodIcon size={14} className="text-[#8f96a3]" />
                          <span className="text-sm text-[#14213D]">{p.method}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-[#E9A23B]">${p.amount}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#5c6470]">
                        {new Date(p.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusStyle.variant}>
                          <StatusIcon size={12} className="mr-1" />
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelected(p)}
                            className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#5c6470] hover:text-[#14213D] transition-colors"
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

      {/* DETAILS MODAL */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Payment Details"
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={selected.user} size="lg" />
                <div>
                  <p className="font-bold text-[#14213D]">{selected.user}</p>
                  <p className="text-sm text-[#5c6470]">Payment #{selected.id}</p>
                </div>
              </div>
              <Badge variant={STATUS_BADGE[selected.status].variant}>
                {selected.status}
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40 flex items-center justify-between">
              <p className="text-sm font-medium text-[#14213D]">Amount</p>
              <p className="text-2xl font-bold text-[#E9A23B]">${selected.amount}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <p className="text-xs text-[#5c6470] uppercase tracking-wide mb-1">Method</p>
                <p className="text-sm font-medium text-[#14213D]">{selected.method}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <p className="text-xs text-[#5c6470] uppercase tracking-wide mb-1">Date</p>
                <p className="text-sm font-medium text-[#14213D]">
                  {new Date(selected.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {selected.status === 'completed' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="danger"
                  fullWidth
                  icon={XCircle}
                  onClick={() => refundPayment(selected.id)}
                >
                  Issue Refund
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminPayments;