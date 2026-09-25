import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Construction, Building2 } from 'lucide-react';
import { demoHostels } from '../../data/demoData';

function HostelDetail() {
  const { id } = useParams();
  const hostel = demoHostels.find((h) => String(h.id) === String(id));

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/landlord/hostels"
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'rgba(20,33,61,0.06)' }}
        >
          <ArrowLeft size={20} style={{ color: '#14213D' }} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#E9A23B' }}>
            {hostel ? hostel.name : 'Hostel'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#4B5563' }}>
            Full hostel details coming soon
          </p>
        </div>
      </div>

      {/* Placeholder card */}
      <div
        className="rounded-xl p-12 text-center"
        style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}
      >
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(233,162,59,0.15)' }}
          >
            <Construction size={36} style={{ color: '#E9A23B' }} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#14213D' }}>
          Hostel Detail Page
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#6B7280' }}>
          This page will show everything about {hostel ? `"${hostel.name}"` : 'this hostel'} —
          photo gallery, rooms, bookings, reviews, and analytics — all in one place.
        </p>
        <div className="flex justify-center mt-6">
          <Link
            to="/landlord/hostels"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8862A')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
          >
            <ArrowLeft size={16} />
            Back to My Hostels
          </Link>
        </div>
      </div>

      {/* Quick preview of hostel info */}
      {hostel && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(20,33,61,0.08)' }}
            >
              <Building2 size={20} style={{ color: '#14213D' }} />
            </div>
            <h3 className="font-semibold" style={{ color: '#14213D' }}>Quick Preview</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Location" value={hostel.location || hostel.city} />
            <Info label="Address" value={hostel.address} />
            <Info label="Contact Phone" value={hostel.contact_phone} />
            <Info label="Contact Email" value={hostel.contact_email} />
            <Info label="Total Rooms" value={hostel.rooms} />
            <Info label="Available Rooms" value={hostel.available} />
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium" style={{ color: '#14213D' }}>{value || '—'}</p>
    </div>
  );
}

export default HostelDetail;