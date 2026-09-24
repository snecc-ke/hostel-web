import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, BadgeCheck } from 'lucide-react';

function HostelCardLight({ hostel }) {
  const image = hostel.images?.[0] || 'https://via.placeholder.com/400x300?text=Hostel';

  return (
    <Link
      to={`/hostels/${hostel.id}`}
      className="group block bg-[#FEF7EA] rounded-2xl overflow-hidden border-2 border-[#E9A23B]/40 hover:border-[#E9A23B] hover:shadow-xl hover:shadow-[#E9A23B]/20 transition-all duration-200"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={hostel.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Hostel'; }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#14213D] rounded-full text-xs font-bold shadow-lg">
          <Star size={12} className="fill-[#E9A23B] text-[#E9A23B]" />
          {hostel.rating?.toFixed(1) || 'New'}
        </div>
        {hostel.status === 'verified' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-600/95 backdrop-blur-sm text-white rounded-full text-xs font-semibold shadow-lg">
            <BadgeCheck size={14} />
            Verified
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#14213D] text-base line-clamp-1">{hostel.name}</h3>
            <p className="text-sm text-[#5c6470] mt-1 flex items-center gap-1">
              <MapPin size={13} /> <span className="line-clamp-1">{hostel.address}</span>
            </p>
          </div>
          <ArrowRight size={20} className="text-[#E9A23B] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
        </div>

        {hostel.room_types?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hostel.room_types.slice(0, 3).map((rt) => (
              <span key={rt} className="text-xs bg-white text-[#14213D] border border-[#E9A23B]/30 px-2 py-1 rounded-md font-medium">
                {rt}
              </span>
            ))}
            {hostel.room_types.length > 3 && (
              <span className="text-xs bg-white text-[#14213D] border border-[#E9A23B]/30 px-2 py-1 rounded-md font-medium">
                +{hostel.room_types.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E9A23B]/20">
          <span className="text-xs text-[#5c6470]">
            {hostel.available_rooms} of {hostel.total_rooms} rooms available
          </span>
          <span className="text-xs font-semibold text-[#14213D]">View →</span>
        </div>
      </div>
    </Link>
  );
}

export default HostelCardLight;