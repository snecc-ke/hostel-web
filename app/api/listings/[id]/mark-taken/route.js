import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { syncListingAvailability } from "@/lib/listingAvailability";

// POST /api/listings/:id/mark-taken — landlord marks their own listing as no longer available
export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (listing.landlordId !== authUser.id) {
    return NextResponse.json({ error: "You don't own this listing." }, { status: 403 });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: "TAKEN" },
  });

  return NextResponse.json({ listing: updated });
}
