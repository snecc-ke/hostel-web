import { prisma } from "@/lib/prisma";

export function getListingAvailabilityState(rooms = []) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "AVAILABLE").length;

  return {
    totalRooms,
    availableRooms,
    isFullyBooked: totalRooms > 0 && availableRooms === 0,
  };
}

export async function syncListingAvailability(listingId) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { rooms: true },
  });

  if (!listing) return null;

  const { isFullyBooked } = getListingAvailabilityState(listing.rooms || []);

  if (listing.status === "PENDING" || listing.status === "REJECTED") {
    return listing;
  }

  const nextStatus = isFullyBooked ? "TAKEN" : "APPROVED";

  if (listing.status === nextStatus) {
    return listing;
  }

  return prisma.listing.update({
    where: { id: listingId },
    data: { status: nextStatus },
  });
}
