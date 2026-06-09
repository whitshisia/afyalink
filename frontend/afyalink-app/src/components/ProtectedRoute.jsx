import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the right dashboard based on actual role
    const redirect = user?.role === "doctor" ? "/provider" : "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Outlet />;
  const redirect = user?.role === "doctor" ? "/provider" : "/dashboard";
  return <Navigate to={redirect} replace />;
}
