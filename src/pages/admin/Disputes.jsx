import { useEffect, useState, useMemo } from 'react';
import {
  Search, AlertTriangle, CheckCircle, Clock,
  Eye, User, Home, MessageSquare, Flag
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
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
];

const PRIORITY = {
  high: { variant: 'danger', label: 'High' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'info', label: 'Low' },
};

const STATUS = {
  open: { variant: 'warning', icon: Clock },
  resolved: { variant: 'success', icon: CheckCircle },
};

function Disputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getDisputes()
      .then((data) => { if (mounted) setDisputes(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resolveDispute = (id) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d))
    );
    showToast('Dispute marked as resolved');
    setSelected(null);
  };

  const reopenDispute = (id) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'open' } : d))
    );
    showToast('Dispute reopened', 'error');
    setSelected(null);
  };

  const filtered = useMemo(() => {
    return disputes.filter((d) => {
      const matchesSearch =
        d.subject.toLowerCase().includes(search.toLowerCase()) ||
        d.student.toLowerCase().includes(search.toLowerCase()) ||
        d.landlord.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [disputes, search, statusFilter]);

  const counts = useMemo(() => ({
    all: disputes.length,
    open: disputes.filter((d) => d.status === 'open').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
  }), [disputes]);

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
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Disputes</h1>
          <p className="text-[#5c6470] mt-1">Handle student-landlord conflicts</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
          <AlertTriangle size={16} className="text-[#d98a25]" />
          <span className="text-sm font-medium text-[#b86a1c]">
            {counts.open} open
          </span>
        </div>
      </div>

      {/* ═══════ FILTERS ═══════ */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by subject, student, or landlord..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
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

        {/* ═══════ LIST ═══════ */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No disputes found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((dispute) => {
              const priority = PRIORITY[dispute.priority] || PRIORITY.low;
              const status = STATUS[dispute.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={dispute.id}
                  onClick={() => setSelected(dispute)}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E8ECF1] hover:border-[#E9A23B]/40 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    dispute.priority === 'high' ? 'bg-red-50' :
                    dispute.priority === 'medium' ? 'bg-[#FEF7EA]' : 'bg-[#f0f6fd]'
                  }`}>
                    <AlertTriangle
                      size={22}
                      className={
                        dispute.priority === 'high' ? 'text-red-500' :
                        dispute.priority === 'medium' ? 'text-[#d98a25]' : 'text-[#4A90D9]'
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-[#14213D]">{dispute.subject}</h3>
                      <Badge variant={priority.variant}>{priority.label}</Badge>
                      <Badge variant={status.variant}>
                        <StatusIcon size={12} className="mr-1" />
                        {dispute.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-[#5c6470]">
                      <span className="font-medium text-[#14213D]">{dispute.student}</span>
                      {' vs '}
                      <span className="font-medium text-[#14213D]">{dispute.landlord}</span>
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#8f96a3]">
                      <span>
                        Opened {new Date(dispute.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <Eye size={18} className="text-[#8f96a3]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ═══════ DETAILS MODAL ═══════ */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Dispute Details"
        size="md"
      >
        {selected && (
          <div className="space-y-5">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant={PRIORITY[selected.priority].variant}>
                  <Flag size={12} className="mr-1" />
                  {PRIORITY[selected.priority].label} Priority
                </Badge>
                <Badge variant={STATUS[selected.status].variant}>
                  {selected.status}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">{selected.subject}</h3>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Student</p>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name={selected.student} size="md" />
                  <p className="text-sm font-medium text-[#14213D]">{selected.student}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-2">
                  <Home size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Landlord</p>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name={selected.landlord} size="md" />
                  <p className="text-sm font-medium text-[#14213D]">{selected.landlord}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-[#F4F6F8]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#14213D]" />
                <h4 className="text-sm font-semibold text-[#14213D]">Issue Description</h4>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <p className="text-sm text-[#5c6470] leading-relaxed">
                  {selected.subject}. The student has raised a concern regarding the accommodation
                  and is requesting a resolution from the platform.
                </p>
              </div>
            </div>

            {/* Actions */}
            {selected.status === 'open' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="success"
                  fullWidth
                  icon={CheckCircle}
                  onClick={() => resolveDispute(selected.id)}
                >
                  Mark as Resolved
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={MessageSquare}
                  onClick={() => setSelected(null)}
                >
                  Contact Parties
                </Button>
              </div>
            )}

            {selected.status === 'resolved' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="secondary"
                  fullWidth
                  icon={Clock}
                  onClick={() => reopenDispute(selected.id)}
                >
                  Reopen Dispute
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}

export default Disputes;