"use client";

import { useEffect, useState } from "react";

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [message, setMessage] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [activeBookingRoomId, setActiveBookingRoomId] = useState(null);
  const [bookingForms, setBookingForms] = useState({});
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setSaved(false);
    }
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

  function openDetailsView() {
    setIsDetailsOpen(true);
    if (rooms.length === 0) {
      loadRooms();
    }
  }

  function closeDetailsView() {
    setIsDetailsOpen(false);
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

  const locationText = [listing.area, listing.county].filter(Boolean).join(", ");
  const landmarkText = listing.landmark || "Nearest landmark details will be shared by the landlord.";
  const paymentMethodText = listing.paymentMethod || "Contact the landlord for payment details.";

  return (
    <>
      <div
        className="cursor-pointer rounded-[24px] border border-[#D3DCE0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        onClick={openDetailsView}
      >
        <div className="h-36 bg-[#EEF2F4]">
          {listing.photos && listing.photos.length > 0 ? (
            <img src={listing.photos[0].url} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#8A9187]">No photo yet</div>
          )}
        </div>
        <div className="p-4">
          <p className="font-semibold text-[#142430]">{listing.title}</p>
          <p className="mt-1 text-sm text-gray-500">{locationText || landmarkText}</p>
          <p className="mt-2 text-sm text-gray-600">{listing.description}</p>
          <p className="mt-3 font-semibold text-[#142430]">
            KES {Number(listing.price).toLocaleString()}
            <span className="ml-1 text-xs font-normal text-gray-500">/month</span>
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleContact();
              }}
              disabled={contacting}
              className="flex-1 rounded-md bg-[#2568A8] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {contacting ? "..." : "Contact landlord"}
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleSaveToggle();
              }}
              disabled={saving}
              className="rounded-md border border-[#D3DCE0] px-3 py-2 text-xs"
              title={saved ? "Unsave" : "Save"}
            >
              {saved ? "♥" : "♡"}
            </button>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              openDetailsView();
            }}
            className="mt-3 text-xs font-semibold text-[#2568A8]"
          >
            View full details
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              handleReport();
            }}
            className="mt-2 text-xs text-gray-400 underline"
          >
            Report this listing
          </button>

          {message && <p className="mt-2 text-xs text-[#B4462F]">{message}</p>}
        </div>
      </div>

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-4 sm:px-6 sm:py-6"
          onClick={closeDetailsView}
        >
          <div
            className="mx-auto flex min-h-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-72 bg-[#EEF2F4] sm:h-80">
              {listing.photos && listing.photos.length > 0 ? (
                <img src={listing.photos[0].url} alt={listing.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[#8A9187]">No photo yet</div>
              )}
              <button
                onClick={closeDetailsView}
                className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-[#142430] shadow"
              >
                Close
              </button>
            </div>

            <div className="flex-1 px-6 py-6 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2568A8]">Hostel details</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#142430]">{listing.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {locationText && (
                      <span className="rounded-full border border-[#D3DCE0] bg-[#F9FBFC] px-3 py-1 text-sm text-[#142430]">
                        {locationText}
                      </span>
                    )}
                    {landmarkText && (
                      <span className="rounded-full border border-[#D3DCE0] bg-[#F9FBFC] px-3 py-1 text-sm text-[#142430]">
                        {landmarkText}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-base leading-7 text-gray-600">{listing.description || "More details about this hostel will be shared by the landlord."}</p>
                </div>

                <div className="rounded-[24px] border border-[#D3DCE0] bg-[#F9FBFC] p-5 shadow-sm lg:min-w-[280px]">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2568A8]">Rent</p>
                  <p className="mt-2 text-3xl font-semibold text-[#142430]">KES {Number(listing.price).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-gray-500">{listing.propertyType || "Hostel room"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleContact();
                      }}
                      disabled={contacting}
                      className="rounded-md bg-[#2568A8] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {contacting ? "Opening..." : "Contact via WhatsApp"}
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSaveToggle();
                      }}
                      disabled={saving}
                      className="rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                    >
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#142430]">Rooms</h3>
                  <button onClick={loadRooms} className="text-sm font-medium text-[#2568A8]">
                    Refresh rooms
                  </button>
                </div>

                {loadingRooms ? (
                  <div className="rounded-[20px] border border-dashed border-[#D3DCE0] bg-[#F9FBFC] p-6 text-center text-sm text-gray-500">
                    Loading rooms...
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#D3DCE0] bg-[#F9FBFC] p-6 text-center text-sm text-gray-500">
                    No room details have been posted yet.
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {rooms.map((room) => (
                      <div key={room.id} className="rounded-[20px] border border-[#D3DCE0] bg-[#F9FBFC] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#142430]">
                              {room.roomCode || room.roomNumber || "Room"} • {room.roomType}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Room {room.roomNumber || "—"} • {room.roomCode || "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#142430]">KES {Number(room.cost).toLocaleString()}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">{room.status}</p>
                          </div>
                        </div>
                        {room.details && <p className="mt-3 text-sm text-gray-600">{room.details}</p>}
                        {room.photos && room.photos.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {room.photos.map((photo) => (
                              <img key={photo.id} src={photo.url} alt={room.roomCode || "Room photo"} className="h-20 w-24 rounded-md object-cover" />
                            ))}
                          </div>
                        )}
                        {room.bookings && room.bookings.length > 0 && (
                          <div className="mt-3 rounded-lg border border-[#D3DCE0] bg-white p-3 text-sm text-[#142430]">
                            <p className="font-semibold">Booking update</p>
                            <p className="mt-1">Status: {room.bookings[0].status}</p>
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
                          <div className="mt-4 flex flex-col gap-2 rounded-[16px] border border-[#D3DCE0] bg-[#F9FBFC] p-4">
                            {!isLoggedIn ? (
                              <div className="text-sm font-medium text-[#B4462F]">Log in as a seeker to book this room</div>
                            ) : !isSeeker ? (
                              <div className="text-sm font-medium text-[#B4462F]">Only seekers can book rooms. Please create a seeker account.</div>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    if (activeBookingRoomId === room.id) {
                                      handleBookRoom(room.id);
                                    } else {
                                      toggleBookingForm(room.id);
                                    }
                                  }}
                                  disabled={bookingRoomId === room.id}
                                  className="rounded-md bg-[#2568A8] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                                >
                                  {bookingRoomId === room.id ? "Booking..." : activeBookingRoomId === room.id ? "Submit booking" : "Book this room"}
                                </button>
                                {activeBookingRoomId === room.id && (
                                  <div className="flex flex-col gap-2">
                                    <input
                                      value={bookingForms[room.id]?.fullName || ""}
                                      onChange={(event) => updateBookingForm(room.id, "fullName", event.target.value)}
                                      placeholder="Full name"
                                      className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                                    />
                                    <input
                                      value={bookingForms[room.id]?.phone || ""}
                                      onChange={(event) => updateBookingForm(room.id, "phone", event.target.value)}
                                      placeholder="Phone number"
                                      className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                                    />
                                    <textarea
                                      value={bookingForms[room.id]?.message || ""}
                                      onChange={(event) => updateBookingForm(room.id, "message", event.target.value)}
                                      rows={2}
                                      placeholder="Tell the landlord what you like about this room"
                                      className="w-full rounded-md border border-[#D3DCE0] px-3 py-2 text-sm"
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-gray-500">This room is currently {room.status.toLowerCase()}.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <footer className="border-t border-[#D3DCE0] bg-[#F9FBFC] px-6 py-5 sm:px-8 lg:px-10">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2568A8]">Landlord name</p>
                  <p className="mt-1 text-sm font-semibold text-[#142430]">{listing.landlord?.fullName || "Landlord"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2568A8]">Phone number</p>
                  <p className="mt-1 text-sm font-semibold text-[#142430]">{listing.landlord?.phone || "Contact via WhatsApp"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2568A8]">Payment method</p>
                  <p className="mt-1 text-sm font-semibold text-[#142430]">{paymentMethodText}</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
