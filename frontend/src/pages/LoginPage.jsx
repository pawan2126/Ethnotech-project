import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DemoContext } from '../context/DemoContext';
import { Heart, Mail, Lock, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login, enterDemoMode, isOnline, darkMode } = useContext(DemoContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between py-12 px-6 fade-in relative overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
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
            {isOnline ? 'Backend Online' : 'Simulation Fallback Mode'}
          </span>
        </div>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md mx-auto my-auto z-10">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1.5">Sign in to coordinate emergency life-saving requests.</p>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-850"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/10 px-2 text-[10px] font-bold text-slate-500">Or Simulation</span>
            </div>
          </div>

          <button
            onClick={handleDemoMode}
            className="w-full py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Launch Simulation Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400">New to LifeLink? </span>
            <Link to="/register" className="text-red-500 hover:underline font-semibold">
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto border-t border-slate-900/50 pt-6 text-center text-[10px] text-slate-600 z-10">
        <p>© 2026 LifeLink AI. Standard HIPAA & medical privacy compliant gateway.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
