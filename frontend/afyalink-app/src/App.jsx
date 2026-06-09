import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "../src/components/ProtectedRoute";
import AppLayout from "../src/components/AppLayout";

import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";

import PatientDashboard from "../src/pages/patient/Dasboard";
import ProviderDashboard from "../src/pages/provider/Dasboard";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <div className="text-6xl font-display font-bold text-gray-200 mb-4">
          404
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6">
          This page doesn't exist or has moved.
        </p>
        <a href="/" className="btn btn-primary btn-md">
          Go home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ✅ Public Home */}
      <Route path="/" element={<Home />} />

      {/* ✅ Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ✅ Patient Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["patient", "admin"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route
            path="/find-doctors"
            element={
              <div className="p-8 text-center text-gray-500">
                Find Doctors — Day 3
              </div>
            }
          />
          <Route
            path="/appointments"
            element={
              <div className="p-8 text-center text-gray-500">
                Appointments — Day 4
              </div>
            }
          />
          <Route
            path="/records"
            element={
              <div className="p-8 text-center text-gray-500">
                Health Records — Day 6
              </div>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <div className="p-8 text-center text-gray-500">
                Prescriptions — Day 9
              </div>
            }
          />
          <Route
            path="/health"
            element={
              <div className="p-8 text-center text-gray-500">
                Health Summary — Day 10
              </div>
            }
          />
        </Route>
      </Route>

      {/* ✅ Provider Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["doctor", "admin"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route
            path="/provider/appointments"
            element={
              <div className="p-8 text-center text-gray-500">
                Appointments — Day 5
              </div>
            }
          />
          <Route
            path="/provider/patients"
            element={
              <div className="p-8 text-center text-gray-500">
                Patients — Day 5
              </div>
            }
          />
        </Route>
      </Route>

      {/* ✅ Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AppLayout />}>
          <Route
            path="/admin"
            element={
              <div className="p-8 text-center text-gray-500">
                Admin — Day 11
              </div>
            }
          />
        </Route>
      </Route>

      {/* ❌ 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}