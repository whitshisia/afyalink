// App.jsx
import React, { useEffect, useRef } from 'react';

const App = () => {
  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // Animated stat counters
    const statNums = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const num = parseInt(text.replace(/\D/g, ''));
          const suffix = text.replace(/[\d,]/g, '').trim();
          let start = null;
          const duration = 1800;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.innerHTML = Math.floor(eased * num).toLocaleString() + '<span>' + suffix + '</span>';
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObserver.observe(el));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <StatsBanner />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

// Navbar Component
const Navbar = () => (
  <nav className="sticky top-0 z-[1000] bg-white/92 backdrop-blur-[20px] border-b border-gray-100">
    <div className="flex items-center justify-between px-10 h-[68px] max-w-[1160px] mx-auto">
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <div className="w-[38px] h-[38px] rounded-[11px] bg-green-600 flex items-center justify-center shadow-[0_2px_8px_rgba(22,168,99,0.4)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <span className="font-display text-[20px] font-bold text-gray-900 tracking-[-0.5px]">afya<span className="text-green-600">link</span></span>
      </a>
      <ul className="flex items-center gap-0.5 list-none">
        {['Home', 'Features', 'For Patients', 'For Providers', 'Pricing', 'About Us'].map((item, i) => (
          <li key={i}><a href={i === 0 ? '#' : `#${item.toLowerCase().replace(/\s/g, '-')}`} className={`font-display text-sm font-medium ${i === 0 ? 'text-green-700' : 'text-gray-600'} no-underline px-3.5 py-1.5 rounded-[8px] transition-all hover:text-green-700 hover:bg-green-50`}>{item}</a></li>
        ))}
      </ul>
      <div className="flex items-center gap-2.5">
        <button className="font-display text-sm font-medium text-gray-700 bg-none border border-gray-200 py-2 px-[18px] rounded-md transition-all hover:border-green-400 hover:text-green-700">Log in</button>
        <button className="inline-flex items-center gap-2 font-display text-sm font-bold py-3 px-6 rounded-md bg-green-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-green-700 hover:-translate-y-px">Get Started →</button>
      </div>
    </div>
  </nav>
);

