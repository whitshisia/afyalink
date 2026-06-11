import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Users, TrendingUp, DollarSign, Clock, Video, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user } = useAuthStore();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    weeklyConsultations: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const appointments = await appointmentService.getAll();
      
      // Get today's appointments
      const today = new Date().toDateString();
      const todayApps = appointments.filter(apt => 
        new Date(apt.scheduled_time).toDateString() === today &&
        apt.status !== 'cancelled'
      );
      
      setTodayAppointments(todayApps.slice(0, 5));
      setStats({
        totalPatients: 0, // Would need separate API call
        todayAppointments: todayApps.length,
        weeklyConsultations: appointments.filter(apt => apt.status === 'completed').length,
        revenue: 0 // Would need payment integration
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Dr. {user?.full_name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600 mb-3">
            <Calendar size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.todayAppointments}</div>
          <div className="text-xs text-gray-500 mt-0.5">Appointments Today</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-100/50 text-teal-600 mb-3">
            <Users size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Patients</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 mb-3">
            <CheckCircle size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.weeklyConsultations}</div>
          <div className="text-xs text-gray-500 mt-0.5">Consultations</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600 mb-3">
            <DollarSign size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">KES {stats.revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-0.5">Revenue (KES)</div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-gray-900 mb-4">Today's Appointments</h2>
        
        {todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar size={36} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No appointments scheduled for today</p>
            <p className="text-xs text-gray-400 mt-1">Check back later for new bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {appointment.patient?.user?.full_name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-900">
                      {appointment.patient?.user?.full_name || 'Patient'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {appointment.appointment_type === 'video' ? <Video size={14} /> : <MapPin size={14} />}
                        {appointment.appointment_type === 'video' ? 'Video Call' : 'In-Person'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(appointment.scheduled_time).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  {appointment.video_meeting_link && appointment.status === 'confirmed' && (
                    <a
                      href={appointment.video_meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition"
                    >
                      Start Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link to="/appointments">
          <div className="card p-4 text-center hover:shadow-md transition">
            <Calendar size={24} className="text-brand-600 mx-auto mb-2" />
            <h3 className="font-display font-semibold text-gray-900 text-sm">Manage Schedule</h3>
            <p className="text-xs text-gray-500 mt-1">View all appointments</p>
          </div>
        </Link>
        <Link to="/patients">
          <div className="card p-4 text-center hover:shadow-md transition">
            <Users size={24} className="text-brand-600 mx-auto mb-2" />
            <h3 className="font-display font-semibold text-gray-900 text-sm">Patient List</h3>
            <p className="text-xs text-gray-500 mt-1">View your patients</p>
          </div>
        </Link>
        <Link to="/profile/settings">
          <div className="card p-4 text-center hover:shadow-md transition">
            <svg className="text-brand-600 mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <h3 className="font-display font-semibold text-gray-900 text-sm">Settings</h3>
            <p className="text-xs text-gray-500 mt-1">Update your profile</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProviderDashboard;