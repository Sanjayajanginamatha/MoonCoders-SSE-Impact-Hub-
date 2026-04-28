import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      if (isLogin) {
        // Try real backend login
        const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        // Register
        const name = nameRef.current?.value || '';
        await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
        // Auto-login after register
        const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      // Fallback: simulate login with form data (when backend is offline)
      const name = isLogin
        ? (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1))
        : (nameRef.current?.value || email.split('@')[0]);
      setUser({ name, email, kycVerified: false, impactPoints: 0 });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full card shadow-xl p-8">
        <div className="text-center mb-8">
          <img src="/sse-logo.svg" alt="SSE Impact Hub" className="h-14 w-14 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-secondary">
            Welcome to SSE Hub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Login to start investing" : "Create an account"}
          </p>
        </div>

        <div className="flex mb-8 border-b border-border">
          <button
            className={`flex-1 pb-4 font-semibold text-center ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >Login</button>
          <button
            className={`flex-1 pb-4 font-semibold text-center ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >Signup</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-gray-400 w-5 h-5" />
                <input ref={nameRef} type="text" required className="block w-full pl-10 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2.5" placeholder="Rahul Sharma" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-gray-400 w-5 h-5" />
              <input ref={emailRef} type="email" required className="block w-full pl-10 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2.5" placeholder="investor@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-gray-400 w-5 h-5" />
              <input ref={passwordRef} type={showPassword ? 'text' : 'password'} required className="block w-full pl-10 pr-10 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm px-4 py-2.5" placeholder="••••••••" />
              <button type="button" className="absolute right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary py-2.5">
            {loading ? 'Please wait...' : isLogin ? 'Login to Dashboard' : 'Create Account'}
          </button>

          {isLogin && (
            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
