import React, { useState, useMemo, useEffect } from 'react';
import {
  Star, Search, MessageSquare, Reply, ThumbsUp, ChevronDown, ChevronUp,
} from 'lucide-react';
import Tabs from '../../components/common/Tabs';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';
import { demoHostels } from '../../data/demoData';

const MAX_PREVIEW_CHARS = 140;

const generateReviews = () => {
  const names = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams',
    'David Kimani', 'Grace Njeri', 'Brian Otieno', 'Alice Wanjiru',
    'Peter Njoroge', 'Mary Akinyi', 'Kevin Mwangi', 'Lucy Wambui',
  ];

  const comments = [
    { rating: 5, text: 'Excellent hostel! Clean rooms and very friendly staff. Highly recommend.' },
    { rating: 5, text: 'Best value for money. WiFi is fast, water is always available.' },
    { rating: 5, text: 'Great location, close to campus. Management is very responsive.' },
    { rating: 4, text: 'Good rooms, clean facilities. Parking can be tight sometimes.' },
    { rating: 4, text: 'Comfortable stay. The kitchen could use more equipment. Overall a good experience and I would consider staying here again next semester if the price stays the same.' },
    { rating: 4, text: 'Nice place overall. Quiet and secure area.' },
    { rating: 3, text: 'Average stay. Rooms are okay but WiFi is slow during peak hours.' },
    { rating: 3, text: 'Decent. The water pressure in the showers could be better. Also the common area gets crowded in the evenings but that is expected.' },
    { rating: 2, text: 'Not what I expected. Noise from the road was too much.' },
    { rating: 5, text: 'Superb! Would definitely come back next semester.' },
    { rating: 4, text: 'Really liked it here. The common room is a nice touch.' },
    { rating: 5, text: 'Fantastic experience. Landlord was very understanding and helpful.' },
  ];

  const hostels = demoHostels.slice(0, 4);

  return names.map((name, i) => {
    const data = comments[i % comments.length];
    const hostel = hostels[i % hostels.length];
    return {
      id: i + 1,
      tenant: name,
      avatar: `https://i.pravatar.cc/150?img=${(i % 12) + 1}`,
      hostel: hostel.name,
      hostelId: hostel.id,
      rating: data.rating,
      text: data.text,
      date: new Date(2026, 8, 20 - i).toISOString().split('T')[0],
      reply: i % 3 === 0
        ? 'Thank you for your feedback! We appreciate it.'
        : null,
      replyDate: i % 3 === 0 ? new Date(2026, 8, 21 - i).toISOString().split('T')[0] : null,
      helpful: Math.floor(Math.random() * 20),
    };
  });
};

