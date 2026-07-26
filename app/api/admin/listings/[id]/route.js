import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { action, rejectionReason } = await req.json();
  const { id } = params;

  if (!id) return NextResponse.json({ error: "Missing listing id" }, { status: 400 });

  try {
    if (action === "approve") {
      const listing = await prisma.listing.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedById: authUser.id,
          reviewedAt: new Date(),
        },
        include: { landlord: true },
      });
      // Notify landlord
      try {
        await sendEmail({
          to: listing.landlord.email,
          subject: `Your listing \"${listing.title}\" was approved`,
          text: `Hi ${listing.landlord.fullName},\n\nYour listing \"${listing.title}\" has been approved and is now visible on Hostel Platform.\n\nThanks,\nHostel Platform`,
        });
      } catch (err) {
        console.error("Failed sending approval email:", err);
      }
      return NextResponse.json({ listing });
    }

    if (action === "reject") {
      const listing = await prisma.listing.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason || null,
          reviewedById: authUser.id,
          reviewedAt: new Date(),
        },
        include: { landlord: true },
      });
      // Notify landlord
      try {
        await sendEmail({
          to: listing.landlord.email,
          subject: `Your listing \"${listing.title}\" was rejected`,
          text: `Hi ${listing.landlord.fullName},\n\nYour listing \"${listing.title}\" was rejected. Reason: ${rejectionReason || "Not specified"}.\n\nIf you believe this was a mistake contact support.\n\nThanks,\nHostel Platform`,
        });
      } catch (err) {
        console.error("Failed sending rejection email:", err);
      }
      return NextResponse.json({ listing });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update listing" }, { status: 500 });
  }
}
