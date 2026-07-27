import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/listings/mine — landlord's own listings, any status
export async function GET(req) {
  const authUser = getUserFromRequest(req);

  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const listings = await prisma.listing.findMany({
    where: { landlordId: authUser.id },
    orderBy: { createdAt: "desc" },
    include: { photos: true },
  });

  return NextResponse.json({ listings });
}
