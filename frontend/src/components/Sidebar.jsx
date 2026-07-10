import React, { useContext } from 'react';
import { DemoContext } from '../context/DemoContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Search, ShieldAlert, Activity, Database, Truck, Settings, LogOut, User as UserIcon, MessageSquareCode, Sun, Moon, Globe, Award } from 'lucide-react';

const Sidebar = () => {
  const { 
    role, 
    setRole, 
    darkMode, 
    setDarkMode, 
    lang, 
    setLang, 
    strings,
    showChatbot,
    setShowChatbot,
    currentUser,
    isDemoMode,
    logout
  } = useContext(DemoContext);

  const navigate = useNavigate();

  const roles = [
    { id: 'DONOR', name: strings.donors, icon: Heart },
    { id: 'SEEKER', name: strings.seekers, icon: Search },
    { id: 'HOSPITAL_ADMIN', name: strings.hospitals, icon: Activity },
    { id: 'BLOOD_BANK_ADMIN', name: strings.bloodBanks, icon: Database },
    { id: 'VOLUNTEER', name: strings.volunteers, icon: Truck },
    { id: 'SUPER_ADMIN', name: strings.superAdmin, icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`w-72 flex flex-col h-screen sticky top-0 border-r ${
      darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
    } transition-colors duration-300 z-10`}>
      {/* Branding */}
      <Link to="/" className="p-6 border-b border-inherit flex items-center gap-3">
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
      </Link>

      {/* User Info Card (Non-demo mode) */}
      {!isDemoMode && currentUser && (
        <div className="p-4 border-b border-inherit bg-slate-950/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold uppercase">
            {currentUser.email.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.email.split('@')[0]}</h4>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-400 block mt-0.5">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-red-650/10 hover:text-red-500 rounded-lg transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500" />
          </button>
        </div>
      )}

      {/* Navigation Links for Donor */}
      {!isDemoMode && currentUser?.role === 'DONOR' && (
        <div className="p-4 border-b border-inherit space-y-1">
          <label className="text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-wider">Donor Quick Links</label>
          <Link
            to="/donations"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition"
          >
            <Award className="w-4 h-4 text-rose-500" />
            <span>Donation History Logs</span>
          </Link>
        </div>
      )}

      {/* Role Switcher Section (Demo mode only) */}
      {isDemoMode && (
        <div className="p-4 border-b border-inherit bg-slate-950/20">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
              Demo Dashboard Switcher
            </label>
            <button
              onClick={handleLogout}
              className="text-[9px] text-red-500 hover:underline font-bold"
            >
              Exit Console
            </button>
          </div>
          <div className="grid grid-cols-1 gap-0.5">
            {roles.map(r => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-500' : 'text-slate-400'}`} />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Controls */}
      <div className="p-4 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme & Language</span>
        <div className="flex gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex-1 flex justify-center items-center py-2 rounded-lg border ${
              darkMode ? 'border-slate-800 bg-slate-800/40 text-yellow-400' : 'border-slate-200 bg-slate-50 text-slate-700'
            } hover:scale-105 transition-all`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Lang Toggle */}
          <div className="flex-1 flex items-center gap-1 border rounded-lg px-2 bg-inherit border-inherit">
            <Globe className="w-4 h-4 text-slate-500" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs w-full font-medium focus:outline-none border-none py-1.5 cursor-pointer text-inherit"
            >
              <option value="en" className={darkMode ? 'bg-slate-900' : 'bg-white'}>EN</option>
              <option value="hi" className={darkMode ? 'bg-slate-900' : 'bg-white'}>हिन्दी</option>
              <option value="te" className={darkMode ? 'bg-slate-900' : 'bg-white'}>తెలుగు</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Chatbot Launcher */}
      <div className="mt-auto p-4 border-t border-inherit">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
            showChatbot 
              ? 'bg-indigo-600 text-white shadow-indigo-600/20'
              : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-600/20 hover:shadow-red-600/30 hover:scale-[1.02]'
          }`}
        >
          <MessageSquareCode className="w-4 h-4 animate-bounce" />
          <span>{strings.chatbot}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
