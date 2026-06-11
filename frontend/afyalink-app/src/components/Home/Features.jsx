import React from 'react';

const Features = () => {
  const features = [
    { 
      num: '01', 
      title: 'Appointment Booking', 
      desc: 'Book, reschedule and manage appointments with verified doctors and specialists in seconds.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    { 
      num: '02', 
      title: 'Medical Records', 
      desc: 'Access and manage your entire medical history securely. Share instantly with any provider.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    { 
      num: '03', 
      title: 'Prescriptions', 
      desc: 'View, download and share your prescriptions digitally. Order medicines for home delivery.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 2h6l1 3H8L9 2z"/>
          <path d="M8 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/>
          <path d="M12 11v6M9 14h6"/>
        </svg>
      )
    },
    { 
      num: '04', 
      title: 'AI Health Assistant', 
      desc: 'Get instant, intelligent answers about symptoms, drug interactions, and treatment options.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        </svg>
      )
    },
    { 
      num: '05', 
      title: 'Analytics & Reports', 
      desc: 'Track health trends over time and generate insightful reports for doctors and patients alike.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    { 
      num: '06', 
      title: 'Secure & Private', 
      desc: 'Bank-level encryption and HIPAA-compliant infrastructure keeps your health data safe always.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-[100px] bg-white" id="features">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-[560px] mx-auto mb-16 reveal">
          <div className="eyebrow">Powerful Features</div>
          <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-gray-950 mb-4">
            Everything you need,<br /><em className="not-italic text-brand-500">all in one place</em>
          </h2>
          <p className="text-[17px] text-gray-500 leading-[1.7]">
            AfyaLink helps patients and providers connect, communicate and manage healthcare seamlessly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 rounded-[24px] overflow-hidden border border-gray-200 reveal">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-9 transition-all hover:bg-brand-50 group cursor-default">
              <div className="font-display text-[11px] font-bold tracking-[0.08em] text-gray-300 mb-5 transition-colors group-hover:text-brand-400">
                {feature.num}
              </div>
              <div className="w-12 h-12 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 text-brand-600">
                {feature.icon}
              </div>
              <div className="font-display text-[17px] font-bold text-gray-900 mb-2 tracking-[-0.3px]">
                {feature.title}
              </div>
              <div className="text-sm text-gray-500 leading-[1.65]">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;