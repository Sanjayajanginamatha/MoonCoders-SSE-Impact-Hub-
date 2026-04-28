import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Mail, Phone, User, CreditCard, Lock,
  CheckCircle, ArrowRight, Landmark, AlertCircle
} from 'lucide-react';

/**
 * KYC Registration Flow — 5 steps:
 *  1. Name + Phone
 *  2. Email
 *  3. PAN Card (required for ZCZP bonds & 80G)
 *  4. Demat Account Number (required by SEBI to hold ZCZP bonds)
 *  5. Password
 */
const Kyc = ({ setUser }) => {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pan: '',
    dematAccountNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
      if (!formData.phone.trim()) { setError('Please enter your phone number.'); return; }
      if (!/^\+?[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ''))) {
        setError('Please enter a valid 10-digit mobile number.'); return;
      }
    }
    if (step === 2 && !formData.email.trim()) {
      setError('Please enter your email address.'); return;
    }
    if (step === 3) {
      if (!formData.pan.trim()) { setError('Please enter your PAN number.'); return; }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
        setError('Invalid PAN format. Should be like ABCDE1234F (5 letters, 4 digits, 1 letter).'); return;
      }
    }
    if (step === 4) {
      // Demat is optional during registration — can be linked later
      if (formData.dematAccountNumber.trim() && formData.dematAccountNumber.trim().length < 8) {
        setError('Demat account number must be at least 8 characters if provided.'); return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Register with full KYC data
      await axios.post('http://localhost:8080/api/auth/register', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        pan: formData.pan.toUpperCase(),
        dematAccountNumber: formData.dematAccountNumber,
        password: formData.password
      });

      // Auto-login after registration
      const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = loginRes.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');

    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.error || err.response?.data || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center space-x-1 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((num) => (
        <div key={num} className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            step > num ? 'bg-green-500 text-white' :
            step === num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > num ? <CheckCircle className="w-4 h-4" /> : num}
          </div>
          {num < TOTAL_STEPS && <div className={`flex-1 h-1 mx-1 ${step > num ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const stepTitles = [
    'Enter Your Details',
    'Add your Email',
    'PAN Card Verification',
    'Demat Account Linking',
    'Set Your Password'
  ];

  const stepSubtitles = [
    'Start with your name and mobile number',
    'All portfolio updates and tax certificates go here',
    'Required for ZCZP bonds & 80G tax benefit under Section 80G',
    'Required by SEBI to hold ZCZP bonds — you can skip and link later',
    'Secure your impact investment account'
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-12">
        <div className="text-center max-w-md">
          <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
            {step === 1 && <User size={64} className="text-primary" />}
            {step === 2 && <Mail size={64} className="text-primary" />}
            {step === 3 && <CreditCard size={64} className="text-primary" />}
            {step === 4 && <Landmark size={64} className="text-primary" />}
            {step === 5 && <Lock size={64} className="text-primary" />}
          </div>
          <h2 className="text-3xl font-bold text-secondary mb-4">{stepTitles[step - 1]}</h2>
          <p className="text-gray-600 text-lg">{stepSubtitles[step - 1]}</p>

          {/* SEBI notice on Demat step */}
          {step === 4 && (
            <div className="mt-6 bg-white rounded-xl p-4 text-left shadow-sm border border-blue-200">
              <p className="text-xs font-bold text-primary mb-2">📋 SEBI Requirement</p>
              <p className="text-xs text-gray-600">
                As per SEBI regulations, Zero Coupon Zero Principal (ZCZP) bonds must be held in 
                a registered Demat account. This is mandatory for all investors.
              </p>
            </div>
          )}

          {/* PAN notice */}
          {step === 3 && (
            <div className="mt-6 bg-white rounded-xl p-4 text-left shadow-sm border border-blue-200">
              <p className="text-xs font-bold text-primary mb-2">🔐 Why PAN is needed?</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Mandatory for 80G tax deduction claim</li>
                <li>✓ Required by Income Tax Act for investments above ₹5,000</li>
                <li>✓ Used for SEBI-compliant investor verification</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <StepIndicator />

          <h1 className="text-2xl font-bold text-secondary mb-1">{stepTitles[step - 1]}</h1>
          <p className="text-sm text-gray-500 mb-6">{stepSubtitles[step - 1]}</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-5 text-sm flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={step === TOTAL_STEPS ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* Step 1: Name + Phone */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as per PAN)</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Email */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: PAN */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start">
                  <CheckCircle className="text-primary mt-0.5 mr-3 shrink-0" size={18} />
                  <p className="text-sm text-blue-800">Your PAN is securely stored and used only for SEBI-compliant KYC verification. It is never shared with third parties.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Number</label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" name="pan"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all uppercase tracking-widest font-mono"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)</p>
                </div>
              </div>
            )}

            {/* Step 4: Demat Account */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                  <AlertCircle className="text-amber-600 mt-0.5 mr-3 shrink-0" size={18} />
                  <p className="text-sm text-amber-800">
                    <strong>Demat Account (Optional at signup):</strong> A Demat account is required by SEBI to hold and transfer your ZCZP bonds. You can <strong>skip this step</strong> and link it later from your Account page.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demat Account Number</label>
                  <div className="relative">
                    <Landmark size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" name="dematAccountNumber"
                      value={formData.dematAccountNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono tracking-wider"
                      placeholder="e.g. 1201910100123456 (optional)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your 16-digit DP ID + Client ID (found in your Demat statement)</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600">
                  <p className="font-semibold mb-1">Where to find your Demat number?</p>
                  <ul className="space-y-0.5">
                    <li>• Zerodha / Groww / Upstox: Account Settings → Profile</li>
                    <li>• Angel One / HDFC Sec: My Profile → Demat Details</li>
                    <li>• Physical statement from your DP (Depository Participant)</li>
                  </ul>
                </div>

                {/* Skip option */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                  <p className="text-xs"><strong>💡 Don't have a Demat account yet?</strong> No worries! You can skip this step and link it later from your Account page. Open a free Demat account with Zerodha, Groww, Upstox, or Angel One.</p>
                </div>
              </div>
            )}

            {/* Step 5: Password */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password" name="password" value={formData.password}
                      onChange={handleChange} required minLength={6}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
                  <CheckCircle size={16} className="inline mr-2" />
                  <strong>KYC Complete!</strong> After registration, you'll be able to invest in ZCZP bonds immediately.
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 font-medium"
            >
              {loading ? 'Processing...' : step === TOTAL_STEPS ? 'Complete Registration' : 'Continue'}
              {!loading && step < TOTAL_STEPS && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/auth')} className="text-sm text-gray-500 hover:text-primary">
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
