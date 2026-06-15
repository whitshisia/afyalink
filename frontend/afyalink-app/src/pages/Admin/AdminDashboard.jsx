import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserX, Calendar, DollarSign, Star,
  TrendingUp, Activity, Clock, CheckCircle, XCircle,
  Shield, LogOut, Menu, X, Search, Filter, Eye,
  Check, AlertCircle, MoreVertical, Download, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    checkAdminAuth();
    loadDashboardData();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('admin_access_token');
    const role = localStorage.getItem('user_role');
    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/doctors/pending'),
        api.get('/admin/doctors/all'),
        api.get('/admin/patients/all'),
        api.get('/admin/appointments/all')
      ]);

      setStats(statsRes.data);
      setPendingDoctors(pendingRes.data.doctors || []);
      setAllDoctors(doctorsRes.data.doctors || []);
      setAllPatients(patientsRes.data.patients || []);
      setAppointments(appointmentsRes.data.appointments || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ============ Doctor Management Functions ============
  
  const handleApproveDoctor = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to approve Dr. ${doctorName}?`)) {
      return;
    }
    
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      toast.success(`Dr. ${doctorName} has been approved successfully!`);
      loadDashboardData();
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId, doctorName) => {
    const reason = prompt(`Please provide a reason for rejecting Dr. ${doctorName}:`);
    if (!reason) return;
    
    if (!window.confirm(`Are you sure you want to reject Dr. ${doctorName}?`)) {
      return;
    }
    
    try {
      await api.put(`/admin/doctors/${doctorId}/reject`, null, { params: { reason } });
      toast.success(`Dr. ${doctorName} has been rejected`);
      loadDashboardData();
    } catch (error) {
      console.error('Rejection failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to reject doctor');
    }
  };

  const handleSuspendDoctor = async (doctorId, doctorName) => {
    const reason = prompt(`Reason for suspending Dr. ${doctorName}:`);
    if (!reason) return;
    
    if (!window.confirm(`Are you sure you want to suspend Dr. ${doctorName}?`)) {
      return;
    }
    
    try {
      await api.post(`/admin/doctors/${doctorId}/suspend`, null, { params: { reason } });
      toast.warning(`Dr. ${doctorName} has been suspended`);
      loadDashboardData();
    } catch (error) {
      console.error('Suspension failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to suspend doctor');
    }
  };

  const handleActivateDoctor = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to reactivate Dr. ${doctorName}?`)) {
      return;
    }
    
    try {
      await api.post(`/admin/doctors/${doctorId}/activate`);
      toast.success(`Dr. ${doctorName} has been reactivated`);
      loadDashboardData();
    } catch (error) {
      console.error('Activation failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to activate doctor');
    }
  };

  const handleUpdateFee = async (doctorId, doctorName, currentFee) => {
    const fee = prompt(`Enter new consultation fee for Dr. ${doctorName} (KES):`, currentFee);
    if (!fee || isNaN(fee)) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/update-fee`, null, { params: { consultation_fee: parseFloat(fee) } });
      toast.success(`Fee updated to KES ${parseFloat(fee).toLocaleString()}`);
      loadDashboardData();
    } catch (error) {
      console.error('Fee update failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to update fee');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      <div className="font-display text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <Shield size={24} className="text-brand-600" />
                  <span className="font-display font-bold text-gray-900">Admin Panel</span>
                </div>
              )}
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'overview' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Activity size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Overview</span>}
            </button>
            <button onClick={() => setActiveTab('doctors')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'doctors' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Doctors</span>}
            </button>
            <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'patients' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <UserCheck size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Patients</span>}
            </button>
            <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'appointments' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Calendar size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Appointments</span>}
            </button>
            <button onClick={() => setActiveTab('revenue')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'revenue' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <DollarSign size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Revenue</span>}
            </button>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'doctors' && 'Doctor Management'}
                {activeTab === 'patients' && 'Patient Management'}
                {activeTab === 'appointments' && 'Appointment Management'}
                {activeTab === 'revenue' && 'Revenue Analytics'}
              </h1>
              <p className="text-gray-500 mt-1">Manage your healthcare platform</p>
            </div>
            <button onClick={loadDashboardData} className="p-2 text-gray-500 hover:text-brand-600 transition">
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.users?.total} icon={<Users size={24} />} color="bg-blue-50 text-blue-600" />
                <StatCard title="Doctors" value={stats.users?.doctors} icon={<UserCheck size={24} />} color="bg-green-50 text-green-600" />
                <StatCard title="Patients" value={stats.users?.patients} icon={<Users size={24} />} color="bg-purple-50 text-purple-600" />
                <StatCard title="Pending Approvals" value={stats.users?.pending_doctors} icon={<Clock size={24} />} color="bg-yellow-50 text-yellow-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Appointments" value={stats.appointments?.total} icon={<Calendar size={24} />} color="bg-indigo-50 text-indigo-600" />
                <StatCard title="Completed" value={stats.appointments?.completed} icon={<CheckCircle size={24} />} color="bg-green-50 text-green-600" />
                <StatCard title="Cancelled" value={stats.appointments?.cancelled} icon={<XCircle size={24} />} color="bg-red-50 text-red-600" />
                <StatCard title="Upcoming" value={stats.appointments?.upcoming} icon={<TrendingUp size={24} />} color="bg-cyan-50 text-cyan-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue" value={stats.revenue?.total ? `KES ${stats.revenue.total.toLocaleString()}` : 'KES 0'} icon={<DollarSign size={24} />} color="bg-emerald-50 text-emerald-600" />
                <StatCard title="This Month" value={stats.revenue?.this_month ? `KES ${stats.revenue.this_month.toLocaleString()}` : 'KES 0'} icon={<TrendingUp size={24} />} color="bg-teal-50 text-teal-600" />
                <StatCard title="Avg Rating" value={stats.reviews?.average_rating || '0.0'} icon={<Star size={24} />} color="bg-amber-50 text-amber-600" />
              </div>

              {/* Pending Doctors Section with Enhanced UI */}
              {pendingDoctors.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-yellow-600" />
                      <h2 className="font-display font-semibold text-gray-900">Pending Doctor Approvals</h2>
                      <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                        {pendingDoctors.length} pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Review and verify new doctor applications</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                                {doctor.full_name?.charAt(0) || 'D'}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">Dr. {doctor.full_name}</h3>
                                <p className="text-sm text-gray-500">{doctor.email} • {doctor.phone}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-gray-500">License Number</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.license_number}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Specialization</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.specialization}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Experience</p>
                                <p className="text-sm font-medium text-gray-900">{doctor.years_experience} years</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Consultation Fee</p>
                                <p className="text-sm font-medium text-gray-900">KES {doctor.consultation_fee?.toLocaleString()}</p>
                              </div>
                            </div>
                            {doctor.bio && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500">Bio</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApproveDoctor(doctor.id, doctor.full_name)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                            >
                              <Check size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDoctor(doctor.id, doctor.full_name)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Doctors Tab with Full Management */}
          {activeTab === 'doctors' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending_admin_approval">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allDoctors
                      .filter(d => filterStatus === 'all' || d.status === filterStatus)
                      .filter(d => !searchTerm || d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((doctor) => (
                        <tr key={doctor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                                {doctor.full_name?.charAt(0) || 'D'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Dr. {doctor.full_name}</div>
                                <div className="text-xs text-gray-500">ID: {doctor.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{doctor.email}</div>
                            <div className="text-xs text-gray-500">{doctor.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">KES {doctor.consultation_fee?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doctor.status === 'active' ? 'bg-green-100 text-green-700' :
                              doctor.status === 'pending_admin_approval' ? 'bg-yellow-100 text-yellow-700' :
                              doctor.status === 'suspended' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {doctor.status === 'pending_admin_approval' ? 'Pending' : doctor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-amber-500 fill-current" />
                              <span className="text-sm font-medium">{doctor.rating || 0}</span>
                              <span className="text-xs text-gray-400">({doctor.total_reviews || 0})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {doctor.status === 'pending_admin_approval' && (
                                <>
                                  <button
                                    onClick={() => handleApproveDoctor(doctor.id, doctor.full_name)}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                                  >
                                    <Check size={12} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectDoctor(doctor.id, doctor.full_name)}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                                  >
                                    <XCircle size={12} /> Reject
                                  </button>
                                </>
                              )}
                              {doctor.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateFee(doctor.id, doctor.full_name, doctor.consultation_fee)}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                                  >
                                    Set Fee
                                  </button>
                                  <button
                                    onClick={() => handleSuspendDoctor(doctor.id, doctor.full_name)}
                                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition"
                                  >
                                    Suspend
                                  </button>
                                </>
                              )}
                              {doctor.status === 'suspended' && (
                                <button
                                  onClick={() => handleActivateDoctor(doctor.id, doctor.full_name)}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allPatients
                      .filter(p => !searchTerm || p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{patient.full_name}</div>
                            <div className="text-xs text-gray-500">ID: {patient.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{patient.email}</div>
                            <div className="text-xs text-gray-500">{patient.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{patient.city || 'Not specified'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{patient.total_appointments || 0}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placeholder for Appointments and Revenue tabs */}
          {(activeTab === 'appointments' || activeTab === 'revenue') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Clock size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-500">This section is currently under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;