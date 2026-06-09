import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck, Bell, LogOut, User, Menu, X, LayoutDashboard, Calendar, Stethoscope, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../api/authAPI";
import clsx from "clsx";

const NAV_PATIENT = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
  { label: "Find Doctors", to: "/find-doctors", Icon: Stethoscope },
  { label: "Appointments", to: "/appointments", Icon: Calendar },
  { label: "Records", to: "/records", Icon: FileText },
];
const NAV_DOCTOR = [
  { label: "Dashboard", to: "/provider", Icon: LayoutDashboard },
  { label: "Appointments", to: "/provider/appointments", Icon: Calendar },
  { label: "Patients", to: "/provider/patients", Icon: User },
];

export default function Navbar() {
  const { user, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = user?.role === "doctor" ? NAV_DOCTOR : NAV_PATIENT;

  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(refreshToken),
    onSettled: () => {
      logout();
      navigate("/login");
      toast.success("Signed out successfully");
    },
  });

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} strokeWidth={2.5} color="white" />
            </div>
            <span className="font-display text-lg font-bold text-gray-900 hidden sm:block">
              afya<span className="text-brand-600">link</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, to, Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === to
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold font-display">
                {user?.full_name?.charAt(0) ?? "U"}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {user?.full_name?.split(" ")[0]}
              </span>
            </div>

            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navItems.map(({ label, to, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                location.pathname === to
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
