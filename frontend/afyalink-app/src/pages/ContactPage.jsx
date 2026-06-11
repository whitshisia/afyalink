import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="eyebrow">Contact Us</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Get in <span className="text-brand-500">touch</span>
          </h1>
          <p className="text-lg text-gray-600">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white font-display font-semibold py-3 rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-brand-600" />
                Visit Us
              </h3>
              <p className="text-gray-600">
                Nairobi, Kenya<br />
                Westlands, 5th Floor<br />
                P.O. Box 12345-00100
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-brand-600" />
                Call Us
              </h3>
              <p className="text-gray-600">
                +254 700 000 000<br />
                +254 711 000 000
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Mail size={20} className="text-brand-600" />
                Email Us
              </h3>
              <p className="text-gray-600">
                hello@afyalink.com<br />
                support@afyalink.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;