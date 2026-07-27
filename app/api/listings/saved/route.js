import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/listings/saved — seeker's saved listings
export async function GET(req) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "SEEKER") {
    return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  }

  const saved = await prisma.savedListing.findMany({
    where: { seekerId: authUser.id },
    include: {
      listing: {
        include: {
          photos: true,
          landlord: { select: { fullName: true, phone: true } },
        },
      },
    },
  });

  return NextResponse.json({ saved: saved.map((s) => s.listing) });
}
