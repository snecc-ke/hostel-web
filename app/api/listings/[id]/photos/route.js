import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const MAX_PHOTOS_PER_LISTING = 6;

// POST /api/listings/:id/photos — landlord uploads a photo for their own listing
export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (listing.landlordId !== authUser.id) {
    return NextResponse.json({ error: "You don't own this listing." }, { status: 403 });
  }
  if (listing.photos.length >= MAX_PHOTOS_PER_LISTING) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PHOTOS_PER_LISTING} photos per listing.` },
      { status: 400 }
    );
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
      folder: "hostel-platform/listings",
      transformation: [{ width: 1200, height: 900, crop: "limit" }, { quality: "auto" }],
    });

    const photo = await prisma.photo.create({
      data: {
        listingId: id,
        url: uploadResult.secure_url,
        sortOrder: listing.photos.length,
      },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Photo upload failed." }, { status: 500 });
  }
}

// DELETE /api/listings/:id/photos?photoId=xxx — remove a photo
export async function DELETE(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const photoId = searchParams.get("photoId");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.landlordId !== authUser.id) {
    return NextResponse.json({ error: "You don't own this listing." }, { status: 403 });
  }

  await prisma.photo.deleteMany({ where: { id: photoId, listingId: id } });
  return NextResponse.json({ success: true });
}
