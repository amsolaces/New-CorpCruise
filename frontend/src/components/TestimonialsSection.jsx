import React from 'react';
import { Quote } from 'lucide-react';
import { testimonialsData } from '../data/mock';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="bg-[#1a1c1b] py-24 md:py-32">
      <div className="max-w-[87.5rem] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
            Testimonials
          </span>
          <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85]"
              style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)' }}>
            What Our<br />Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-8 transition-all duration-300 hover:border-[#3f4816]"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-[#3f4816] rounded-full flex items-center justify-center mb-6">
                <Quote className="text-[#d9fb06]" size={24} />
              </div>
              
              {/* Quote Text */}
              <p className="text-[#d9fb06] font-medium text-base leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="border-t border-[rgba(63,72,22,0.5)] pt-6">
                <div className="font-semibold text-[#d9fb06]">
                  {testimonial.author}
                </div>
                <div className="text-[#888680] text-sm font-medium">
                  {testimonial.position}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
