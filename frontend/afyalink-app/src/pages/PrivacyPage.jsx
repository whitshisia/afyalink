import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">Last updated: January 2025</p>
            <p className="mb-4">At AfyaLink, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, including name, contact information, medical history, payment details, and appointment data.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to provide healthcare services, process payments, communicate with you, improve our platform, and comply with legal obligations.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">3. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your data.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">4. Data Sharing</h2>
            <p className="mb-4">We do not sell your personal information. We may share data with healthcare providers for treatment purposes, payment processors, and as required by law.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">5. Your Rights</h2>
            <p className="mb-4">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">6. Cookies</h2>
            <p className="mb-4">We use cookies to improve your experience. You can control cookie settings in your browser.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">7. Contact Us</h2>
            <p className="mb-4">For privacy concerns, contact us at privacy@afyalink.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;