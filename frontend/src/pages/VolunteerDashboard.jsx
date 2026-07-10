import React, { useContext, useState } from 'react';
import { DemoContext } from '../context/DemoContext';
import { Truck, MapPin, Navigation, Calendar, CheckCircle2, User } from 'lucide-react';

const VolunteerDashboard = () => {
  const { volunteers, volunteerAssignments, addAuditLog, currentUser } = useContext(DemoContext);
  
  const vol = volunteers[0];
  const [volStatus, setVolStatus] = useState(vol.status);
  const [activeTask, setActiveTask] = useState(volunteerAssignments[0]);

  const handleStatusChange = (status) => {
    setVolStatus(status);
    vol.status = status;
    addAuditLog(currentUser?.email || vol.name, `Updated status to ${status}`);
  };

  const handleCompleteTask = () => {
    if (!activeTask) return;
    addAuditLog(currentUser?.email || vol.name, `Completed transit assignment task ID: ${activeTask.id}`);
    alert("🚀 Delivery task marked as completed! Hospital and donor notified.");
    setActiveTask(null);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Volunteer Logistics Desk</h2>
          <p className="text-sm text-slate-400">Accept coordination requests, view route directions, and manage donation drives.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={volStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit font-semibold"
          >
            <option value="IDLE">🟢 Active / Idle</option>
            <option value="BUSY">🔴 En Route / Busy</option>
            <option value="OFFLINE">⚪ Offline</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transit Task & Route */}
        <div className="lg:col-span-2 space-y-6">
          {activeTask ? (
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-500" />
                <span>Assigned Emergency Task</span>
              </h3>
              
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                <p className="text-sm leading-relaxed text-slate-200 font-medium">
                  {activeTask.task}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Transit Distance</span>
                    <span className="font-bold text-white text-sm">{activeTask.distance}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Estimated Duration</span>
                    <span className="font-bold text-white text-sm">{activeTask.eta}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Task Status</span>
                    <span className="font-bold text-indigo-400 text-sm uppercase">{activeTask.status}</span>
                  </div>
                </div>
              </div>

              {/* Simulated GPS Navigation Route Map */}
              <div className="bg-slate-955/60 rounded-2xl border border-slate-800 p-4 h-64 relative flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center opacity-40 pointer-events-none">
                  {/* Grid Lines mockup */}
                  <div className="grid grid-cols-6 grid-rows-6 w-full h-full border border-slate-800/20">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border border-slate-800/10" />
                    ))}
                  </div>
                </div>
                
                {/* Route Path Indicator Map Pins */}
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                  <span className="text-[8px] bg-slate-950 border border-slate-800 px-1 py-0.5 rounded text-white font-mono mt-1">Start (RedCross)</span>
                </div>

                <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-red-500 fill-red-500/20 animate-bounce" />
                  <span className="text-[8px] bg-slate-950 border border-slate-800 px-1 py-0.5 rounded text-white font-mono mt-1">End (CityGen)</span>
                </div>

                {/* Simulated route line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line 
                    x1="25%" y1="28%" x2="66%" y2="66%" 
                    stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6,4"
                  />
                </svg>

                <div className="relative flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-850 z-10">
                  <span className="text-[10px] text-slate-400">Navigation Route Map Coordinates</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-[10px] font-bold transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                  </a>
                </div>
              </div>

              <button
                onClick={handleCompleteTask}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                Mark Task as Delivered & Completed
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
              No active logistics transit requests assigned to you. Toggle status to available to receive broadcasts.
            </div>
          )}
        </div>

        {/* Right Column: Donation Camps directory */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            <span>Donation Drives & Camps</span>
          </h3>
          <p className="text-xs text-slate-400">Local upcoming camp events coordination directory.</p>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Whitefield Corporate Hub</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-400">
                  UPCOMING
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Time: July 12, 10:00 AM - 4:00 PM</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[9px] text-slate-500">
                <span>Coordinator: Vikram</span>
                <span className="text-indigo-400 font-semibold">12 registered donors</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">St. Johns Campus Drive</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400">
                  ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Time: July 08, 9:00 AM - 5:00 PM</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[9px] text-slate-500">
                <span>Coordinator: Pawan</span>
                <span className="text-indigo-400 font-semibold">35 registered donors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
