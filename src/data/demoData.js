export const demoHostels = [
  {
    id: 1,
    name: 'Green Valley Hostel',
    address: '123 University Road, Campus Area',
    city: 'Nairobi',
    price: 250,
    rating: 4.5,
    reviewCount: 128,
    rooms: 20,
    available: 8,
    status: 'verified',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    amenities: ['Free WiFi', 'Parking', 'Kitchen', 'Security', 'Laundry'],
    roomTypes: [
      { type: 'Single', price: 250, capacity: 1 },
      { type: 'Double', price: 180, capacity: 2 },
      { type: 'Triple', price: 120, capacity: 3 },
    ],
    description: 'A modern hostel located near the university, offering comfortable rooms and excellent amenities for students.',
  },
  {
    id: 2,
    name: 'Sunrise Hostel',
    address: '456 College Street, Downtown',
    city: 'Nairobi',
    price: 200,
    rating: 4.2,
    reviewCount: 95,
    rooms: 15,
    available: 5,
    status: 'verified',
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['Free WiFi', 'Kitchen', 'Security'],
    roomTypes: [
      { type: 'Single', price: 200, capacity: 1 },
      { type: 'Double', price: 150, capacity: 2 },
    ],
    description: 'Affordable and clean accommodation in the heart of the city, close to public transport.',
  },
  {
    id: 3,
    name: 'Lakeview Residency',
    address: '789 Lake Drive, North Side',
    city: 'Nairobi',
    price: 350,
    rating: 4.8,
    reviewCount: 210,
    rooms: 10,
    available: 10,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['Free WiFi', 'Parking', 'Gym', 'Security', 'Laundry', 'Kitchen'],
    roomTypes: [
      { type: 'Single', price: 350, capacity: 1 },
      { type: 'Studio', price: 450, capacity: 1 },
    ],
    description: 'Premium student accommodation with lake views and modern facilities.',
  },
];

export const demoBookings = [
  { id: 1, student: 'John Doe', hostel: 'Green Valley', room: 'A-101', checkIn: '2026-10-01', checkOut: '2026-12-31', amount: 750, status: 'pending' },
  { id: 2, student: 'Jane Smith', hostel: 'Sunrise Hostel', room: 'B-205', checkIn: '2026-09-15', checkOut: '2026-12-15', amount: 600, status: 'confirmed' },
  { id: 3, student: 'Mike Johnson', hostel: 'Green Valley', room: 'A-102', checkIn: '2026-10-05', checkOut: '2027-01-05', amount: 750, status: 'confirmed' },
  { id: 4, student: 'Sarah Williams', hostel: 'Lakeview', room: 'C-301', checkIn: '2026-09-20', checkOut: '2026-12-20', amount: 1050, status: 'cancelled' },
];

export const demoMessages = [
  { id: 1, sender: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', message: 'Hi, is the room still available?', time: '10:30 AM', unread: true },
  { id: 2, sender: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2', message: 'When can I schedule a viewing?', time: 'Yesterday', unread: false },
  { id: 3, sender: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3', message: 'Thank you for the quick response!', time: '2 days ago', unread: false },
];

export const demoStats = {
  landlord: {
    totalHostels: 3,
    totalRooms: 45,
    occupancyRate: 78,
    monthlyEarnings: 12500,
    pendingBookings: 5,
    totalStudents: 35,
  },
  student: {
    activeBookings: 1,
    savedHostels: 8,
    unreadMessages: 3,
    totalSpent: 2400,
  },
  admin: {
    totalUsers: 1250,
    totalHostels: 45,
    pendingVerifications: 8,
    openDisputes: 3,
    monthlyRevenue: 45000,
  },
};