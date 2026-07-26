import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id, roomId } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (listing.landlordId !== authUser.id) {
    return NextResponse.json({ error: "You don't own this listing." }, { status: 403 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId }, include: { photos: true } });
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const { imageBase64 } = await req.json();
  if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
    return NextResponse.json({ error: "A valid image is required." }, { status: 400 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({
      error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.",
    }, { status: 500 });
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: "hostel-platform/rooms",
      transformation: [{ width: 1200, height: 900, crop: "limit" }, { quality: "auto" }],
    });

    const photo = await prisma.roomPhoto.create({
      data: { roomId, url: uploadResult.secure_url, sortOrder: room.photos.length },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Room photo upload failed." }, { status: 500 });
  }
}
