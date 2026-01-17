import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you! Our team will contact you shortly.');
    setFormData({ name: '', email: '', company: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="bg-[#3f4816] py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d9fb06] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d9fb06] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-[87.5rem] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-[#d9fb06]/80 text-sm font-medium uppercase tracking-widest mb-4 block">
              Get Started Today
            </span>
            <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85] mb-6"
                style={{ fontSize: 'clamp(2.5rem, 4vw + 1rem, 4rem)' }}>
              Upgrade Your<br />Corporate Travel
            </h2>
            <p className="text-[#d9fb06]/80 font-medium text-lg mb-8 leading-relaxed">
              Join hundreds of businesses that trust The Corp Cruise for their executive transportation needs.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Dedicated corporate account manager',
                'Customized billing and invoicing',
                'Priority booking and 24/7 support',
                'Volume discounts for enterprise clients'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-[#d9fb06]" size={20} />
                  <span className="text-[#d9fb06] font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] p-8 md:p-10">
            <h3 className="text-[#d9fb06] font-semibold text-2xl mb-2">
              Request Corporate Account
            </h3>
            <p className="text-[#888680] font-medium mb-8">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-[#302f2c] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680] h-12 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#302f2c] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680] h-12 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="bg-[#302f2c] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680] h-12 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Tell us about your transportation needs"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-[#302f2c] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680] resize-none focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <ArrowRight size={20} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
