import { useAuthStore } from "../../store/authStore";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

const STAT_CARDS = [
  { label: "Appointments Today", value: "—", Icon: Calendar, color: "text-brand-600 bg-brand-50" },
  { label: "Total Patients", value: "—", Icon: Users, color: "text-teal-600 bg-teal-100/50" },
  { label: "Consultations", value: "—", Icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  { label: "Revenue (KES)", value: "—", Icon: DollarSign, color: "text-amber-600 bg-amber-50" },
];

export default function ProviderDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Good morning, {user?.full_name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your patients today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <div className="font-display text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-gray-900 mb-4">Today's Appointments</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar size={36} className="text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No appointments scheduled yet</p>
          <p className="text-xs text-gray-400 mt-1">Complete your doctor profile to start receiving bookings</p>
        </div>
      </div>
    </div>
  );
}