function RatingBreakdown({ reviews }) {
  const total = reviews.length || 1;
  const byRating = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
      <h3 className="font-semibold mb-4" style={{ color: '#14213D' }}>Rating Breakdown</h3>
      <div className="space-y-3">
        {byRating.map(({ rating, count }) => {
          const pct = (count / total) * 100;
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 flex-shrink-0">
                <span className="text-sm font-medium" style={{ color: '#14213D' }}>{rating}</span>
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: '#E9A23B' }}
                />
              </div>
              <span className="text-xs text-gray-500 w-10 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onReply }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > MAX_PREVIEW_CHARS;
  const preview = isLong && !expanded
    ? review.text.slice(0, MAX_PREVIEW_CHARS).trimEnd() + '…'
    : review.text;

  return (
    <div
      className="rounded-xl p-5 transition-shadow hover:shadow-md flex flex-col"
      style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}
    >
      <div className="flex items-start gap-3">
        <img
          src={review.avatar}
          alt={review.tenant}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: '#14213D' }}>
                {review.tenant}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                <span style={{ color: '#4A90D9' }}>{review.hostel}</span> · {formatDate(review.date)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <StarRow rating={review.rating} size={12} />
              <span className="text-xs font-semibold" style={{ color: '#14213D' }}>
                {review.rating}.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm leading-relaxed" style={{ color: '#1B1F27' }}>
          {preview}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: '#4A90D9' }}
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={12} />
              </>
            ) : (
              <>
                Read more <ChevronDown size={12} />
              </>
            )}
          </button>
        )}
      </div>

      {review.reply && (
        <div
          className="mt-3 p-3 rounded-lg border-l-4"
          style={{ backgroundColor: 'rgba(233,162,59,0.08)', borderColor: '#E9A23B' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <MessageSquare size={12} style={{ color: '#C8862A' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#C8862A' }}>
              Your Reply
            </p>
            {review.replyDate && (
              <span className="text-[10px] text-gray-500">· {formatDate(review.replyDate)}</span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#14213D' }}>
            {review.reply}
          </p>
        </div>
      )}

      <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <ThumbsUp size={11} />
          {review.helpful} helpful
        </span>
        <button
          onClick={() => onReply(review)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
        >
          <Reply size={12} />
          {review.reply ? 'Edit Reply' : 'Reply'}
        </button>
      </div>
    </div>
  );
}

function Reviews() {
  const toast = useToast();

  const [reviews, setReviews] = useState(generateReviews);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const replied = reviews.filter((r) => r.reply).length;
    const rate = total > 0 ? Math.round((replied / total) * 100) : 0;
    return { avg: avg.toFixed(1), total, rate };
  }, [reviews]);

  const counts = useMemo(() => ({
    all: reviews.length,
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }), [reviews]);

  /* Filter, search, AND sort newest first */
  const filtered = useMemo(() => {
    const list = reviews.filter((r) => {
      const matchesTab = activeTab === 'all' || r.rating === Number(activeTab);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.tenant.toLowerCase().includes(q) ||
        r.hostel.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
    /* Newest first */
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reviews, activeTab, search]);

  const openReply = (review) => {
    setReplyTarget(review);
    setReplyText(review.reply || '');
  };

  const closeReply = () => {
    if (saving) return;
    setReplyTarget(null);
    setReplyText('');
  };

  const saveReply = async () => {
    const text = replyText.trim();
    if (!text) {
      toast.error('Reply cannot be empty');
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    setReviews((prev) =>
      prev.map((r) =>
        r.id === replyTarget.id
          ? { ...r, reply: text, replyDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
    toast.success(replyTarget.reply ? 'Reply updated' : 'Reply posted');
    setSaving(false);
    closeReply();
  };

  const removeReply = () => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === replyTarget.id ? { ...r, reply: null, replyDate: null } : r
      )
    );
    toast.success('Reply removed');
    closeReply();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Reviews</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>
            See what tenants are saying about your hostels
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Average Rating"
          value={stats.avg}
          subtitle={`Based on ${stats.total} reviews`}
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Total Reviews"
          value={stats.total}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Response Rate"
          value={`${stats.rate}%`}
          subtitle="Replies to reviews"
          icon={Reply}
          color="green"
        />
      </div>

      {/* Layout: breakdown + tabs/search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <RatingBreakdown reviews={reviews} />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl px-2 pt-2" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
            <Tabs
              tabs={[
                { id: 'all', label: 'All', count: counts.all },
                { id: '5', label: '5★', count: counts[5] },
                { id: '4', label: '4★', count: counts[4] },
                { id: '3', label: '3★', count: counts[3] },
                { id: '2', label: '2★', count: counts[2] },
                { id: '1', label: '1★', count: counts[1] },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <div className="rounded-xl p-3 flex flex-wrap items-center gap-3" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              />
            </div>
            <span className="text-sm text-gray-500">
              {filtered.length} review{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Review Cards — 2-col grid on large screens */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="Try changing the filter or search."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} onReply={openReply} />
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={!!replyTarget}
        onClose={closeReply}
        title={replyTarget?.reply ? 'Edit Reply' : 'Reply to Review'}
        size="lg"
      >
        {replyTarget && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#F4F6F8' }}>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={replyTarget.avatar}
                  alt={replyTarget.tenant}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#14213D' }}>
                    {replyTarget.tenant}
                  </p>
                  <StarRow rating={replyTarget.rating} size={12} />
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#1B1F27' }}>
                {replyTarget.text}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#14213D' }}>
                Your Reply
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank the tenant, address their concerns, or provide helpful info..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              {replyTarget.reply && (
                <button
                  type="button"
                  onClick={removeReply}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Remove Reply
                </button>
              )}
              <button
                type="button"
                onClick={closeReply}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <Button onClick={saveReply} variant="primary" loading={saving}>
                {replyTarget.reply ? 'Save Changes' : 'Post Reply'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Reviews;