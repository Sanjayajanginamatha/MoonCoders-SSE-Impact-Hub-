import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, ServerCrash } from 'lucide-react';
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

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      if (isLogin) {
        // ── Real backend login — no offline bypass ──
        const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/dashboard');

      } else {
        // ── Register new user ──
        const name = nameRef.current?.value || '';
        await axios.post('http://localhost:8080/api/auth/register', { name, email, password });

        // Auto-login after registration
        const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      // Show the real error — NO silent bypass
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
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
            {isLogin ? 'Login to start investing' : 'Create your investor account'}
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
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-start gap-2 border border-red-100">
            {error.includes('server') || error.includes('backend')
              ? <ServerCrash className="w-4 h-4 shrink-0 mt-0.5" />
              : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            }
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as per PAN)</label>
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

        {/* KYC note for new users */}
        {!isLogin && (
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
            ⚠️ After registration, you must complete KYC with your <strong>PAN card</strong> and <strong>Demat account number</strong> before purchasing ZCZP bonds.
          </div>
        )}
      </div>
    </div>
  );
}
