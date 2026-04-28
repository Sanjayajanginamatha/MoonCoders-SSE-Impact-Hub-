import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Phone, User, CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const Kyc = ({ setUser }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pan: '',
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
    if (step === 1 && (!formData.name || !formData.phone)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 2 && !formData.email) {
      setError('Please enter your email');
      return;
    }
    if (step === 3 && !formData.pan) {
      setError('Please enter your PAN');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Please set a password');
      return;
    }
    
    setLoading(true);
    try {
      // Register the user
      await axios.post('http://localhost:8080/api/auth/register', formData);
      
      // Auto-login after registration
      const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      setUser(loginRes.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center space-x-2 mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {num}
          </div>
          {num < 4 && <div className={`w-12 h-1 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Graphics/Info */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-blue-50 p-12">
        <div className="text-center max-w-md">
          {step === 1 && (
            <>
              <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
                <User size={64} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">Minimum Documents. Quick Onboarding.</h2>
              <p className="text-gray-600 text-lg">Start with just your Mobile Number and Name. Zero paperwork required for initial sign up.</p>
            </>
          )}
          {step === 2 && (
            <>
              <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
                <Mail size={64} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">KYC Verification via Email</h2>
              <p className="text-gray-600 text-lg">We will send all important portfolio updates and tax certificates to this email address.</p>
            </>
          )}
          {step === 3 && (
            <>
              <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
                <CreditCard size={64} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">Verify your PAN</h2>
              <p className="text-gray-600 text-lg">Your PAN details are securely verified to comply with SEBI regulations. Your information is 100% safe and encrypted.</p>
            </>
          )}
          {step === 4 && (
            <>
              <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
                <Lock size={64} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">Secure your Account</h2>
              <p className="text-gray-600 text-lg">Set a strong password to protect your social impact investments and portfolio.</p>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <StepIndicator />
          
          <h1 className="text-2xl font-bold text-secondary mb-6">
            {step === 1 && "Enter Your Details"}
            {step === 2 && "Add your email address"}
            {step === 3 && "Enter your PAN Number"}
            {step === 4 && "Set your Password"}
          </h1>

          {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+91 "
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name (As per PAN)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <button type="button" onClick={() => setFormData({...formData, email: formData.name.replace(/\s+/g, '').toLowerCase() + '@gmail.com'})} className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </button>
                
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 uppercase">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Email Manually</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 flex items-start">
                  <CheckCircle className="text-primary mt-0.5 mr-3 flex-shrink-0" size={18} />
                  <p className="text-sm text-blue-800">Your information is safe and encrypted. We only use this for official KYC verification.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter your 10-digit PAN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all uppercase"
                      placeholder="ABCDE1234F"
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 font-medium"
            >
              {loading ? 'Verifying...' : step === 4 ? 'Complete Registration' : 'CONTINUE'}
              {!loading && step < 4 && <ArrowRight size={18} className="ml-2" />}
            </button>
            
          </form>
          
          <div className="mt-8 text-center">
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
