import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create your profile',
      desc: 'Sign up in under 2 minutes. Add your health history securely — we encrypt everything end-to-end.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      number: '02',
      title: 'Find your doctor',
      desc: 'Browse 350+ verified specialists. Read reviews, check availability, and choose your time slot.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      )
    },
    {
      number: '03',
      title: 'Consult & heal',
      desc: 'Meet via video or in-person. Receive e-prescriptions, referrals, and follow-ups — all in-app.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-[100px] bg-gray-950 overflow-hidden relative" id="how-it-works">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-[560px] mx-auto mb-16 reveal">
          <div className="eyebrow text-brand-400">Process</div>
          <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-white mb-4">
            Up and running<br />in 3 simple steps.
          </h2>
          <p className="text-[17px] text-white/50 leading-[1.7]">
            From sign-up to your first consultation — no paperwork, no queues, no hassle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-[24px] overflow-hidden border border-white/10 reveal">
          {steps.map((step, index) => (
            <div key={index} className="p-10 bg-gray-950 border-r border-white/10 last:border-r-0 relative">
              <div className="font-display text-[60px] font-extrabold text-white/5 leading-none mb-5 tracking-[-3px]">
                {step.number}
              </div>
              <div className="w-[52px] h-[52px] rounded-[18px] bg-brand-600/12 border border-brand-600/25 flex items-center justify-center mb-5 text-brand-400">
                {step.icon}
              </div>
              <div className="font-display text-[19px] font-bold text-white mb-2.5 tracking-[-0.4px]">
                {step.title}
              </div>
              <div className="text-sm text-white/50 leading-[1.7]">{step.desc}</div>
              {index < 2 && (
                <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center z-10 hidden md:flex">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;