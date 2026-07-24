import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/admin/listings — pending listings, admin only
export async function GET(req) {
  const authUser = getUserFromRequest(req);

  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const listings = await prisma.listing.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { landlord: { select: { fullName: true, phone: true, email: true } } },
  });

  return NextResponse.json({ listings });
}
