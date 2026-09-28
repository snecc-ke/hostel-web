import { demoHostels } from './demoData';

const ROOM_TYPE_PREFIX = {
  'Single Room': 'S',
  Bedsitter: 'BS',
};

/**
 * Auto-generate individual rooms from each hostel's roomTypes.
 * Room names: <prefix>-<100 + i + 1>
 * First N rooms (per type) are marked occupied.
 */
export function generateDemoRooms() {
  const rooms = [];
  let globalId = 1;

  demoHostels.forEach((hostel) => {
    const types = hostel.roomTypes || [];
    types.forEach((rt) => {
      const total = rt.count ?? 10;
      const occupied = rt.occupied ?? 0;
      const prefix = ROOM_TYPE_PREFIX[rt.type] || 'R';

      for (let i = 0; i < total; i++) {
        const isOccupied = i < occupied;
        rooms.push({
          id: globalId++,
          name: `${prefix}-${100 + i + 1}`,
          hostelId: hostel.id,
          hostelName: hostel.name,
          type: rt.type,
          capacity: rt.capacity || 1,
          price: rt.price,
          status: isOccupied ? 'occupied' : 'vacant',
        });
      }
    });
  });

  return rooms;
}

export const demoRooms = generateDemoRooms();