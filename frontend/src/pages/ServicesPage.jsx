import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { Briefcase, Plane, Shield, Calendar, Route, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { servicesData, companyInfo } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';

const iconMap = {
  Briefcase,
  Plane,
  Shield,
  Calendar,
  Route,
};

const ServicesPage = () => {
  const handleRequestAccount = () => {
    window.location.href = 'mailto:booking@thecorpcruise.com?subject=Corporate%20Account%20Request';
  };

  return (
    <div className="min-h-screen bg-[#1a1c1b]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#1a1c1b]">
        <div className="max-w-[87.5rem] mx-auto px-6 md:px-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300 mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="max-w-3xl">
            <span className="text-[#888680] text-sm font-medium uppercase tracking-widest mb-4 block">
              Our Services
            </span>
            <h1 className="font-black text-[#d9fb06] uppercase leading-[0.85] mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)' }}>
              Complete Corporate Transportation Solutions
            </h1>
            <p className="text-[#888680] font-medium text-lg leading-relaxed">
              {companyInfo.name} offers comprehensive ground transportation services designed specifically for modern businesses. From daily commutes to large-scale corporate events, we handle every aspect with precision and professionalism.
            </p>
          </div>
        </div>
      </section>

      {/* Services Accordion Section */}
      <section className="py-16 md:py-24 bg-[#302f2c]">
        <div className="max-w-[87.5rem] mx-auto px-6 md:px-10">
          <Accordion type="single" collapsible className="space-y-4">
            {servicesData.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              return (
                <AccordionItem 
                  key={service.id} 
                  value={`service-${service.id}`}
                  className="bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] data-[state=open]:border-[#d9fb06] transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 md:px-8 py-6 hover:no-underline group">
                    <div className="flex items-center gap-4 md:gap-6 text-left w-full">
                      {/* Number */}
                      <span className="text-[#3f4816] group-data-[state=open]:text-[#d9fb06] font-black text-3xl md:text-4xl transition-colors duration-300 w-12 flex-shrink-0">
                        0{index + 1}
                      </span>
                      
                      {/* Icon */}
                      <div className="w-12 h-12 bg-[#302f2c] group-data-[state=open]:bg-[#d9fb06] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300">
                        <IconComponent
                          className="text-[#d9fb06] group-data-[state=open]:text-[#1a1c1b] transition-colors duration-300"
                          size={24}
                        />
                      </div>
                      
                      {/* Title & Description */}
                      <div className="flex-grow">
                        <h3 className="text-[#d9fb06] font-semibold text-lg md:text-xl">
                          {service.title}
                        </h3>
                        <p className="text-[#888680] font-medium text-sm md:text-base mt-1 hidden sm:block">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 md:px-8 pb-8">
                    <div className="pt-4 border-t border-[rgba(63,72,22,0.5)]">
                      {/* Full Description */}
                      <p className="text-[#d9fb06]/80 font-medium leading-relaxed mb-8">
                        {service.fullDescription}
                      </p>
                      
                      {/* Features Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#3f4816] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="text-[#d9fb06]" size={14} />
                            </div>
                            <span className="text-[#888680] font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleRequestAccount}
                          className="bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full px-6 py-3 font-semibold text-sm uppercase tracking-tight transition-all duration-300 inline-flex items-center gap-2"
                        >
                          Inquire About This Service
                          <ArrowRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#1a1c1b]">
        <div className="max-w-[87.5rem] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-black text-[#d9fb06] uppercase leading-[0.85] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw + 1rem, 3.5rem)' }}>
            Ready to Get Started?
          </h2>
          <p className="text-[#888680] font-medium text-lg mb-8 max-w-2xl mx-auto">
            Contact our team today to discuss your corporate transportation needs and receive a customized solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRequestAccount}
              className="bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full px-8 py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 inline-flex items-center gap-2"
            >
              Request Corporate Account
              <ArrowRight size={20} />
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-8 py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 w-full sm:w-auto"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
