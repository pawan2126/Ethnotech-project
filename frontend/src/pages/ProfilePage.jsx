import React, { useContext, useState } from 'react';
import { DemoContext } from '../context/DemoContext';
import { User, Mail, Phone, MapPin, Heart, Award, Shield, Save, Calendar, Droplets, Star, Edit3 } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, donors, darkMode, addAuditLog } = useContext(DemoContext);

  // Find donor profile from mock data
  const donorData = donors.find(d => d.email === currentUser?.email) || donors[0];

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: donorData?.name || 'Demo User',
    email: donorData?.email || currentUser?.email || 'demo@lifelink.ai',
    phone: donorData?.phone || currentUser?.phone || '+91 9876543210',
    bloodGroup: donorData?.bloodGroup || 'O-',
    address: donorData?.address || 'Bengaluru, India',
  });

  const stats = {
    totalDonations: Math.floor((donorData?.trustScore || 80) / 8),
    livesSaved: Math.floor((donorData?.trustScore || 80) / 8) * 3,
    trustScore: donorData?.trustScore || 80,
    memberSince: 'January 2025',
    lastDonation: donorData?.lastDonationDate || '2026-04-10',
    isAvailable: donorData?.isAvailable ?? true,
  };

  const allBadges = [
    { name: 'Hero', description: '5+ verified donations', icon: Heart, earned: (donorData?.badges || []).includes('HERO'), color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { name: 'Gold Donor', description: '10+ verified donations', icon: Award, earned: (donorData?.badges || []).includes('GOLD'), color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { name: 'Platinum Legend', description: '15+ emergency assignments', icon: Star, earned: (donorData?.badges || []).includes('PLATINUM'), color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { name: 'First Responder', description: 'Responded to SOS within 5min', icon: Shield, earned: stats.trustScore >= 90, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'Community Star', description: 'Attended 3+ donation camps', icon: Star, earned: false, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { name: 'Lifeline', description: 'Donated rare blood type (O-)', icon: Droplets, earned: donorData?.bloodGroup === 'O-', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      addAuditLog(form.email, `Updated profile: name=${form.name}, phone=${form.phone}`);
    }, 800);
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-600/5 blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border-2 border-red-500/30 flex items-center justify-center shadow-xl shadow-red-950/20">
            <span className="text-4xl font-black text-red-400 uppercase">{form.name.charAt(0)}</span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-white">{form.name}</h2>
            <p className="text-sm text-slate-400 mt-1">{form.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                {form.bloodGroup}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                stats.isAvailable
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700/50 border border-slate-600 text-slate-400'
              }`}>
                {stats.isAvailable ? '● Available' : '○ Unavailable'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                Trust: {stats.trustScore}/100
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Donations', value: stats.totalDonations, icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Lives Saved', value: stats.livesSaved, icon: Droplets, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Trust Score', value: `${stats.trustScore}/100`, icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Member Since', value: stats.memberSince, icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className={`absolute top-3 right-3 p-2 rounded-lg ${s.bg}`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Profile Details / Edit Form */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 block">Full Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-800/30 px-4 py-2.5 rounded-xl border border-slate-800">
                <User className="w-4 h-4 text-slate-500" />
                <span>{form.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-800/30 px-4 py-2.5 rounded-xl border border-slate-800">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{form.email}</span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 block">Phone</label>
            {editing ? (
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-800/30 px-4 py-2.5 rounded-xl border border-slate-800">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{form.phone}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 block">Address</label>
            {editing ? (
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-800/30 px-4 py-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{form.address}</span>
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-red-600/20 hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Badge Gallery */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Badge Gallery
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border text-center transition-all relative overflow-hidden ${
                  badge.earned
                    ? `${badge.bg} ${badge.border} hover:scale-[1.02]`
                    : 'bg-slate-800/30 border-slate-800 opacity-40'
                }`}
              >
                {badge.earned && (
                  <div className="absolute top-2 right-2 text-[8px] uppercase tracking-wider bg-emerald-500 px-1.5 py-0.5 rounded text-white font-bold">
                    Earned
                  </div>
                )}
                <Icon className={`w-10 h-10 mx-auto mb-2 ${badge.earned ? badge.color : 'text-slate-600'}`} />
                <h4 className={`text-sm font-bold ${badge.earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
