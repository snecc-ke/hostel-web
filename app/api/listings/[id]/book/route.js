import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }
  if (authUser.role !== "SEEKER") {
    return NextResponse.json({ error: "Only seekers can book rooms." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const roomId = body.roomId;
  const fullName = (body.fullName || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!roomId) {
    return NextResponse.json({ error: "A room must be selected." }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Please enter your phone number." }, { status: 400 });
  }
  if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { listing: { include: { landlord: true } } },
  });
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  if (room.listingId !== id) {
    return NextResponse.json({ error: "Room does not belong to this listing." }, { status: 400 });
  }
  if (room.status !== "AVAILABLE") {
    return NextResponse.json({ error: "This room is no longer available." }, { status: 400 });
  }

  const existing = await prisma.booking.findFirst({
    where: { roomId, seekerId: authUser.id, status: { in: ["PENDING", "APPROVED"] } },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a pending or approved booking for this room." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      listingId: id,
      roomId,
      seekerId: authUser.id,
      fullName,
      phone,
      message: message || null,
      amountPaid: 0,
      amountDue: room.cost,
      status: "PENDING",
    },
  });

  await prisma.room.update({ where: { id: roomId }, data: { status: "BOOKED" } });

  try {
    await sendEmail({
      to: room.listing.landlord.email,
      subject: `New booking request for ${room.listing.title}`,
      text: `Hi ${room.listing.landlord.fullName},\n\nA new booking request was submitted for room ${room.roomNumber || room.roomCode || room.id} at ${room.listing.title}.\n\nGuest: ${fullName}\nPhone: ${phone}\nMessage: ${message || "No message provided."}\n\nPlease review the request in your dashboard.\n\nThanks,\nHostel Platform`,
    });
  } catch (err) {
    console.error("Failed to send booking notification to landlord:", err);
  }

  return NextResponse.json({ booking }, { status: 201 });
}
