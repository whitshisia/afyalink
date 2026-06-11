import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Shield,
  Award,
  MessageSquare,
  Star,
  FileText,
  Pill,
  Hospital,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('week');
  
  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    averageRating: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });

  // Chart Data
  const [revenueData, setRevenueData] = useState([]);
  const [appointmentTrends, setAppointmentTrends] = useState([]);
  
  // Lists
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        usersRes,
        appointmentsRes,
        doctorsRes,
        paymentsRes,
        reviewsRes
      ] = await Promise.all([
        api.get('/admin/users', { params: { limit: 100 } }),
        api.get('/admin/appointments', { params: { limit: 100 } }),
        api.get('/admin/doctors', { params: { limit: 100 } }),
        api.get('/admin/payments', { params: { limit: 100 } }),
        api.get('/admin/reviews', { params: { limit: 50 } })
      ]);

      const users = usersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const doctors = doctorsRes.data || [];
      const payments = paymentsRes.data || [];
      const allReviews = reviewsRes.data || [];

      // Calculate stats
      const patients = users.filter(u => u.role === 'patient');
      const activeUsers = users.filter(u => u.status === 'active');
      const newUsersThisMonth = users.filter(u => {
        const createdDate = new Date(u.created_at);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      });

      const completed = appointments.filter(a => a.status === 'completed');
      const cancelled = appointments.filter(a => a.status === 'cancelled');
      const pending = appointments.filter(a => a.status === 'pending');
      
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const avgRating = doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / (doctors.length || 1);

      setStats({
        totalUsers: users.length,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        completedAppointments: completed.length,
        cancelledAppointments: cancelled.length,
        pendingAppointments: pending.length,
        totalRevenue: totalRevenue,
        pendingPayments: pendingPayments,
        averageRating: Math.round(avgRating * 10) / 10,
        activeUsers: activeUsers.length,
        newUsersThisMonth: newUsersThisMonth.length
      });

      // Generate revenue data (mock - in production from API)
      setRevenueData([
        { day: 'Mon', revenue: 12500 },
        { day: 'Tue', revenue: 18200 },
        { day: 'Wed', revenue: 15400 },
        { day: 'Thu', revenue: 22100 },
        { day: 'Fri', revenue: 19800 },
        { day: 'Sat', revenue: 14300 },
        { day: 'Sun', revenue: 9800 }
      ]);

      // Appointment trends
      setAppointmentTrends([
        { month: 'Jan', appointments: 45 },
        { month: 'Feb', appointments: 52 },
        { month: 'Mar', appointments: 48 },
        { month: 'Apr', appointments: 61 },
        { month: 'May', appointments: 58 },
        { month: 'Jun', appointments: 72 }
      ]);

      // Recent users
      setRecentUsers(users.slice(0, 5));
      
      // Pending doctors (not verified)
      setPendingDoctors(doctors.filter(d => !d.is_verified).slice(0, 5));
      
      // Recent appointments
      setRecentAppointments(appointments.slice(0, 5));
      
      // Top doctors by rating
      setTopDoctors([...doctors].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5));
      
      // Recent reviews
      setReviews(allReviews.slice(0, 5));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set mock data for demo
      setStats({
        totalUsers: 1247,
        totalPatients: 982,
        totalDoctors: 245,
        totalAppointments: 3421,
        completedAppointments: 2856,
        cancelledAppointments: 312,
        pendingAppointments: 253,
        totalRevenue: 2845000,
        pendingPayments: 125000,
        averageRating: 4.8,
        activeUsers: 1098,
        newUsersThisMonth: 156
      });
      
      setRevenueData([
        { day: 'Mon', revenue: 12500 },
        { day: 'Tue', revenue: 18200 },
        { day: 'Wed', revenue: 15400 },
        { day: 'Thu', revenue: 22100 },
        { day: 'Fri', revenue: 19800 },
        { day: 'Sat', revenue: 14300 },
        { day: 'Sun', revenue: 9800 }
      ]);
      
      setRecentUsers([
        { id: 1, full_name: 'John Kamau', email: 'john@example.com', role: 'patient', status: 'active', created_at: new Date().toISOString() },
        { id: 2, full_name: 'Dr. Sarah Wanjiku', email: 'sarah@example.com', role: 'doctor', status: 'active', created_at: new Date().toISOString() }
      ]);
      
      setPendingDoctors([
        { id: 1, user: { full_name: 'Dr. Michael Otieno' }, license_number: 'MPCB/123/2024', created_at: new Date().toISOString() }
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/verify`);
      toast.success('Doctor verified successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await api.delete(`/admin/doctors/${doctorId}`);
      toast.success('Doctor application rejected');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to reject doctor');
    }
  };

  const handleExportData = async (type) => {
    try {
      const response = await api.get(`/admin/export/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      suspended: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      confirmed: 'bg-green-100 text-green-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Activity size={20} />, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { id: 'doctors', label: 'Doctors', icon: <Stethoscope size={20} />, path: '/admin/doctors' },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, path: '/admin/appointments' },
    { id: 'payments', label: 'Payments', icon: <DollarSign size={20} />, path: '/admin/payments' },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
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
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-semibold text-gray-900 text-sm">Admin Portal</p>
                  <p className="text-xs text-gray-500">{user?.full_name}</p>
                </div>
              </div>
            </div>

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
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-display text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-500 mt-1">Overview of platform performance and metrics</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => loadDashboardData()}
                    className="p-2 text-gray-500 hover:text-brand-600 transition"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button className="relative p-2 text-gray-500 hover:text-brand-600 transition">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Users size={20} className="text-brand-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{stats.newUsersThisMonth} this month
                  </span>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Total Users</div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-gray-500">👥 {stats.totalPatients} Patients</span>
                  <span className="text-gray-500">👨‍⚕️ {stats.totalDoctors} Doctors</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.totalAppointments.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Total Appointments</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-600">✓ {stats.completedAppointments}</span>
                  <span className="text-xs text-yellow-600">⏳ {stats.pendingAppointments}</span>
                  <span className="text-xs text-red-600">✗ {stats.cancelledAppointments}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">
                  KES {(stats.totalRevenue / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Revenue</div>
                <div className="text-xs text-amber-600 mt-1">Pending: KES {stats.pendingPayments.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Star size={20} className="text-purple-600" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="text-xs text-gray-500 mt-1">Average Doctor Rating</div>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12} className={i <= Math.floor(stats.averageRating) ? 'text-amber-500 fill-current' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-gray-900">Revenue Overview</h2>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div className="h-64">
                  <div className="flex items-end justify-between h-full gap-2">
                    {revenueData.map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                          style={{ height: `${(item.revenue / 25000) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appointment Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-gray-900">Appointment Trends</h2>
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <div className="space-y-3">
                  {appointmentTrends.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-10">{item.month}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 rounded-full flex items-center justify-end pr-2 text-xs text-white font-medium"
                          style={{ width: `${(item.appointments / 100) * 100}%` }}
                        >
                          {item.appointments > 50 && item.appointments}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10">{item.appointments}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Pending Doctor Verifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="font-display font-semibold text-gray-900">Pending Verifications</h2>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {pendingDoctors.length} pending
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {pendingDoctors.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No pending verifications</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingDoctors.map((doctor) => (
                        <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{doctor.user?.full_name}</p>
                            <p className="text-xs text-gray-500 mt-1">License: {doctor.license_number}</p>
                            <p className="text-xs text-gray-400">Joined: {new Date(doctor.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerifyDoctor(doctor.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleRejectDoctor(doctor.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Top Rated Doctors */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-display font-semibold text-gray-900">Top Rated Doctors</h2>
                </div>
                <div className="p-6">
                  {topDoctors.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No doctors found</p>
                  ) : (
                    <div className="space-y-4">
                      {topDoctors.map((doctor, idx) => (
                        <div key={doctor.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Dr. {doctor.user?.full_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-amber-500 fill-current" />
                                <span className="text-sm font-medium">{doctor.rating || 4.5}</span>
                              </div>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{doctor.specializations?.[0]?.name || 'General'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">KES {doctor.consultation_fee?.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{doctor.total_reviews || 0} reviews</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="font-display font-semibold text-gray-900">Recent Users</h2>
                    <Link to="/admin/users" className="text-sm text-brand-600 hover:text-brand-700">
                      View all →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {user.role === 'doctor' ? <Stethoscope size={18} className="text-gray-600" /> : <UserCheck size={18} className="text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="font-display font-semibold text-gray-900">Recent Appointments</h2>
                    <Link to="/admin/appointments" className="text-sm text-brand-600 hover:text-brand-700">
                      View all →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {appointment.doctor?.user?.full_name} with {appointment.patient?.user?.full_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(appointment.scheduled_time).toLocaleDateString()} at{' '}
                            {new Date(appointment.scheduled_time).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Export Data</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleExportData('users')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download size={16} />
                  Export Users
                </button>
                <button
                  onClick={() => handleExportData('appointments')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download size={16} />
                  Export Appointments
                </button>
                <button
                  onClick={() => handleExportData('payments')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download size={16} />
                  Export Payments
                </button>
                <button
                  onClick={() => handleExportData('doctors')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download size={16} />
                  Export Doctors
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;