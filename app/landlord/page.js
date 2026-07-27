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
  const [expandedListingId, setExpandedListingId] = useState(null);
  const [roomForms, setRoomForms] = useState({});
  const [roomLists, setRoomLists] = useState({});
  const [roomLoading, setRoomLoading] = useState({});
  const [roomMessage, setRoomMessage] = useState({});
  const [expandedRoomId, setExpandedRoomId] = useState(null);
  const [bookingActionForms, setBookingActionForms] = useState({});
  const [bookingActionLoading, setBookingActionLoading] = useState({});
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

  function updateRoomForm(listingId, field, value) {
    setRoomForms((prev) => ({
      ...prev,
      [listingId]: { ...(prev[listingId] || {}), [field]: value },
    }));
  }

  async function loadRoomsForListing(listingId) {
    setRoomLoading((prev) => ({ ...prev, [listingId]: true }));
    setRoomMessage((prev) => ({ ...prev, [listingId]: "" }));
    try {
      const res = await fetch(`/api/listings/${listingId}/rooms`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load rooms.");
      setRoomLists((prev) => ({ ...prev, [listingId]: data.rooms || [] }));
    } catch (err) {
      setRoomMessage((prev) => ({ ...prev, [listingId]: err.message || "Could not load rooms." }));
    }
    setRoomLoading((prev) => ({ ...prev, [listingId]: false }));
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

  async function handleAddRoom(event, listingId) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const draft = roomForms[listingId] || {};
    const payload = {
      startRoomNumber: draft.startRoomNumber || "",
      totalRooms: draft.totalRooms || 1,
      roomType: draft.roomType || "STANDARD",
      cost: Number(draft.cost),
      details: draft.details || "",
      status: draft.status || "AVAILABLE",
    };

    try {
      const res = await fetch(`/api/listings/${listingId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add rooms.");
      setRoomForms((prev) => ({
        ...prev,
        [listingId]: { startRoomNumber: "", totalRooms: "", roomType: "STANDARD", cost: "", details: "", status: "AVAILABLE" },
      }));
      await loadRoomsForListing(listingId);
      const count = data.count || 1;
      setRoomMessage((prev) => ({ ...prev, [listingId]: `Added ${count} room${count > 1 ? "s" : ""} successfully.` }));
    } catch (err) {
      setRoomMessage((prev) => ({ ...prev, [listingId]: err.message || "Could not add rooms." }));
    }
  }

  async function handleUploadListingPhoto(event, listingId) {
    const file = event.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ imageBase64: reader.result }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Photo upload failed.");
        await loadListings(token);
        setRoomMessage((prev) => ({ ...prev, [listingId]: "Listing photo uploaded." }));
      } catch (err) {
        setRoomMessage((prev) => ({ ...prev, [listingId]: err.message || "Photo upload failed." }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleUploadRoomPhoto(event, listingId, roomId) {
    const file = event.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}/rooms/${roomId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ imageBase64: reader.result }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Photo upload failed.");
        await loadRoomsForListing(listingId);
        setRoomMessage((prev) => ({ ...prev, [listingId]: "Room photo uploaded." }));
      } catch (err) {
        setRoomMessage((prev) => ({ ...prev, [listingId]: err.message || "Photo upload failed." }));
      }
    };
    reader.readAsDataURL(file);
  }

  function toggleRoomDetails(roomId) {
    setExpandedRoomId((prev) => (prev === roomId ? null : roomId));
  }

  async function handleToggleListing(listingId) {
    const isCurrentlyExpanded = expandedListingId === listingId;
    const nextExpanded = isCurrentlyExpanded ? null : listingId;
    setExpandedListingId(nextExpanded);
    if (nextExpanded && !roomLists[listingId]) {
      await loadRoomsForListing(listingId);
    }
  }

  function updateBookingActionForm(roomId, field, value) {
    setBookingActionForms((prev) => ({
      ...prev,
      [roomId]: { ...(prev[roomId] || {}), [field]: value },
    }));
  }

  async function handleUpdateBooking(bookingId, roomId, listingId, status) {
    const token = localStorage.getItem("token");
    if (!token) return;

    setBookingActionLoading((prev) => ({ ...prev, [roomId]: true }));
    const payload = { status };
    const actionValues = bookingActionForms[roomId] || {};
    if (status === "OCCUPIED") {
      if (actionValues.amountPaid !== undefined) payload.amountPaid = Number(actionValues.amountPaid);
      if (actionValues.amountDue !== undefined) payload.amountDue = Number(actionValues.amountDue);
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update booking.");
      setRoomMessage((prev) => ({ ...prev, [listingId]: `Booking ${status.toLowerCase()} successfully.` }));
      await loadRoomsForListing(listingId);
    } catch (err) {
      setRoomMessage((prev) => ({ ...prev, [listingId]: err.message || "Could not update booking." }));
    }

    setBookingActionLoading((prev) => ({ ...prev, [roomId]: false }));
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
            {listings.map((listing) => {
              const isExpanded = expandedListingId === listing.id;
              const roomEntries = roomLists[listing.id] || [];
              const draft = roomForms[listing.id] || { roomNumber: "", roomCode: "", roomType: "STANDARD", cost: "", details: "", status: "AVAILABLE" };
              return (
                <div key={listing.id} className="bg-white border border-[#D3DCE0] rounded-xl p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                      <button onClick={() => handleToggleListing(listing.id)} className="text-xs border border-[#D3DCE0] rounded-md px-3 py-1.5 text-[#142430]">
                        {isExpanded ? "Hide rooms" : "Manage rooms"}
                      </button>
                      <button onClick={() => handleDelete(listing.id)} className="text-xs border border-[#B4462F]/30 text-[#B4462F] rounded-md px-3 py-1.5">
                        Delete
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded-lg border border-[#D3DCE0] bg-[#F9FBFC] p-4 space-y-4">
                      <div className="rounded-lg border border-[#D3DCE0] bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#142430]">Listing photos</p>
                            <p className="text-xs text-gray-500">Add cover photos for this hostel listing.</p>
                          </div>
                          <label className="inline-flex cursor-pointer rounded-md border border-[#D3DCE0] px-3 py-2 text-xs font-medium text-[#2568A8]">
                            Upload photo
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUploadListingPhoto(event, listing.id)} />
                          </label>
                        </div>
                        {listing.photos && listing.photos.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {listing.photos.map((photo) => (
                              <img key={photo.id} src={photo.url} alt={listing.title} className="h-20 w-24 rounded-md object-cover" />
                            ))}
                          </div>
                        )}
                      </div>

                      <form onSubmit={(event) => handleAddRoom(event, listing.id)} className="space-y-3">
                        <div className="rounded-md border border-[#D3DCE0] bg-white p-3 text-sm text-gray-600">
                          Enter a starting room number and how many identical rooms you want to add. You can use formats like 101, A1, or B1.
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input value={draft.startRoomNumber || ""} onChange={(event) => updateRoomForm(listing.id, "startRoomNumber", event.target.value)} placeholder="Starting room number (e.g. 101, A1, B1)" className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm" />
                          <input type="number" min="1" value={draft.totalRooms || ""} onChange={(event) => updateRoomForm(listing.id, "totalRooms", event.target.value)} placeholder="How many rooms?" className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <select value={draft.roomType || "STANDARD"} onChange={(event) => updateRoomForm(listing.id, "roomType", event.target.value)} className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm">
                            <option value="STANDARD">Standard</option>
                            <option value="SELF_CONTAINED">Self-contained</option>
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                            <option value="SHARED">Shared</option>
                          </select>
                          <input type="number" value={draft.cost || ""} onChange={(event) => updateRoomForm(listing.id, "cost", event.target.value)} placeholder="Monthly cost" className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm" />
                          <select value={draft.status || "AVAILABLE"} onChange={(event) => updateRoomForm(listing.id, "status", event.target.value)} className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm">
                            <option value="AVAILABLE">Available</option>
                            <option value="BOOKED">Booked</option>
                          </select>
                        </div>
                        <textarea value={draft.details || ""} onChange={(event) => updateRoomForm(listing.id, "details", event.target.value)} rows={2} placeholder="Room description, amenities, furniture, notes" className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-md bg-[#2568A8] px-4 py-2 text-sm font-medium text-white">Add rooms in bulk</button>
                      </form>

                      {roomMessage[listing.id] && <p className="text-sm text-[#1F6F54]">{roomMessage[listing.id]}</p>}

                      {roomLoading[listing.id] ? (
                        <p className="text-sm text-gray-500">Loading rooms...</p>
                      ) : roomEntries.length === 0 ? (
                        <p className="text-sm text-gray-500">No rooms added yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {roomEntries.map((room) => (
                            <div key={room.id} className="rounded-lg border border-[#D3DCE0] bg-white p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-[#142430]">{room.roomCode || room.roomNumber || "Room"} • {room.roomType}</p>
                                  <p className="text-xs text-gray-500">{room.roomNumber || "—"} • {room.roomCode || "—"}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-[#142430]">KES {Number(room.cost).toLocaleString()}</p>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{room.status}</p>
                                </div>
                              </div>
                              {room.details && <p className="mt-2 text-xs text-gray-600">{room.details}</p>}
                              <button
                                type="button"
                                onClick={() => toggleRoomDetails(room.id)}
                                className="mt-3 text-xs text-[#2568A8] font-semibold"
                              >
                                {expandedRoomId === room.id ? "Hide room details" : "View room details"}
                              </button>
                              {expandedRoomId === room.id && (
                                <div className="mt-3 space-y-4 rounded-lg border border-[#D3DCE0] bg-[#F4F7FB] p-3">
                                  {room.photos && room.photos.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-[#142430] mb-2">Room photos</p>
                                      <div className="flex gap-2 overflow-x-auto">
                                        {room.photos.map((photo) => (
                                          <img key={photo.id} src={photo.url} alt={room.roomCode || "Room photo"} className="h-20 w-24 rounded-md object-cover" />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {room.bookings && room.bookings.length > 0 ? (
                                    <div className="space-y-3 rounded-md border border-[#D3DCE0] bg-white p-3 text-sm text-[#142430]">
                                      <p className="font-semibold">Latest booking details</p>
                                      <p>Status: {room.bookings[0].status}</p>
                                      <p>Guest: {room.bookings[0].fullName || room.bookings[0].name || "Unknown"}</p>
                                      <p>Phone: {room.bookings[0].phone || "N/A"}</p>
                                      {room.bookings[0].message && <p>Message: {room.bookings[0].message}</p>}
                                      {room.bookings[0].status === "OCCUPIED" && (
                                        <>
                                          <p>Total paid: KES {Number(room.bookings[0].amountPaid ?? 0).toLocaleString()}</p>
                                          <p>Amount due: KES {Number(room.bookings[0].amountDue ?? 0).toLocaleString()}</p>
                                        </>
                                      )}

                                      {room.bookings[0].status === "PENDING" && (
                                        <div className="flex flex-wrap gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateBooking(room.bookings[0].id, room.id, listing.id, "APPROVED")}
                                            disabled={bookingActionLoading[room.id]}
                                            className="rounded-md bg-[#1F6F54] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                                          >
                                            Approve booking
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateBooking(room.bookings[0].id, room.id, listing.id, "REJECTED")}
                                            disabled={bookingActionLoading[room.id]}
                                            className="rounded-md bg-[#B4462F] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                                          >
                                            Reject booking
                                          </button>
                                        </div>
                                      )}

                                      {room.bookings[0].status === "APPROVED" && (
                                        <div className="space-y-3">
                                          <div className="grid gap-2 sm:grid-cols-2">
                                            <input
                                              type="number"
                                              value={bookingActionForms[room.id]?.amountPaid ?? ""}
                                              onChange={(event) => updateBookingActionForm(room.id, "amountPaid", event.target.value)}
                                              placeholder="Total paid"
                                              className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                                            />
                                            <input
                                              type="number"
                                              value={bookingActionForms[room.id]?.amountDue ?? ""}
                                              onChange={(event) => updateBookingActionForm(room.id, "amountDue", event.target.value)}
                                              placeholder="Amount due"
                                              className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateBooking(room.bookings[0].id, room.id, listing.id, "OCCUPIED")}
                                            disabled={bookingActionLoading[room.id]}
                                            className="rounded-md bg-[#2568A8] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                                          >
                                            Mark as occupied
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-500">No booking details available for this room.</p>
                                  )}

                                  <label className="inline-flex cursor-pointer rounded-md border border-[#D3DCE0] px-3 py-2 text-xs font-medium text-[#2568A8]">
                                    Upload room photo
                                    <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUploadRoomPhoto(event, listing.id, room.id)} />
                                  </label>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
