"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PROPERTY_TYPES = ["BEDSITTER", "HOSTEL_ROOM", "ONE_BEDROOM", "TWO_BEDROOM", "APARTMENT", "BUNGALOW"];

const STATUS_STYLES = {
  PENDING: { bg: "#FDF3E3", text: "#E2A63B", label: "Pending review" },
  APPROVED: { bg: "#E7F2ED", text: "#1F6F54", label: "Approved" },
  REJECTED: { bg: "#FBEDEA", text: "#B4462F", label: "Rejected" },
  TAKEN: { bg: "#EEF2F4", text: "#6B7A85", label: "Taken" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
      {style.label}
    </span>
  );
}

export default function LandlordDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    roomCount: "",
    roomTypes: "",
    roomCharges: "",
    description: "",
    propertyType: "HOSTEL_ROOM",
    price: "",
    county: "",
    area: "",
    landmark: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) { router.push("/login"); return; }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "LANDLORD") { router.push("/"); return; }
    if (parsedUser.accountStatus === "PENDING") { router.push("/landlord/pending"); return; }
    setUser(parsedUser);
    loadListings(token);
  }, []);

  async function loadListings(token) {
    setLoading(true);
    try {
      const res = await fetch("/api/listings/mine", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not load your listings."); }
      else { setListings(data.listings); }
    } catch (err) { setError("Could not reach the server."); }
    setLoading(false);
  }

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmitListing(e) {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          roomCount: Number(form.roomCount),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Something went wrong."); setSubmitting(false); return; }
      setForm({
        title: "",
        roomCount: "",
        roomTypes: "",
        roomCharges: "",
        description: "",
        propertyType: "HOSTEL_ROOM",
        price: "",
        county: "",
        area: "",
        landmark: "",
      });
      setShowForm(false);
      setSuccessMessage(data.reviewNotice || "Thank you for registering your hostel. Your registration is under review and you will receive an approval or rejection email within 1–7 days.");
      setSubmitting(false);
      loadListings(token);
    } catch (err) { setFormError("Could not reach the server."); setSubmitting(false); }
  }

  async function handleMarkTaken(id) {
    const token = localStorage.getItem("token");
    await fetch("/api/listings/" + id + "/mark-taken", { method: "POST", headers: { Authorization: "Bearer " + token } });
    loadListings(token);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this listing permanently? This can't be undone.")) return;
    const token = localStorage.getItem("token");
    await fetch("/api/listings/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    loadListings(token);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#142430]">Welcome, {user.fullName}</h1>
            <p className="text-sm text-gray-500">Manage your listings</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-[#2568A8] underline">Log out</button>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="bg-[#2568A8] text-white text-sm font-medium rounded-md px-4 py-2 mb-6">
          {showForm ? "Cancel" : "+ Register a hostel"}
        </button>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-[#1F6F54]/30 bg-[#E7F2ED] px-4 py-3 text-sm text-[#1F6F54]">
            {successMessage}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmitListing} className="bg-white border border-[#D3DCE0] rounded-xl p-6 mb-8 space-y-4">
            <h2 className="font-semibold text-[#142430]">Hostel registration</h2>
            <p className="text-sm text-gray-500">Share your hostel details and we will review the registration before it goes live.</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleFormChange} required
                  placeholder="e.g. Green Valley Hostel" className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Number of rooms</label>
                <input type="number" name="roomCount" value={form.roomCount} onChange={handleFormChange} required min="1"
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Room types</label>
                <input name="roomTypes" value={form.roomTypes} onChange={handleFormChange} required
                  placeholder="Single, Double, Self-contained" className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Room charges</label>
                <input name="roomCharges" value={form.roomCharges} onChange={handleFormChange} required
                  placeholder="Single: KES 8000, Double: KES 12000" className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#142430] mb-1">Short description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} required rows={3}
                placeholder="Mention Wi-Fi, shared kitchen, security, location perks..." className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Property type</label>
                <select name="propertyType" value={form.propertyType} onChange={handleFormChange}
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm">
                  {PROPERTY_TYPES.map((t) => (<option key={t} value={t}>{t.replace("_", " ")}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Starting room charge (KES/month)</label>
                <input type="number" name="price" value={form.price} onChange={handleFormChange} required min="1"
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">County</label>
                <input name="county" value={form.county} onChange={handleFormChange} required
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#142430] mb-1">Area</label>
                <input name="area" value={form.area} onChange={handleFormChange} required
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#142430] mb-1">Landmark (optional)</label>
              <input name="landmark" value={form.landmark} onChange={handleFormChange}
                placeholder="e.g. 300m from JKUAT gate A" className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
            </div>

            {formError && (
              <p className="text-sm text-[#B4462F] bg-[#FBEDEA] border border-[#B4462F]/30 rounded-md px-3 py-2">{formError}</p>
            )}

            <div className="rounded-lg border border-[#D3DCE0] bg-[#F9FBFC] px-3 py-3 text-sm text-gray-600">
              Thank you for registering. Your hostel will be reviewed within 1–7 days, and an approval or rejection message will be sent to your email.
            </div>

            <button type="submit" disabled={submitting} className="bg-[#2568A8] text-white text-sm font-medium rounded-md px-4 py-2 disabled:opacity-50">
              {submitting ? "Registering..." : "Register hostel"}
            </button>
          </form>
        )}

        <h2 className="font-semibold text-[#142430] mb-3">Your registrations</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-[#B4462F]">{error}</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't submitted any listings yet.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white border border-[#D3DCE0] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-[#142430]">{listing.title}</p>
                    <StatusBadge status={listing.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {listing.area}, {listing.county} - KES {Number(listing.price).toLocaleString()}/mo
                  </p>
                  {listing.status === "REJECTED" && listing.rejectionReason && (
                    <p className="text-xs text-[#B4462F] mt-1">Rejected: {listing.rejectionReason}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {listing.status === "APPROVED" && (
                    <button onClick={() => handleMarkTaken(listing.id)} className="text-xs border border-[#D3DCE0] rounded-md px-3 py-1.5 text-[#142430]">
                      Mark as taken
                    </button>
                  )}
                  <button onClick={() => handleDelete(listing.id)} className="text-xs border border-[#B4462F]/30 text-[#B4462F] rounded-md px-3 py-1.5">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