// Hero Component
const Hero = () => (
  <section className="bg-gradient-to-br from-gray-50 to-white py-20 px-0 overflow-hidden relative">
    <div className="max-w-[1160px] mx-auto px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-15 items-center">
        <div className="animate-[fadeUp_0.7s_ease-out_both]">
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold tracking-[0.08em] uppercase text-green-600 bg-green-50 border border-green-200 rounded-full py-1 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-ring"></span>
              Smart Healthcare. Connected Care.
            </div>
          </div>
          <h1 className="text-[54px] font-extrabold leading-[1.08] tracking-[-2px] text-gray-950 mb-5">Healthcare made<br /><em className="not-italic text-green-500">simple,</em> <span className="text-teal-500">connected</span><br />&amp; accessible.</h1>
          <p className="text-[17px] text-gray-500 leading-[1.75] max-w-[460px] mb-9">AfyaLink is your all-in-one platform to manage appointments, medical records, prescriptions and much more — securely and anytime, anywhere.</p>
          <div className="flex gap-3 mb-10">
            <button className="inline-flex items-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-green-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-green-700 hover:-translate-y-px">Get Started Free →</button>
            <button className="inline-flex items-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-transparent text-green-700 border-2 border-green-300 transition-all hover:bg-green-50 hover:border-green-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Book a Demo
            </button>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex">
              {['AW', 'JO', 'FM', 'SK'].map((init, i) => (
                <span key={i} className={`w-[34px] h-[34px] rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold font-display text-white -ml-2.5 first:ml-0 ${i === 0 ? 'bg-green-700' : i === 1 ? 'bg-green-600' : i === 2 ? 'bg-teal-500' : 'bg-green-800'}`}>{init}</span>
              ))}
            </div>
            <div>
              <div className="text-amber-500 tracking-[1px] text-[13px]">★★★★★</div>
              <div className="text-[13px] text-gray-500"><strong className="text-gray-800 font-semibold">Trusted by 5,000+</strong> patients and healthcare providers</div>
            </div>
          </div>
        </div>

        <div className="animate-[fadeUp_0.7s_0.15s_ease-out_both] relative">
          <div className="absolute bottom-[-24px] left-[-30px] bg-white rounded-[18px] shadow-lg border border-gray-100 p-3 animate-[float_5s_0.5s_ease-in-out_infinite]">
            <div className="font-display text-[10px] font-semibold text-gray-500 mb-1">Today's Revenue</div>
            <div className="font-display text-lg font-extrabold text-gray-900">KES 245K</div>
            <div className="text-[10px] text-green-600 font-semibold">↑ 15% from yesterday</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[24px] shadow-lg overflow-hidden">
            <div className="bg-gray-950 py-3.5 px-5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
              </div>
              <div className="font-display text-xs font-medium text-white/50">AfyaLink Provider Portal</div>
              <div className="w-[52px]"></div>
            </div>
            <div className="grid grid-cols-[160px_1fr]">
              <div className="bg-gray-950 py-4 border-r border-white/10">
                <div className="flex items-center gap-2 px-4 pb-3.5 border-b border-white/10 mb-2.5">
                  <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                  </div>
                  <span className="font-display text-xs font-bold text-white">afyalink</span>
                </div>
                {['Dashboard', 'Appointments', 'Patients', 'Records', 'Analytics'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 px-4 py-2 text-[11px] font-display transition-all cursor-pointer ${i === 0 ? 'bg-green-600/15 text-green-300 border-r-2 border-green-400' : 'text-white/45'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 opacity-60">
                      {i === 0 && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>}
                      {i === 1 && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                      {i === 2 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                      {i === 3 && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                      {i === 4 && <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50">
                <div className="font-display text-xs font-semibold text-gray-800">Good morning, Dr. Mercy 👋</div>
                <div className="text-[10px] text-gray-400 mb-3">Here's what's happening with your patients today.</div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Appointments', val: '24', delta: '↑ 12% today' },
                    { label: 'Patients', val: '520', delta: '↑ 8% this week' },
                    { label: 'Consultations', val: '18', delta: '↑ 15% today' },
                    { label: 'Revenue', val: 'KES 245K', delta: '↑ 15% today' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[8px] border border-gray-200 p-2">
                      <div className="text-[9px] text-gray-400 font-display mb-0.5">{stat.label}</div>
                      <div className="font-display text-base font-bold text-gray-900">{stat.val}</div>
                      <div className="text-[9px] text-green-600 font-medium">{stat.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-[8px] border border-gray-200 p-2.5">
                  <div className="font-display text-[10px] font-semibold text-gray-700 mb-2">Today's Appointments</div>
                  {[
                    { name: 'Samuel Mwangi', type: 'General Checkup', time: '09:00 AM', status: 'Confirmed', bg: 'bg-green-600' },
                    { name: 'Grace Njeri', type: 'Consultation', time: '10:30 AM', status: 'Confirmed', bg: 'bg-teal-500' },
                    { name: 'Peter Okemo', type: 'Follow-up', time: '12:00 PM', status: 'Pending', bg: 'bg-purple-600' },
                    { name: 'Lydia Achieng', type: 'Lab Review', time: '02:30 PM', status: 'Confirmed', bg: 'bg-green-800' }
                  ].map((apt, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-none last:pb-0">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white font-display ${apt.bg}`}>{apt.name.charAt(0)}{apt.name.split(' ')[1].charAt(0)}</div>
                      <div className="flex-1">
                        <div className="font-display text-[9px] font-semibold text-gray-800">{apt.name}</div>
                        <div className="text-[9px] text-gray-400">{apt.type}</div>
                      </div>
                      <div className="text-[9px] text-gray-500 font-display">{apt.time}</div>
                      <div className={`text-[8px] font-semibold font-display py-0.5 px-[7px] rounded-[10px] ${apt.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-100 text-amber-800'}`}>{apt.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[-20px] right-[-24px] bg-white rounded-[18px] shadow-lg border border-gray-100 p-3 animate-[float_5.5s_1s_ease-in-out_infinite]">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mb-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 stroke-green-600"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>
            </div>
            <div className="font-display text-[10px] font-bold text-green-700">AI Health Assistant</div>
            <div className="text-[10px] text-gray-500 max-w-[120px] mt-0.5">Ask about symptoms, drugs, treatments...</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// LogosStrip Component
const LogosStrip = () => {
  const logos = ['AAR Healthcare', "Gertrude's Children's Hospital", 'The Nairobi Hospital', 'Medhealers Care & Beyond', 'LVCT Health', 'PharmAccess Foundation'];
  
  return (
    <div className="border-t border-gray-100 border-b border-gray-100 py-8 overflow-hidden">
      <div className="text-center font-display text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-6">Trusted by leading healthcare organizations</div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-16 w-max animate-[ticker_22s_linear_infinite]">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex items-center gap-2 font-display text-sm font-bold text-gray-400 whitespace-nowrap opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                {i % 6 === 0 && <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v2l10 5 10-5v-2l-10 5z"/>}
                {i % 6 === 1 && <><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></>}
                {i % 6 === 2 && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>}
                {i % 6 === 3 && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>}
                {i % 6 === 4 && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>}
                {i % 6 === 5 && <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>}
              </svg>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Features Component
const Features = () => {
  const features = [
    { num: '01', title: 'Appointment Booking', desc: 'Book, reschedule and manage appointments with verified doctors and specialists in seconds.', icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { num: '02', title: 'Medical Records', desc: 'Access and manage your entire medical history securely. Share instantly with any provider.', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
    { num: '03', title: 'Prescriptions', desc: 'View, download and share your prescriptions digitally. Order medicines for home delivery.', icon: <><path d="M9 2h6l1 3H8L9 2z"/><path d="M8 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M12 11v6M9 14h6"/></> },
    { num: '04', title: 'AI Health Assistant', desc: 'Get instant, intelligent answers about symptoms, drug interactions, and treatment options.', icon: <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>, special: true },
    { num: '05', title: 'Analytics & Reports', desc: 'Track health trends over time and generate insightful reports for doctors and patients alike.', icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
    { num: '06', title: 'Secure & Private', desc: 'Bank-level encryption and HIPAA-compliant infrastructure keeps your health data safe always.', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></> }
  ];

  return (
    <section className="py-[100px] bg-white" id="features">
      <div className="max-w-[1160px] mx-auto px-10">
        <div className="text-center max-w-[560px] mx-auto mb-16 reveal">
          <div className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-green-500 mb-3">Powerful Features</div>
          <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-gray-950 mb-4">Everything you need,<br /><em className="not-italic text-green-500">all in one place</em></h2>
          <p className="text-[17px] text-gray-500 leading-[1.7]">AfyaLink helps patients and providers connect, communicate and manage healthcare seamlessly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 rounded-[24px] overflow-hidden border border-gray-200 reveal">
          {features.map((feat, i) => (
            <div key={i} className="bg-white p-9 transition-all hover:bg-green-50 group cursor-default">
              <div className="font-display text-[11px] font-bold tracking-[0.08em] text-gray-300 mb-5 transition-colors group-hover:text-green-400">{feat.num}</div>
              <div className={`w-12 h-12 rounded-md border flex items-center justify-center mb-4 ${feat.special ? 'bg-teal-50/8 border-teal-200/20' : 'bg-green-50 border-green-100'}`}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${feat.special ? 'stroke-teal-500' : 'stroke-green-600'}`}>{feat.icon}</svg>
              </div>
              <div className="font-display text-[17px] font-bold text-gray-900 mb-2 tracking-[-0.3px]">{feat.title}</div>
              <div className="text-sm text-gray-500 leading-[1.65]">{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// HowItWorks Component
const HowItWorks = () => (
  <section className="py-[100px] bg-gray-950 overflow-hidden relative" id="how-it-works">
    <div className="max-w-[1160px] mx-auto px-10 relative z-10">
      <div className="text-center max-w-[560px] mx-auto mb-16 reveal">
        <div className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-green-400 mb-3">Process</div>
        <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-white mb-4">Up and running<br />in 3 simple steps.</h2>
        <p className="text-[17px] text-white/50 leading-[1.7]">From sign-up to your first consultation — no paperwork, no queues, no hassle.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/4 rounded-[24px] overflow-hidden border border-white/8 reveal">
        {[
          { num: '01', title: 'Create your profile', desc: 'Sign up in under 2 minutes. Add your health history securely — we encrypt everything end-to-end.', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
          { num: '02', title: 'Find your doctor', desc: 'Browse 350+ verified specialists. Read reviews, check availability, and choose your time slot.', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
          { num: '03', title: 'Consult & heal', desc: 'Meet via video or in-person. Receive e-prescriptions, referrals, and follow-ups — all in-app.', icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.8-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></> }
        ].map((step, i) => (
          <div key={i} className="p-10 bg-gray-950 border-r border-white/6 last:border-r-0 relative">
            <div className="font-display text-[60px] font-extrabold text-white/5 leading-none mb-5 tracking-[-3px]">{step.num}</div>
            <div className="w-[52px] h-[52px] rounded-[18px] bg-green-600/12 border border-green-600/25 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6.5 h-6.5 stroke-green-400">{step.icon}</svg>
            </div>
            <div className="font-display text-[19px] font-bold text-white mb-2.5 tracking-[-0.4px]">{step.title}</div>
            <div className="text-sm text-white/50 leading-[1.7]">{step.desc}</div>
            {i < 2 && (
              <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center z-10">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 stroke-white"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// StatsBanner Component
const StatsBanner = () => (
  <div className="bg-gradient-to-br from-green-800 via-green-600 to-teal-500">
    <div className="max-w-[1160px] mx-auto px-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { num: '5,000', suffix: '+', label: 'Happy Patients' },
          { num: '200', suffix: '+', label: 'Healthcare Providers' },
          { num: '50', suffix: '+', label: 'Partner Facilities' },
          { num: '98', suffix: '%', label: 'Satisfaction Rate' }
        ].map((stat, i) => (
          <div key={i} className="py-12 px-8 text-center border-r border-white/15 last:border-r-0">
            <div className="font-display text-[48px] font-extrabold text-white tracking-[-2px] leading-none mb-2">
              <span className="stat-num">{stat.num}<span>{stat.suffix}</span></span>
            </div>
            <div className="text-sm text-white/70 font-normal">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    { quote: "I booked a consultation at midnight when my daughter had a fever. The doctor responded within minutes. AfyaLink is a genuine lifesaver for families.", name: 'Amina Wanjiru', role: 'Mother of 3 · Nairobi', bg: 'bg-green-700', initial: 'AW', featured: false },
    { quote: "Getting my lab results digitally and having the doctor explain them in a follow-up call was incredibly convenient. No more queuing at the hospital.", name: 'James Ochieng', role: 'Business Owner · Kisumu', bg: 'rgba(255,255,255,0.15)', initial: 'JO', featured: true, textColor: 'text-green-200' },
    { quote: "The mental health support is confidential and professional. It's made a real difference in my wellbeing — I recommend it to everyone I know.", name: 'Faith Muthoni', role: 'Teacher · Mombasa', bg: 'bg-teal-500', initial: 'FM', featured: false }
  ];

  return (
    <section className="py-[100px] bg-gray-50" id="patients">
      <div className="max-w-[1160px] mx-auto px-10">
        <div className="max-w-[500px] mb-14 reveal">
          <div className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-green-500 mb-3">Testimonials</div>
          <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-gray-950">Trusted by patients<br /><em className="not-italic text-green-500">across Kenya.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
          {testimonials.map((t, i) => (
            <div key={i} className={`rounded-[24px] border p-7 transition-all hover:shadow-md hover:-translate-y-0.5 ${t.featured ? 'bg-green-800 border-transparent' : 'bg-white border-gray-200'}`}>
              <div className="mb-3.5"><span className="text-amber-500 text-sm tracking-[1px]">★★★★★</span></div>
              <div className={`text-[15px] leading-[1.75] mb-5 italic ${t.featured ? 'text-white/80' : 'text-gray-700'}`}>"{t.quote}"</div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display text-[13px] font-bold text-white ${t.featured ? '' : t.bg}`} style={t.featured ? { background: t.bg, color: 'var(--green-200)' } : {}}>{t.initial}</div>
                <div>
                  <div className={`font-display text-sm font-semibold ${t.featured ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                  <div className={`text-xs ${t.featured ? 'text-white/50' : 'text-gray-400'}`}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Component
const Pricing = () => {
  const plans = [
    { name: 'Basic', price: '0', period: 'Free forever', popular: false, features: ['2 consultations/month', 'Basic medical records', 'Appointment reminders', 'Community health tips'] },
    { name: 'Pro', price: '1,499', period: 'per month', popular: true, features: ['Unlimited consultations', 'Full medical records & history', 'AI Health Assistant access', 'e-Pharmacy with delivery', 'Priority support 24/7'] },
    { name: 'Enterprise', price: 'Custom', period: 'for organizations', popular: false, features: ['Everything in Pro', 'Multi-facility management', 'Custom analytics & reports', 'Dedicated account manager'] }
  ];

  return (
    <section className="py-[100px] bg-white" id="pricing">
      <div className="max-w-[1160px] mx-auto px-10">
        <div className="text-center max-w-[520px] mx-auto mb-16 reveal">
          <div className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-green-500 mb-3">Pricing</div>
          <h2 className="text-[42px] font-extrabold tracking-[-1.5px] text-gray-950 mb-4">Simple, transparent<br /><em className="not-italic text-green-500">pricing.</em></h2>
          <p className="text-[17px] text-gray-500">No hidden fees. Choose the plan that fits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-[24px] p-9 border transition-all hover:shadow-lg relative ${plan.popular ? 'bg-green-800 border-transparent shadow-[0_0_0_1px_rgba(22,168,99,0.2),0_8px_32px_rgba(22,168,99,0.15)]' : 'border-gray-200 bg-white'}`}>
              {plan.popular && <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 bg-green-400 text-green-950 font-display text-[11px] font-bold tracking-[0.06em] uppercase py-1 px-4 rounded-full">Most Popular</div>}
              <div className={`font-display text-sm font-semibold tracking-[0.06em] uppercase mb-4 ${plan.popular ? 'text-green-300' : 'text-gray-500'}`}>{plan.name}</div>
              <div className={`font-display text-[44px] font-extrabold tracking-[-2px] mb-1 ${plan.popular ? 'text-white' : 'text-gray-950'}`}>{plan.price === 'Custom' ? plan.price : <><sup className="text-xl align-super">KES</sup>{plan.price}</>}</div>
              <div className={`text-[13px] mb-7 ${plan.popular ? 'text-white/50' : 'text-gray-400'}`}>{plan.period}</div>
              <div className={`h-px mb-6 ${plan.popular ? 'bg-white/10' : 'bg-gray-100'}`}></div>
              <ul className="list-none mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className={`flex items-center gap-2.5 text-sm py-1.5 ${plan.popular ? 'text-white/80' : 'text-gray-700'}`}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'stroke-green-300' : 'stroke-green-500'}`}><polyline points="20 6 9 17 4 12"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 font-display text-sm font-bold rounded-md transition-all ${plan.popular ? 'bg-green-400 text-green-950 hover:bg-green-300' : 'bg-transparent text-green-700 border-2 border-green-200 hover:bg-green-50'}`}>
                {plan.price === 'Custom' ? 'Contact Sales →' : plan.popular ? 'Start Pro Plan' : 'Get Started Free'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Component
const CTA = () => (
  <section className="py-[100px] bg-gray-950 text-center overflow-hidden relative">
    <div className="max-w-[640px] mx-auto px-10 relative z-10">
      <div className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-green-400 mb-5">Get started today</div>
      <h2 className="text-[52px] font-extrabold text-white leading-[1.05] tracking-[-2px] mb-5">Healthcare that<br />comes to <em className="not-italic text-green-400">you.</em></h2>
      <p className="text-lg text-white/50 mb-10">Join thousands of Kenyans taking control of their health with AfyaLink.</p>
      <div className="flex justify-center gap-3">
        <button className="inline-flex items-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-green-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-green-700 hover:-translate-y-px">Book Your First Consult</button>
        <button className="inline-flex items-center gap-2 font-display text-[15px] font-bold py-4 px-8 rounded-[18px] bg-white/12 text-white border-2 border-white/30 backdrop-blur-sm transition-all hover:bg-white/22">Schedule a Demo</button>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-950 border-t border-white/6">
    <div className="max-w-[1160px] mx-auto px-10">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-15 py-16 pb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-green-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <span className="font-display text-lg font-bold text-white">afya<span className="text-green-400">link</span></span>
          </div>
          <div className="text-sm text-white/40 leading-[1.7] max-w-[220px] mb-6">Your health, connected. Accessible, affordable healthcare for every Kenyan — everywhere.</div>
          <div className="flex gap-2 flex-wrap">
            {['KMPDC Registered', 'SSL Secured', 'HIPAA Compliant'].map((badge, i) => (
              <span key={i} className="font-display text-[10px] font-semibold tracking-[0.05em] text-green-300 bg-green-600/10 border border-green-600/20 py-1 px-2.5 rounded-full">{badge}</span>
            ))}
          </div>
        </div>
        {[
          { title: 'Services', items: ['Consultations', 'Mental Health', 'Lab Tests', 'e-Pharmacy', 'Emergency Care'] },
          { title: 'Company', items: ['About Us', 'Our Doctors', 'Careers', 'Blog', 'Press'] },
          { title: 'Support', items: ['Help Center', 'Privacy Policy', 'Terms of Use', 'Contact Us', 'Status'] }
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-display text-xs font-bold tracking-[0.08em] uppercase text-white/50 mb-4">{col.title}</h4>
            <ul className="list-none">
              {col.items.map((item, j) => (
                <li key={j} className="text-sm text-white/40 py-1.5 cursor-pointer transition-colors hover:text-green-300">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/6 py-5 flex justify-between items-center">
        <div className="text-[13px] text-white/30">© 2025 AfyaLink Technologies Ltd. All rights reserved. Nairobi, Kenya.</div>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Cookies'].map((link, i) => (
            <a key={i} href="#" className="text-[13px] text-white/30 no-underline hover:text-green-400">{link}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default App;