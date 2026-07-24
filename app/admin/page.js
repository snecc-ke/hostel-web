"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setUser(parsed);
    loadUsers(token);
    loadListings(token);
  }, []);

  async function loadUsers(token) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not load users."); }
      else { setUsers(data.users); }
    } catch (err) { setError("Could not reach server."); }
    setLoading(false);
  }

  async function loadListings(token) {
    try {
      const res = await fetch("/api/admin/listings", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (res.ok) setListings(data.listings || []);
    } catch (err) { console.error(err); }
  }

  async function handleApprove(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Could not update user."); }
      else { loadUsers(token); }
    } catch (err) { alert("Could not reach server."); }
  }

  async function handleApproveListing(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Could not update listing."); }
      else { loadListings(token); }
    } catch (err) { alert("Could not reach server."); }
  }

  async function handleRejectListing(id) {
    const token = localStorage.getItem("token");
    const reason = prompt("Rejection reason (optional):");
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ action: "reject", rejectionReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Could not update listing."); }
      else { loadListings(token); }
    } catch (err) { alert("Could not reach server."); }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#142430]">Admin dashboard</h1>
            <p className="text-sm text-gray-500">System administration and user management</p>
          </div>
        </div>

        <section className="bg-white border border-[#D3DCE0] rounded-xl p-6">
          <h2 className="font-semibold mb-4">Users</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-sm text-[#B4462F]">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2">{u.fullName}</td>
                      <td className="py-2 text-gray-600">{u.email}</td>
                      <td className="py-2">{u.role}</td>
                      <td className="py-2">{u.accountStatus}</td>
                      <td className="py-2">
                        {u.role === "LANDLORD" && u.accountStatus === "PENDING" && (
                          <button onClick={() => handleApprove(u.id)} className="bg-[#2568A8] text-white px-3 py-1 rounded-md text-xs">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white border border-[#D3DCE0] rounded-xl p-6 mt-6">
          <h2 className="font-semibold mb-4">Listings</h2>
          {listings.length === 0 ? (
            <p className="text-sm text-gray-500">No recent listings.</p>
          ) : (
            <div className="space-y-3">
              {listings.map((l) => (
                <div key={l.id} className="border rounded p-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{l.title}</p>
                    <p className="text-sm text-gray-500">{l.area}, {l.county} — {l.propertyType}</p>
                    <p className="text-xs text-gray-500">Status: {l.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {l.status === "PENDING" && (
                      <>
                        <button onClick={() => handleApproveListing(l.id)} className="bg-[#1F6F54] text-white px-3 py-1 rounded-md text-xs">Approve</button>
                        <button onClick={() => handleRejectListing(l.id)} className="bg-[#B4462F] text-white px-3 py-1 rounded-md text-xs">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
