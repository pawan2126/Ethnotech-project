import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DemoContext } from '../context/DemoContext';
import { registerUser } from '../services/api';
import { Heart, User, Mail, Lock, Phone, MapPin, Calendar, Activity } from 'lucide-react';

const RegisterPage = () => {
  const { isOnline } = useContext(DemoContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('DONOR');
  
  // Role specific details
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dob, setDob] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !phone) {
      setError('Please fill in email, password, and phone.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        email,
        password,
        phone,
        role,
        fullName: role === 'DONOR' || role === 'VOLUNTEER' ? fullName : undefined,
        bloodGroup: role === 'DONOR' ? bloodGroup : undefined,
        address,
        gender: role === 'DONOR' ? gender : undefined,
        dob: role === 'DONOR' ? dob : undefined,
      };

      const res = await registerUser(payload);
      setSuccess('Registration successful! Redirecting to login page...');
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-6 fade-in relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/30">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              LifeLink AI
            </h1>
            <p className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
              Emergency Network
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {isOnline ? 'Backend Online' : 'Demo Offline Mode'}
          </span>
        </div>
      </header>

      {/* Registration Card */}
      <main className="w-full max-w-xl mx-auto my-auto z-10">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-400 mt-1">Join the smart routing emergency blood community.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-xs font-semibold">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Phone Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Account Role</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition-all appearance-none"
                  >
                    <option value="DONOR">Donor (Give Blood)</option>
                    <option value="SEEKER">Seeker (Need Blood)</option>
                    <option value="HOSPITAL_ADMIN">Hospital Administrator</option>
                    <option value="BLOOD_BANK_ADMIN">Blood Bank Director</option>
                    <option value="VOLUNTEER">Transit Volunteer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Donor specific fields */}
            {role === 'DONOR' && (
              <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Golla Pawan"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition-all"
                    >
                      <option value="O-">O- Negative (Universal)</option>
                      <option value="O+">O+ Positive</option>
                      <option value="A+">A+ Positive</option>
                      <option value="A-">A- Negative</option>
                      <option value="B+">B+ Positive</option>
                      <option value="B-">B- Negative</option>
                      <option value="AB+">AB+ Positive (Recipient)</option>
                      <option value="AB-">AB- Negative</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition-all"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Address (Common field) */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Address / Base Coordinates</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Whitefield corporate hub, Bengaluru"
                  rows="2"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!isOnline && role !== 'DONOR')}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? 'Creating Account...' : isOnline ? 'Submit Registration' : 'Register (Requires Server)'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400">Already registered? </span>
            <Link to="/login" className="text-red-500 hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto border-t border-slate-900/50 pt-6 text-center text-[10px] text-slate-600 z-10">
        <p>© 2026 LifeLink AI. Standard medical data compliance protocol.</p>
      </footer>
    </div>
  );
};

export default RegisterPage;
