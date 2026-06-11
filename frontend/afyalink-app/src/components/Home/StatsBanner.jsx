import React, { useEffect, useRef, useState } from 'react';

const StatsBanner = () => {
  const [counts, setCounts] = useState({ patients: 0, providers: 0, facilities: 0, satisfaction: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { key: 'patients', label: 'Happy Patients', target: 5000, suffix: '+' },
    { key: 'providers', label: 'Healthcare Providers', target: 200, suffix: '+' },
    { key: 'facilities', label: 'Partner Facilities', target: 50, suffix: '+' },
    { key: 'satisfaction', label: 'Satisfaction Rate', target: 98, suffix: '%' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumbers();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    stats.forEach((stat) => {
      let start = 0;
      const duration = 2000;
      const increment = stat.target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= stat.target) {
          setCounts(prev => ({ ...prev, [stat.key]: stat.target }));
          clearInterval(timer);
        } else {
          setCounts(prev => ({ ...prev, [stat.key]: Math.floor(start) }));
        }
      }, 16);
    });
  };

  return (
    <div className="bg-gradient-to-br from-brand-800 via-brand-600 to-teal-500" ref={sectionRef}>
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="py-12 px-8 text-center border-r border-white/15 last:border-r-0">
              <div className="font-display text-[48px] font-extrabold text-white tracking-[-2px] leading-none mb-2">
                {counts[stat.key]}{stat.suffix}
              </div>
              <div className="text-sm text-white/70 font-normal">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;