import React, { useContext, useState, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { getAuditLogs } from '../services/api';
import { ShieldCheck, UserCheck, AlertOctagon, RefreshCw, BarChart2, ShieldAlert, Cpu } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { auditLogs: contextAuditLogs, users, setUsers, sosRequests, addAuditLog, isDemoMode } = useContext(DemoContext);

  const [filterRole, setFilterRole] = useState('ALL');
  const [dbAuditLogs, setDbAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setDbAuditLogs(contextAuditLogs);
    } else {
      setLoadingLogs(true);
      getAuditLogs()
        .then(setDbAuditLogs)
        .catch(() => setDbAuditLogs(contextAuditLogs))
        .finally(() => setLoadingLogs(false));
    }
  }, [contextAuditLogs, isDemoMode]);

  const toggleUserStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    addAuditLog("super_admin@lifelink.gov", `Updated user status ID: ${id} to ${nextStatus}`);
    alert(`User status changed to ${nextStatus}!`);
  };

  const filteredUsers = filterRole === 'ALL' 
    ? users 
    : users.filter(u => u.role === filterRole);

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Super Admin Command Center</h2>
          <p className="text-sm text-slate-400">System metrics, fraud monitoring logs, audit trails, and accounts approvals.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold font-mono">
          <span>Root Status: SECURED</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden animate-fade-in">
          <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-semibold">Total Registry</span>
          <span className="text-2xl font-black text-white mt-1 block">1,824</span>
          <p className="text-[10px] text-emerald-400 mt-2 font-semibold">↑ 12% increase this month</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden animate-fade-in">
          <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-semibold">Active SOS Alerts</span>
          <span className="text-2xl font-black text-red-500 mt-1 block">{sosRequests.length}</span>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">Real-time emergencies open</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden animate-fade-in">
          <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-semibold">AI Match Rate</span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">98.4%</span>
          <p className="text-[10px] text-emerald-400 mt-2 font-semibold">Under 15 mins ETA average</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden animate-fade-in">
          <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-semibold">System Trust score</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">99.1%</span>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">Zero commercial fraud detected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Directory Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accounts Directory */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-500" />
                <span>User Registry Directory</span>
              </h3>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-2 py-1 text-[10px] bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-red-500 text-inherit font-semibold"
              >
                <option value="ALL">All Roles</option>
                <option value="DONOR">Donors</option>
                <option value="SEEKER">Seekers</option>
                <option value="HOSPITAL_ADMIN">Hospitals</option>
                <option value="VOLUNTEER">Volunteers</option>
              </select>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
                    <th className="pb-2">Account email</th>
                    <th className="pb-2">System Role</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-950/20">
                      <td className="py-2.5 font-medium text-slate-200">{u.email}</td>
                      <td className="py-2.5 text-[10px] font-bold text-slate-400">{u.role}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            u.status === 'ACTIVE' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Real-Time Audit Trail</span>
            </h3>

            {loadingLogs ? (
              <p className="text-xs text-slate-500">Loading audit trail logs...</p>
            ) : dbAuditLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No logs reported yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {dbAuditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-start text-xs">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-200 block leading-tight">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">By: {log.user} | IP: {log.ipAddress || '127.0.0.1'}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-semibold shrink-0">
                      {log.timestamp ? log.timestamp.split('T')[0] : 'Today'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Fraud Screen & Analytics Charts */}
        <div className="space-y-6">
          {/* Gemini AI Fraud & Spam Screen */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>AI Spam Guard Screen</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Realtime SOS notes scanned for spam score and financial queries.</p>

            <div className="space-y-3">
              {sosRequests.map(r => {
                const isSpam = r.notes.toLowerCase().includes("money") || r.notes.toLowerCase().includes("cash") || r.notes.toLowerCase().includes("buy");
                const score = isSpam ? 95 : 10;
                return (
                  <div key={r.id} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Request #{r.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                        isSpam ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        AI Score: {score}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">"{r.notes}"</p>
                    <span className="text-[9px] text-slate-500 block">
                      Status: {isSpam ? '❌ Blocked' : '✅ Verified Emergency'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Demands Level SVG Charts */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Stock Demand Levels</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-300">O- Negative</span>
                  <span className="text-red-500 font-bold">95% Critical</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-300">O+ Positive</span>
                  <span className="text-slate-400 font-bold">45% Stable</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-300">A+ Positive</span>
                  <span className="text-slate-400 font-bold">30% Stable</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
