import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Info, Save, ShieldCheck, ShieldAlert, CheckCircle, CreditCard, Mail, Phone, User, Loader, Camera, Upload, Calendar, MapPin, Briefcase, Landmark, Star, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { getTierInfo } from '../utils/gamification';
import axios from 'axios';

const VALID_PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

export default function Account({ user, setUser }) {
  const [pan, setPan] = useState(user?.pan || '');
  const [demat, setDemat] = useState(user?.dematAccountNumber || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [panStatus, setPanStatus] = useState(user?.panVerified ? 'verified' : (user?.kycVerified ? 'verified' : 'idle'));
  const [kycLoading, setKycLoading] = useState(false);
  const [kycError, setKycError] = useState('');
  const [kycSuccess, setKycSuccess] = useState('');
  const [saved, setSaved] = useState(false);
  
  // New profile fields
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [dateOfBirth, setDateOfBirth] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [aadhar, setAadhar] = useState(user?.aadhar || '');
  
  const fileInputRef = useRef(null);

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(val);
    setPanStatus('idle');
  };

  const verifyPan = () => {
    if (!VALID_PAN_REGEX.test(pan)) {
      setPanStatus('failed');
      return;
    }
    setPanStatus('verifying');
    setTimeout(() => setPanStatus('verified'), 2000);
  };

  // Submit KYC to backend — saves PAN + Demat permanently
  const submitKyc = async () => {
    setKycError('');
    setKycSuccess('');
    if (!VALID_PAN_REGEX.test(pan)) {
      setKycError('Invalid PAN format. Must be like ABCDE1234F');
      return;
    }
    if (!demat.trim() || demat.trim().length < 8) {
      setKycError('Please enter a valid Demat account number (minimum 8 characters).');
      return;
    }
    setKycLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:8080/api/auth/kyc',
        { pan: pan.toUpperCase(), dematAccountNumber: demat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setKycSuccess('KYC verified! You can now purchase ZCZP bonds.');
      setPanStatus('verified');
    } catch (err) {
      setKycError(err.response?.data?.error || 'KYC submission failed. Please try again.');
    } finally {
      setKycLoading(false);
    }
  };

  // Verify PAN only (without Demat) — for donors who don't have a Demat account yet
  const verifyPanOnly = async () => {
    setKycError('');
    setKycSuccess('');
    if (!VALID_PAN_REGEX.test(pan)) {
      setKycError('Invalid PAN format. Must be like ABCDE1234F');
      return;
    }
    setKycLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:8080/api/auth/verify-pan',
        { pan: pan.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setPanStatus('verified');
      setKycSuccess(res.data.message || 'PAN verified successfully!');
    } catch (err) {
      setKycError(err.response?.data?.error || 'PAN verification failed. Please try again.');
    } finally {
      setKycLoading(false);
    }
  };

  // Link Demat account only — for donors who already have PAN verified
  const linkDematOnly = async () => {
    setKycError('');
    setKycSuccess('');
    if (!demat.trim() || demat.trim().length < 8) {
      setKycError('Please enter a valid Demat account number (minimum 8 characters).');
      return;
    }
    setKycLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:8080/api/auth/link-demat',
        { dematAccountNumber: demat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setKycSuccess(res.data.message || 'Demat account linked successfully!');
    } catch (err) {
      setKycError(err.response?.data?.error || 'Demat linking failed. Please try again.');
    } finally {
      setKycLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:8080/api/auth/profile',
        {
          name, phone, profileImage,
          dob: dateOfBirth, gender, address, city, state, pincode, occupation, aadhar
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (setUser) {
        setUser(res.data.user);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        if (setUser) {
          setUser(prev => ({ ...prev, profileImage: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPanBorderColor = () => {
    if (panStatus === 'verified') return 'border-green-400 focus:ring-green-400 focus:border-green-400';
    if (panStatus === 'failed') return 'border-red-400 focus:ring-red-400 focus:border-red-400';
    return 'border-gray-300 focus:ring-primary focus:border-primary';
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">Account & KYC</h2>
        <p className="text-gray-600 mb-8">Manage your profile and PAN for 80G tax benefits.</p>

        <div className="max-w-3xl space-y-6">

          {/* KYC Status Banner */}
          <div className={`rounded-xl p-4 flex items-center gap-4 border ${
            user?.kycVerified
              ? 'bg-green-50 border-green-200 text-green-800'
              : user?.panVerified
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {user?.kycVerified
              ? <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
              : <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />}
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {user?.kycVerified
                  ? '✅ KYC Verified — You can buy ZCZP bonds & claim 80G benefits'
                  : user?.panVerified
                    ? '🔵 PAN Verified — Link your Demat account to complete KYC and start investing'
                    : '⚠️ KYC Incomplete — Verify your PAN Card and link Demat Account to invest in ZCZP bonds'}
              </p>
              <p className="text-xs mt-0.5 opacity-75">
                {user?.kycVerified
                  ? `PAN: ${user.pan} | Demat: ${user.dematAccountNumber}`
                  : user?.panVerified
                    ? `PAN: ${user.pan} ✅ | Demat: Not linked yet`
                    : 'Both PAN card and Demat account are mandatory as per SEBI & Income Tax Act.'}
              </p>
            </div>
          </div>

          {/* Profile Card with Picture */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary border-b border-border pb-3 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Details
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Profile Picture Section */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-14 h-14 text-white" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary">Profile Photo</p>
                  <p className="text-sm text-gray-500 mt-1">Upload a clear photo for your profile. Max 5MB.</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" /> Upload Photo
                    </button>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage(null);
                          if (setUser) setUser(prev => ({ ...prev, profileImage: null }));
                        }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-gray-400 font-normal">(as per PAN)</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <div className="relative flex items-center">
                    <Briefcase className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                      placeholder="e.g., Software Engineer, Business"
                    />
                  </div>
                </div>

                {/* Aadhar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative flex items-center">
                    <CreditCard className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={aadhar}
                      onChange={e => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm font-mono"
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-border pt-5">
                <h4 className="font-medium text-secondary mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Address Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 text-gray-400 w-4 h-4 mt-2" />
                      <textarea
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        rows={2}
                        className="block w-full pl-9 border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="block w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary px-4 py-2.5 text-sm font-mono"
                      placeholder="XXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="border-t border-border pt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={user?.email || 'investor@example.com'}
                    disabled
                    className="block w-full pl-9 border border-gray-200 rounded-md bg-gray-50 text-gray-500 px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed after registration.</p>
              </div>

              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Profile
              </button>

              {saved && (
                <p className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Profile saved successfully!
                </p>
              )}
            </form>
          </div>


          {/* KYC Card — PAN + Demat (supports separate verification) */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary border-b border-border pb-3 mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              KYC Verification (Required for ZCZP Bonds)
            </h3>

            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 mb-5 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <p className="text-xs text-sky-700">
                Both your <strong>PAN Card</strong> and <strong>Demat Account</strong> are mandatory before you can invest in ZCZP bonds.
                This is required under SEBI regulations and the Income Tax Act for 80G benefits.
                {!user?.kycVerified && user?.panVerified && (
                  <span className="block mt-1 text-amber-700 font-semibold">
                    ✅ PAN is verified! Now link your Demat account to complete KYC.
                  </span>
                )}
              </p>
            </div>

            {/* Individual Verification Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className={`rounded-lg p-3 border flex items-center gap-3 ${
                user?.panVerified 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {user?.panVerified 
                  ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
                <div>
                  <p className={`font-semibold text-sm ${user?.panVerified ? 'text-green-700' : 'text-red-600'}`}>
                    PAN Card {user?.panVerified ? 'Verified' : 'Not Verified'}
                  </p>
                  {user?.panVerified && user?.pan && (
                    <p className="text-xs text-green-600 font-mono">{user.pan}</p>
                  )}
                </div>
              </div>
              <div className={`rounded-lg p-3 border flex items-center gap-3 ${
                user?.dematAccountNumber 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {user?.dematAccountNumber 
                  ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
                <div>
                  <p className={`font-semibold text-sm ${user?.dematAccountNumber ? 'text-green-700' : 'text-red-600'}`}>
                    Demat Account {user?.dematAccountNumber ? 'Linked' : 'Not Linked'}
                  </p>
                  {user?.dematAccountNumber && (
                    <p className="text-xs text-green-600 font-mono">{user.dematAccountNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {kycError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{kycError}
              </div>
            )}
            {kycSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-100 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />{kycSuccess}
              </div>
            )}

            <div className="space-y-5">
              {/* Section 1: PAN Verification */}
              <div className={`border rounded-xl p-5 ${user?.panVerified ? 'bg-green-50/50 border-green-200' : 'border-border'}`}>
                <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Step 1: PAN Card Verification
                  {user?.panVerified && <span className="text-green-600 text-xs ml-auto">✅ Complete</span>}
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Number</label>
                  <div className="relative flex items-center">
                    <CreditCard className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={pan}
                      onChange={handlePanChange}
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      disabled={user?.panVerified}
                      className={`block w-full pl-9 pr-10 border rounded-md px-4 py-2.5 text-sm font-mono uppercase tracking-widest transition-colors ${getPanBorderColor()} ${user?.panVerified ? 'bg-green-50' : ''}`}
                    />
                    <div className="absolute right-3">
                      {user?.panVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {panStatus === 'failed' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {panStatus === 'failed' && <p className="text-red-500 text-xs mt-1">Invalid PAN. Format: ABCDE1234F</p>}
                </div>

                {!user?.panVerified && (
                  <button
                    onClick={verifyPanOnly}
                    disabled={kycLoading || pan.length !== 10}
                    className="btn btn-primary flex items-center gap-2 mt-3 disabled:opacity-60"
                  >
                    {kycLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {kycLoading ? 'Verifying PAN...' : 'Verify PAN Only'}
                  </button>
                )}
              </div>

              {/* Section 2: Demat Account Linking */}
              <div className={`border rounded-xl p-5 ${user?.dematAccountNumber ? 'bg-green-50/50 border-green-200' : 'border-border'}`}>
                <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2 text-sm">
                  <Landmark className="w-4 h-4 text-primary" />
                  Step 2: Demat Account Linking
                  {user?.dematAccountNumber && <span className="text-green-600 text-xs ml-auto">✅ Complete</span>}
                </h4>

                {/* Help box if no Demat */}
                {!user?.dematAccountNumber && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-bold text-amber-800 mb-1">💡 Don't have a Demat account?</p>
                    <p className="text-xs text-amber-700 mb-2">
                      A Demat account is mandatory to hold ZCZP bonds as per SEBI regulations. 
                      You can open a <strong>free Demat account</strong> in just a few minutes with any of these SEBI-registered brokers:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-medium">🟢 Zerodha</span>
                      <span className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-medium">🟣 Groww</span>
                      <span className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-medium">🔵 Upstox</span>
                      <span className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-medium">🔴 Angel One</span>
                      <span className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-medium">🟠 HDFC Securities</span>
                    </div>
                    <p className="text-xs text-amber-600">
                      Once opened, come back here and enter your 16-digit Demat number (DP ID + Client ID).
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demat Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Landmark className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={demat}
                      onChange={e => setDemat(e.target.value)}
                      placeholder="e.g. 1201910100123456"
                      disabled={user?.kycVerified}
                      className={`block w-full pl-9 border rounded-md px-4 py-2.5 text-sm font-mono tracking-wider transition-colors border-gray-300 focus:ring-primary focus:border-primary ${user?.kycVerified ? 'bg-green-50' : ''}`}
                    />
                    {user?.dematAccountNumber && (
                      <div className="absolute right-3"><CheckCircle className="w-4 h-4 text-green-500" /></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">16-digit DP ID + Client ID from Zerodha / Groww / Upstox / Angel One</p>
                </div>

                {!user?.kycVerified && (
                  <button
                    onClick={linkDematOnly}
                    disabled={kycLoading || !demat.trim() || demat.trim().length < 8}
                    className="btn btn-primary flex items-center gap-2 mt-3 disabled:opacity-60"
                  >
                    {kycLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
                    {kycLoading ? 'Linking Demat...' : 'Link Demat Account'}
                  </button>
                )}
              </div>

              {/* Combined Submit — both at once */}
              {!user?.kycVerified && !user?.panVerified && (
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-gray-500 mb-3">Or submit both PAN and Demat together:</p>
                  <button
                    onClick={submitKyc}
                    disabled={kycLoading}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {kycLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {kycLoading ? 'Submitting KYC...' : 'Submit Full KYC (PAN + Demat)'}
                  </button>
                </div>
              )}

              {user?.kycVerified && (
                <p className="text-green-600 text-sm font-medium flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4" /> KYC Complete — ZCZP bond investment unlocked!
                </p>
              )}
            </div>
          </div>

          {/* Gamification / Impact Points Card */}
          <div className="card p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Impact Rewards & Activity
              </h3>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Impact Points</p>
                <p className="text-2xl font-black text-primary">{user?.impactPoints || 0}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTierInfo(user?.impactPoints).currentTier.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Current Tier</p>
                    <p className={`font-bold ${getTierInfo(user?.impactPoints).currentTier.color}`}>
                      {getTierInfo(user?.impactPoints).currentTier.name}
                    </p>
                  </div>
                </div>
                {getTierInfo(user?.impactPoints).nextTier && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Next Tier</p>
                    <p className={`font-bold opacity-70 ${getTierInfo(user?.impactPoints).nextTier.color}`}>
                      {getTierInfo(user?.impactPoints).nextTier.icon} {getTierInfo(user?.impactPoints).nextTier.name}
                    </p>
                  </div>
                )}
              </div>
              
              {getTierInfo(user?.impactPoints).nextTier ? (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${getTierInfo(user?.impactPoints).progressPercentage}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-500 font-medium">
                    Earn <span className="font-bold text-secondary">{getTierInfo(user?.impactPoints).pointsToNext} more points</span> to reach {getTierInfo(user?.impactPoints).nextTier.name}!
                  </p>
                </>
              ) : (
                <p className="text-sm text-center text-primary font-bold mt-4">You have reached the highest tier! Thank you for your incredible impact.</p>
              )}
            </div>

            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-secondary mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> How to earn points?
              </h4>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 list-disc list-inside">
                <li>Invest in an NGO bond (100 points per ₹1000)</li>
                <li>Verify your KYC details (500 points)</li>
                <li>Share an impact story (50 points)</li>
                <li>Daily check-in (10 points)</li>
              </ul>
              
              <button 
                onClick={() => {
                  if (setUser) {
                    setUser(prev => ({ ...prev, impactPoints: (prev.impactPoints || 0) + 50 }));
                  }
                }}
                className="w-full btn btn-outline border-primary/50 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-500" /> Simulate Activity (+50 Points)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
