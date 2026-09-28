import { useEffect, useState } from 'react';
import {
  CheckCircle, XCircle, MapPin, Eye, Star,
  ShieldCheck, AlertTriangle, User, Building2,
  Mail, Phone
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { adminService } from '../../services/adminService';

function Verifications() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  const [landlord, setLandlord] = useState(null);
  const [otherHostels, setOtherHostels] = useState([]);
  const [loadingLandlord, setLoadingLandlord] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await adminService.getVerifications();
        if (mounted) setHostels(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selected) {
      setLandlord(null);
      setOtherHostels([]);
      return;
    }

    let mounted = true;
    async function loadLandlord() {
      setLoadingLandlord(true);
      try {
        const [ll, hostelsList] = await Promise.all([
          adminService.getLandlordDetails(selected.owner_id),
          adminService.getLandlordHostels(selected.owner_id),
        ]);
        if (mounted) {
          setLandlord(ll);
          setOtherHostels(hostelsList.filter((h) => h.id !== selected.id));
        }
      } finally {
        if (mounted) setLoadingLandlord(false);
      }
    }
    loadLandlord();
    return () => { mounted = false; };
  }, [selected]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await adminService.approveHostel(id);
      setHostels((prev) => prev.filter((h) => h.id !== id));
      showToast('Hostel approved', 'success');
      setSelected(null);
    } catch {
      showToast('Failed to approve', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await adminService.rejectHostel(id);
      setHostels((prev) => prev.filter((h) => h.id !== id));
      showToast('Hostel rejected', 'error');
      setSelected(null);
    } catch {
      showToast('Failed to reject', 'error');
    } finally {
      setProcessing(null);
    }
  };

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
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Verifications</h1>
          <p className="text-[#5c6470] mt-1">Review and approve pending hostel listings</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF7EA] border border-[#E9A23B]/40">
          <ShieldCheck size={16} className="text-[#d98a25]" />
          <span className="text-sm font-medium text-[#b86a1c]">{hostels.length} pending</span>
        </div>
      </div>

      {error && (
        <EmptyState title="Couldn't load verifications" description={error} actionLabel="Retry" onAction={() => window.location.reload()} />
      )}

      {!error && hostels.length === 0 && (
        <Card>
          <EmptyState icon={CheckCircle} title="All caught up!" description="There are no pending hostels to review right now." />
        </Card>
      )}

      {!error && hostels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <Card key={hostel.id} padding="p-0" className="overflow-hidden group">
              <div className="relative overflow-hidden">
                <img src={hostel.images?.[0]} alt={hostel.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#14213D] rounded-full text-xs font-bold shadow">
                  <Star size={12} className="fill-[#E9A23B] text-[#E9A23B]" />
                  {hostel.rating?.toFixed(1) || 'New'}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-[#E9A23B]/95 backdrop-blur-sm text-[#14213D] rounded-full text-xs font-semibold shadow">
                  <ShieldCheck size={14} /> Pending
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#14213D] text-base line-clamp-1">{hostel.name}</h3>
                <p className="text-sm text-[#5c6470] mt-1 flex items-center gap-1">
                  <MapPin size={13} /> <span className="line-clamp-1">{hostel.address}</span>
                </p>
                {hostel.room_types?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hostel.room_types.slice(0, 3).map((rt) => (
                      <span key={rt} className="text-xs bg-[#F4F6F8] text-[#5c6470] px-2 py-1 rounded-md font-medium">
                        {rt}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F4F6F8]">
                  <div>
                    <span className="text-lg font-bold text-[#E9A23B]">${hostel.price_per_month}</span>
                    <span className="text-xs text-[#5c6470]">/mo</span>
                  </div>
                  <span className="text-xs text-[#8f96a3]">{hostel.total_rooms} rooms</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="primary" fullWidth icon={Eye} onClick={() => setSelected(hostel)}>
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => !processing && setSelected(null)} title="Review Hostel" size="lg">
        {selected && (
          <div className="space-y-5">
            <img src={selected.images?.[0]} alt={selected.name} className="w-full h-56 object-cover rounded-xl" />

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="warning">
                  <ShieldCheck size={12} className="mr-1" /> Pending Review
                </Badge>
                <span className="text-sm text-[#5c6470] flex items-center gap-1">
                  <Star size={14} className="text-[#E9A23B] fill-[#E9A23B]" />
                  {selected.rating?.toFixed(1) || 'New'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#14213D]">{selected.name}</h3>
              <p className="text-sm text-[#5c6470] mt-1 flex items-center gap-1">
                <MapPin size={14} /> {selected.address}, {selected.city}
              </p>
              <p className="text-2xl font-bold text-[#E9A23B] mt-3">
                ${selected.price_per_month}
                <span className="text-sm text-[#5c6470] font-normal">/month</span>
              </p>
            </div>

            {/* LANDLORD DETAILS */}
            {loadingLandlord ? (
              <div className="pt-4 border-t border-[#F4F6F8]">
                <div className="h-3 bg-[#F4F6F8] rounded w-1/3 animate-pulse mb-3" />
                <div className="h-20 bg-[#F4F6F8] rounded-xl animate-pulse" />
              </div>
            ) : landlord ? (
              <div className="pt-4 border-t border-[#F4F6F8]">
                <h4 className="text-sm font-semibold text-[#14213D] mb-3 flex items-center gap-2">
                  <User size={14} /> Landlord Details
                </h4>

                <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={landlord.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#14213D]">{landlord.name}</p>
                        {landlord.verified && <Badge variant="success">Verified</Badge>}
                      </div>
                      <p className="text-xs text-[#5c6470] mt-0.5">
                        Landlord since {new Date(landlord.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-[#5c6470]">
                      <Mail size={14} className="text-[#4A90D9]" />
                      <span className="truncate">{landlord.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5c6470]">
                      <Phone size={14} className="text-[#4A90D9]" />
                      <span>{landlord.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-semibold text-[#5c6470] uppercase tracking-wide flex items-center gap-1.5">
                      <Building2 size={12} /> Other Verified Hostels
                    </h5>
                    <span className="text-xs font-bold text-[#14213D]">{otherHostels.length}</span>
                  </div>

                  {otherHostels.length === 0 ? (
                    <div className="p-3 rounded-lg bg-white border border-[#E8ECF1] text-center">
                      <p className="text-xs text-[#8f96a3]">This is their first verified hostel</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {otherHostels.map((h) => (
                        <div key={h.id} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#E8ECF1]">
                          <img src={h.images?.[0]} alt={h.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#14213D] truncate">{h.name}</p>
                            <p className="text-xs text-[#5c6470] truncate">{h.address}</p>
                          </div>
                          <span className="text-sm font-bold text-[#E9A23B]">${h.price_per_month}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="pt-4 border-t border-[#F4F6F8]">
              <h4 className="text-sm font-semibold text-[#14213D] mb-2">Description</h4>
              <p className="text-sm text-[#5c6470] leading-relaxed">{selected.description}</p>
            </div>

            {selected.room_types?.length > 0 && (
              <div className="pt-4 border-t border-[#F4F6F8]">
                <h4 className="text-sm font-semibold text-[#14213D] mb-2">Room Types</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.room_types.map((rt) => (
                    <span key={rt} className="px-3 py-1.5 bg-[#F4F6F8] rounded-lg text-sm text-[#14213D] border border-[#E8ECF1]">
                      {rt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.amenities?.length > 0 && (
              <div className="pt-4 border-t border-[#F4F6F8]">
                <h4 className="text-sm font-semibold text-[#14213D] mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.amenities.map((a) => (
                    <span key={a} className="text-xs bg-[#F4F6F8] text-[#5c6470] px-2 py-1 rounded-md">{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
              <Button
                variant="success"
                fullWidth
                icon={CheckCircle}
                loading={processing === selected.id}
                onClick={() => handleApprove(selected.id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                fullWidth
                icon={XCircle}
                disabled={processing === selected.id}
                onClick={() => handleReject(selected.id)}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Verifications;