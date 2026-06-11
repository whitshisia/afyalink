import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, Video, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [appointments, doctors] = await Promise.all([
        appointmentService.getAll(),
        doctorService.getAll({ limit: 3 })
      ]);
      
      const upcoming = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
      const completed = appointments.filter(apt => apt.status === 'completed');
      
      setUpcomingAppointments(upcoming.slice(0, 5));
      setRecentDoctors(doctors);
      setStats({
        totalAppointments: appointments.length,
        completedAppointments: completed.length,
        upcomingAppointments: upcoming.length,
        totalSpent: 0 // Calculate from payments
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

  const getAppointmentTypeIcon = (type) => {
    return type === 'video' ? <Video size={16} /> : <MapPin size={16} />;
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
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your health today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600 mb-3">
            <Calendar size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</div>
          <div className="text-xs text-gray-500 mt-0.5">Upcoming Appointments</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-100/50 text-teal-600 mb-3">
            <Users size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Appointments</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 mb-3">
            <CheckCircle size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{stats.completedAppointments}</div>
          <div className="text-xs text-gray-500 mt-0.5">Completed Consultations</div>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600 mb-3">
            <DollarSign size={20} />
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">KES {stats.totalSpent.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Spent</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link to="/appointments/book">
          <div className="card p-6 text-center hover:shadow-lg transition-all group">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-600 transition-colors">
              <Calendar className="text-brand-600 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="font-display font-semibold text-gray-900 mb-2">Book New Appointment</h3>
            <p className="text-sm text-gray-500">Schedule a consultation with top doctors</p>
          </div>
        </Link>
        <Link to="/records">
          <div className="card p-6 text-center hover:shadow-lg transition-all group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
              <svg className="text-blue-600 group-hover:text-white transition-colors" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 className="font-display font-semibold text-gray-900 mb-2">Medical Records</h3>
            <p className="text-sm text-gray-500">Access your health history and lab results</p>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-semibold text-gray-900">Upcoming Appointments</h2>
          <Link to="/appointments" className="text-sm text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar size={36} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No upcoming appointments</p>
            <Link to="/appointments/book" className="text-sm text-brand-600 hover:text-brand-700 mt-2">
              Book your first appointment →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                    {appointment.doctor?.user?.full_name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-900">
                      Dr. {appointment.doctor?.user?.full_name || 'Doctor'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {getAppointmentTypeIcon(appointment.appointment_type)}
                        {appointment.appointment_type === 'video' ? 'Video Call' : 'In-Person'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(appointment.scheduled_time).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        at {new Date(appointment.scheduled_time).toLocaleTimeString('en-US', { 
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
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Doctors */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-semibold text-gray-900">Recommended Doctors</h2>
          <Link to="/doctors" className="text-sm text-brand-600 hover:text-brand-700">
            View all doctors →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recentDoctors.map((doctor) => (
            <div key={doctor.id} className="card p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                  {doctor.user?.full_name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-900">Dr. {doctor.user?.full_name}</h4>
                  <p className="text-xs text-gray-500">{doctor.specializations?.[0]?.name || 'General Physician'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">⭐ {doctor.rating || 4.5}</span>
                <span className="text-gray-500">KES {doctor.consultation_fee?.toLocaleString() || 2500}</span>
              </div>
              <Link
                to={`/appointments/book?doctor=${doctor.id}`}
                className="block text-center py-2 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition text-sm font-medium"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;