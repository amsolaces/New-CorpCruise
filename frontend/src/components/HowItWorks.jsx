import React from 'react';
import { CheckCircle } from 'lucide-react';
import { howItWorksData } from '../data/mock';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#302f2c] py-24 md:py-32">
      <div className="max-w-[87.5rem] mx-auto px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
            Simple Process
          </span>
          <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)' }}>
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#3f4816] -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {howItWorksData.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] p-8 text-center transition-all duration-300 hover:border-[#3f4816]">
                  {/* Step Number */}
                  <div className="relative z-10 w-20 h-20 bg-[#d9fb06] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-[#1a1c1b] font-black text-3xl">
                      {step.step}
                    </span>
                  </div>
                  
                  <h3 className="text-[#d9fb06] font-semibold text-xl mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#888680] font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow for non-last items on desktop */}
                {index < howItWorksData.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                    <div className="w-6 h-6 bg-[#302f2c] rotate-45 border-t border-r border-[#3f4816]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#888680] font-medium text-lg mb-6">
            Ready to elevate your corporate transportation?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-[#d9fb06]">
              <CheckCircle size={20} />
              <span className="font-medium">No hidden fees</span>
            </div>
            <div className="flex items-center gap-2 text-[#d9fb06]">
              <CheckCircle size={20} />
              <span className="font-medium">Flexible billing</span>
            </div>
            <div className="flex items-center gap-2 text-[#d9fb06]">
              <CheckCircle size={20} />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
