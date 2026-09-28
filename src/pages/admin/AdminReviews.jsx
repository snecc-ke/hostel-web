import { useEffect, useState, useMemo } from 'react';
import {
  Search, Star, CheckCircle, XCircle, Clock,
  Trash2, MessageSquare, Home, Filter
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
  { key: 'approved', label: 'Approved' },
  { key: 'pending', label: 'Pending' },
];

const STATUS_BADGE = {
  approved: { variant: 'success', label: 'Approved' },
  pending: { variant: 'warning', label: 'Pending' },
  rejected: { variant: 'danger', label: 'Rejected' },
};

// Star rating component
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? 'text-[#E9A23B] fill-[#E9A23B]'
              : 'text-[#D1D5DB]'
          }
        />
      ))}
      <span className="text-xs text-[#5c6470] ml-1 font-medium">{rating}.0</span>
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getReviews()
      .then((data) => { if (mounted) setReviews(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = (id, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(
      `Review ${newStatus}`,
      newStatus === 'rejected' ? 'error' : 'success'
    );
    setSelected(null);
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review deleted', 'error');
    setSelected(null);
  };

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.student.toLowerCase().includes(search.toLowerCase()) ||
        r.hostel.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  const counts = useMemo(() => ({
    all: reviews.length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    pending: reviews.filter((r) => r.status === 'pending').length,
  }), [reviews]);

  // Average rating
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

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
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Reviews</h1>
          <p className="text-[#5c6470] mt-1">Moderate user reviews and ratings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Average rating */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
            <Star size={16} className="text-[#E9A23B] fill-[#E9A23B]" />
            <span className="text-sm font-bold text-[#b86a1c]">
              {avgRating} avg
            </span>
          </div>
          {counts.pending > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
              <Clock size={16} className="text-[#d98a25]" />
              <span className="text-sm font-medium text-[#b86a1c]">
                {counts.pending} pending
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ FILTERS ═══════ */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by student, hostel, or comment..."
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

        {/* ═══════ REVIEWS LIST ═══════ */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((review) => {
              const statusStyle = STATUS_BADGE[review.status];
              return (
                <div
                  key={review.id}
                  onClick={() => setSelected(review)}
                  className="p-5 rounded-xl bg-white border border-[#E8ECF1] hover:border-[#E9A23B]/40 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Header: student + status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={review.student} size="md" />
                      <div>
                        <p className="font-semibold text-[#14213D] text-sm">{review.student}</p>
                        <p className="text-xs text-[#8f96a3] flex items-center gap-1">
                          <Home size={11} /> {review.hostel}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                  </div>

                  {/* Rating */}
                  <StarRating rating={review.rating} />

                  {/* Comment */}
                  <p className="text-sm text-[#5c6470] mt-3 leading-relaxed line-clamp-2">
                    "{review.comment}"
                  </p>

                  {/* Date */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F4F6F8]">
                    <span className="text-xs text-[#8f96a3]">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {review.status === 'pending' && (
                      <span className="text-xs font-medium text-[#E9A23B]">
                        Needs review
                      </span>
                    )}
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
        title="Review Details"
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
                  <p className="text-sm text-[#5c6470] flex items-center gap-1">
                    <Home size={12} /> {selected.hostel}
                  </p>
                </div>
              </div>
              <Badge variant={STATUS_BADGE[selected.status].variant}>
                {STATUS_BADGE[selected.status].label}
              </Badge>
            </div>

            {/* Rating */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
              <p className="text-xs text-[#5c6470] uppercase tracking-wide mb-2">
                Rating
              </p>
              <div className="flex items-center gap-2">
                <StarRating rating={selected.rating} />
              </div>
            </div>

            {/* Comment */}
            <div className="pt-4 border-t border-[#F4F6F8]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#14213D]" />
                <h4 className="text-sm font-semibold text-[#14213D]">Comment</h4>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <p className="text-sm text-[#5c6470] leading-relaxed italic">
                  "{selected.comment}"
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="text-xs text-[#8f96a3]">
              Submitted{' '}
              {new Date(selected.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>

            {/* Actions */}
            {selected.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="success"
                  fullWidth
                  icon={CheckCircle}
                  onClick={() => updateStatus(selected.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  icon={XCircle}
                  onClick={() => updateStatus(selected.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            )}

            {selected.status === 'approved' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="danger"
                  fullWidth
                  icon={Trash2}
                  onClick={() => deleteReview(selected.id)}
                >
                  Delete Review
                </Button>
              </div>
            )}

            {selected.status === 'rejected' && (
              <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
                <Button
                  variant="secondary"
                  fullWidth
                  icon={CheckCircle}
                  onClick={() => updateStatus(selected.id, 'approved')}
                >
                  Approve Instead
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}

export default AdminReviews;