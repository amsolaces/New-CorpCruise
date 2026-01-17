import React from 'react';
import { UserCheck, Car, Clock, Receipt, Headphones, MapPin } from 'lucide-react';
import { whyChooseUsData } from '../data/mock';

const iconMap = {
  UserCheck,
  Car,
  Clock,
  Receipt,
  Headphones,
  MapPin,
};

const WhyChooseUs = () => {
  return (
    <section className="bg-[#1a1c1b] py-24 md:py-32">
      <div className="max-w-[87.5rem] mx-auto px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
            Why Choose Us
          </span>
          <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)' }}>
            Corporate Excellence,<br />Every Mile
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsData.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-8 transition-all duration-300 hover:bg-[#3f4816] hover:border-[#3f4816]"
              >
                <div className="w-14 h-14 bg-[#3f4816] group-hover:bg-[#d9fb06] rounded-full flex items-center justify-center mb-6 transition-all duration-300">
                  <IconComponent
                    className="text-[#d9fb06] group-hover:text-[#1a1c1b] transition-colors duration-300"
                    size={28}
                  />
                </div>
                <h3 className="text-[#d9fb06] font-semibold text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#888680] font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
