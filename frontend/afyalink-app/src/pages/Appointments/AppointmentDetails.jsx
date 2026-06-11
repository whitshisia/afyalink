import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, Video, MapPin, User, Stethoscope, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    try {
      const data = await appointmentService.getById(id);
      setAppointment(data);
    } catch (error) {
      console.error('Failed to load appointment:', error);
      toast.error('Failed to load appointment details');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancelling(true);
    try {
      await appointmentService.cancel(id, 'User cancelled', 'patient');
      toast.success('Appointment cancelled successfully');
      loadAppointment();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/appointments')}
          className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-2"
        >
          ← Back to Appointments
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-display text-2xl font-bold mb-2">Appointment Details</h1>
                <p className="opacity-90">Appointment ID: #{appointment.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Doctor Info */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Doctor Information</h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
                  {appointment.doctor?.user?.full_name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 text-lg">
                    Dr. {appointment.doctor?.user?.full_name || 'Doctor'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.doctor?.specializations?.[0]?.name || 'General Physician'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {appointment.doctor?.years_of_experience || 5}+ years experience
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-brand-600" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">{new Date(appointment.scheduled_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock size={20} className="text-brand-600" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium">{new Date(appointment.scheduled_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {appointment.appointment_type === 'video' ? <Video size={20} className="text-brand-600" /> : <MapPin size={20} className="text-brand-600" />}
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-medium capitalize">{appointment.appointment_type?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Stethoscope size={20} className="text-brand-600" />
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="font-medium">KES {appointment.doctor?.consultation_fee?.toLocaleString() || 2500}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason & Symptoms */}
            {(appointment.reason || appointment.symptoms) && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Visit Details</h2>
                <div className="space-y-4">
                  {appointment.reason && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reason for Visit</p>
                      <p className="text-gray-700">{appointment.reason}</p>
                    </div>
                  )}
                  {appointment.symptoms && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Symptoms</p>
                      <p className="text-gray-700">{appointment.symptoms}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Doctor's Notes (if completed) */}
            {appointment.notes && appointment.status === 'completed' && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Doctor's Notes</h2>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <FileText size={18} className="text-blue-600 mb-2" />
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <div className="flex gap-4">
                {appointment.appointment_type === 'video' && appointment.status === 'confirmed' && (
                  <a
                    href={appointment.video_meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-brand-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                  >
                    <Video size={18} className="inline mr-2" />
                    Join Video Call
                  </a>
                )}
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            )}

            {/* Cancellation Info */}
            {appointment.cancellation_reason && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle size={18} />
                  <span className="font-semibold">Cancellation Reason</span>
                </div>
                <p className="text-sm text-red-700">{appointment.cancellation_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;