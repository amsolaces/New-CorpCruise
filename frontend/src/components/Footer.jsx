import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Twitter, Instagram, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contactInfo, companyInfo } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Corporate Commute', href: '/services' },
      { label: 'Airport Transfers', href: '/services' },
      { label: 'VIP Movement', href: '/services' },
      { label: 'Event Transportation', href: '/services' },
      { label: 'Intercity Travel', href: '/services' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Our Fleet', href: '/#fleet' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-[#1a1c1b] border-t border-[rgba(63,72,22,0.5)]">
      <div className="max-w-[87.5rem] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={companyInfo.logo} 
                alt="CorpCruise Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-[#d9fb06] font-bold text-xl tracking-tight">
                  {companyInfo.name}
                </span>
                <span className="text-[#888680] text-xs font-medium uppercase tracking-wider">
                  {companyInfo.tagline}
                </span>
              </div>
            </div>
            <p className="text-[#888680] font-medium mb-6 max-w-sm leading-relaxed">
              Premium corporate ground transportation for businesses that demand excellence, reliability, and professionalism.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-[#d9fb06] hover:text-[rgba(217,251,6,0.8)] transition-colors duration-300">
                <Phone size={18} />
                <span className="font-semibold">{contactInfo.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-[#888680] ml-7">
                <Clock size={14} />
                <span className="text-sm font-medium">{contactInfo.availability}</span>
              </div>
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300">
                <Mail size={18} />
                <span className="font-medium">{contactInfo.email}</span>
              </a>
              <div className="flex items-center gap-3 text-[#888680]">
                <MapPin size={18} />
                <span className="font-medium">{contactInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[#d9fb06] font-semibold text-sm uppercase tracking-wider mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#888680] hover:text-[#d9fb06] font-medium transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[#d9fb06] font-semibold text-sm uppercase tracking-wider mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#888680] hover:text-[#d9fb06] font-medium transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#d9fb06] font-semibold text-sm uppercase tracking-wider mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#888680] hover:text-[#d9fb06] font-medium transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(63,72,22,0.5)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#888680] text-sm font-medium">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-[#302f2c] rounded-full flex items-center justify-center text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] transition-all duration-300"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-[#302f2c] rounded-full flex items-center justify-center text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] transition-all duration-300"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-[#302f2c] rounded-full flex items-center justify-center text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
