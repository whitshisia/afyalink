import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, Video, MapPin, ChevronRight, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancel(id, 'User cancelled', 'patient');
        toast.success('Appointment cancelled successfully');
        loadAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.scheduled_time);
    const now = new Date();
    if (filter === 'upcoming') return aptDate > now && apt.status !== 'cancelled';
    if (filter === 'past') return aptDate < now || apt.status === 'completed';
    if (filter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">My Appointments</h1>
          <Link
            to="/appointments/book"
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition"
          >
            + Book New
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 text-sm font-medium transition ${
                filter === tab
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'upcoming' ? "You don't have any upcoming appointments" : "You don't have any past appointments"}
            </p>
            <Link to="/appointments/book" className="text-brand-600 hover:text-brand-700 font-medium">
              Book your first appointment →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
                      {appointment.doctor?.user?.full_name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 text-lg">
                        Dr. {appointment.doctor?.user?.full_name || 'Doctor'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.doctor?.specializations?.[0]?.name || 'General Physician'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          {new Date(appointment.scheduled_time).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          {new Date(appointment.scheduled_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      {appointment.appointment_type === 'video' && appointment.status === 'confirmed' && (
                        <a
                          href={appointment.video_meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
                        >
                          <Video size={14} />
                          Join Call
                        </a>
                      )}
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;