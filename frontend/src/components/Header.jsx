import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Phone } from 'lucide-react';
import BookingModal from './BookingModal';

const Header = ({ onBookNow }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1c1b]/95 backdrop-blur-sm border-b border-[rgba(63,72,22,0.5)]">
        <div className="max-w-[87.5rem] mx-auto px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d9fb06] rounded-full flex items-center justify-center">
                <span className="text-[#1a1c1b] font-bold text-lg">TC</span>
              </div>
              <span className="text-[#d9fb06] font-semibold text-xl tracking-tight hidden sm:block">
                The Corp Cruise
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#d9fb06] font-medium text-sm px-4 py-2 hover:text-[rgba(217,251,6,0.8)] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+18005550000"
                className="flex items-center gap-2 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300"
              >
                <Phone size={18} />
                <span className="text-sm font-medium">+1 (800) 555-CORP</span>
              </a>
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
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[#d9fb06] font-medium text-base px-4 py-3 hover:bg-[#302f2c] rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3 px-4">
                <a
                  href="tel:+18005550000"
                  className="flex items-center gap-2 text-[#888680]"
                >
                  <Phone size={18} />
                  <span className="text-sm font-medium">+1 (800) 555-CORP</span>
                </a>
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
