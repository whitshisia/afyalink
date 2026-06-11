import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="eyebrow">About Us</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Making healthcare<br /><span className="text-brand-500">accessible for all</span>
          </h1>
          <p className="text-lg text-gray-600">
            AfyaLink was founded with a mission to revolutionize healthcare delivery in Kenya and beyond.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            To provide accessible, affordable, and quality healthcare to every Kenyan through innovative 
            technology solutions that connect patients with trusted healthcare providers.
          </p>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            A future where quality healthcare is just a click away for everyone, everywhere in Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-brand-50 rounded-xl p-6 text-center">
            <div className="font-display text-3xl font-extrabold text-brand-600 mb-2">5,000+</div>
            <div className="text-gray-600">Patients Served</div>
          </div>
          <div className="bg-brand-50 rounded-xl p-6 text-center">
            <div className="font-display text-3xl font-extrabold text-brand-600 mb-2">200+</div>
            <div className="text-gray-600">Healthcare Providers</div>
          </div>
          <div className="bg-brand-50 rounded-xl p-6 text-center">
            <div className="font-display text-3xl font-extrabold text-brand-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;