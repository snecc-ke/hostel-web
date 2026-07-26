import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const authUser = getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: authUser.role === "LANDLORD" ? { listing: { landlordId: authUser.id } } : { seekerId: authUser.id },
    include: {
      room: true,
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
