import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">Last updated: January 2025</p>
            <p className="mb-4">By using AfyaLink, you agree to these terms. Please read them carefully.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">1. Account Registration</h2>
            <p className="mb-4">You must provide accurate information when creating an account and keep your credentials secure. You are responsible for all activities that occur under your account.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">2. Medical Disclaimer</h2>
            <p className="mb-4">AfyaLink connects you with healthcare providers but does not provide medical advice directly. Always consult with qualified medical professionals for medical advice, diagnosis, or treatment.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">3. Payment Terms</h2>
            <p className="mb-4">Services are billed according to your selected plan. Payments are processed securely through our payment partners. All fees are non-refundable unless otherwise stated.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">4. Privacy & Data Security</h2>
            <p className="mb-4">We take your privacy seriously. All medical information is encrypted and stored securely. We comply with applicable data protection laws.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">5. Cancellation Policy</h2>
            <p className="mb-4">Appointments can be cancelled up to 2 hours before the scheduled time without penalty. Late cancellations may incur a fee.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">AfyaLink is not liable for any indirect, incidental, or consequential damages arising from use of our platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;