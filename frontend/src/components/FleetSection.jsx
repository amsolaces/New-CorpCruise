import React from 'react';
import { Users, Check } from 'lucide-react';
import { fleetData } from '../data/mock';

const FleetSection = () => {
  return (
    <section id="fleet" className="bg-[#1a1c1b] py-24 md:py-32">
      <div className="max-w-[87.5rem] mx-auto px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
            Our Fleet
          </span>
          <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)' }}>
            Premium Vehicles<br />For Every Need
          </h2>
          <p className="text-[#888680] font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Meticulously maintained, fully equipped luxury vehicles ready to deliver executive-class comfort.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {fleetData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group bg-[#302f2c] border border-[rgba(63,72,22,0.5)] overflow-hidden transition-all duration-300 hover:border-[#3f4816]"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#302f2c] to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#d9fb06] font-semibold text-xl">
                    {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#888680]">
                    <Users size={18} />
                    <span className="text-sm font-medium">{vehicle.capacity}</span>
                  </div>
                </div>
                
                <p className="text-[#888680] font-medium mb-6 leading-relaxed">
                  {vehicle.description}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="text-[#d9fb06]" size={16} />
                      <span className="text-[#888680] text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
