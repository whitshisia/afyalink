import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Video, 
  MapPin,
  ArrowRight,
  User,
  FileText,
  Pill,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Star,
  Activity,
  Heart,
  Syringe,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalSpent: 0,
    totalEarnings: 0,
    totalPatients: 0,
    satisfactionRate: 98
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load appointments
      const appointments = await appointmentService.getAll();
      
      // Calculate stats based on user role
      const now = new Date();
      const upcoming = appointments.filter(apt => 
        new Date(apt.scheduled_time) > now && apt.status !== 'cancelled'
      );
      const completed = appointments.filter(apt => apt.status === 'completed');
      const cancelled = appointments.filter(apt => apt.status === 'cancelled');
      
      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming.length,
        completedAppointments: completed.length,
        cancelledAppointments: cancelled.length,
        totalSpent: 0, // Would come from payment API
        totalEarnings: 0, // Would come from payment API
        totalPatients: 0, // Would come from patient API
        satisfactionRate: 98
      });
      
      setUpcomingAppointments(upcoming.slice(0, 5));
      
      // Generate recent activity
      const activity = [];
      if (upcoming.length > 0) {
        activity.push({
          id: 1,
          type: 'appointment',
          title: 'Upcoming Appointment',
          description: `You have an appointment with Dr. ${upcoming[0]?.doctor?.user?.full_name || 'Doctor'} on ${new Date(upcoming[0]?.scheduled_time).toLocaleDateString()}`,
          time: new Date(upcoming[0]?.scheduled_time).toLocaleString(),
          icon: <Calendar size={16} />
        });
      }
      if (completed.length > 0) {
        activity.push({
          id: 2,
          type: 'completed',
          title: 'Appointment Completed',
          description: `Your consultation with Dr. ${completed[0]?.doctor?.user?.full_name || 'Doctor'} has been completed`,
          time: 'Recently',
          icon: <CheckCircle size={16} />
        });
      }
      setRecentActivity(activity);
      
      // Mock notifications
      setNotifications([
        {
          id: 1,
          title: 'Appointment Reminder',
          message: "You have an appointment tomorrow at 10:00 AM",
          time: '1 hour ago',
          read: false
        },
        {
          id: 2,
          title: 'Prescription Ready',
          message: "Your prescription has been filled and is ready for pickup",
          time: '2 hours ago',
          read: false
        }
      ]);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      in_progress: 'bg-purple-100 text-purple-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Activity size={20} />, path: '/dashboard' },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
    { id: 'records', label: 'Medical Records', icon: <FileText size={20} />, path: '/records' },
    { id: 'prescriptions', label: 'Prescriptions', icon: <Pill size={20} />, path: '/prescriptions' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/profile/change-password' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-gray-900 text-sm">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Welcome back to your health dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Calendar size={20} className="text-brand-600" />
                  </div>
                  <span className="text-xs text-gray-400">This month</span>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</div>
                <div className="text-xs text-gray-500 mt-1">Upcoming Appointments</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <CheckCircle size={20} className="text-teal-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.completedAppointments}</div>
                <div className="text-xs text-gray-500 mt-1">Completed Consultations</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Star size={20} className="text-purple-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.satisfactionRate}%</div>
                <div className="text-xs text-gray-500 mt-1">Satisfaction Rate</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <DollarSign size={20} className="text-amber-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">
                  {user?.role === 'doctor' ? 'KES ' + (stats.totalEarnings || 0).toLocaleString() : 'KES ' + (stats.totalSpent || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">{user?.role === 'doctor' ? 'Total Earnings' : 'Total Spent'}</div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Upcoming Appointments */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h2 className="font-display font-semibold text-gray-900">Upcoming Appointments</h2>
                      <Link to="/appointments" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        View all <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {upcomingAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No upcoming appointments</p>
                        <Link to="/appointments/book" className="text-sm text-brand-600 hover:text-brand-700 mt-2 inline-block">
                          Book your first appointment →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
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
                                    {appointment.appointment_type === 'video' ? <Video size={12} /> : <MapPin size={12} />}
                                    {appointment.appointment_type === 'video' ? 'Video Call' : 'In-Person'}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(appointment.scheduled_time).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    at {new Date(appointment.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              {appointment.video_meeting_link && appointment.status === 'confirmed' && (
                                <a
                                  href={appointment.video_meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700 transition"
                                >
                                  Join
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Link to="/appointments/book">
                    <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-5 text-white hover:shadow-lg transition">
                      <Calendar size={24} className="mb-2" />
                      <h3 className="font-display font-semibold">Book Appointment</h3>
                      <p className="text-sm opacity-90 mt-1">Schedule a consultation</p>
                    </div>
                  </Link>
                  <Link to="/records/upload">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-5 text-white hover:shadow-lg transition">
                      <FileText size={24} className="mb-2" />
                      <h3 className="font-display font-semibold">Upload Records</h3>
                      <p className="text-sm opacity-90 mt-1">Add medical documents</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Column - Activity & Notifications */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="font-display font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    ) : (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-600">
                              {activity.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h2 className="font-display font-semibold text-gray-900">Notifications</h2>
                      <Bell size={18} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No new notifications</p>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-3 rounded-lg ${!notification.read ? 'bg-brand-50' : ''}`}>
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart size={20} className="text-green-600" />
                    <h3 className="font-display font-semibold text-gray-900">Health Tip</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Stay hydrated! Drink at least 8 glasses of water daily for optimal health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;