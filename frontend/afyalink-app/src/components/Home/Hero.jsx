import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20 px-0 overflow-hidden relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-15 items-center">
          {/* Left Content */}
          <div className="animate-[fadeUp_0.7s_ease-out_both]">
            <div className="mb-6 lg:mb-7">
              <div className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold tracking-[0.08em] uppercase text-brand-600 bg-brand-50 border border-brand-200 rounded-full py-1 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-ring"></span>
                Smart Healthcare. Connected Care.
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-[-2px] text-gray-950 mb-4 lg:mb-5">
              Healthcare made<br />
              <em className="not-italic text-brand-500">simple,</em>{' '}
              <span className="text-teal-500">connected</span><br />
              &amp; accessible.
            </h1>
            <p className="text-base lg:text-[17px] text-gray-500 leading-[1.75] max-w-[460px] mb-6 lg:mb-9">
              AfyaLink is your all-in-one platform to manage appointments, medical records, 
              prescriptions and much more — securely and anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8 lg:mb-10">
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="inline-flex items-center justify-center gap-2 font-display text-[15px] font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-[18px] bg-brand-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-brand-700 hover:-translate-y-px"
              >
                {isAuthenticated ? 'Go to Dashboard →' : 'Get Started Free →'}
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="inline-flex items-center justify-center gap-2 font-display text-[15px] font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-[18px] bg-transparent text-brand-700 border-2 border-brand-300 transition-all hover:bg-brand-50 hover:border-brand-500"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Book a Demo
              </button>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="flex">
                {['AW', 'JO', 'FM', 'SK'].map((init, i) => (
                  <span key={i} className={`w-[34px] h-[34px] rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold font-display text-white -ml-2.5 first:ml-0 ${
                    i === 0 ? 'bg-brand-700' : i === 1 ? 'bg-brand-600' : i === 2 ? 'bg-teal-500' : 'bg-brand-800'
                  }`}>
                    {init}
                  </span>
                ))}
              </div>
              <div>
                <div className="text-amber-500 tracking-[1px] text-[13px]">★★★★★</div>
                <div className="text-[13px] text-gray-500">
                  <strong className="text-gray-800 font-semibold">Trusted by 5,000+</strong> patients and healthcare providers
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual - Dashboard Mockup */}
          <div className="animate-[fadeUp_0.7s_0.15s_ease-out_both] relative mt-8 lg:mt-0">
            {/* Floating Card 1 - Revenue */}
            <div className="absolute -bottom-4 -left-4 lg:bottom-[-24px] lg:left-[-30px] bg-white rounded-[18px] shadow-lg border border-gray-100 p-3 hidden sm:block animate-[float_5s_0.5s_ease-in-out_infinite] z-10">
              <div className="font-display text-[10px] font-semibold text-gray-500 mb-1">Today's Revenue</div>
              <div className="font-display text-lg font-extrabold text-gray-900">KES 245K</div>
              <div className="text-[10px] text-green-600 font-semibold">↑ 15% from yesterday</div>
            </div>

            {/* Main Dashboard */}
            <div className="bg-white border border-gray-200 rounded-[24px] shadow-lg overflow-hidden relative z-20">
              {/* Dashboard Bar */}
              <div className="bg-gray-950 py-3.5 px-5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                </div>
                <div className="font-display text-xs font-medium text-white/50">AfyaLink Provider Portal</div>
                <div className="w-[52px]"></div>
              </div>

              {/* Dashboard Body */}
              <div className="grid grid-cols-[160px_1fr]">
                {/* Sidebar */}
                <div className="bg-gray-950 py-4 border-r border-white/10">
                  <div className="flex items-center gap-2 px-4 pb-3.5 border-b border-white/10 mb-2.5">
                    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                    <span className="font-display text-xs font-bold text-white">afyalink</span>
                  </div>
                  
                  {/* Sidebar Menu Items */}
                  {['Dashboard', 'Appointments', 'Patients', 'Records', 'Analytics'].map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-4 py-2 text-[11px] font-display transition-all cursor-pointer ${
                      idx === 0 ? 'bg-green-600/15 text-green-300 border-r-2 border-green-400' : 'text-white/45 hover:bg-white/5'
                    }`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 opacity-60">
                        {idx === 0 && (
                          <>
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                          </>
                        )}
                        {idx === 1 && (
                          <>
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </>
                        )}
                        {idx === 2 && (
                          <>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </>
                        )}
                        {idx === 3 && (
                          <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </>
                        )}
                        {idx === 4 && (
                          <>
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                          </>
                        )}
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="p-4 bg-gray-50">
                  <div className="font-display text-xs font-semibold text-gray-800">Good morning, Dr. Mercy 👋</div>
                  <div className="text-[10px] text-gray-400 mb-3">Here's what's happening with your patients today.</div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-white rounded-[8px] border border-gray-200 p-2">
                      <div className="text-[9px] text-gray-400 font-display mb-0.5">Appointments</div>
                      <div className="font-display text-base font-bold text-gray-900">24</div>
                      <div className="text-[9px] text-green-600 font-medium">↑ 12% today</div>
                    </div>
                    <div className="bg-white rounded-[8px] border border-gray-200 p-2">
                      <div className="text-[9px] text-gray-400 font-display mb-0.5">Patients</div>
                      <div className="font-display text-base font-bold text-gray-900">520</div>
                      <div className="text-[9px] text-green-600 font-medium">↑ 8% this week</div>
                    </div>
                    <div className="bg-white rounded-[8px] border border-gray-200 p-2">
                      <div className="text-[9px] text-gray-400 font-display mb-0.5">Consultations</div>
                      <div className="font-display text-base font-bold text-gray-900">18</div>
                      <div className="text-[9px] text-green-600 font-medium">↑ 15% today</div>
                    </div>
                    <div className="bg-white rounded-[8px] border border-gray-200 p-2">
                      <div className="text-[9px] text-gray-400 font-display mb-0.5">Revenue</div>
                      <div className="font-display text-[13px] font-bold text-gray-900">KES 245K</div>
                      <div className="text-[9px] text-green-600 font-medium">↑ 15% today</div>
                    </div>
                  </div>

                  {/* Today's Appointments */}
                  <div className="bg-white rounded-[8px] border border-gray-200 p-2.5">
                    <div className="font-display text-[10px] font-semibold text-gray-700 mb-2">Today's Appointments</div>
                    
                    {/* Appointment 1 */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white font-display">SM</div>
                      <div className="flex-1">
                        <div className="font-display text-[9px] font-semibold text-gray-800">Samuel Mwangi</div>
                        <div className="text-[9px] text-gray-400">General Checkup</div>
                      </div>
                      <div className="text-[9px] text-gray-500 font-display">09:00 AM</div>
                      <div className="text-[8px] font-semibold font-display py-0.5 px-[7px] rounded-[10px] bg-green-50 text-green-700">Confirmed</div>
                    </div>
                    
                    {/* Appointment 2 */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white font-display">GN</div>
                      <div className="flex-1">
                        <div className="font-display text-[9px] font-semibold text-gray-800">Grace Njeri</div>
                        <div className="text-[9px] text-gray-400">Consultation</div>
                      </div>
                      <div className="text-[9px] text-gray-500 font-display">10:30 AM</div>
                      <div className="text-[8px] font-semibold font-display py-0.5 px-[7px] rounded-[10px] bg-green-50 text-green-700">Confirmed</div>
                    </div>
                    
                    {/* Appointment 3 */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white font-display">PO</div>
                      <div className="flex-1">
                        <div className="font-display text-[9px] font-semibold text-gray-800">Peter Okemo</div>
                        <div className="text-[9px] text-gray-400">Follow-up</div>
                      </div>
                      <div className="text-[9px] text-gray-500 font-display">12:00 PM</div>
                      <div className="text-[8px] font-semibold font-display py-0.5 px-[7px] rounded-[10px] bg-yellow-50 text-yellow-700">Pending</div>
                    </div>
                    
                    {/* Appointment 4 */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-none">
                      <div className="w-6 h-6 rounded-full bg-green-800 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white font-display">LA</div>
                      <div className="flex-1">
                        <div className="font-display text-[9px] font-semibold text-gray-800">Lydia Achieng</div>
                        <div className="text-[9px] text-gray-400">Lab Review</div>
                      </div>
                      <div className="text-[9px] text-gray-500 font-display">02:30 PM</div>
                      <div className="text-[8px] font-semibold font-display py-0.5 px-[7px] rounded-[10px] bg-green-50 text-green-700">Confirmed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - AI Assistant */}
            <div className="absolute -top-4 -right-2 lg:top-[-20px] lg:right-[-24px] bg-white rounded-[18px] shadow-lg border border-gray-100 p-3 hidden sm:block animate-[float_5.5s_1s_ease-in-out_infinite] z-10">
              <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center mb-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 stroke-brand-600">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <div className="font-display text-[10px] font-bold text-brand-700">AI Health Assistant</div>
              <div className="text-[10px] text-gray-500 max-w-[120px] mt-0.5">Ask about symptoms, drugs, treatments...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;