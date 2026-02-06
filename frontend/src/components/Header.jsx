import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Phone, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import { companyInfo, contactInfo } from '../data/mock';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Fleet', href: '/#fleet' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Admin', href: '/admin' },
  ];

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.replace('/#', '');
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1c1b]/95 backdrop-blur-sm border-b border-[rgba(63,72,22,0.5)]">
        <div className="max-w-[87.5rem] mx-auto px-6 md:px-10 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={companyInfo.logo} 
                alt="CorpCruise Logo" 
                className="w-10 h-10 object-contain"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-[#d9fb06] font-bold text-xl tracking-tight leading-tight">
                  {companyInfo.name}
                </span>
                <span className="text-[#888680] text-[10px] font-medium uppercase tracking-wider">
                  {companyInfo.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-[#d9fb06] font-medium text-sm px-4 py-2 hover:text-[rgba(217,251,6,0.8)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-[#d9fb06] font-medium text-sm px-4 py-2 hover:text-[rgba(217,251,6,0.8)] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 text-[#d9fb06] hover:text-[rgba(217,251,6,0.8)] transition-colors duration-300"
                >
                  <Phone size={16} />
                  <span className="text-sm font-semibold">{contactInfo.phone}</span>
                </a>
                <span className="flex items-center gap-1 text-[#888680] text-xs">
                  <Clock size={12} />
                  {contactInfo.availability}
                </span>
              </div>
              <Button
                onClick={handleBookNow}
                className="bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full px-6 py-2 font-semibold text-sm uppercase tracking-tight transition-all duration-300"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-[#d9fb06] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-[rgba(63,72,22,0.5)] pt-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-[#d9fb06] font-medium text-base px-4 py-3 hover:bg-[#302f2c] rounded-lg transition-colors duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[#d9fb06] font-medium text-base px-4 py-3 hover:bg-[#302f2c] rounded-lg transition-colors duration-300"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3 px-4">
                <div className="flex flex-col">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-2 text-[#d9fb06]"
                  >
                    <Phone size={18} />
                    <span className="font-semibold">{contactInfo.phone}</span>
                  </a>
                  <span className="flex items-center gap-1 text-[#888680] text-xs ml-6">
                    <Clock size={12} />
                    {contactInfo.availability}
                  </span>
                </div>
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 rounded-full py-3 font-semibold text-sm uppercase"
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
};

export default Header;
