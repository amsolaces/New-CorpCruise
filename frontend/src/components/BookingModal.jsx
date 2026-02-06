import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Check, 
  Phone, 
  Mail, 
  Loader2, 
  X, 
  Shield, 
  Car, 
  Truck, 
  Bus,
  ArrowRight,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { contactInfo } from '../data/mock';

const BookingModal = ({ isOpen, onClose }) => {
  // Code verification state
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(0); // 0 = verification, 1-3 = booking steps
  const [bookingData, setBookingData] = useState({
    // Step 1 - Company Service Details
    companyName: '',
    city: '',
    dutyType: '',
    vehicleCategory: 'sedan',
    // Step 2 - Pickup Details
    pickupLocation: '',
    date: '',
    time: '',
    dropoffLocation: '',
    // Step 3 - Passenger Details
    fullName: '',
    phoneNumber: '',
    email: '',
    specialRequests: ''
  });

  // Grouped cities
  const indianCities = [
    'Mumbai', 'Delhi', 'Bhubaneswar', 'Kolkata', 'Ranchi', 'Chennai',
    'Lucknow', 'Bengaluru', 'Amritsar', 'Hyderabad', 'Vijayawada',
    'Chandigarh', 'Vizag (Visakhapatnam)', 'Nainital', 'Tirupati',
    'Rishikesh', 'Jalandhar', 'Dehradun', 'Madurai', 'Allahabad (Prayagraj)',
    'Coimbatore', 'Varanasi', 'Indore', 'Bhopal', 'Nagpur', 'Gwalior',
    'Pune', 'Aurangabad', 'Nashik', 'Shirdi', 'Pondicherry', 'Patna',
    'Ludhiana', 'Mysore', 'Manipal', 'Kochi'
  ];

  const internationalCities = ['Dubai', 'Nepal', 'Bangladesh'];

  const dutyTypes = [
    { value: 'employee-transport', label: 'Employee Transport' },
    { value: 'airport-transfer', label: 'Airport Transfer' },
    { value: 'intercity', label: 'Intercity' },
    { value: 'outstation', label: 'Outstation' }
  ];

  const vehicleCategories = [
    { value: 'sedan', label: 'Sedan', icon: Car },
    { value: 'suv', label: 'SUV', icon: Truck },
    { value: 'van', label: 'Van', icon: Bus }
  ];

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast.error('Please enter your corporate access code');
      return;
    }

    setIsVerifying(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedCodes = localStorage.getItem('corpcruise_codes');
    let codes = savedCodes ? JSON.parse(savedCodes) : [];
    
    const matchingCode = codes.find(c => c.code === accessCode.toUpperCase() && !c.used);
    
    if (matchingCode) {
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
      toast.success('Access verified! Proceeding to booking...');
      
      setTimeout(() => {
        setCurrentStep(1);
      }, 1000);
    } else if (codes.find(c => c.code === accessCode.toUpperCase() && c.used)) {
      toast.error('This code has already been used. Please contact admin for a new code.');
    } else {
      toast.error('Invalid access code. Please check and try again.');
    }
    
    setIsVerifying(false);
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!bookingData.companyName || !bookingData.city || !bookingData.dutyType) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (currentStep === 2) {
      if (!bookingData.pickupLocation || !bookingData.date || !bookingData.time || !bookingData.dropoffLocation) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.fullName || !bookingData.phoneNumber || !bookingData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const savedBookings = localStorage.getItem('corpcruise_bookings');
    const bookings = savedBookings ? JSON.parse(savedBookings) : [];
    
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      code: accessCode.toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    bookings.unshift(newBooking);
    localStorage.setItem('corpcruise_bookings', JSON.stringify(bookings));
    
    toast.success('Booking confirmed! Our team will contact you shortly.');
    
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setAccessCode('');
    setIsVerified(false);
    setCurrentStep(0);
    setBookingData({
      companyName: '',
      city: '',
      dutyType: '',
      vehicleCategory: 'sedan',
      pickupLocation: '',
      date: '',
      time: '',
      dropoffLocation: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      specialRequests: ''
    });
    onClose();
  };

  const handleCancel = () => {
    if (currentStep > 0) {
      setCurrentStep(0);
      setIsVerified(false);
    } else {
      handleClose();
    }
  };

  const getProgress = () => {
    if (currentStep === 0) return 0;
    return ((currentStep) / 3) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1c1b] border border-[rgba(63,72,22,0.5)] max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#888680] hover:text-[#d9fb06] transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          {currentStep === 0 && (
            <div className="w-16 h-16 bg-[#3f4816] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-[#d9fb06]" size={32} />
            </div>
          )}
          
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-[#d9fb06] font-black text-2xl uppercase tracking-tight block">
                {currentStep === 0 ? 'Corporate Access Required' : 'Book Your Luxury Ride'}
              </span>
              <span className="text-[#888680] text-sm font-medium block mt-2">
                {currentStep === 0 
                  ? 'Enter your access code to book a ride'
                  : 'Experience premium corporate transportation with CorpCruise'
                }
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          {currentStep > 0 && (
            <div className="mt-4 h-1.5 bg-[#302f2c] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#d9fb06] transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </div>

        {/* Step 0: Code Verification */}
        {currentStep === 0 && (
          <form onSubmit={handleVerify} className="px-6 pb-6">
            <div className="mb-6">
              <label className="text-[#d9fb06] text-sm font-semibold uppercase tracking-wider block mb-2">
                Access Code
              </label>
              <Input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="E.g., CORP-ABC-2024-001"
                disabled={isVerifying || isVerified}
                className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-14 text-lg font-medium tracking-wide focus:border-[#d9fb06] focus:ring-[#d9fb06]"
              />
            </div>

            {/* Help Box */}
            <div className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] rounded-lg p-4 mb-6">
              <p className="text-[#d9fb06] font-semibold mb-2 text-sm">
                Need an access code?
              </p>
              <div className="space-y-1">
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 text-[#888680] hover:text-[#d9fb06] transition-colors text-sm">
                  <Phone size={14} />
                  <span>Contact: {contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-[#888680] hover:text-[#d9fb06] transition-colors text-sm">
                  <Mail size={14} />
                  <span>Email: {contactInfo.email}</span>
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isVerifying || isVerified}
              className={`w-full rounded-full py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 ${
                isVerified
                  ? 'bg-green-500 text-white'
                  : 'bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Verifying...
                </>
              ) : isVerified ? (
                <>
                  <Check size={20} className="mr-2" />
                  Access Verified!
                </>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Verify Code
                </>
              )}
            </Button>
          </form>
        )}

        {/* Step 1: Company Service Details */}
        {currentStep === 1 && (
          <div className="px-6 pb-6">
            <h3 className="text-[#d9fb06] font-semibold text-lg mb-4">Company Service Details</h3>
            
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={bookingData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>

              {/* City and Duty Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Select City <span className="text-red-400">*</span>
                  </label>
                  <Select value={bookingData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06] [&>span]:text-[#888680]/60 [&[data-state=open]>span]:text-[#d9fb06] data-[placeholder]:text-[#888680]/60">
                      <SelectValue placeholder="Choose city" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#302f2c] border-[#3f4816] max-h-[300px]">
                      <SelectGroup>
                        <SelectLabel className="text-[#d9fb06] font-semibold text-xs uppercase tracking-wider px-2 py-2">Indian Cities</SelectLabel>
                        {indianCities.map(city => (
                          <SelectItem 
                            key={city} 
                            value={city.toLowerCase().replace(/\s+/g, '-')}
                            className="text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] focus:bg-[#3f4816] focus:text-[#d9fb06]"
                          >
                            {city}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[#d9fb06] font-semibold text-xs uppercase tracking-wider px-2 py-2 border-t border-[#3f4816] mt-2">International</SelectLabel>
                        {internationalCities.map(city => (
                          <SelectItem 
                            key={city} 
                            value={city.toLowerCase().replace(/\s+/g, '-')}
                            className="text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] focus:bg-[#3f4816] focus:text-[#d9fb06]"
                          >
                            {city}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Duty Type <span className="text-red-400">*</span>
                  </label>
                  <Select value={bookingData.dutyType} onValueChange={(value) => handleInputChange('dutyType', value)}>
                    <SelectTrigger className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06] [&>span]:text-[#888680]/60 [&[data-state=open]>span]:text-[#d9fb06] data-[placeholder]:text-[#888680]/60">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#302f2c] border-[#3f4816]">
                      {dutyTypes.map(type => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-[#888680] hover:text-[#d9fb06] hover:bg-[#3f4816] focus:bg-[#3f4816] focus:text-[#d9fb06]"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vehicle Category */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-2">
                  Vehicle Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {vehicleCategories.map(vehicle => {
                    const IconComponent = vehicle.icon;
                    const isSelected = bookingData.vehicleCategory === vehicle.value;
                    return (
                      <button
                        key={vehicle.value}
                        type="button"
                        onClick={() => handleInputChange('vehicleCategory', vehicle.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          isSelected 
                            ? 'border-[#d9fb06] bg-[#3f4816]' 
                            : 'border-[#3f4816] bg-[#302f2c] hover:border-[#888680]'
                        }`}
                      >
                        <IconComponent 
                          size={28} 
                          className={isSelected ? 'text-[#d9fb06]' : 'text-[#888680]'} 
                        />
                        <span className={`text-sm font-medium ${isSelected ? 'text-[#d9fb06]' : 'text-[#888680]'}`}>
                          {vehicle.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#3f4816] my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-[#d9fb06] border-[#d9fb06] bg-transparent hover:bg-[#d9fb06] hover:text-[#1a1c1b]"
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-full py-5 font-semibold bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Pickup Details */}
        {currentStep === 2 && (
          <div className="px-6 pb-6">
            <h3 className="text-[#d9fb06] font-semibold text-lg mb-4">Pickup Details</h3>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                  Pickup Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888680]" size={18} />
                  <Input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    placeholder="Enter pickup location"
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 pl-10 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06] [color-scheme:dark]"
                  />
                </div>
                
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Dropoff Location */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                  Dropoff Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888680]" size={18} />
                  <Input
                    type="text"
                    value={bookingData.dropoffLocation}
                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                    placeholder="Enter dropoff location"
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 pl-10 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                  />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#3f4816] my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-[#d9fb06] border-[#d9fb06] bg-transparent hover:bg-[#d9fb06] hover:text-[#1a1c1b]"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-full py-5 font-semibold bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Passenger Details */}
        {currentStep === 3 && (
          <div className="px-6 pb-6">
            <h3 className="text-[#d9fb06] font-semibold text-lg mb-4">Passenger Details</h3>
            
            <div className="space-y-4">
              {/* Full Name and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                  />
                </div>
                
                <div>
                  <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={bookingData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 h-11 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-[#d9fb06] text-sm font-medium block mb-1.5">
                  Special Requests
                </label>
                <Textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="bg-[#302f2c] border-[#3f4816] text-[#d9fb06] placeholder:text-[#888680]/60 resize-none focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#3f4816] my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-[#d9fb06] border-[#d9fb06] bg-transparent hover:bg-[#d9fb06] hover:text-[#1a1c1b]"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 rounded-full py-5 font-semibold bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check size={18} className="mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
