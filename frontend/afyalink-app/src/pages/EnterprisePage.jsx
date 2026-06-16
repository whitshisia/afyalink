import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Shield, BarChart3, Database, Globe, CheckCircle, ArrowRight } from 'lucide-react';

const EnterprisePage = () => {
  const features = [
    {
      icon: <Building size={32} className="text-brand-600" />,
      title: "Multi-Facility Management",
      desc: "Manage multiple clinics and hospitals from a single dashboard"
    },
    {
      icon: <Users size={32} className="text-brand-600" />,
      title: "Staff Management",
      desc: "Manage doctors, nurses, and administrative staff efficiently"
    },
    {
      icon: <Shield size={32} className="text-brand-600" />,
      title: "Enterprise Security",
      desc: "Bank-level encryption and compliance with healthcare regulations"
    },
    {
      icon: <BarChart3 size={32} className="text-brand-600" />,
      title: "Advanced Analytics",
      desc: "Comprehensive reporting and business intelligence"
    },
    {
      icon: <Database size={32} className="text-brand-600" />,
      title: "EHR Integration",
      desc: "Seamless integration with existing electronic health records"
    },
    {
      icon: <Globe size={32} className="text-brand-600" />,
      title: "White Label Solution",
      desc: "Custom branding and personalized patient portal"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Custom",
      features: [
        "Up to 5 facilities",
        "Up to 50 staff members",
        "Basic analytics",
        "Email support",
        "API access"
      ]
    },
    {
      name: "Professional",
      price: "Custom",
      popular: true,
      features: [
        "Up to 20 facilities",
        "Up to 200 staff members",
        "Advanced analytics",
        "Priority support",
        "Full API access",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited facilities",
        "Unlimited staff",
        "Custom analytics",
        "24/7 dedicated support",
        "White label solution",
        "On-premise deployment"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Enterprise Healthcare Solutions
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Comprehensive healthcare management platform for hospitals, clinics, and healthcare organizations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
            >
              Request Demo <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern healthcare organization
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

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Custom Pricing for Your Needs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Contact our sales team for a personalized quote based on your requirements
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl p-8 shadow-sm border ${plan.popular ? 'border-brand-500 shadow-lg' : 'border-gray-200'} relative`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-sm font-bold py-1 px-4 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="font-display text-3xl font-bold text-gray-900">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="block text-center border-2 border-brand-600 text-brand-600 py-2 rounded-lg font-semibold hover:bg-brand-50 transition"
                >
                  Contact Sales
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Transform Your Healthcare Organization?</h2>
          <p className="text-white/90 mb-8">
            Join leading healthcare providers using AfyaLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Schedule Demo <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnterprisePage;