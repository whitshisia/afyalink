import React from 'react';

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">Last updated: January 2025</p>
            <p className="mb-4">AfyaLink uses cookies to improve your experience on our platform. This policy explains what cookies are, how we use them, and your choices regarding cookies.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">What Are Cookies</h2>
            <p className="mb-4">Cookies are small text files stored on your device when you visit websites. They help us remember your preferences and analyze how you use our platform.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">How We Use Cookies</h2>
            <p className="mb-4">We use the following types of cookies:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly (authentication, security).</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our platform.</li>
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser.</li>
            </ul>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">Third-Party Cookies</h2>
            <p className="mb-4">We may use third-party services that set their own cookies, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Google Analytics for platform analytics</li>
              <li>Payment processors for secure transactions</li>
              <li>Video conferencing providers for telemedicine</li>
            </ul>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">Managing Cookies</h2>
            <p className="mb-4">You can control and manage cookies through your browser settings. However, disabling certain cookies may affect platform functionality.</p>
            
            <h2 className="font-display text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">For questions about our Cookie Policy, contact us at privacy@afyalink.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;