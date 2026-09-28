import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';
import LandlordLayout from './layouts/LandlordLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import SearchPage from './pages/public/SearchPage';
import HostelDetailPage from './pages/public/HostelDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Tenant Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyBookings from './pages/student/MyBookings';
import StudentMessages from './pages/student/Messages';
import StudentPayments from './pages/student/Payments';
import SavedHostels from './pages/student/SavedHostels';
import MyReviews from './pages/student/MyReviews';
import StudentSettings from './pages/student/StudentSettings';

// Landlord Pages
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import MyHostels from './pages/landlord/MyHostels';
import EditHostel from './pages/landlord/EditHostel';
import AddHostel from './pages/landlord/AddHostel';
import Rooms from './pages/landlord/Rooms';
import HostelDetail from './pages/landlord/HostelDetail';
import Bookings from './pages/landlord/Bookings';
import LandlordMessages from './pages/landlord/Messages';
import LandlordPayments from './pages/landlord/Payments';
import Reviews from './pages/landlord/Reviews';
import Analytics from './pages/landlord/Analytics';
import LandlordSettings from './pages/landlord/LandlordSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Verifications from './pages/admin/Verifications';
import Users from './pages/admin/Users';
import AdminBookings from './pages/admin/AdminBookings';
import Disputes from './pages/admin/Disputes';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/hostels/:id" element={<HostelDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            </Route>

            {/* Tenant Routes (protected) */}
            <Route
              path="/tenant"
              element={
                <ProtectedRoute role="tenant">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/tenant/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="messages" element={<StudentMessages />} />
              <Route path="payments" element={<StudentPayments />} />
              <Route path="saved" element={<SavedHostels />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Landlord Routes (protected) */}
            <Route
              path="/landlord"
              element={
                <ProtectedRoute role="landlord">
                  <LandlordLayout />
                </ProtectedRoute>
              }
            > 
              <Route path="hostels/:id/edit" element={<EditHostel />} />   
              <Route index element={<Navigate to="/landlord/dashboard" replace />} />
              <Route path="hostels/:id" element={<HostelDetail />} />
              <Route path="dashboard" element={<LandlordDashboard />} />
              <Route path="hostels" element={<MyHostels />} />
              <Route path="hostels/new" element={<AddHostel />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="messages" element={<LandlordMessages />} />
              <Route path="payments" element={<LandlordPayments />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<LandlordSettings />} />
            </Route>

            {/* Admin Routes (protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="verifications" element={<Verifications />} />
              <Route path="users" element={<Users />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="disputes" element={<Disputes />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;