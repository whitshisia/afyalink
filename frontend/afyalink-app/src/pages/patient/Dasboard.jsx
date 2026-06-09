import { useAuthStore } from "../../store/authStore";
import { ShieldCheck, Calendar, FileText, Pill, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_ACTIONS = [
  { label: "Book Appointment", icon: Calendar, to: "/find-doctors", color: "bg-brand-50 text-brand-700" },
  { label: "My Records", icon: FileText, to: "/records", color: "bg-teal-100/60 text-teal-700" },
  { label: "Prescriptions", icon: Pill, to: "/prescriptions", color: "bg-amber-50 text-amber-700" },
  { label: "Health Summary", icon: Activity, to: "/health", color: "bg-purple-50 text-purple-700" },
];

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Good morning, {user?.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your health overview for today.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="card card-hover p-5 flex flex-col items-center gap-3 text-center"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <span className="text-sm font-semibold text-gray-800">{label}</span>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments placeholder */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-gray-900 mb-4">
          Upcoming Appointments
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar size={36} className="text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No upcoming appointments</p>
          <Link to="/find-doctors" className="btn btn-primary btn-md mt-4">
            Book your first consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
