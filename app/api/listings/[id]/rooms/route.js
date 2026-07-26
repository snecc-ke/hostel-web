import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

function buildRoomNumber(startValue, index) {
  const rawValue = String(startValue || "1").trim();
  const match = rawValue.match(/^([A-Za-z]+)(\d+)$/);

  if (match) {
    return `${match[1]}${Number(match[2]) + index}`;
  }

  if (/^\d+$/.test(rawValue)) {
    return String(Number(rawValue) + index);
  }

  return `${rawValue}${index + 1}`;
}

export async function GET(req, { params }) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      rooms: {
        include: {
          photos: true,
          bookings: {
            where: { status: { in: ["PENDING", "APPROVED", "OCCUPIED"] } },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ rooms: listing.rooms || [] });
}

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

  const body = await req.json();
  const roomType = (body.roomType || "STANDARD").trim();
  const cost = Number(body.cost);
  const details = (body.details || "").trim();
  const status = body.status || "AVAILABLE";

  if (!roomType || !cost || cost <= 0) {
    return NextResponse.json({ error: "A valid room type and cost are required." }, { status: 400 });
  }

  const useBatch = body.totalRooms || body.roomCount;
  if (useBatch) {
    const totalRooms = Number(body.totalRooms || body.roomCount);
    const startRoomNumber = body.startRoomNumber || body.roomNumberStart || body.roomNumber || "1";

    if (!Number.isFinite(totalRooms) || totalRooms <= 0 || totalRooms > 500) {
      return NextResponse.json({ error: "totalRooms must be between 1 and 500." }, { status: 400 });
    }
    if (!String(startRoomNumber).trim()) {
      return NextResponse.json({ error: "startRoomNumber is required." }, { status: 400 });
    }

    const createdRooms = [];
    for (let index = 0; index < totalRooms; index += 1) {
      const roomNumber = buildRoomNumber(startRoomNumber, index);
      const roomCode = body.roomCode ? `${String(body.roomCode).trim()}${index + 1}` : `R${roomNumber}`;
      const room = await prisma.room.create({
        data: {
          listingId: id,
          roomNumber,
          roomCode,
          roomType,
          cost,
          details: details || null,
          status,
        },
      });
      createdRooms.push(room);
    }

    return NextResponse.json({ createdRooms, count: createdRooms.length }, { status: 201 });
  }

  const room = await prisma.room.create({
    data: {
      listingId: id,
      roomNumber: body.roomNumber ? String(body.roomNumber).trim() : null,
      roomCode: body.roomCode ? String(body.roomCode).trim() : null,
      roomType,
      cost,
      details: details || null,
      status,
    },
  });

  return NextResponse.json({ room }, { status: 201 });
}
