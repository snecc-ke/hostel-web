"use client";

import { useEffect, useState } from "react";

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [activeBookingRoomId, setActiveBookingRoomId] = useState(null);
  const [bookingForms, setBookingForms] = useState({});
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  async function handleSaveToggle() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in as a seeker to save listings.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/listings/" + listing.id + "/save", {
        method: saved ? "DELETE" : "POST",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        setSaved(!saved);
        setMessage("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Could not update.");
      }
    } catch (err) {
      setMessage("Could not reach the server.");
    }
    setSaving(false);
  }

  async function handleContact() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in as a seeker to contact the landlord.");
      return;
    }
    setContacting(true);
    try {
      const res = await fetch("/api/listings/" + listing.id + "/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ message: "Hi, is " + listing.title + " still available?" }),
      });
      const data = await res.json();
      if (res.ok && data.whatsappLink) {
        window.open(data.whatsappLink, "_blank");
      } else {
        setMessage(data.error || "Could not start conversation.");
      }
    } catch (err) {
      setMessage("Could not reach the server.");
    }
    setContacting(false);
  }

  async function handleReport() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in to report a listing.");
      return;
    }
    const reason = window.prompt("What's wrong with this listing?");
    if (!reason || reason.trim().length < 5) return;

    try {
      const res = await fetch("/api/listings/" + listing.id + "/report", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      setMessage(res.ok ? "Thanks, we'll look into it." : (data.error || "Could not submit report."));
    } catch (err) {
      setMessage("Could not reach the server.");
    }
  }

  async function loadRooms() {
    if (loadingRooms) return;
    setLoadingRooms(true);
    setBookingMessage("");
    try {
      const res = await fetch(`/api/listings/${listing.id}/rooms`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load rooms.");
      setRooms(data.rooms || []);
    } catch (err) {
      setBookingMessage(err.message || "Could not load rooms.");
    }
    setLoadingRooms(false);
  }

  function toggleRooms() {
    if (!showRooms && rooms.length === 0) {
      loadRooms();
    }
    setShowRooms(!showRooms);
  }

  function updateBookingForm(roomId, field, value) {
    setBookingForms((prev) => ({
      ...prev,
      [roomId]: {
        ...(prev[roomId] || {}),
        [field]: value,
      },
    }));
  }

  function toggleBookingForm(roomId) {
    if (activeBookingRoomId === roomId) {
      setActiveBookingRoomId(null);
      return;
    }
    setActiveBookingRoomId(roomId);
    setBookingMessage("");
  }

  async function handleBookRoom(roomId) {
    const token = localStorage.getItem("token");
    if (!token) {
      setBookingMessage("Log in as a seeker to book a room.");
      return;
    }

    const form = bookingForms[roomId] || {};
    const fullName = (form.fullName || "").trim();
    const phone = (form.phone || "").trim();
    const message = (form.message || "").trim();

    if (!fullName) {
      setBookingMessage("Please enter your full name before booking.");
      return;
    }
    if (!phone) {
      setBookingMessage("Please enter your phone number before booking.");
      return;
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      setBookingMessage("Please enter a valid phone number.");
      return;
    }

    setBookingRoomId(roomId);
    try {
      const res = await fetch(`/api/listings/${listing.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ roomId, fullName, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed.");
      setBookingMessage("Booking request sent. The landlord will review it shortly.");
      setBookingForms((prev) => ({
        ...prev,
        [roomId]: { fullName: "", phone: "", message: "" },
      }));
      setActiveBookingRoomId(null);
    } catch (err) {
      setBookingMessage(err.message || "Could not place booking.");
    }
    setBookingRoomId(null);
  }

  return (
    <div className="bg-white border border-[#D3DCE0] rounded-xl overflow-hidden relative">
      <div className="h-32 bg-[#EEF2F4] flex items-center justify-center text-[#8A9187] text-sm">
        {listing.photos && listing.photos.length > 0 ? (
          <img src={listing.photos[0].url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          "No photo yet"
        )}
      </div>
      <div className="p-4">
        <p className="font-medium text-[#142430]">{listing.title}</p>
        <p className="text-sm text-gray-500 mb-2">
          {listing.landmark || (listing.area + ", " + listing.county)}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          {listing.description}
        </p>
        <p className="font-semibold text-[#142430] font-mono mb-3">
          KES {Number(listing.price).toLocaleString()}
          <span className="text-xs font-normal text-gray-500"> /month</span>
        </p>

        <div className="flex gap-2 mb-2">
          <button
            onClick={handleContact}
            disabled={contacting}
            className="flex-1 bg-[#2568A8] text-white text-xs font-medium rounded-md py-2 disabled:opacity-50"
          >
            {contacting ? "..." : "Contact via WhatsApp"}
          </button>
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className="border border-[#D3DCE0] rounded-md px-3 py-2 text-xs"
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>

        <div className="border-t border-[#D3DCE0] pt-3 mt-3">
          <button onClick={toggleRooms} className="text-xs font-semibold text-[#2568A8]">
            {showRooms ? "Hide room details" : "View rooms & book"}
          </button>

          {showRooms && (
            <div className="mt-3 space-y-3">
              {loadingRooms ? (
                <p className="text-xs text-gray-500">Loading rooms...</p>
              ) : rooms.length === 0 ? (
                <p className="text-xs text-gray-500">No room details have been posted yet.</p>
              ) : (
                rooms.map((room) => (
                  <div key={room.id} className="rounded-lg border border-[#D3DCE0] bg-[#F9FBFC] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#142430]">
                          {room.roomCode || room.roomNumber || "Room"} • {room.roomType}
                        </p>
                        <p className="text-xs text-gray-500">
                          Room {room.roomNumber || "—"} • {room.roomCode || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#142430]">KES {Number(room.cost).toLocaleString()}</p>
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">{room.status}</p>
                      </div>
                    </div>
                    {room.details && <p className="mt-2 text-xs text-gray-600">{room.details}</p>}
                    {room.photos && room.photos.length > 0 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {room.photos.map((photo) => (
                          <img key={photo.id} src={photo.url} alt={room.roomCode || "Room photo"} className="h-20 w-24 rounded-md object-cover" />
                        ))}
                      </div>
                    )}
                    {room.bookings && room.bookings.length > 0 && (
                      <div className="mt-3 rounded-md border border-[#D3DCE0] bg-[#F3F7FB] p-3 text-xs text-[#142430]">
                        <p className="font-semibold">Booking details</p>
                        <p>Status: {room.bookings[0].status}</p>
                        <p>Guest: {room.bookings[0].fullName}</p>
                        <p>Phone: {room.bookings[0].phone}</p>
                        {room.status === "OCCUPIED" && (
                          <>
                            <p>Total paid: KES {Number(room.bookings[0].amountPaid).toLocaleString()}</p>
                            <p>Amount due: KES {Number(room.bookings[0].amountDue).toLocaleString()}</p>
                          </>
                        )}
                      </div>
                    )}
                    {room.status === "AVAILABLE" ? (
                      <div className="mt-3 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            if (activeBookingRoomId === room.id) {
                              handleBookRoom(room.id);
                            } else {
                              toggleBookingForm(room.id);
                            }
                          }}
                          disabled={bookingRoomId === room.id}
                          className="rounded-md bg-[#2568A8] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                        >
                          {bookingRoomId === room.id ? "Booking..." : activeBookingRoomId === room.id ? "Submit booking" : "Book this room"}
                        </button>
                        {activeBookingRoomId === room.id && (
                          <div className="flex flex-col gap-2">
                            <input
                              value={bookingForms[room.id]?.fullName || ""}
                              onChange={(event) => updateBookingForm(room.id, "fullName", event.target.value)}
                              placeholder="Full name"
                              className="w-full rounded-md border border-[#D3DCE0] px-2 py-2 text-xs"
                            />
                            <input
                              value={bookingForms[room.id]?.phone || ""}
                              onChange={(event) => updateBookingForm(room.id, "phone", event.target.value)}
                              placeholder="Phone number"
                              className="w-full rounded-md border border-[#D3DCE0] px-2 py-2 text-xs"
                            />
                            <textarea
                              value={bookingForms[room.id]?.message || ""}
                              onChange={(event) => updateBookingForm(room.id, "message", event.target.value)}
                              rows={2}
                              placeholder="Tell the landlord what you like about this room"
                              className="w-full rounded-md border border-[#D3DCE0] px-2 py-2 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-gray-500">This room is currently {room.status.toLowerCase()}.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button onClick={handleReport} className="text-xs text-gray-400 underline mt-3">
          Report this listing
        </button>

        {message && <p className="text-xs text-[#B4462F] mt-2">{message}</p>}
        {bookingMessage && <p className="text-xs text-[#1F6F54] mt-2">{bookingMessage}</p>}
      </div>
    </div>
  );
}
