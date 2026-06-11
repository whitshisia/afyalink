import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-[100px] bg-gray-950 text-center overflow-hidden relative">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="eyebrow text-brand-400 mb-5">Get started today</div>
        <h2 className="text-[52px] font-extrabold text-white leading-[1.05] tracking-[-2px] mb-5">
          Healthcare that<br />comes to <em className="not-italic text-brand-400">you.</em>
        </h2>
        <p className="text-lg text-white/50 mb-10">
          Join thousands of Kenyans taking control of their health with AfyaLink.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-brand-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-brand-700 hover:-translate-y-px"
          >
            Book Your First Consult
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="inline-flex items-center justify-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-white/12 text-white border-2 border-white/30 backdrop-blur-sm transition-all hover:bg-white/22"
          >
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;