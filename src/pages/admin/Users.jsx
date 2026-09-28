import { useEffect, useState, useMemo } from 'react';
import {
  Search, Shield, Ban, CheckCircle, UserPlus,
  Mail, Calendar, ShieldCheck, AlertTriangle
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

const ROLE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'student', label: 'Students' },
  { key: 'landlord', label: 'Landlords' },
  { key: 'admin', label: 'Admins' },
];

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getUsers()
      .then((data) => { if (mounted) setUsers(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = (id) => {
    setProcessing(id);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: !u.is_active } : u
        )
      );
      const user = users.find((u) => u.id === id);
      showToast(
        user?.is_active ? 'User suspended' : 'User activated',
        user?.is_active ? 'error' : 'success'
      );
      setProcessing(null);
      setSelected(null);
    }, 500);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const roleBadge = {
    admin: 'navy',
    landlord: 'accent',
    student: 'info',
  };

  // Counts per role
  const counts = useMemo(() => {
    return {
      all: users.length,
      student: users.filter((u) => u.role === 'student').length,
      landlord: users.filter((u) => u.role === 'landlord').length,
      admin: users.filter((u) => u.role === 'admin').length,
    };
  }, [users]);

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
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14213D] tracking-tight">Users</h1>
          <p className="text-[#5c6470] mt-1">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
            <Shield size={16} className="text-[#14213D]" />
            <span className="text-sm font-medium text-[#14213D]">{counts.all} total</span>
          </div>
        </div>
      </div>

      {/* ═══════ FILTERS + SEARCH ═══════ */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {ROLE_TABS.map((tab) => {
              const isActive = roleFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setRoleFilter(tab.key)}
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

        {/* ═══════ TABLE ═══════ */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No users found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setRoleFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-[#5c6470] uppercase tracking-wider border-b border-[#E8ECF1]">
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F8]">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#FAFBFC] transition-colors cursor-pointer"
                    onClick={() => setSelected(u)}
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="md" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#14213D] truncate">{u.name}</p>
                          <p className="text-sm text-[#5c6470] truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={roleBadge[u.role]}>{u.role}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {u.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Suspended</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#5c6470]">
                      {new Date(u.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#5c6470]">
                      {u.last_login
                        ? new Date(u.last_login).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelected(u)}
                          className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#5c6470] hover:text-[#14213D] transition-colors"
                          title="View details"
                        >
                          <Shield size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          disabled={processing === u.id}
                          className={`p-2 rounded-lg transition-colors ${
                            u.is_active
                              ? 'hover:bg-red-50 text-[#5c6470] hover:text-red-600'
                              : 'hover:bg-emerald-50 text-[#5c6470] hover:text-emerald-600'
                          }`}
                          title={u.is_active ? 'Suspend user' : 'Activate user'}
                        >
                          {u.is_active ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ═══════ USER DETAILS MODAL ═══════ */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="User Details"
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="xl" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#14213D]">{selected.name}</h3>
                  <Badge variant={roleBadge[selected.role]}>{selected.role}</Badge>
                </div>
                <p className="text-sm text-[#5c6470]">{selected.email}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Status</p>
                </div>
                {selected.is_active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="danger">Suspended</Badge>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Verified</p>
                </div>
                {selected.email_verified ? (
                  <Badge variant="success">Email verified</Badge>
                ) : (
                  <Badge variant="warning">Unverified</Badge>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Joined</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">
                  {new Date(selected.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F6F8] border border-[#E8ECF1]">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-[#14213D]" />
                  <p className="text-xs text-[#5c6470] uppercase tracking-wide">Last login</p>
                </div>
                <p className="text-sm font-medium text-[#14213D]">
                  {selected.last_login
                    ? new Date(selected.last_login).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Never'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#E8ECF1]">
              <Button
                variant={selected.is_active ? 'danger' : 'success'}
                fullWidth
                icon={selected.is_active ? Ban : CheckCircle}
                onClick={() => toggleStatus(selected.id)}
                loading={processing === selected.id}
              >
                {selected.is_active ? 'Suspend User' : 'Activate User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

export default Users;