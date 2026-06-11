import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'For Patients', href: '/patients' },
    { name: 'For Providers', href: '/providers' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`sticky top-0 z-[1000] transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-[20px] shadow-sm' : 'bg-white/92 backdrop-blur-[20px]'
    } border-b border-gray-100`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[68px] max-w-[1160px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_2px_8px_rgba(22,168,99,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-[22px] h-[22px]">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <span className="font-display text-[20px] font-bold text-gray-900 tracking-[-0.5px]">
            afya<span className="text-brand-600">link</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-0.5 list-none">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="font-display text-sm font-medium text-gray-600 no-underline px-3.5 py-1.5 rounded-[8px] transition-all hover:text-brand-700 hover:bg-brand-50"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <button className="font-display text-sm font-medium text-gray-700 bg-none border border-gray-200 py-2 px-4 rounded-md transition-all hover:border-brand-400 hover:text-brand-700">
                  Dashboard
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                className="font-display text-sm font-medium text-red-600 bg-none border border-red-200 py-2 px-4 rounded-md transition-all hover:bg-red-50"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-semibold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="font-display text-sm font-medium text-gray-700 bg-none border border-gray-200 py-2 px-[18px] rounded-md transition-all hover:border-brand-400 hover:text-brand-700">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center gap-2 font-display text-sm font-bold py-2.5 px-5 rounded-md bg-brand-600 text-white shadow-[0_4px_14px_rgba(22,168,99,0.35)] transition-all hover:bg-brand-700 hover:-translate-y-px">
                  Get Started →
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-brand-600 hover:bg-brand-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-display text-sm font-medium text-gray-600 no-underline px-3.5 py-2 rounded-[8px] transition-all hover:text-brand-700 hover:bg-brand-50"
                >
                  {link.name}
                </a>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left font-display text-sm font-medium text-gray-700 px-3.5 py-2 rounded-md hover:bg-brand-50">
                      Dashboard
                    </button>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left font-display text-sm font-medium text-red-600 px-3.5 py-2 rounded-md hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left font-display text-sm font-medium text-gray-700 px-3.5 py-2 rounded-md hover:bg-brand-50">
                      Log in
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left font-display text-sm font-bold text-brand-600 px-3.5 py-2 rounded-md hover:bg-brand-50">
                      Get Started →
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;