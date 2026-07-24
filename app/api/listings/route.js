import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { validateListingInput } from "@/lib/validate";

const MAX_PENDING_PER_LANDLORD = 10;

function buildRegistrationDescription(body) {
  const details = [];
  if (body.hostelName) details.push(`Hostel name: ${body.hostelName}`);
  if (body.roomCount) details.push(`Number of rooms: ${body.roomCount}`);
  if (body.roomTypes) details.push(`Room types: ${body.roomTypes}`);
  if (body.roomCharges) details.push(`Room charges: ${body.roomCharges}`);
  if (body.description) details.push(`Additional details: ${body.description}`);
  return details.join("\n");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county");
  const propertyType = searchParams.get("type");

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

  const where = {
    status: "APPROVED",
    ...(county ? { county: { equals: county, mode: "insensitive" } } : {}),
    ...(propertyType ? { propertyType } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { photos: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req) {
  const authUser = getUserFromRequest(req);

  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }
  if (authUser.role !== "LANDLORD") {
    return NextResponse.json(
      { error: "Only landlord accounts can submit listings." },
      { status: 403 }
    );
  }

  const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (dbUser?.accountStatus === "PENDING") {
    return NextResponse.json(
      { error: "Your landlord account is awaiting admin approval before you can list properties." },
      { status: 403 }
    );
  }
  if (dbUser?.accountStatus === "SUSPENDED") {
    return NextResponse.json(
      { error: "Your account has been suspended." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const validationErrors = validateListingInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(" ") }, { status: 400 });
    }

    const pendingCount = await prisma.listing.count({
      where: { landlordId: authUser.id, status: "PENDING" },
    });
    if (pendingCount >= MAX_PENDING_PER_LANDLORD) {
      return NextResponse.json(
        {
          error: `You have ${pendingCount} listings awaiting review already. Wait for those to be reviewed before submitting more.`,
        },
        { status: 429 }
      );
    }

    const title = (body.hostelName || body.title || "").trim();
    const description = buildRegistrationDescription(body);
    const propertyType = body.propertyType || "HOSTEL_ROOM";
    const price = Number(body.price);
    const county = (body.county || "").trim();
    const area = (body.area || "").trim();
    const landmark = (body.landmark || "").trim();

    const listing = await prisma.listing.create({
      data: {
        landlordId: authUser.id,
        title,
        description,
        propertyType,
        price,
        county,
        area,
        landmark: landmark || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      listing,
      reviewNotice: "Thank you for registering your hostel. Your registration is under review and you will receive an approval or rejection email within 1–7 days.",
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong creating the listing." },
      { status: 500 }
    );
  }
}
