import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, MapPin, Star, Edit, Trash2, Eye, Building2
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import { useToast } from '../../context/ToastContext';
import { demoHostels } from '../../data/demoData';

function MyHostels() {
  const navigate = useNavigate();
  const toast = useToast();
  const [hostels, setHostels] = useState(demoHostels);
  const [activeTab, setActiveTab] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => ({
    all: hostels.length,
    verified: hostels.filter((h) => h.status === 'verified').length,
    pending: hostels.filter((h) => h.status === 'pending').length,
    inactive: hostels.filter((h) => h.status === 'inactive').length,
  }), [hostels]);

  const filteredHostels = useMemo(() => {
    if (activeTab === 'all') return hostels;
    return hostels.filter((h) => h.status === activeTab);
  }, [hostels, activeTab]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setHostels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>My Hostels</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>Manage your properties</p>
        </div>
        <Link
          to="/landlord/hostels/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8862A')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
        >
          <Plus size={18} />
          Add Hostel
        </Link>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'verified', label: 'Verified', count: counts.verified },
          { id: 'pending', label: 'Pending', count: counts.pending },
          { id: 'inactive', label: 'Inactive', count: counts.inactive },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Hostels Grid */}
      {filteredHostels.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={activeTab === 'all' ? 'No hostels yet' : `No ${activeTab} hostels`}
          description={
            activeTab === 'all'
              ? 'Add your first hostel to start receiving bookings.'
              : `You have no hostels in the ${activeTab} category.`
          }
          actionLabel={activeTab === 'all' ? 'Add Hostel' : null}
          onAction={activeTab === 'all' ? () => navigate('/landlord/hostels/new') : null}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHostels.map((hostel) => {
            const isVacant = hostel.available > 0;

            return (
              <div
                key={hostel.id}
                className="group rounded-xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: '#F4F6F8',
                  border: '1px solid #E5E7EB',
                  transition:
                    'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(74, 144, 217, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div className="relative h-36 bg-gray-200 overflow-hidden">
                  <img
                    src={hostel.image || 'https://via.placeholder.com/400x200?text=Hostel'}
                    alt={hostel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={
                        hostel.status === 'verified'
                          ? 'success'
                          : hostel.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {hostel.status}
                    </Badge>
                  </div>
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur"
                    style={{
                      backgroundColor: isVacant ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                      color: '#FFFFFF',
                    }}
                  >
                    {isVacant ? 'Vacant' : 'Occupied'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold leading-tight truncate" style={{ color: '#14213D' }}>
                    {hostel.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#6B7280' }}>
                    <MapPin size={12} />
                    <span className="truncate">{hostel.address}</span>
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div className="text-center flex-1">
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Rooms</p>
                      <p className="text-sm font-bold" style={{ color: '#14213D' }}>{hostel.rooms}</p>
                    </div>
                    <div className="text-center flex-1 border-x" style={{ borderColor: '#E5E7EB' }}>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Free</p>
                      <p className="text-sm font-bold" style={{ color: '#10B981' }}>{hostel.available}</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Rating</p>
                      <p className="flex items-center justify-center gap-0.5 text-sm font-bold" style={{ color: '#14213D' }}>
                        {hostel.rating > 0 ? (
                          <>
                            <Star size={11} className="text-yellow-500 fill-yellow-500" />
                            {hostel.rating}
                          </>
                        ) : (
                          '—'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Link
                      to={`/landlord/hostels/${hostel.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
                      style={{ backgroundColor: '#14213D', color: '#FFFFFF' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0D1628')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#14213D')}
                    >
                      <Eye size={13} />
                      View
                    </Link>
                    <Link
                      to={`/landlord/hostels/${hostel.id}/edit`}
                      className="inline-flex items-center justify-center p-1.5 rounded-md transition-colors"
                      style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.3)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.15)')}
                      title="Edit"
                    >
                      <Edit size={13} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(hostel);
                      }}
                      className="inline-flex items-center justify-center p-1.5 rounded-md transition-colors"
                      style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#DC2626' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.25)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)')}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete hostel?"
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.name}" and all its rooms. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default MyHostels;