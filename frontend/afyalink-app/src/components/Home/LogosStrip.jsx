import React from 'react';

const LogosStrip = () => {
  const logos = [
    'AAR Healthcare',
    "Gertrude's Children's Hospital",
    'The Nairobi Hospital',
    'Medhealers Care & Beyond',
    'LVCT Health',
    'PharmAccess Foundation'
  ];

  return (
    <div className="border-t border-gray-100 border-b border-gray-100 py-8 overflow-hidden">
      <div className="text-center font-display text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-6">
        Trusted by leading healthcare organizations
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-16 w-max animate-[ticker_22s_linear_infinite]">
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center gap-2 font-display text-sm font-bold text-gray-400 whitespace-nowrap opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v2l10 5 10-5v-2l-10 5z"/>
              </svg>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogosStrip;