import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { syncListingAvailability } from "@/lib/listingAvailability";

export async function PATCH(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const { id } = params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (authUser.role === "LANDLORD") {
    const listing = await prisma.listing.findUnique({ where: { id: booking.listingId } });
    if (!listing || listing.landlordId !== authUser.id) {
      return NextResponse.json({ error: "You do not manage this booking." }, { status: 403 });
    }
  } else if (booking.seekerId !== authUser.id) {
    return NextResponse.json({ error: "You do not own this booking." }, { status: 403 });
  }

  const body = await req.json();
  const status = body.status;
  const amountPaid = body.amountPaid !== undefined ? Number(body.amountPaid) : undefined;
  const amountDue = body.amountDue !== undefined ? Number(body.amountDue) : undefined;
  const validStatuses = ["PENDING", "APPROVED", "REJECTED", "OCCUPIED"];

  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: `status must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
  }

  const data = { status };
  if (status === "APPROVED") {
    data.room = { update: { status: "BOOKED" } };
  }
  if (status === "REJECTED") {
    data.room = { update: { status: "AVAILABLE" } };
  }
  if (status === "OCCUPIED") {
    data.room = { update: { status: "OCCUPIED" } };
    if (amountPaid !== undefined) data.amountPaid = amountPaid;
    if (amountDue !== undefined) data.amountDue = amountDue;
  }

  const updated = await prisma.booking.update({
    where: { id },
    data,
    include: { seeker: true, room: true },
  });

  if (updated.room?.listingId) {
    await syncListingAvailability(updated.room.listingId);
  }

  if (updated.seeker?.email) {
    let subject = "Booking update";
    let text = `Hi ${updated.seeker.fullName},\n\nYour booking status was updated to ${updated.status}.`;

    if (updated.status === "APPROVED") {
      subject = "Your booking has been approved";
      text = `Hi ${updated.seeker.fullName},\n\nYour booking request has been approved. The room is now reserved for you.`;
    }
    if (updated.status === "REJECTED") {
      subject = "Your booking has been rejected";
      text = `Hi ${updated.seeker.fullName},\n\nYour booking request has been rejected. Please check other rooms or contact the landlord for more details.`;
    }
    if (updated.status === "OCCUPIED") {
      subject = "Your booking has been marked occupied";
      text = `Hi ${updated.seeker.fullName},\n\nYour booking is now marked as occupied. Total paid: KES ${updated.amountPaid ?? 0}. Amount due: KES ${updated.amountDue ?? 0}.`;
    }

    try {
      await sendEmail({
        to: updated.seeker.email,
        subject,
        text,
      });
    } catch (err) {
      console.error("Failed sending booking status email:", err);
    }
  }

  return NextResponse.json({ booking: updated });
}
