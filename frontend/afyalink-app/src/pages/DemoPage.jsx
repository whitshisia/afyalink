import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Send, 
  CheckCircle, 
  Video, 
  MapPin,
  Users,
  Stethoscope,
  Shield,
  Award,
  ArrowRight,
  Star,
  Play,
  ChevronRight,
  MessageSquare,
  FileText,
  Pill,
  Heart,
  Activity,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DemoPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    organization: '',
    role: 'patient',
    preferred_date: '',
    preferred_time: '',
    message: '',
    hear_about: '',
    appointment_type: 'video'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/demo/request', formData);
      setSubmitted(true);
      toast.success('Demo request submitted! We\'ll contact you within 24 hours.');
      
      // Reset form after 5 seconds and redirect
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Demo request failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Video size={20} />, title: 'Video Consultations', desc: 'High-quality video calls with patients' },
    { icon: <FileText size={20} />, title: 'EHR Integration', desc: 'Seamless medical records management' },
    { icon: <Pill size={20} />, title: 'E-Prescriptions', desc: 'Digital prescriptions and refills' },
    { icon: <Calendar size={20} />, title: 'Smart Scheduling', desc: 'Automated appointment booking' },
    { icon: <DollarSign size={20} />, title: 'Integrated Payments', desc: 'M-Pesa and card payments' },
    { icon: <Shield size={20} />, title: 'HIPAA Compliant', desc: 'Bank-level security' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Wanjiku',
      role: 'Cardiologist, Nairobi Hospital',
      content: 'AfyaLink has transformed how I manage my practice. The platform is intuitive and my patients love it!',
      rating: 5,
      avatar: 'SW'
    },
    {
      name: 'John Kamau',
      role: 'CEO, MedHealers Group',
      content: 'The best healthcare platform we\'ve used. Great support team and excellent features.',
      rating: 5,
      avatar: 'JK'
    },
    {
      name: 'Dr. Michael Otieno',
      role: 'Family Physician',
      content: 'Streamlined my appointment scheduling and reduced no-shows significantly.',
      rating: 5,
      avatar: 'MO'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Request Received!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in AfyaLink. Our team will review your request and contact you within 24 hours to schedule your personalized demo.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Confirmation sent to:</p>
              <p className="font-medium text-gray-900">{formData.email}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
            >
              Return to Home <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Play size={16} />
            <span className="text-sm">See AfyaLink in Action</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Schedule a <span className="text-brand-300">Personalized Demo</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Discover how AfyaLink can transform your healthcare practice. Get a customized walkthrough tailored to your needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
              {/* Progress Steps */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {s}
                        </div>
                        <span className={`text-sm hidden sm:inline ${
                          step >= s ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {s === 1 ? 'Contact Info' : s === 2 ? 'Practice Details' : 'Schedule'}
                        </span>
                      </div>
                      {s < 3 && <ChevronRight size={16} className="text-gray-300" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <div className="relative">
                          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          placeholder="+254 700 000 000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        I am a *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, role: 'patient' })}
                          className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                            formData.role === 'patient'
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 text-gray-700 hover:border-brand-400'
                          }`}
                        >
                          <User size={18} />
                          Patient
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, role: 'provider' })}
                          className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                            formData.role === 'provider'
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 text-gray-700 hover:border-brand-400'
                          }`}
                        >
                          <Stethoscope size={18} />
                          Healthcare Provider
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How did you hear about us?
                      </label>
                      <select
                        name="hear_about"
                        value={formData.hear_about}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">Select an option</option>
                        <option value="search">Google Search</option>
                        <option value="social">Social Media</option>
                        <option value="friend">Friend/Colleague</option>
                        <option value="advertisement">Advertisement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* Step 2: Practice Details */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization/Clinic Name
                      </label>
                      <div className="relative">
                        <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          placeholder="e.g., Nairobi Medical Center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Demo Type *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, appointment_type: 'video' })}
                          className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                            formData.appointment_type === 'video'
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 text-gray-700 hover:border-brand-400'
                          }`}
                        >
                          <Video size={18} />
                          Video Demo
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, appointment_type: 'in_person' })}
                          className={`py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition ${
                            formData.appointment_type === 'in_person'
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 text-gray-700 hover:border-brand-400'
                          }`}
                        >
                          <MapPin size={18} />
                          In-Person Demo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message / Specific Requirements
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                        placeholder="Tell us about your specific needs, number of practitioners, clinic size, or any questions you have..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="preferred_date"
                          value={formData.preferred_date}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          name="preferred_time"
                          value={formData.preferred_time}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                          required
                        >
                          <option value="">Select time slot</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Demo Duration: 30-45 minutes</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Our team will confirm the exact time and send you a calendar invite.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Request Demo
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Features & Testimonials */}
          <div>
            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                What's Included in Your Demo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{feature.title}</p>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose AfyaLink */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 mb-6 text-white">
              <h2 className="font-display text-xl font-bold mb-4">Why Healthcare Providers Choose AfyaLink</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">5,000+ Active Patients</p>
                    <p className="text-sm opacity-90">Growing patient network</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">98% Satisfaction Rate</p>
                    <p className="text-sm opacity-90">From providers and patients</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">HIPAA Compliant</p>
                    <p className="text-sm opacity-90">Bank-level security</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <div className="space-y-4">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">How long is the demo?</p>
                  <p className="text-sm text-gray-500">Our demos typically run for 30-45 minutes, depending on your questions and specific needs.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Is there a cost for the demo?</p>
                  <p className="text-sm text-gray-500">No, the demo is completely free. There's no obligation to purchase after the demo.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Can I bring my team?</p>
                  <p className="text-sm text-gray-500">Absolutely! Feel free to invite your colleagues. Just let us know how many will be attending.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">What if I need to reschedule?</p>
                  <p className="text-sm text-gray-500">You can easily reschedule by contacting our support team at demo@afyalink.com.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Ready to Transform Your Healthcare Practice?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of healthcare providers already using AfyaLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
            >
              Schedule Your Demo Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 border-2 border-brand-600 text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition"
            >
              <MessageSquare size={18} />
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;