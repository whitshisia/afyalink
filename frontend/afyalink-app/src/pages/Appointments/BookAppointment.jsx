import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, MapPin, Video, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveOfflineAppointment } from '../../services/indexedDB';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState('video');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Fetch doctors on load
  useEffect(() => {
    loadDoctors();
  }, []);

  // Check for doctor ID in URL params
  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === parseInt(doctorId));
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(2);
      }
    }
  }, [doctors, searchParams]);

  const loadDoctors = async () => {
    try {
      const data = await doctorService.getAll({ limit: 50 });
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (doctorId, date) => {
    // In production, fetch from API
    // For now, generate mock slots
    const mockSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
      '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
    ];
    setAvailableSlots(mockSlots);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadAvailableSlots(selectedDoctor.id, date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setBookingLoading(true);

    const appointmentData = {
      doctor_id: selectedDoctor.id,
      scheduled_time: `${selectedDate}T${convertTo24Hour(selectedTime)}:00`,
      duration_minutes: 30,
      appointment_type: appointmentType,
      reason: reason,
      symptoms: symptoms
    };

    try {
      // Try to book online first
      const response = await appointmentService.create(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      if (!navigator.onLine) {
        // Save for offline sync
        await saveOfflineAppointment(appointmentData);
        toast.success('Appointment saved offline. Will sync when you\'re back online.');
        navigate('/appointments');
      } else {
        console.error('Booking failed:', error);
        toast.error(error.response?.data?.detail || 'Failed to book appointment');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours) + 12;
    return `${hours}:${minutes}`;
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  <span className={`text-sm ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 1 ? 'Select Doctor' : s === 2 ? 'Select Date' : s === 3 ? 'Details' : 'Confirm'}
                  </span>
                </div>
                {s < 4 && <ChevronRight size={16} className="text-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Select a Doctor</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {doctor.user?.full_name?.charAt(0) || 'D'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-gray-900">Dr. {doctor.user?.full_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{doctor.specializations?.[0]?.name || 'General Physician'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-500 fill-current" />
                          <span className="text-sm font-semibold">{doctor.rating || 4.5}</span>
                        </div>
                        <span className="text-xs text-gray-400">({doctor.total_reviews || 0} reviews)</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-brand-600 font-semibold">KES {doctor.consultation_fee?.toLocaleString() || 2500}</p>
                        <p className="text-xs text-gray-500 mt-1">{doctor.years_of_experience || 5}+ years experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && selectedDoctor && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6"
            >
              <ChevronLeft size={20} />
              Back to Doctors
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Doctor Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedDoctor.user?.full_name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900">Dr. {selectedDoctor.user?.full_name}</h2>
                    <p className="text-gray-500">{selectedDoctor.specializations?.[0]?.name || 'General Physician'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="text-amber-500 fill-current" />
                      <span className="text-sm">{selectedDoctor.rating || 4.5}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{selectedDoctor.bio || 'Experienced healthcare professional dedicated to providing quality patient care.'}</p>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-display font-semibold text-gray-900 mb-4">Select Date & Time</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Date</label>
                  <div className="grid grid-cols-4 gap-2">
                    {generateDateOptions().map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                        className={`p-3 rounded-lg border text-center transition ${
                          selectedDate === date.toISOString().split('T')[0]
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-200 hover:border-brand-400'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold">
                          {date.getDate()}
                        </div>
                        <div className="text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleTimeSelect(slot)}
                          className={`py-2 px-3 rounded-lg border text-sm transition ${
                            selectedTime === slot
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 hover:border-brand-400'
                          }`}
                        >
                          <Clock size={14} className="inline mr-1" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full mt-6 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6"
            >
              <ChevronLeft size={20} />
              Back to Date Selection
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Appointment Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-display font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Doctor</span>
                    <span className="font-medium">Dr. {selectedDoctor.user?.full_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Consultation Fee</span>
                    <span className="font-semibold text-brand-600">KES {selectedDoctor.consultation_fee?.toLocaleString() || 2500}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-display font-semibold text-gray-900 mb-4">Appointment Details</h3>
                
                <div className="space-y-4">
                  {/* Appointment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setAppointmentType('video')}
                        className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                          appointmentType === 'video'
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-200 hover:border-brand-400'
                        }`}
                      >
                        <Video size={18} />
                        Video Call
                      </button>
                      <button
                        onClick={() => setAppointmentType('in_person')}
                        className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                          appointmentType === 'in_person'
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-200 hover:border-brand-400'
                        }`}
                      >
                        <MapPin size={18} />
                        In-Person
                      </button>
                    </div>
                  </div>

                  {/* Reason for visit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                    <textarea
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Briefly describe your reason for consultation..."
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (Optional)</label>
                    <textarea
                      rows="2"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="List any symptoms you're experiencing..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={bookingLoading}
                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </div>
                    ) : (
                      'Confirm Booking →'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;