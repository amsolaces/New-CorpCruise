import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { heroData } from '../data/mock';
import BookingModal from './BookingModal';

const HeroSection = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center bg-[#1a1c1b] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroData.backgroundImage}
          alt="Luxury corporate transportation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1b] via-[#1a1c1b]/90 to-transparent" />
        <div className="absolute inset-0 bg-[#1a1c1b]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[87.5rem] mx-auto px-10 py-40 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#3f4816]/50 border border-[#3f4816] rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#d9fb06] rounded-full animate-pulse" />
            <span className="text-[#d9fb06] text-sm font-medium uppercase tracking-wider">
              Corporate Ground Transportation
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-[#d9fb06] uppercase leading-[0.85] mb-6"
              style={{ fontSize: 'clamp(3.5rem, 5vw + 1rem, 6rem)' }}>
            {heroData.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-[#d9fb06]/80 text-xl md:text-2xl font-medium leading-relaxed mb-10 max-w-2xl">
            {heroData.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full px-8 py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 inline-flex items-center gap-2"
            >
              {heroData.ctaPrimary}
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-8 py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300"
            >
              {heroData.ctaSecondary}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-12">
            {[
              { value: '10K+', label: 'Corporate Rides' },
              { value: '500+', label: 'Business Clients' },
              { value: '99.8%', label: 'On-Time Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-left">
                <div className="text-[#d9fb06] text-4xl md:text-5xl font-black">
                  {stat.value}
                </div>
                <div className="text-[#888680] text-sm font-medium uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[#888680] text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="text-[#d9fb06]" size={24} />
      </div>
    </section>
  );
};

export default HeroSection;
