import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoContext } from '../context/DemoContext';
import { Heart, ShieldCheck, MapPin, Cpu, Users, ChevronRight, Activity } from 'lucide-react';

const LandingPage = () => {
  const { darkMode } = useContext(DemoContext);
  
  // Count up stats simulator
  const [activeDonors, setActiveDonors] = useState(0);
  const [savedLives, setSavedLives] = useState(0);

  useEffect(() => {
    const donorInterval = setInterval(() => {
      setActiveDonors(prev => {
        if (prev >= 1200) {
          clearInterval(donorInterval);
          return 1200;
        }
        return prev + 40;
      });
    }, 30);

    const livesInterval = setInterval(() => {
      setSavedLives(prev => {
        if (prev >= 4800) {
          clearInterval(livesInterval);
          return 4800;
        }
        return prev + 150;
      });
    }, 30);

    return () => {
      clearInterval(donorInterval);
      clearInterval(livesInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-6 fade-in relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Premium Floating Cells / Particles */}
      <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-red-600/10 blur-xl pointer-events-none float" />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-indigo-600/10 blur-xl pointer-events-none float-delayed" />
      <div className="absolute top-10 right-1/4 w-16 h-16 rounded-full bg-rose-600/5 blur-lg pointer-events-none float" />

      {/* Dynamic Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-600/30">
            <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              LifeLink AI
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
              Emergency Network
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-600/20"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl w-full mx-auto text-center py-16 z-10 space-y-8 slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>Gemini Pro & Firebase-Powered Blood Dispatch</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
          Every Second Counts.<br />
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-indigo-400 bg-clip-text text-transparent">
            Smart Emergency Blood Network.
          </span>
        </h2>
        
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          LifeLink AI bridges the gap in blood emergencies. Connecting donors, hospitals, and dispatchers instantly via Firebase triggers and Google Gemini routing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-[1.02]"
          >
            <span>Launch Simulation Console</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
            <span className="text-2xl font-black text-white">{activeDonors.toLocaleString()}+</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Active Donors</span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
            <span className="text-2xl font-black text-white">{savedLives.toLocaleString()}+</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Saved Lives</span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
            <span className="text-2xl font-black text-white">45+</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Partner Hospitals</span>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
            <span className="text-2xl font-black text-white">98%</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">AI Prediction Rate</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto border-t border-slate-900 pt-6 text-center text-xs text-slate-600 z-10">
        <p>© 2026 LifeLink AI. Designed for critical healthcare coordination.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
