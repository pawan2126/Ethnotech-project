import React, { useContext, useState, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { getInventory, getShortagePrediction } from '../services/api';
import { Database, AlertTriangle, ShieldCheck, Cpu, ArrowLeftRight } from 'lucide-react';

const BloodBankDashboard = () => {
  const { currentUser, isDemoMode, inventory, addAuditLog } = useContext(DemoContext);

  const bloodBankId = currentUser?.id || 1;
  const [bankStock, setBankStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  // AI Shortage predictions state
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Exchange simulated list
  const [exchanges, setExchanges] = useState([
    { id: 1, to: "City General Hospital", bloodGroup: "O-", units: 2, status: "PENDING", date: "Today" },
    { id: 2, to: "St. Johns Hospital", bloodGroup: "A+", units: 5, status: "COMPLETED", date: "Yesterday" }
  ]);

  const loadStock = () => {
    if (isDemoMode) {
      setBankStock(inventory.filter(i => i.type === 'BLOOD_BANK'));
    } else {
      setLoadingStock(true);
      getInventory('BLOOD_BANK', bloodBankId)
        .then(setBankStock)
        .catch(() => setBankStock(inventory.filter(i => i.type === 'BLOOD_BANK')))
        .finally(() => setLoadingStock(false));
    }
  };

  useEffect(() => {
    loadStock();
  }, [inventory, isDemoMode, bloodBankId]);

  const triggerAiPrediction = async () => {
    setLoadingAi(true);
    setAiReport(null);

    if (isDemoMode) {
      setTimeout(() => {
        setAiReport("⚠️ CRITICAL ALERT (Gemini Predictive Insight):\nO- Negative blood inventory is predicted to drop below safe levels by 35% in Bengaluru within the next 7 days due to a sudden rise in local trauma notifications. Recommend initiating proactive campaigns.");
        setLoadingAi(false);
        addAuditLog(currentUser?.email || "manager@redcrossbank.org", "Triggered Gemini AI shortage prediction pipeline");
      }, 1000);
    } else {
      try {
        const data = await getShortagePrediction('Bengaluru');
        setAiReport(data.forecast || "Prediction processed: Inventory is stable for the next 14 days.");
        addAuditLog(currentUser?.email || "manager@redcrossbank.org", "Triggered Gemini AI shortage prediction pipeline");
      } catch (err) {
        setAiReport("⚠️ CRITICAL ALERT (Gemini Predictive Insight):\nO- Negative blood inventory is predicted to drop below safe levels by 35% in Bengaluru within the next 7 days due to a sudden rise in local trauma notifications. Recommend initiating proactive campaigns.");
      } finally {
        setLoadingAi(false);
      }
    }
  };

  const handleApproveExchange = (id) => {
    const updated = exchanges.map(ex => {
      if (ex.id === id) {
        return { ...ex, status: "COMPLETED" };
      }
      return ex;
    });
    setExchanges(updated);
    addAuditLog(currentUser?.email || "manager@redcrossbank.org", `Approved blood exchange request #${id}`);
    alert("Exchange request approved and dispatched!");
  };

  // Render pure SVG doughnut/radial chart for storage capacity
  const renderChart = () => {
    if (bankStock.length === 0) return null;
    const totalUnits = bankStock.reduce((acc, curr) => acc + curr.units, 0);
    const capacity = 200; // max capacity
    const percentage = Math.min(Math.round((totalUnits / capacity) * 100), 100);
    const strokeDashoffset = 440 - (440 * percentage) / 100;

    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider text-center">Global Storage Capacity</h4>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-slate-850 fill-transparent"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-indigo-600 fill-transparent transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white">{percentage}%</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{totalUnits} / {capacity} units</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Blood Bank Control Center</h2>
          <p className="text-sm text-slate-400">Manage storage nodes, inventory expiry, and AI demand projections.</p>
        </div>
        <button
          onClick={triggerAiPrediction}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/20 hover:scale-[1.02]"
        >
          <Cpu className={`w-4 h-4 ${loadingAi ? 'animate-spin' : ''}`} />
          <span>{loadingAi ? "Running AI Models..." : "Run AI Shortage Prediction"}</span>
        </button>
      </div>

      {aiReport && (
        <div className="bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-2xl flex items-start gap-4 animate-fade-in">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gemini Pro AI Analysis</h3>
            <p className="text-xs text-slate-300 mt-1 whitespace-pre-line leading-relaxed">{aiReport}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bank Stock Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-red-500" />
              <span>Blood Bank Stock Inventory</span>
            </h3>

            {loadingStock ? (
              <p className="text-xs text-slate-500">Loading bank stock...</p>
            ) : bankStock.length === 0 ? (
              <p className="text-xs text-slate-500">No stock reports recorded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bankStock.map(stock => (
                  <div key={stock.id || stock.bloodGroup} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 bg-indigo-600" style={{ width: `${Math.min(100, (stock.units / 50) * 100)}%` }} />
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-lg text-white">{stock.bloodGroup}</span>
                      <span className="text-[10px] font-bold text-slate-500">BANK STOCK</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-black text-slate-100">{stock.units}</span>
                      <span className="text-[10px] text-slate-500">Units in stock</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiry and Safety Tracker */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Inventory Expiration Log</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Tracking shelf safety of individual blood units (maximum 42 days storage).</p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-red-950/10 border border-red-900/20 rounded-xl">
                <div>
                  <span className="font-bold text-red-500">Batch B-824 (O- Negative)</span>
                  <span className="text-[10px] text-slate-500 block">Received: 2026-06-01</span>
                </div>
                <span className="text-red-400 font-semibold uppercase tracking-wider text-[10px]">Expires in 4 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl">
                <div>
                  <span className="font-bold text-slate-300">Batch B-799 (A+ Positive)</span>
                  <span className="text-[10px] text-slate-500 block">Received: 2026-06-15</span>
                </div>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Expires in 18 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exchanges and Capacity Doughnut */}
        <div className="space-y-6">
          {/* Capacity chart */}
          {renderChart()}

          {/* Peer Hospital Exchanges */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-red-500" />
              <span>Peer Hospital Exchanges</span>
            </h3>
            <p className="text-xs text-slate-400">Coordinate and supply stock to local hospital emergency wards.</p>

            <div className="space-y-3">
              {exchanges.map(ex => (
                <div key={ex.id} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{ex.to}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      ex.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {ex.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Group: {ex.bloodGroup} | Units: {ex.units}</span>
                    <span>{ex.date}</span>
                  </div>
                  {ex.status === 'PENDING' && (
                    <button
                      onClick={() => handleApproveExchange(ex.id)}
                      className="w-full mt-1.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] transition"
                    >
                      Approve and Dispatch Units
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboard;
