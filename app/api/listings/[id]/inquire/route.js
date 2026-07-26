import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

function toInternationalKenyanFormat(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "SEEKER") {
    return NextResponse.json(
      { error: "Create a free account to contact landlords." },
      { status: 403 }
    );
  }

  const limit = rateLimit(`inquire:${authUser.id}`, { max: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many inquiries sent. Try again later." },
      { status: 429 }
    );
  }

  const { id } = await params;
  const { message } = await req.json();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { landlord: { select: { phone: true, fullName: true } } },
  });

  if (!listing || listing.status !== "APPROVED") {
    return NextResponse.json({ error: "Listing not available." }, { status: 404 });
  }

  await prisma.inquiry.create({
    data: {
      listingId: id,
      seekerId: authUser.id,
      message: message || `Hi, I'm interested in ${listing.title}`,
    },
  });

  const waText = encodeURIComponent(
    message || `Hi, I'm interested in your listing: ${listing.title}`
  );
  const phoneDigits = toInternationalKenyanFormat(listing.landlord.phone);
  const whatsappLink = `https://wa.me/${phoneDigits}?text=${waText}`;

  return NextResponse.json({ whatsappLink });
}
