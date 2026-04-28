import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowLeft, Key, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Token & New Password
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setStep(2);
    }
  }, [location]);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Reset link sent! Please check your Gmail.');
      
      // Simulation fallback: If token is in response, auto-fill it for testing
      if (response.data.token) {
        console.log('Reset Token (Simulation):', response.data.token);
        setToken(response.data.token); 
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data || 'Email not found or error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.response?.data || 'Invalid token or error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full card shadow-xl p-8 bg-white rounded-xl">
        <div className="text-center mb-8">
          <img src="/sse-logo.svg" alt="SSE Impact Hub" className="h-14 w-14 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-secondary">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? "Enter your email to receive a reset link." 
              : "Enter your new password below."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm border border-green-100 flex items-center">
            <CheckCircle size={16} className="mr-2" />
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm flex items-center">
                <Mail className="absolute left-3 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2 border" 
                  placeholder="investor@example.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn btn-primary py-2.5 flex justify-center items-center"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Reset Token</label>
              <div className="mt-1 relative rounded-md shadow-sm flex items-center">
                <Key className="absolute left-3 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  required 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="block w-full pl-10 border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2 border" 
                  placeholder="Enter token" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="mt-1 relative rounded-md shadow-sm flex items-center">
                <Lock className="absolute left-3 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2 border" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn btn-primary py-2.5"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/auth" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
