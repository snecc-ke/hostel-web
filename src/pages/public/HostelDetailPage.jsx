import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Users, Heart, Share2, ArrowLeft,
  BadgeCheck, Check
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { hostelService } from '../../services/hostelService';

function HostelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let mounted = true;
    async function fetchHostel() {
      try {
        const data = await hostelService.get(id);
        if (mounted) setHostel(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchHostel();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-[#F4F6F8]">
        <div className="max-w-4xl mx-auto py-16 px-6">
          <EmptyState
            title="Hostel not found"
            description={error || 'This hostel does not exist.'}
            actionLabel="Back to Search"
            onAction={() => navigate('/search')}
          />
        </div>
      </div>
    );
  }

  const images = hostel.images?.length > 0 ? hostel.images : ['https://via.placeholder.com/800x500?text=Hostel'];
  const currentImages =
    activeTab === 'overview'
      ? images
      : hostel.room_photos?.[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-[#4A90D9] hover:text-[#3574c1] text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to search
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tabbed gallery */}
            <div className="bg-[#1B1F27] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/10 overflow-x-auto">
                <button
                  onClick={() => { setActiveTab('overview'); setActiveImage(0); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#E9A23B] text-[#14213D]'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Overview
                </button>
                {hostel.room_types?.map((rt) => (
                  <button
                    key={rt}
                    onClick={() => { setActiveTab(rt); setActiveImage(0); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === rt
                        ? 'bg-[#E9A23B] text-[#14213D]'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {rt}
                  </button>
                ))}
              </div>

              <img
                src={currentImages[activeImage] || 'https://via.placeholder.com/800x500?text=Room'}
                alt={hostel.name}
                className="w-full h-[400px] md:h-[480px] object-cover"
              />

              {currentImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {currentImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? 'border-[#E9A23B] shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info card */}
            <Card>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {hostel.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        <BadgeCheck size={14} /> Verified
                      </span>
                    )}
                    <span className="text-sm text-[#5c6470] flex items-center gap-1">
                      <Star size={14} className="text-[#E9A23B] fill-[#E9A23B]" />
                      <span className="font-semibold text-[#14213D]">
                        {hostel.rating?.toFixed(1) || 'New'}
                      </span>
                      <span>({hostel.review_count || 0} reviews)</span>
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#14213D] tracking-tight">
                    {hostel.name}
                  </h1>

                  <p className="text-[#5c6470] mt-2 flex items-center gap-1.5">
                    <MapPin size={16} /> {hostel.address}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      saved
                        ? 'bg-[#E9A23B] border-[#E9A23B] text-[#14213D]'
                        : 'border-[#E8ECF1] text-[#5c6470] hover:border-[#E9A23B] hover:text-[#E9A23B]'
                    }`}
                  >
                    <Heart size={18} className={saved ? 'fill-[#14213D]' : ''} />
                  </button>
                  <button className="p-2.5 rounded-xl border border-[#E8ECF1] text-[#5c6470] hover:border-[#4A90D9] hover:text-[#4A90D9] transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#F4F6F8]">
                <h2 className="text-xl font-bold text-[#14213D] mb-3">About this hostel</h2>
                <p className="text-[#5c6470] leading-relaxed">{hostel.description}</p>
              </div>

              {hostel.amenities?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#F4F6F8]">
                  <h2 className="text-xl font-bold text-[#14213D] mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hostel.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm text-[#5c6470]">
                        <span className="w-5 h-5 bg-[#E9A23B]/15 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-[#d98a25]" />
                        </span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hostel.room_types?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#F4F6F8]">
                  <h2 className="text-xl font-bold text-[#14213D] mb-3">Room Types Available</h2>
                  <div className="flex flex-wrap gap-2">
                    {hostel.room_types.map((rt) => (
                      <div
                        key={rt}
                        className="px-4 py-2 bg-[#F4F6F8] rounded-xl text-sm font-medium text-[#14213D] border border-[#E8ECF1]"
                      >
                        {rt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT — sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card>
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#E9A23B]">
                      ${hostel.price_per_month}
                    </span>
                    <span className="text-[#5c6470]">/month</span>
                  </div>
                  <p className="text-xs text-[#8f96a3] mt-1">Starting price</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-center gap-2 text-sm text-[#5c6470] mb-2">
                    <Users size={16} />
                    <span>
                      <span className="font-semibold text-[#14213D]">{hostel.available_rooms}</span>
                      {' '}of {hostel.total_rooms} rooms available
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E9A23B] to-[#d98a25]"
                      style={{
                        width: `${((hostel.available_rooms || 0) / (hostel.total_rooms || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Button fullWidth size="lg" variant="accent">Book Now</Button>
                <button className="w-full mt-2 px-6 py-3 text-base font-medium rounded-[10px] border-2 border-[#14213D] text-[#14213D] hover:bg-[#14213D] hover:text-white transition-colors">
                  Message Landlord
                </button>
              </Card>

              <Card>
                <h3 className="font-semibold text-[#14213D] mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5c6470]">Location</span>
                    <span className="font-medium text-[#14213D]">{hostel.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5c6470]">Total Rooms</span>
                    <span className="font-medium text-[#14213D]">{hostel.total_rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5c6470]">Room Types</span>
                    <span className="font-medium text-[#14213D]">{hostel.room_types?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5c6470]">Rating</span>
                    <span className="font-medium text-[#14213D] flex items-center gap-1">
                      <Star size={12} className="text-[#E9A23B] fill-[#E9A23B]" />
                      {hostel.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="bg-[#E9A23B]/10 border border-[#E9A23B]/30 rounded-2xl p-4">
                <div className="flex gap-3">
                  <BadgeCheck className="text-[#d98a25] flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-[#14213D] mb-1">Safe booking</p>
                    <p className="text-xs text-[#5c6470] leading-relaxed">
                      Your booking is protected. Payment is only released after check-in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostelDetailPage;