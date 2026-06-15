import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, Shield, Clock, 
  Video, FileText, Smartphone, Award, CheckCircle, ArrowRight 
} from 'lucide-react';

const ProvidersPage = () => {
  const benefits = [
    {
      icon: <Users size={32} />,
      title: 'Patient Management',
      desc: 'Easily manage all your patients, appointments, and medical records in one place.'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Smart Scheduling',
      desc: 'Automated appointment scheduling with reminders and calendar integration.'
    },
    {
      icon: <DollarSign size={32} />,
      title: 'Secure Payments',
      desc: 'Integrated payment system with M-Pesa and card payments.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Practice Analytics',
      desc: 'Track your practice performance with detailed analytics and reports.'
    },
    {
      icon: <Shield size={32} />,
      title: 'HIPAA Compliant',
      desc: 'Bank-level security and compliance with healthcare data protection standards.'
    },
    {
      icon: <Video size={32} />,
      title: 'Telemedicine',
      desc: 'Built-in video consultation platform for remote patient care.'
    }
  ];

  const features = [
    "Digital prescriptions and e-prescribing",
    "Automated patient reminders (SMS/Email)",
    "Patient portal for medical records access",
    "Integration with lab systems",
    "Multi-clinic/hospital management",
    "Revenue reporting and analytics",
    "Patient feedback and ratings",
    "Mobile app for patients"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Grow Your Practice with AfyaLink
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join hundreds of healthcare providers who use AfyaLink to manage their practice and connect with patients.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">200+</div>
              <div className="text-gray-500">Active Providers</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">5,000+</div>
              <div className="text-gray-500">Patients Served</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">98%</div>
              <div className="text-gray-500">Satisfaction Rate</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-brand-600 mb-2">24/7</div>
              <div className="text-gray-500">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Why Choose AfyaLink?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern healthcare practice
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-gray-600 mb-6">
                AfyaLink provides a comprehensive suite of tools designed specifically for healthcare providers in Kenya.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                >
                  Request Demo <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <Smartphone size={48} className="text-brand-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-gray-900">Mobile-Ready Platform</h3>
                <p className="text-gray-500 mt-2">Access your practice from anywhere, anytime</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Video size={20} className="text-brand-600" />
                  <span className="text-gray-700">Conduct video consultations</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <FileText size={20} className="text-brand-600" />
                  <span className="text-gray-700">Access patient records on the go</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Calendar size={20} className="text-brand-600" />
                  <span className="text-gray-700">Manage your schedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">What Providers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Award key={i} size={16} className="text-amber-500 fill-current" />)}
              </div>
              <p className="text-gray-600 mb-4">"AfyaLink has transformed how I manage my practice. The platform is intuitive and my patients love it!"</p>
              <div className="font-semibold text-gray-900">Dr. Sarah Wanjiku</div>
              <div className="text-sm text-gray-500">Cardiologist</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Award key={i} size={16} className="text-amber-500 fill-current" />)}
              </div>
              <p className="text-gray-600 mb-4">"The telemedicine feature has been a game-changer for my practice, especially during the pandemic."</p>
              <div className="font-semibold text-gray-900">Dr. James Otieno</div>
              <div className="text-sm text-gray-500">Family Physician</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Award key={i} size={16} className="text-amber-500 fill-current" />)}
              </div>
              <p className="text-gray-600 mb-4">"Patient management has never been easier. The automated reminders have significantly reduced no-shows."</p>
              <div className="font-semibold text-gray-900">Dr. Mercy Kimani</div>
              <div className="text-sm text-gray-500">Pediatrician</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-white/90 mb-8">
            Join the growing network of healthcare providers using AfyaLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Sign Up as Provider
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProvidersPage;