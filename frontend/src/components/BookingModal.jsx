import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, Phone, Mail, Loader2, X, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { contactInfo } from '../data/mock';

const BookingModal = ({ isOpen, onClose }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast.error('Please enter your corporate access code');
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check against generated codes in localStorage
    const savedCodes = localStorage.getItem('corpcruise_codes');
    let codes = savedCodes ? JSON.parse(savedCodes) : [];
    
    const matchingCode = codes.find(c => c.code === accessCode.toUpperCase() && !c.used);
    
    if (matchingCode) {
      // Mark code as used
      codes = codes.map(c => {
        if (c.code === accessCode.toUpperCase()) {
          return {
            ...c,
            used: true,
            usedAt: new Date().toISOString(),
            usedBy: 'User'
          };
        }
        return c;
      });
      localStorage.setItem('corpcruise_codes', JSON.stringify(codes));
      
      setIsVerified(true);
      toast.success('Access verified! Redirecting to booking...');
      
      // Simulate redirect after verification
      setTimeout(() => {
        setIsVerified(false);
        setAccessCode('');
        onClose();
        toast.info('Booking portal ready. Please contact us to complete your booking.');
        // Open email for booking
        window.location.href = 'mailto:booking@thecorpcruise.com?subject=Ride%20Booking%20Request&body=My%20access%20code%3A%20' + accessCode.toUpperCase();
      }, 2000);
    } else if (codes.find(c => c.code === accessCode.toUpperCase() && c.used)) {
      toast.error('This code has already been used. Please contact admin for a new code.');
    } else {
      toast.error('Invalid access code. Please check and try again.');
    }
    
    setIsVerifying(false);
  };

  const handleClose = () => {
    setAccessCode('');
    setIsVerified(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          {/* Icon */}
          <div className="w-16 h-16 bg-[#3f4816] rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-[#d9fb06]" size={32} />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-[#d9fb06] font-black text-2xl md:text-3xl uppercase tracking-tight block">
                Corporate Access
              </span>
              <span className="text-[#d9fb06] font-black text-2xl md:text-3xl uppercase tracking-tight block">
                Required
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-[#888680] text-center mt-4 font-medium">
            Enter your corporate access code to book a ride
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="px-8 pb-8">
          <div className="mb-6">
            <label className="text-[#d9fb06] text-sm font-semibold uppercase tracking-wider block mb-3">
              Access Code
            </label>
            <Input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="E.g., CORP-ABC-2024-001"
              disabled={isVerifying || isVerified}
              className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-14 text-lg font-medium tracking-wide focus:border-[#d9fb06] focus:ring-[#d9fb06] transition-all duration-300"
            />
          </div>

          {/* Help Box */}
          <div className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] rounded-lg p-5 mb-6">
            <p className="text-[#d9fb06] font-semibold mb-3">
              Need an access code?
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-3 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300"
              >
                <Phone size={16} />
                <span className="font-medium">{contactInfo.phone}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300"
              >
                <Mail size={16} />
                <span className="font-medium">{contactInfo.email}</span>
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isVerifying || isVerified}
            className={`w-full rounded-full py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              isVerified
                ? 'bg-green-500 text-white'
                : 'bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verifying...
              </>
            ) : isVerified ? (
              <>
                <Check size={20} />
                Access Verified!
              </>
            ) : (
              <>
                <Check size={20} />
                Verify Code
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
