import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: 'Basic',
      price: '0',
      period: 'Free forever',
      popular: false,
      features: [
        '2 consultations/month',
        'Basic medical records',
        'Appointment reminders',
        'Community health tips'
      ]
    },
    {
      name: 'Pro',
      price: '1,499',
      period: 'per month',
      popular: true,
      features: [
        'Unlimited consultations',
        'Full medical records & history',
        'AI Health Assistant access',
        'e-Pharmacy with delivery',
        'Priority support 24/7'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'for organizations',
      popular: false,
      features: [
        'Everything in Pro',
        'Multi-facility management',
        'Custom analytics & reports',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <section className="py-[100px] bg-white" id="pricing">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-[520px] mx-auto mb-16 reveal">
          <div className="eyebrow">Pricing</div>
          <h2 className="text-[42px] font-extrabold tracking-[-1.5px] text-gray-950 mb-4">
            Simple, transparent<br /><em className="not-italic text-brand-500">pricing.</em>
          </h2>
          <p className="text-[17px] text-gray-500">No hidden fees. Choose the plan that fits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-[24px] p-9 border transition-all hover:shadow-lg relative ${
                plan.popular
                  ? 'bg-brand-800 border-transparent shadow-[0_0_0_1px_rgba(22,168,99,0.2),0_8px_32px_rgba(22,168,99,0.15)]'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 bg-brand-400 text-brand-950 font-display text-[11px] font-bold tracking-[0.06em] uppercase py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`font-display text-sm font-semibold tracking-[0.06em] uppercase mb-4 ${
                plan.popular ? 'text-brand-300' : 'text-gray-500'
              }`}>
                {plan.name}
              </div>
              <div className={`font-display text-[44px] font-extrabold tracking-[-2px] mb-1 ${
                plan.popular ? 'text-white' : 'text-gray-950'
              }`}>
                {plan.price === 'Custom' ? (
                  plan.price
                ) : (
                  <>
                    <sup className="text-xl align-super">KES</sup>
                    {plan.price}
                  </>
                )}
              </div>
              <div className={`text-[13px] mb-7 ${plan.popular ? 'text-white/50' : 'text-gray-400'}`}>
                {plan.period}
              </div>
              <div className={`h-px mb-6 ${plan.popular ? 'bg-white/10' : 'bg-gray-100'}`} />
              <ul className="list-none mb-8 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-2.5 text-sm py-1 ${
                    plan.popular ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0 stroke-green-500">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(plan.price === 'Custom' ? '/contact' : '/register')}
                className={`w-full py-3 font-display text-sm font-bold rounded-md transition-all ${
                  plan.popular
                    ? 'bg-brand-400 text-brand-950 hover:bg-brand-300'
                    : 'bg-transparent text-brand-700 border-2 border-brand-200 hover:bg-brand-50'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales →' : plan.popular ? 'Start Pro Plan' : 'Get Started Free'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;