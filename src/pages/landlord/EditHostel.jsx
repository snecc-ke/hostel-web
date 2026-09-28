import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Check, AlertCircle,
} from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Stepper from '../../components/common/Stepper';
import FileUpload from '../../components/common/FileUpload';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { demoHostels } from '../../data/demoData';

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'photos', label: 'Photos' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'review', label: 'Review' },
];

const COMMON_AMENITIES = [
  'Free WiFi', 'Parking', 'Kitchen', 'Laundry', 'Security',
  'Water', 'Electricity', 'Study Room', 'Gym', 'CCTV',
  'Backup Generator', 'Furnished',
];

const ROOM_TYPES = ['Single Room', 'Bedsitter'];

function EditHostel() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(4);
  const [form, setForm] = useState(null);
  const [amenityInput, setAmenityInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── Load existing hostel data on mount ── */
  useEffect(() => {
    const hostel = demoHostels.find((h) => String(h.id) === String(id));
    if (!hostel) {
      toast.error('Hostel not found');
      navigate('/landlord/hostels');
      return;
    }

    setForm({
      name: hostel.name || '',
      description: hostel.description || '',
      address: hostel.address || '',
      location: hostel.location || hostel.city || '',
      contact_phone: hostel.contact_phone || '',
      contact_email: hostel.contact_email || '',
      amenities: hostel.amenities || [],
      photos: (hostel.gallery || [hostel.image]).filter(Boolean).map((url, i) => ({
        preview: url,
        name: `photo-${i + 1}.jpg`,
        isExisting: true,
      })),
      rooms: hostel.roomTypes?.map((rt) => ({
        type: rt.type || 'Single Room',
        price: rt.price || '',
        capacity: rt.capacity || 1,
        count: rt.count || 10,
        occupied: rt.occupied || 0,
      })) || [{ type: 'Single Room', price: '', capacity: 1, count: '', occupied: 0 }],
      agreeTerms: true,
    });
    setLoading(false);
  }, [id, navigate, toast]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
    if (errors.amenities) setErrors((prev) => ({ ...prev, amenities: undefined }));
  };

  const addCustomAmenity = () => {
    const a = amenityInput.trim();
    if (!a || form.amenities.includes(a)) return;
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, a] }));
    setAmenityInput('');
  };

  const updateRoom = (index, key, value) => {
    setForm((prev) => {
      const next = [...prev.rooms];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, rooms: next };
    });
    if (errors.rooms || errors[`room_price_${index}`] || errors[`room_count_${index}`] || errors[`room_occupied_${index}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.rooms;
        delete copy[`room_price_${index}`];
        delete copy[`room_count_${index}`];
        delete copy[`room_occupied_${index}`];
        return copy;
      });
    }
  };

  const addRoom = () => {
    setForm((prev) => ({
      ...prev,
      rooms: [...prev.rooms, { type: 'Single Room', price: '', capacity: 1, count: '', occupied: 0 }],
    }));
  };

  const removeRoom = (index) => {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (stepIndex) => {
    const errs = {};
    if (stepIndex === 0) {
      if (!form.name.trim()) errs.name = 'Hostel name is required';
      if (!form.description.trim() || form.description.trim().length < 30)
        errs.description = 'Description must be at least 30 characters';
      if (!form.address.trim()) errs.address = 'Address is required';
      if (!form.location.trim()) errs.location = 'Location is required';
      if (!form.contact_phone) {
        errs.contact_phone = 'Contact phone is required';
      } else if (!isValidPhoneNumber(form.contact_phone)) {
        errs.contact_phone = 'Enter a valid phone number for the selected country';
      }
      if (!form.contact_email.trim()) errs.contact_email = 'Contact email is required';
      else if (!/^\S+@\S+\.\S+$/.test(form.contact_email))
        errs.contact_email = 'Invalid email format';
    } else if (stepIndex === 1) {
      if (form.amenities.length === 0) errs.amenities = 'Select at least one amenity';
    } else if (stepIndex === 2) {
      if (form.photos.length === 0) errs.photos = 'Upload at least one photo';
    } else if (stepIndex === 3) {
      if (form.rooms.length === 0) errs.rooms = 'Add at least one room type';
      form.rooms.forEach((r, i) => {
        const total = Number(r.count) || 0;
        const occupied = Number(r.occupied) || 0;
        if (!r.price || Number(r.price) <= 0)
          errs[`room_price_${i}`] = 'Price must be greater than 0';
        if (total <= 0)
          errs[`room_count_${i}`] = 'Total must be greater than 0';
        if (occupied < 0)
          errs[`room_occupied_${i}`] = 'Cannot be negative';
        else if (occupied > total)
          errs[`room_occupied_${i}`] = 'Cannot exceed total rooms';
      });
    } else if (stepIndex === 4) {
      if (!form.agreeTerms) errs.agreeTerms = 'You must accept the terms';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const next = Math.min(currentStep + 1, STEPS.length - 1);
    setCurrentStep(next);
    setMaxReachedStep((prev) => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (index) => {
    if (index <= maxReachedStep) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success('Hostel updated successfully');
    setSubmitting(false);
    navigate('/landlord/hostels');
  };

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{ border: '4px solid #E5E7EB', borderTopColor: '#E9A23B' }}
        />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <Field
              label="Hostel Name"
              required
              value={form.name}
              onChange={(v) => update('name', v)}
              placeholder="e.g., Green Valley Hostel"
              error={errors.name}
            />
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe the hostel (min 30 chars)"
                className="w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
                style={{ borderColor: errors.description ? '#EF4444' : '#D1D5DB' }}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Address"
                required
                value={form.address}
                onChange={(v) => update('address', v)}
                placeholder="Street or plot number"
                error={errors.address}
              />
              <Field
                label="Location"
                required
                value={form.location}
                onChange={(v) => update('location', v)}
                placeholder="e.g., Near Machakos University"
                error={errors.location}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="KE"
                  value={form.contact_phone}
                  onChange={(v) => update('contact_phone', v || '')}
                  className="phone-input-custom"
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact_phone}</p>
                )}
              </div>
              <Field
                label="Contact Email"
                required
                type="email"
                value={form.contact_email}
                onChange={(v) => update('contact_email', v)}
                placeholder="info@hostel.com"
                error={errors.contact_email}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">Select all the amenities your hostel offers.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COMMON_AMENITIES.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-all"
                    style={{
                      borderColor: selected ? '#E9A23B' : '#E5E7EB',
                      backgroundColor: selected ? 'rgba(233,162,59,0.12)' : '#FFFFFF',
                      color: '#14213D',
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: selected ? '#E9A23B' : 'transparent',
                        border: selected ? 'none' : '1.5px solid #D1D5DB',
                      }}
                    >
                      {selected && <Check size={12} style={{ color: '#14213D' }} />}
                    </span>
                    <span className="truncate">{a}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
                Add custom amenity
              </label>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomAmenity();
                    }
                  }}
                  placeholder="e.g., Swimming Pool"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
                />
                <Button type="button" onClick={addCustomAmenity} variant="primary">
                  <Plus size={16} /> Add
                </Button>
              </div>
            </div>

            {form.amenities.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Selected ({form.amenities.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#14213D' }}
                    >
                      {a}
                      <button type="button" onClick={() => toggleAmenity(a)} className="hover:opacity-70">
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {errors.amenities && <p className="text-sm text-red-500">{errors.amenities}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Update photos. The first one is the cover. Existing photos shown as-is.
            </p>
            <FileUpload
              files={form.photos}
              onChange={(files) => update('photos', files)}
              maxFiles={10}
              maxSizeMB={5}
            />
            {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">
              Update the room types and occupancy.
            </p>

            {form.rooms.map((room, i) => {
              const total = Number(room.count) || 0;
              const occupied = Number(room.occupied) || 0;
              const vacant = Math.max(total - occupied, 0);

              return (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm" style={{ color: '#14213D' }}>
                      Room Type #{i + 1}
                    </h4>
                    {form.rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(i)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#14213D' }}>Room Type</label>
                      <select
                        value={room.type}
                        onChange={(e) => updateRoom(i, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                      >
                        {ROOM_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#14213D' }}>Price (KSh/mo)</label>
                      <input
                        type="number"
                        min="0"
                        value={room.price}
                        onChange={(e) => updateRoom(i, 'price', e.target.value)}
                        placeholder="15000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                        style={{ borderColor: errors[`room_price_${i}`] ? '#EF4444' : '#D1D5DB' }}
                      />
                      {errors[`room_price_${i}`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`room_price_${i}`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#14213D' }}>Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={room.capacity}
                        onChange={(e) => updateRoom(i, 'capacity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#14213D' }}>Total</label>
                      <input
                        type="number"
                        min="1"
                        value={room.count}
                        onChange={(e) => updateRoom(i, 'count', e.target.value)}
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                        style={{ borderColor: errors[`room_count_${i}`] ? '#EF4444' : '#D1D5DB' }}
                      />
                      {errors[`room_count_${i}`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`room_count_${i}`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#14213D' }}>Occupied</label>
                      <input
                        type="number"
                        min="0"
                        value={room.occupied}
                        onChange={(e) => updateRoom(i, 'occupied', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                        style={{ borderColor: errors[`room_occupied_${i}`] ? '#EF4444' : '#D1D5DB' }}
                      />
                      {errors[`room_occupied_${i}`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`room_occupied_${i}`]}</p>
                      )}
                    </div>
                  </div>

                  {total > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
                      <span style={{ color: '#6B7280' }}>
                        Total: <span className="font-semibold" style={{ color: '#14213D' }}>{total}</span>
                      </span>
                      <span style={{ color: '#6B7280' }}>
                        Occupied: <span className="font-semibold" style={{ color: '#DC2626' }}>{occupied}</span>
                      </span>
                      <span style={{ color: '#6B7280' }}>
                        Vacant: <span className="font-semibold" style={{ color: '#10B981' }}>{vacant}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addRoom}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors"
              style={{ borderColor: '#E9A23B', color: '#14213D', backgroundColor: 'transparent' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(233,162,59,0.15)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Plus size={16} /> Add another room type
            </button>

            {errors.rooms && <p className="text-sm text-red-500">{errors.rooms}</p>}
          </div>
        );

      case 4:
        const totals = form.rooms.reduce(
          (acc, r) => {
            const total = Number(r.count) || 0;
            const occupied = Number(r.occupied) || 0;
            acc.total += total;
            acc.occupied += occupied;
            acc.vacant += Math.max(total - occupied, 0);
            return acc;
          },
          { total: 0, occupied: 0, vacant: 0 }
        );

        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold mb-3" style={{ color: '#14213D' }}>Basic Info</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Summary label="Name" value={form.name} />
                <Summary label="Location" value={form.location} />
                <Summary label="Address" value={form.address} />
                <Summary label="Phone" value={form.contact_phone} />
                <Summary label="Email" value={form.contact_email} />
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Description</dt>
                  <dd className="text-gray-800 mt-0.5">{form.description}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold mb-3" style={{ color: '#14213D' }}>
                Amenities ({form.amenities.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#14213D' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold mb-3" style={{ color: '#14213D' }}>
                Photos ({form.photos.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {form.photos.map((p, i) => (
                  <img
                    key={i}
                    src={p.preview}
                    alt={p.name}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold mb-3" style={{ color: '#14213D' }}>Rooms</h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#F4F6F8' }}>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold" style={{ color: '#14213D' }}>{totals.total}</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.08)' }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: '#DC2626' }}>Occupied</p>
                  <p className="text-xl font-bold" style={{ color: '#DC2626' }}>{totals.occupied}</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: '#10B981' }}>Vacant</p>
                  <p className="text-xl font-bold" style={{ color: '#10B981' }}>{totals.vacant}</p>
                </div>
              </div>

              <div className="space-y-2">
                {form.rooms.map((r, i) => {
                  const total = Number(r.count) || 0;
                  const occupied = Number(r.occupied) || 0;
                  const vacant = Math.max(total - occupied, 0);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ backgroundColor: '#F4F6F8' }}
                    >
                      <div className="text-sm">
                        <span className="font-medium" style={{ color: '#14213D' }}>{r.type}</span>
                        <span className="text-gray-500 ml-2">· Capacity {r.capacity}</span>
                      </div>
                      <div className="text-sm text-right">
                        <span className="font-medium" style={{ color: '#14213D' }}>
                          KSh {Number(r.price).toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-3">
                          {total} total · {occupied} occupied · {vacant} vacant
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => update('agreeTerms', e.target.checked)}
                className="mt-1 w-4 h-4"
                style={{ accentColor: '#E9A23B' }}
              />
              <span className="text-sm text-gray-600">
                I confirm the information above is accurate and I agree to the{' '}
                <Link to="/terms" className="font-medium" style={{ color: '#4A90D9' }}>Terms of Service</Link>.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/landlord/hostels"
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'rgba(20,33,61,0.06)' }}
        >
          <ArrowLeft size={20} style={{ color: '#14213D' }} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#E9A23B' }}>Edit Hostel</h1>
          <p className="text-sm mt-0.5" style={{ color: '#4B5563' }}>
            Update the details of <span className="font-medium">{form.name}</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          maxReachedStep={maxReachedStep}
          onStepClick={jumpTo}
        />
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        {renderStep()}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="px-5 py-2.5 rounded-lg font-medium text-sm border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: '#D1D5DB', color: '#14213D', backgroundColor: '#F4F6F8' }}
        >
          Back
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8862A')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
            onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#C8862A')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, value, onChange, placeholder, error, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] focus:border-[#E9A23B]"
        style={{ borderColor: error ? '#EF4444' : '#D1D5DB' }}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium mt-0.5" style={{ color: '#14213D' }}>{value || '—'}</dd>
    </div>
  );
}

export default EditHostel;