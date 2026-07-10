import React, { useContext, useState } from 'react';
import { DemoContext } from '../context/DemoContext';
import { CalendarDays, MapPin, Users, Clock, CheckCircle2, Plus, Filter, Heart, Building2, Sparkles } from 'lucide-react';

const BloodCampPage = () => {
  const { bloodCamps, registerForCamp, darkMode, currentUser, role } = useContext(DemoContext);
  const [filter, setFilter] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [registeredCamps, setRegisteredCamps] = useState(new Set());

  const filteredCamps = bloodCamps.filter(c => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const handleRegister = (campId) => {
    registerForCamp(campId);
    setRegisteredCamps(prev => new Set([...prev, campId]));
  };

  const canCreateCamp = role === 'HOSPITAL_ADMIN' || role === 'BLOOD_BANK_ADMIN' || role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <CalendarDays className="w-6 h-6 text-rose-500" />
            </div>
            Blood Donation Camps
          </h2>
          <p className="text-sm text-slate-400 mt-1">Browse upcoming camps, register to attend, and help save lives.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex bg-slate-900/60 rounded-xl border border-slate-800 p-0.5">
            {['ALL', 'UPCOMING', 'COMPLETED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {canCreateCamp && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-red-600/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Camp</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-white">{bloodCamps.length}</span>
          <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Total Camps</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-emerald-400">{bloodCamps.filter(c => c.status === 'UPCOMING').length}</span>
          <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Upcoming</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-white">{bloodCamps.reduce((s, c) => s + c.registered, 0)}</span>
          <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Total Registrations</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-rose-400">{bloodCamps.reduce((s, c) => s + c.capacity, 0)}</span>
          <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Total Capacity</span>
        </div>
      </div>

      {/* Create Camp Form */}
      {showCreateForm && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 slide-up">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            Schedule New Blood Camp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Camp Name" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50" />
            <input placeholder="Location" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50" />
            <input type="date" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50" />
            <input placeholder="Time (e.g., 9:00 AM - 4:00 PM)" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50" />
            <input type="number" placeholder="Capacity" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50" />
            <input placeholder="Blood Groups Needed (comma sep.)" className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50" />
          </div>
          <textarea placeholder="Camp description..." className="w-full mt-4 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 h-20 resize-none" />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 border border-slate-700 hover:bg-slate-800 transition">Cancel</button>
            <button onClick={() => { setShowCreateForm(false); alert('✅ Camp created successfully! (Demo)'); }} className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md hover:scale-[1.02] transition-all">Create Camp</button>
          </div>
        </div>
      )}

      {/* Camp Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCamps.map((camp, i) => {
          const fillPercent = Math.round((camp.registered / camp.capacity) * 100);
          const isFull = camp.registered >= camp.capacity;
          const isCompleted = camp.status === 'COMPLETED';
          const isRegistered = registeredCamps.has(camp.id);

          return (
            <div
              key={camp.id}
              className={`bg-slate-900/40 border rounded-2xl overflow-hidden transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-950/10 ${
                isCompleted ? 'border-slate-800 opacity-70' : 'border-slate-800'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Camp Header */}
              <div className="p-5 pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-slate-700 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{camp.name}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{camp.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{camp.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                    <span>{camp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{camp.time}</span>
                  </div>
                </div>

                {/* Blood Groups Needed */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {camp.bloodGroupsNeeded.map(bg => (
                    <span key={bg} className="px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                      {bg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer with progress and CTA */}
              <div className="p-5 pt-4 mt-3 border-t border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <Users className="w-3 h-3 inline mr-1" />
                    {camp.registered} / {camp.capacity} registered
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{fillPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
                {!isCompleted && (
                  <button
                    onClick={() => handleRegister(camp.id)}
                    disabled={isFull || isRegistered}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isRegistered
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                        : isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isRegistered ? (
                      <><CheckCircle2 className="w-4 h-4" /><span>Registered ✓</span></>
                    ) : isFull ? (
                      <span>Camp Full</span>
                    ) : (
                      <><Heart className="w-4 h-4" /><span>Register to Attend</span></>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCamps.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No camps found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default BloodCampPage;
