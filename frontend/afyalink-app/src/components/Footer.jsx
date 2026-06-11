import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Book a Demo', href: '/demo' },
        { name: 'Log in', href: '/login' },
        { name: 'Sign up', href: '/register' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { name: 'For Patients', href: '/patients' },
        { name: 'For Providers', href: '/providers' },
        { name: 'Enterprise', href: '/enterprise' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 border-t border-white/6">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-15 py-12 lg:py-16 pb-8 lg:pb-12">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-brand-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-white">afya<span className="text-brand-400">link</span></span>
            </Link>
            <div className="text-sm text-white/40 leading-[1.7] max-w-[220px] mb-6">
              Your health, connected. Accessible, affordable healthcare for every Kenyan — everywhere.
            </div>
            <div className="flex gap-2 flex-wrap">
              {['KMPDC Registered', 'SSL Secured', 'HIPAA Compliant'].map((badge, i) => (
                <span key={i} className="font-display text-[10px] font-semibold tracking-[0.05em] text-brand-300 bg-brand-600/10 border border-brand-600/20 py-1 px-2.5 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-xs font-bold tracking-[0.08em] uppercase text-white/50 mb-4">
                {section.title}
              </h4>
              <ul className="list-none space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-white/40 no-underline hover:text-brand-300 transition block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[13px] text-white/30">
            © 2025 AfyaLink Technologies Ltd. All rights reserved. Nairobi, Kenya.
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[13px] text-white/30 no-underline hover:text-brand-400">
              Privacy
            </Link>
            <Link to="/terms" className="text-[13px] text-white/30 no-underline hover:text-brand-400">
              Terms
            </Link>
            <Link to="/cookies" className="text-[13px] text-white/30 no-underline hover:text-brand-400">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;