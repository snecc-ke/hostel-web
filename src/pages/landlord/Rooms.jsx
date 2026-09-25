import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, DoorOpen,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { demoHostels } from '../../data/demoData';
import { demoRooms } from '../../data/demoRooms';

const ROOM_TYPES = ['Single Room', 'Bedsitter'];
const PAGE_SIZE_OPTIONS = [15, 20];

const initialRoomForm = {
  hostelId: '',
  name: '',
  type: 'Single Room',
  capacity: 1,
  price: '',
  status: 'vacant',
};

function Rooms() {
  const toast = useToast();

  const [rooms, setRooms] = useState(demoRooms);
  const [hostelFilter, setHostelFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(initialRoomForm);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [hostelFilter, search, pageSize]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchesHostel =
        hostelFilter === 'all' || String(r.hostelId) === String(hostelFilter);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);
      return matchesHostel && matchesSearch;
    });
  }, [rooms, hostelFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRooms = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    setEditingRoom(null);
    setForm({ ...initialRoomForm, hostelId: demoHostels[0]?.id || '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      hostelId: room.hostelId,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      status: room.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (deleting) return;
    setModalOpen(false);
    setEditingRoom(null);
    setForm(initialRoomForm);
    setFormErrors({});
  };

  const validateForm = () => {
    const e = {};
    if (!form.hostelId) e.hostelId = 'Select a hostel';
    if (!form.name.trim()) e.name = 'Room name is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0';
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = 'Capacity must be greater than 0';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const hostel = demoHostels.find((h) => String(h.id) === String(form.hostelId));

    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? {
                ...r,
                name: form.name,
                type: form.type,
                capacity: Number(form.capacity),
                price: Number(form.price),
                status: form.status,
                hostelId: hostel?.id,
                hostelName: hostel?.name,
              }
            : r
        )
      );
      toast.success('Room updated');
    } else {
      const newRoom = {
        id: Date.now(),
        name: form.name,
        hostelId: hostel?.id,
        hostelName: hostel?.name,
        type: form.type,
        capacity: Number(form.capacity),
        price: Number(form.price),
        status: form.status,
      };
      setRooms((prev) => [newRoom, ...prev]);
      toast.success('Room added');
    }

    closeModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Room',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'rgba(20,33,61,0.08)', color: '#14213D' }}
          >
            {r.name.slice(0, 3).toUpperCase()}
          </div>
          <span className="font-medium" style={{ color: '#14213D' }}>
            {r.name}
          </span>
        </div>
      ),
    },
    { key: 'hostelName', label: 'Hostel' },
    { key: 'type', label: 'Type' },
    { key: 'capacity', label: 'Capacity', align: 'center' },
    {
      key: 'price',
      label: 'Price',
      align: 'right',
      sortable: true,
      render: (r) => (
        <span className="font-medium" style={{ color: '#14213D' }}>
          {formatCurrency(r.price)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (r) => (
        <Badge variant={r.status === 'vacant' ? 'success' : 'danger'}>
          {r.status === 'vacant' ? 'Vacant' : 'Occupied'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="inline-flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(233,162,59,0.15)', color: '#C8862A' }}
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(r);
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#DC2626' }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Rooms</h1>
          <p className="mt-1" style={{ color: '#4B5563' }}>
            Manage individual rooms across your properties
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8862A')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
        >
          <Plus size={18} />
          Add Room
        </button>
      </div>

      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3" style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}>
        <select
          value={hostelFilter}
          onChange={(e) => setHostelFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
        >
          <option value="all">All Hostels</option>
          {demoHostels.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room name or type..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
            />
          </div>
        </div>

        <span className="text-sm text-gray-500">
          {filtered.length} room{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Table
        columns={columns}
        data={pageRooms}
        rowKey={(r) => r.id}
        emptyIcon={DoorOpen}
        emptyTitle="No rooms found"
        emptyDescription="Try changing filters or add a new room."
      />

      {filtered.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded border border-gray-300 bg-white text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-white"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingRoom ? 'Edit Room' : 'Add Room'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
              Hostel <span className="text-red-500">*</span>
            </label>
            <select
              value={form.hostelId}
              onChange={(e) => setForm({ ...form, hostelId: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              style={{ borderColor: formErrors.hostelId ? '#EF4444' : '#D1D5DB' }}
            >
              <option value="">Select a hostel</option>
              {demoHostels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            {formErrors.hostelId && <p className="mt-1 text-sm text-red-500">{formErrors.hostelId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., A-101"
              className="w-full px-4 py-2.5 border rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              style={{ borderColor: formErrors.name ? '#EF4444' : '#D1D5DB' }}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>Capacity</label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
                style={{ borderColor: formErrors.capacity ? '#EF4444' : '#D1D5DB' }}
              />
              {formErrors.capacity && <p className="mt-1 text-sm text-red-500">{formErrors.capacity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#14213D' }}>
              Price (KSh / month) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="15000"
              className="w-full px-4 py-2.5 border rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              style={{ borderColor: formErrors.price ? '#EF4444' : '#D1D5DB' }}
            />
            {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#14213D' }}>Status</label>
            <div className="flex gap-3">
              {[
                { value: 'vacant', label: 'Vacant', color: '#10B981' },
                { value: 'occupied', label: 'Occupied', color: '#EF4444' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: opt.value })}
                  className="flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    borderColor: form.status === opt.value ? opt.color : '#D1D5DB',
                    backgroundColor: form.status === opt.value ? `${opt.color}15` : '#FFFFFF',
                    color: form.status === opt.value ? opt.color : '#6B7280',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button onClick={handleSave} variant="primary">
              {editingRoom ? 'Save Changes' : 'Add Room'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete room?"
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.name}". This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default Rooms;