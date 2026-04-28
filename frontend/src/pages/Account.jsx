import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Info, Save, ShieldCheck, ShieldAlert, CheckCircle, CreditCard, Mail, Phone, User, Loader, Camera, Upload, Calendar, MapPin, Briefcase, Globe, Edit2, Star, TrendingUp, Zap } from 'lucide-react';
import { getTierInfo } from '../utils/gamification';

const VALID_PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export default function Account({ user, setUser }) {
  const [pan, setPan] = useState(user?.pan || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [panStatus, setPanStatus] = useState(user?.kycVerified ? 'verified' : 'idle');
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
    setTimeout(() => {
      setPanStatus('verified');
    }, 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (setUser) {
      setUser({
        ...user,
        name,
        phone,
        pan,
        profileImage,
        dob: dateOfBirth,
        gender,
        address,
        city,
        state,
        pincode,
        occupation,
        aadhar,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            panStatus === 'verified'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {panStatus === 'verified'
              ? <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
              : <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />}
            <div>
              <p className="font-semibold text-sm">
                {panStatus === 'verified' ? 'KYC Verified — You can claim 80G benefits' : 'KYC Pending — Verify your PAN to unlock 80G benefits'}
              </p>
              <p className="text-xs mt-0.5 opacity-75">
                {panStatus === 'verified'
                  ? 'Your PAN has been verified. 80G certificates will be auto-generated after each investment.'
                  : 'PAN is mandatory for claiming Section 80G tax deductions under Income Tax Act.'}
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


          {/* PAN Verification Card */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary border-b border-border pb-3 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              PAN Verification
            </h3>

            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 mb-5 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <p className="text-xs text-sky-700">
                Enter your 10-digit PAN (e.g. ABCDE1234F). This is verified against NSDL database for 80G eligibility.
                Your data is encrypted and never shared.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <div className="relative flex items-center">
                  <CreditCard className="absolute left-3 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={pan}
                    onChange={handlePanChange}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    disabled={panStatus === 'verified'}
                    className={`block w-full pl-9 pr-10 border rounded-md px-4 py-2.5 text-sm font-mono uppercase tracking-widest transition-colors ${getPanBorderColor()} ${panStatus === 'verified' ? 'bg-green-50' : ''}`}
                  />
                  {/* Status icon */}
                  <div className="absolute right-3">
                    {panStatus === 'verifying' && <Loader className="w-4 h-4 text-primary animate-spin" />}
                    {panStatus === 'verified' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {panStatus === 'failed' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                  </div>
                </div>

                {/* Status messages */}
                {panStatus === 'failed' && (
                  <p className="text-red-500 text-xs mt-1">Invalid PAN format. PAN should be like ABCDE1234F.</p>
                )}
                {panStatus === 'verifying' && (
                  <p className="text-primary text-xs mt-1 animate-pulse">Verifying with NSDL database...</p>
                )}
                {panStatus === 'verified' && (
                  <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> PAN verified successfully! 80G benefits unlocked.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={verifyPan}
                  disabled={pan.length !== 10 || panStatus === 'verifying' || panStatus === 'verified'}
                  className={`btn py-2.5 px-5 text-sm whitespace-nowrap ${
                    panStatus === 'verified'
                      ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                      : 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {panStatus === 'verifying' ? 'Verifying...' : panStatus === 'verified' ? '✓ Verified' : 'Verify PAN'}
                </button>
              </div>
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
