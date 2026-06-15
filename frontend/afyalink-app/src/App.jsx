import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { initOfflineSync } from './services/offlineSync';
import Layout from './components/Layout/Layout';
import PWAInstallPrompt from './components/Common/PWAInstallPrompt';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import ProviderDashboard from './pages/Dashboard/ProviderDashboard';
// import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BookAppointment from './pages/Appointments/BookAppointment';
import MyAppointments from './pages/Appointments/MyAppointments';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import MyRecords from './pages/MedicalRecords/MyRecords';
import UploadRecord from './pages/MedicalRecords/UploadRecord';
import ShareRecord from './pages/MedicalRecords/ShareRecord';
import MyPrescriptions from './pages/Prescriptions/MyPrescriptions';
import RequestRefill from './pages/Prescriptions/RequestRefill';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import DemoPage from './pages/DemoPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ProvidersPage from './pages/ProvidersPage';
import CookiesPage from './pages/CookiesPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ChangePassword from './pages/Profile/ChangePassword';
import NotificationSettings from './pages/Profile/NotificationSettings';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
    initOfflineSync();
  }, []);

  return (
    <>
      <PWAInstallPrompt />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
        <Route path="/register" element={<Navigate to="/signup" replace />} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        <Route path="/demo" element={<Layout><DemoPage /></Layout>} />
        <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
        <Route path="/providers" element={<Layout><ProvidersPage /></Layout>} />
        <Route path="/cookies" element={<Layout><CookiesPage /></Layout>} />
        <Route path="/careers" element={<Layout><CareersPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Layout><PatientDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/provider/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Layout><ProviderDashboard /></Layout>
          </ProtectedRoute>
        } />
        {/* <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } /> */}
        
        {/* Appointment Routes */}
        <Route path="/appointments/book" element={
          <ProtectedRoute>
            <Layout><BookAppointment /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout><MyAppointments /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/appointments/:id" element={
          <ProtectedRoute>
            <Layout><AppointmentDetails /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Medical Records Routes */}
        <Route path="/records" element={
          <ProtectedRoute>
            <Layout><MyRecords /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/records/upload" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <Layout><UploadRecord /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/records/share/:id" element={
          <ProtectedRoute>
            <Layout><ShareRecord /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Prescription Routes */}
        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <Layout><MyPrescriptions /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/prescriptions/refill/:id" element={
          <ProtectedRoute>
            <Layout><RequestRefill /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Profile Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ProfileSettings /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile/change-password" element={
          <ProtectedRoute>
            <Layout><ChangePassword /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile/notifications" element={
          <ProtectedRoute>
            <Layout><NotificationSettings /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;