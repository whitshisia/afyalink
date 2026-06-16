import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, Video, MapPin, Star, Shield, Smartphone, CheckCircle } from 'lucide-react';

const PatientsPage = () => {
  const features = [
    {
      icon: <Calendar size={32} className="text-brand-600" />,
      title: "Easy Appointment Booking",
      desc: "Book appointments with top doctors in just a few clicks"
    },
    {
      icon: <Video size={32} className="text-brand-600" />,
      title: "Video Consultations",
      desc: "Consult with doctors from the comfort of your home"
    },
    {
      icon: <Stethoscope size={32} className="text-brand-600" />,
      title: "Access Medical Records",
      desc: "View and share your medical history securely"
    },
    {
      icon: <Clock size={32} className="text-brand-600" />,
      title: "24/7 Access",
      desc: "Access healthcare services anytime, anywhere"
    },
    {
      icon: <Shield size={32} className="text-brand-600" />,
      title: "Secure & Private",
      desc: "Your health data is protected with bank-level security"
    },
    {
      icon: <Smartphone size={32} className="text-brand-600" />,
      title: "Mobile App",
      desc: "Access your health records on the go"
    }
  ];

  const benefits = [
    "No subscription fees - pay only for consultations",
    "Access to 200+ verified doctors",
    "Digital prescriptions sent to your phone",
    "Lab results delivered instantly",
    "Appointment reminders via SMS/Email",
    "Easy prescription refills"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your Health, <span className="text-brand-300">In Your Hands</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Access quality healthcare from anywhere, anytime. Book appointments, access records, and consult with top doctors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started Free →
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">200+</div>
              <div className="text-gray-500">Verified Doctors</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">5,000+</div>
              <div className="text-gray-500">Happy Patients</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">24/7</div>
              <div className="text-gray-500">Support Available</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">98%</div>
              <div className="text-gray-500">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Why Choose AfyaLink?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make healthcare accessible, affordable, and convenient for everyone
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                Everything You Need for Better Health
              </h2>
              <p className="text-gray-600 mb-6">
                AfyaLink provides a comprehensive healthcare solution designed specifically for patients in Kenya.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                >
                  Create Free Account →
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <Smartphone size={48} className="text-brand-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-gray-900">Mobile App Coming Soon</h3>
                <p className="text-gray-500 mt-2">Access your health records from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No hidden fees. Pay only for what you use.
            </p>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-brand-600 font-semibold mb-2">Free for Patients</div>
            <div className="font-display text-5xl font-bold text-gray-900 mb-4">KES 0</div>
            <p className="text-gray-500 mb-6">Pay only for consultations with doctors</p>
            <Link
              to="/register"
              className="block text-center bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-white/90 mb-8">
            Join thousands of Kenyans using AfyaLink for their healthcare needs
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up Free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PatientsPage;