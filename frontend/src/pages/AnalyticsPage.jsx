import React, { useContext, useState, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { BarChart3, PieChart, TrendingUp, Activity, Droplets, MapPin, Clock, Zap } from 'lucide-react';

// Pure SVG Donut Chart Component
const DonutChart = ({ data, size = 180 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 20;
  const circumference = 2 * Math.PI * r;
  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {data.map((d, i) => {
        const segmentLength = (d.value / total) * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += segmentLength;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="16"
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 1s ease, stroke-dashoffset 1s ease' }}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-white text-2xl font-black">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">Total Units</text>
    </svg>
  );
};

// Pure SVG Bar Chart Component
const BarChart = ({ data, height = 200 }) => {
  const max = Math.max(...data.map(d => d.value));
  const barWidth = 32;
  const gap = 16;
  const width = data.length * (barWidth + gap);

  return (
    <svg width="100%" height={height + 40} viewBox={`0 0 ${width + 40} ${height + 40}`} className="mx-auto">
      {data.map((d, i) => {
        const barH = (d.value / max) * height;
        const x = 20 + i * (barWidth + gap);
        const y = height - barH;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.color || '#ef4444'} stopOpacity="1" />
                <stop offset="100%" stopColor={d.color || '#ef4444'} stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect
              x={x} y={y} width={barWidth} height={barH}
              rx="4" fill={`url(#bar-grad-${i})`}
              style={{ transition: 'height 0.8s ease, y 0.8s ease', transitionDelay: `${i * 100}ms` }}
            />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-white text-[10px] font-bold">
              {d.value}
            </text>
            <text x={x + barWidth / 2} y={height + 16} textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const AnalyticsPage = () => {
  const { donors, inventory, sosRequests, auditLogs, bloodCamps } = useContext(DemoContext);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  // Compute blood group distribution from inventory
  const bgGroups = {};
  inventory.forEach(item => {
    bgGroups[item.bloodGroup] = (bgGroups[item.bloodGroup] || 0) + item.units;
  });

  const bgColors = {
    'O+': '#ef4444', 'O-': '#f97316', 'A+': '#3b82f6', 'A-': '#8b5cf6',
    'B+': '#10b981', 'B-': '#14b8a6', 'AB+': '#f59e0b', 'AB-': '#ec4899'
  };

  const donutData = Object.entries(bgGroups).map(([group, units]) => ({
    label: group,
    value: units,
    color: bgColors[group] || '#6b7280'
  }));

  // Monthly donation trend (simulated)
  const monthlyTrend = [
    { label: 'Jan', value: 34, color: '#ef4444' },
    { label: 'Feb', value: 42, color: '#ef4444' },
    { label: 'Mar', value: 28, color: '#ef4444' },
    { label: 'Apr', value: 56, color: '#ef4444' },
    { label: 'May', value: 38, color: '#ef4444' },
    { label: 'Jun', value: 65, color: '#ef4444' },
    { label: 'Jul', value: 48, color: '#ef4444' },
  ];

  // City coverage data
  const cityData = [
    { city: 'Whitefield', donors: 12, coverage: 85 },
    { city: 'Koramangala', donors: 8, coverage: 72 },
    { city: 'Indiranagar', donors: 15, coverage: 92 },
    { city: 'Hebbal', donors: 6, coverage: 55 },
    { city: 'Jayanagar', donors: 10, coverage: 78 },
    { city: 'Marathahalli', donors: 9, coverage: 68 },
  ];

  // Inventory health
  const inventoryHealth = inventory.map(item => ({
    ...item,
    health: item.units >= 20 ? 'GOOD' : item.units >= 5 ? 'LOW' : 'CRITICAL',
    healthColor: item.units >= 20 ? 'bg-emerald-500' : item.units >= 5 ? 'bg-amber-500' : 'bg-red-500',
    percent: Math.min(100, Math.round((item.units / 50) * 100)),
  }));

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
          </div>
          Analytics & Insights
        </h2>
        <p className="text-sm text-slate-400 mt-1">Platform-wide metrics, trends, and real-time health indicators.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Donors', value: donors.filter(d => d.isAvailable).length, icon: Droplets, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Open SOS Requests', value: sosRequests.filter(r => r.status === 'OPEN').length, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total Stock (Units)', value: inventory.reduce((s, i) => s + i.units, 0), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Upcoming Camps', value: bloodCamps.filter(c => c.status === 'UPCOMING').length, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className={`absolute top-3 right-3 p-2 rounded-lg ${kpi.bg}`}>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">{kpi.label}</span>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Group Distribution (Donut) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Blood Group Distribution
          </h3>
          <p className="text-[10px] text-slate-500 mb-6">Inventory spread across all blood groups</p>
          <DonutChart data={donutData} />
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {donutData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] text-slate-400 font-semibold">{d.label}: {d.value}u</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Donation Trend (Bar) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            Monthly Donation Trend
          </h3>
          <p className="text-[10px] text-slate-500 mb-6">2026 monthly donation volume</p>
          <BarChart data={monthlyTrend} />
        </div>
      </div>

      {/* City Coverage & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City-wise Donor Coverage */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            City-wise Donor Coverage
          </h3>
          <p className="text-[10px] text-slate-500 mb-5">Donor availability by area</p>
          <div className="space-y-3">
            {cityData.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-300">{c.city}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{c.donors} donors • {c.coverage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      c.coverage >= 80 ? 'bg-emerald-500' : c.coverage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: animated ? `${c.coverage}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health Scores */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            Inventory Health Monitor
          </h3>
          <p className="text-[10px] text-slate-500 mb-5">Per-group stock levels with health status</p>
          <div className="space-y-3">
            {inventoryHealth.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-white w-8">{item.bloodGroup}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ${item.healthColor}`}
                    style={{ width: animated ? `${item.percent}%` : '0%', transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <span className="text-[10px] font-bold w-14 text-right text-slate-400">{item.units} units</span>
                <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  item.health === 'GOOD' ? 'bg-emerald-500/10 text-emerald-400' :
                  item.health === 'LOW' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {item.health}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Metrics */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          SOS Response Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-2xl font-black text-emerald-400">2.4</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Avg Response (min)</span>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-2xl font-black text-indigo-400">94%</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">Match Success Rate</span>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-2xl font-black text-rose-400">156</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">SOS Resolved (YTD)</span>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-2xl font-black text-amber-400">12</span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-1 uppercase tracking-wider">AI Fraud Blocks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
