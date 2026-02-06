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
  SelectItem,
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
  Calendar,
  Clock,
  MapPin,
  User,
  Building
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

  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad'
  ];

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
    // Validate current step
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

    // Save booking to localStorage
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
    
    // Reset and close
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

  // Progress bar
  const getProgress = () => {
    if (currentStep === 0) return 0;
    return ((currentStep) / 3) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-none max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-gray-900 font-bold text-2xl block" style={{ fontFamily: 'Georgia, serif' }}>
                {currentStep === 0 ? 'Corporate Access Required' : 'Book Your Luxury Ride'}
              </span>
              <span className="text-gray-500 text-sm font-normal block mt-1">
                {currentStep === 0 
                  ? 'Enter your access code to book a ride'
                  : 'Experience premium corporate transportation with CorpCruise'
                }
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          {currentStep > 0 && (
            <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </div>

        {/* Step 0: Code Verification */}
        {currentStep === 0 && (
          <form onSubmit={handleVerify} className="px-6 pb-6">
            <div className="mb-6">
              <label className="text-gray-700 text-sm font-semibold block mb-2">
                Access Code
              </label>
              <Input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="E.g., CORP-ABC-2024-001"
                disabled={isVerifying || isVerified}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 text-base focus:border-amber-400 focus:ring-amber-400"
              />
            </div>

            {/* Help Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-semibold mb-2 text-sm">
                Need an access code?
              </p>
              <div className="space-y-1">
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  <Phone size={14} />
                  <span>Contact: {contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  <Mail size={14} />
                  <span>Email: {contactInfo.email}</span>
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isVerifying || isVerified}
              className={`w-full rounded-full py-6 font-semibold text-base uppercase tracking-wide transition-all duration-300 ${
                isVerified
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600'
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
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Company Service Details</h3>
            
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={bookingData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 focus:border-amber-400 focus:ring-amber-400"
                />
              </div>

              {/* City and Duty Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Select City <span className="text-red-500">*</span>
                  </label>
                  <Select value={bookingData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 focus:border-amber-400 focus:ring-amber-400">
                      <SelectValue placeholder="Choose your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Duty Type <span className="text-red-500">*</span>
                  </label>
                  <Select value={bookingData.dutyType} onValueChange={(value) => handleInputChange('dutyType', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 focus:border-amber-400 focus:ring-amber-400">
                      <SelectValue placeholder="Select duty type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dutyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vehicle Category */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-2">
                  Vehicle Category <span className="text-red-500">*</span>
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
                            ? 'border-amber-400 bg-amber-50' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent 
                          size={28} 
                          className={isSelected ? 'text-amber-500' : 'text-gray-400'} 
                        />
                        <span className={`text-sm font-medium ${isSelected ? 'text-amber-600' : 'text-gray-600'}`}>
                          {vehicle.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-amber-600 border-amber-400 hover:bg-amber-50"
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-full py-5 font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
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
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Pickup Details</h3>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-1.5">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    placeholder="Enter pickup location"
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 pl-10 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="bg-gray-50 border-gray-200 text-gray-900 h-11 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="bg-gray-50 border-gray-200 text-gray-900 h-11 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dropoff Location */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-1.5">
                  Dropoff Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    value={bookingData.dropoffLocation}
                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                    placeholder="Enter dropoff location"
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 pl-10 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-amber-600 border-amber-400 hover:bg-amber-50"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-full py-5 font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
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
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Passenger Details</h3>
            
            <div className="space-y-4">
              {/* Full Name and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
                
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={bookingData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 focus:border-amber-400 focus:ring-amber-400"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-gray-700 text-sm font-medium block mb-1.5">
                  Special Requests
                </label>
                <Textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 resize-none focus:border-amber-400 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-full py-5 font-semibold text-amber-600 border-amber-400 hover:bg-amber-50"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 rounded-full py-5 font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
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
