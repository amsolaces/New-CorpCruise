import React from 'react';
import { Briefcase, Plane, Shield, Calendar, Route, ArrowRight } from 'lucide-react';
import { servicesData } from '../data/mock';

const iconMap = {
  Briefcase,
  Plane,
  Shield,
  Calendar,
  Route,
};

const ServicesSection = () => {
  return (
    <section id="services" className="bg-[#302f2c] py-24 md:py-32">
      <div className="max-w-[87.5rem] mx-auto px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
              Our Services
            </span>
            <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)' }}>
              Tailored Corporate<br />Solutions
            </h2>
          </div>
          <p className="text-[#888680] font-medium text-lg max-w-md leading-relaxed">
            Comprehensive ground transportation services designed for modern businesses and corporate teams.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {servicesData.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="group bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 transition-all duration-300 hover:bg-[#3f4816] hover:border-[#3f4816] cursor-pointer"
              >
                {/* Number */}
                <div className="text-[#3f4816] group-hover:text-[#d9fb06] font-black text-5xl md:text-6xl transition-colors duration-300 w-20 flex-shrink-0">
                  0{index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-[#302f2c] group-hover:bg-[#d9fb06] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <IconComponent
                    className="text-[#d9fb06] group-hover:text-[#1a1c1b] transition-colors duration-300"
                    size={26}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-[#d9fb06] font-semibold text-xl md:text-2xl mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[#888680] font-medium leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="text-[#d9fb06]" size={28} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
