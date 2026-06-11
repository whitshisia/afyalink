import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Fixed: Removed BrowserRouter/Router import
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
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BookAppointment from './pages/Appointments/BookAppointment';
import MyAppointments from './pages/Appointments/MyAppointments';
import MyRecords from './pages/MedicalRecords/MyRecords';
import MyPrescriptions from './pages/Prescriptions/MyPrescriptions';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import DemoPage from './pages/DemoPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
    initOfflineSync();
  }, []);

  return (
    <> {/* Fixed: Replaced <Router> with a clean React Fragment */}
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
        
        {/* Protected Routes */}
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
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
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
        <Route path="/records" element={
          <ProtectedRoute>
            <Layout><MyRecords /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <Layout><MyPrescriptions /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
