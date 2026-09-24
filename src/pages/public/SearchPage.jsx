import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import HostelCard from '../../components/hostel/HostelCard';
import { hostelService } from '../../services/hostelService';

const ROOM_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'single', label: 'Single' },
  { key: 'bedsitter', label: 'Bedsitter' },
  { key: '1bedroom', label: '1 Bedroom' },
  { key: '2bedroom', label: '2 Bedroom' },
];

// ─── Looping Typewriter Hook ───
function useTypewriter(text, speed = 70, pauseAfterTyping = 2000, deleteSpeed = 40) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Fully typed → pause → start deleting
    if (!deleting && index === text.length) {
      const timeout = setTimeout(() => setDeleting(true), pauseAfterTyping);
      return () => clearTimeout(timeout);
    }

    // Fully deleted → pause → start typing
    if (deleting && index === 0) {
      const timeout = setTimeout(() => setDeleting(false), 500);
      return () => clearTimeout(timeout);
    }

    // Type or delete one character at a time
    const timeout = setTimeout(() => {
      const nextIndex = deleting ? index - 1 : index + 1;
      setIndex(nextIndex);
      setDisplayed(text.slice(0, nextIndex));
    }, deleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [index, deleting, text, speed, pauseAfterTyping, deleteSpeed]);

  return { displayed };
}

function SearchPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoom, setActiveRoom] = useState('all');

  const { displayed: typedTitle } = useTypewriter('Find Your Hostel', 70, 2000, 40);

  useEffect(() => {
    let mounted = true;
    async function fetchHostels() {
      try {
        const data = await hostelService.list();
        if (mounted) setHostels(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load hostels');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchHostels();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = hostels;

    if (activeRoom !== 'all') {
      result = result.filter((h) =>
        h.room_types?.some((rt) => rt.toLowerCase().includes(activeRoom.toLowerCase()))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) => h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
      );
    }

    return result;
  }, [hostels, activeRoom, searchQuery]);

  return (
    <div className="bg-[#F4F6F8] min-h-screen">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="bg-[#14213D] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E9A23B] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A90D9] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 relative text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight min-h-[48px] md:min-h-[60px]">
            {typedTitle}
            <span className="inline-block w-[3px] h-[1em] bg-[#E9A23B] ml-1 align-middle animate-pulse" />
          </h1>

          <p className="text-slate-300 mb-8">
            Browse verified hostels near your campus
          </p>

          <div className="relative max-w-xl mx-auto">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f96a3] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search hostel name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-white text-[#1B1F27] placeholder:text-[#8f96a3] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E9A23B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f96a3] hover:text-[#1B1F27]"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ ROOM TYPE TABS ═══════════════ */}
      <section className="bg-[#F4F6F8] border-b border-[#E8ECF1] sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {ROOM_TYPES.map((tab) => {
              const isActive = activeRoom === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveRoom(tab.key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-white text-[#5c6470] border border-[#E8ECF1] hover:border-[#14213D] hover:text-[#14213D]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ RESULTS ═══════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#5c6470]">
              Showing <span className="font-semibold text-[#14213D]">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'hostel' : 'hostels'}
            </p>
            {(activeRoom !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveRoom('all');
                  setSearchQuery('');
                }}
                className="text-sm text-[#4A90D9] hover:text-[#3574c1] font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && (
          <EmptyState
            title="Couldn't load hostels"
            description={error}
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No hostels found"
            description="Try adjusting your filters or search query."
            actionLabel="Clear Filters"
            onAction={() => {
              setActiveRoom('all');
              setSearchQuery('');
            }}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchPage;