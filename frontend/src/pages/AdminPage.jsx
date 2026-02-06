import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogOut, 
  Plus, 
  Copy, 
  Check, 
  Ticket, 
  FileText, 
  Users,
  Trash2,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Admin credentials
const ADMIN_EMAIL = 'mak@thecorpcruise.com';
const ADMIN_PASSWORD = 'SGTmak@687812';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('codes');
  
  // Data states
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Check for saved login on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('corpcruise_admin_logged_in');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch codes and bookings when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCodes();
      fetchBookings();
    }
  }, [isLoggedIn]);

  // Auto-refresh codes every 30 seconds to update expiry status
  useEffect(() => {
    if (isLoggedIn && activeTab === 'codes') {
      const interval = setInterval(fetchCodes, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, activeTab]);

  const fetchCodes = async () => {
    try {
      const response = await axios.get(`${API}/codes`);
      setGeneratedCodes(response.data);
    } catch (error) {
      console.error('Error fetching codes:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('corpcruise_admin_logged_in', 'true');
      toast.success('Welcome back, Admin!');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('corpcruise_admin_logged_in');
    setEmail('');
    setPassword('');
    toast.success('Logged out successfully');
  };

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/codes`);
      setGeneratedCodes(prev => [response.data, ...prev]);
      toast.success('New booking code generated! Valid for 15 minutes.');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteCode = async (id) => {
    try {
      await axios.delete(`${API}/codes/${id}`);
      setGeneratedCodes(prev => prev.filter(c => c.id !== id));
      toast.success('Code deleted');
    } catch (error) {
      console.error('Error deleting code:', error);
      toast.error('Failed to delete code');
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#1a1c1b]">
        <Header />
        
        <div className="min-h-screen flex items-center justify-center px-6 py-32">
          <div className="w-full max-w-md">
            <div className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#3f4816] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-[#d9fb06]" size={32} />
                </div>
                <h1 className="text-[#d9fb06] font-black text-2xl uppercase mb-2">
                  Admin Login
                </h1>
                <p className="text-[#888680] font-medium">
                  Enter your credentials to access the admin panel
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-[#d9fb06] text-sm font-semibold uppercase tracking-wider block mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888680]" size={18} />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@corpcruise.com"
                      required
                      className="bg-[#1a1c1b] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680]/60 h-12 pl-12 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#d9fb06] text-sm font-semibold uppercase tracking-wider block mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888680]" size={18} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="bg-[#1a1c1b] border-[rgba(63,72,22,0.5)] text-[#d9fb06] placeholder:text-[#888680]/60 h-12 pl-12 pr-12 focus:border-[#d9fb06] focus:ring-[#d9fb06]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888680] hover:text-[#d9fb06] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full py-6 font-semibold text-base uppercase tracking-tight transition-all duration-300 disabled:opacity-50"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#1a1c1b]">
      <Header />
      
      <div className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-[87.5rem] mx-auto px-6 md:px-10">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[#d9fb06] font-black text-3xl uppercase">
                Admin Dashboard
              </h1>
              <p className="text-[#888680] font-medium mt-1">
                Manage booking codes, view requests and bookings
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-6 py-2 font-semibold text-sm uppercase transition-all duration-300 inline-flex items-center gap-2 w-fit"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[rgba(63,72,22,0.5)] pb-4 overflow-x-auto">
            {[
              { id: 'codes', label: 'Booking Codes', icon: Ticket },
              { id: 'bookings', label: 'New Bookings', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#d9fb06] text-[#1a1c1b]'
                    : 'bg-[#302f2c] text-[#888680] hover:text-[#d9fb06]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'codes' && (
            <div>
              {/* Generate Code Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-[#d9fb06] font-semibold text-xl">
                    Generated Codes ({generatedCodes.length})
                  </h2>
                  <p className="text-[#888680] text-sm mt-1">
                    Each code is valid for 15 minutes and can be used once
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={fetchCodes}
                    variant="outline"
                    className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-4 py-2 transition-all duration-300"
                  >
                    <RefreshCw size={18} />
                  </Button>
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isLoading}
                    className="bg-[#d9fb06] text-[#1a1c1b] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full px-6 py-2 font-semibold text-sm uppercase transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Generate New Code
                  </Button>
                </div>
              </div>

              {/* Codes List */}
              {generatedCodes.length === 0 ? (
                <div className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-12 text-center">
                  <Ticket className="text-[#888680] mx-auto mb-4" size={48} />
                  <p className="text-[#888680] font-medium">
                    No codes generated yet. Click the button above to create one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedCodes.map((item) => {
                    const isExpired = item.is_expired;
                    const isUsed = item.used;
                    
                    return (
                      <div
                        key={item.id}
                        className={`bg-[#302f2c] border p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isExpired || isUsed 
                            ? 'border-[#888680]/30 opacity-60' 
                            : 'border-[rgba(63,72,22,0.5)]'
                        }`}
                      >
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <code className="text-[#d9fb06] font-mono text-lg font-bold">
                              {item.code}
                            </code>
                            {isUsed && (
                              <span className="bg-[#3f4816] text-[#d9fb06] text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                <Check size={12} />
                                USED
                              </span>
                            )}
                            {isExpired && !isUsed && (
                              <span className="bg-red-900/50 text-red-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                <AlertCircle size={12} />
                                EXPIRED
                              </span>
                            )}
                            {!isExpired && !isUsed && (
                              <span className="bg-green-900/50 text-green-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                <Clock size={12} />
                                {item.minutes_remaining} min left
                              </span>
                            )}
                          </div>
                          <p className="text-[#888680] text-sm">
                            Created: {formatDateTime(item.created_at)}
                          </p>
                          <p className="text-[#888680] text-sm">
                            Expires: {formatDateTime(item.expires_at)}
                          </p>
                          {item.used_by && item.used_at && (
                            <p className="text-[#888680] text-sm">
                              Used by: {item.used_by} on {formatDateTime(item.used_at)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!isExpired && !isUsed && (
                            <Button
                              onClick={() => handleCopyCode(item.code)}
                              variant="outline"
                              className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-4 py-2 transition-all duration-300"
                            >
                              {copiedCode === item.code ? (
                                <Check size={18} />
                              ) : (
                                <Copy size={18} />
                              )}
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteCode(item.id)}
                            variant="outline"
                            className="bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-white rounded-full px-4 py-2 transition-all duration-300"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#d9fb06] font-semibold text-xl">
                  New Bookings ({bookings.length})
                </h2>
                <Button
                  onClick={fetchBookings}
                  variant="outline"
                  className="bg-transparent text-[#d9fb06] border-[#d9fb06] hover:bg-[#d9fb06] hover:text-[#1a1c1b] rounded-full px-4 py-2 transition-all duration-300"
                >
                  <RefreshCw size={18} />
                </Button>
              </div>
              
              {bookings.length === 0 ? (
                <div className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-12 text-center">
                  <FileText className="text-[#888680] mx-auto mb-4" size={48} />
                  <p className="text-[#888680] font-medium">
                    No new bookings yet. Bookings will appear here when users book rides with valid codes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#302f2c] border border-[rgba(63,72,22,0.5)] p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[#d9fb06] font-semibold text-lg">{booking.full_name}</span>
                            <span className="bg-[#3f4816] text-[#d9fb06] text-xs font-semibold px-2 py-1 rounded-full uppercase">
                              {booking.status || 'pending'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Company:</span> {booking.company_name}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Phone:</span> {booking.phone_number}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Email:</span> {booking.email}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">City:</span> {booking.city}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Duty Type:</span> {booking.duty_type}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Vehicle:</span> {booking.vehicle_category}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Pickup:</span> {booking.pickup_location}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Dropoff:</span> {booking.dropoff_location}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Date:</span> {booking.date}</p>
                            <p className="text-[#888680]"><span className="text-[#d9fb06]">Time:</span> {booking.time}</p>
                          </div>
                          {booking.special_requests && (
                            <p className="text-[#888680] mt-2"><span className="text-[#d9fb06]">Special Requests:</span> {booking.special_requests}</p>
                          )}
                          <p className="text-[#888680] text-xs mt-3">
                            Code: {booking.code} | Booked: {formatDateTime(booking.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
