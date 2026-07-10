import React, { useContext, useState, useMemo } from 'react';
import { DemoContext } from '../context/DemoContext';
import { Trophy, Medal, Crown, Star, Shield, Heart, Filter, TrendingUp } from 'lucide-react';

const LeaderboardPage = () => {
  const { donors, currentUser } = useContext(DemoContext);
  const [filterBg, setFilterBg] = useState('ALL');

  // Build leaderboard with stable donation counts
  const leaderboard = useMemo(() => {
    return [...donors]
      .sort((a, b) => b.trustScore - a.trustScore)
      .map((d, i) => ({
        ...d,
        rank: i + 1,
        donationCount: Math.floor(d.trustScore / 8),
        livesSaved: Math.floor(d.trustScore / 8) * 3,
      }));
  }, [donors]);

  const filtered = filterBg === 'ALL' ? leaderboard : leaderboard.filter(d => d.bloodGroup === filterBg);

  const bloodGroups = ['ALL', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-sm font-black text-slate-500">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-slate-400/10 to-slate-500/5 border-slate-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700/10 to-orange-600/5 border-amber-700/30';
    return 'bg-slate-900/30 border-slate-800';
  };

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  // Current user's rank
  const myRank = leaderboard.find(d => d.email === currentUser?.email);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            Donor Leaderboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">Top blood donors ranked by trust score and contribution.</p>
        </div>
        {/* Blood Group Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex flex-wrap bg-slate-900/60 rounded-xl border border-slate-800 p-0.5 gap-0.5">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setFilterBg(bg)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                  filterBg === bg
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Your Rank Card */}
      {myRank && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-black text-indigo-400">
            #{myRank.rank}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white">Your Position</h3>
            <p className="text-xs text-slate-400">Trust Score: {myRank.trustScore} • {myRank.donationCount} donations • {myRank.livesSaved} lives saved</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Top {Math.round((myRank.rank / leaderboard.length) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Podium — Top 3 */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          <div className="bg-slate-900/40 border border-slate-400/20 rounded-2xl p-5 text-center relative slide-up" style={{ minHeight: '220px' }}>
            <div className="absolute top-3 left-3">
              <Medal className="w-6 h-6 text-slate-300" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-400/10 border border-slate-400/20 mx-auto flex items-center justify-center text-slate-300 text-2xl font-black uppercase mt-4">
              {top3[1].name.charAt(0)}
            </div>
            <h4 className="text-sm font-bold text-white mt-3">{top3[1].name}</h4>
            <span className="text-[10px] text-slate-500 font-semibold">{top3[1].bloodGroup}</span>
            <div className="mt-3 text-xl font-black text-slate-300">{top3[1].trustScore}</div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Trust Score</span>
            <div className="mt-2 flex justify-center gap-1">
              {top3[1].badges.map((b, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-[8px] font-bold text-slate-400">{b}</span>
              ))}
            </div>
          </div>

          {/* 1st Place */}
          <div className="bg-gradient-to-b from-amber-500/10 to-slate-900/40 border border-amber-500/30 rounded-2xl p-5 text-center relative slide-up shadow-lg shadow-amber-500/5" style={{ minHeight: '260px' }}>
            <div className="absolute top-3 left-3">
              <Crown className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div className="absolute top-2 right-2 text-[8px] font-extrabold uppercase tracking-widest bg-amber-500 px-2 py-0.5 rounded text-black">
              #1
            </div>
            <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border-2 border-amber-400/30 mx-auto flex items-center justify-center text-amber-400 text-3xl font-black uppercase mt-4">
              {top3[0].name.charAt(0)}
            </div>
            <h4 className="text-base font-bold text-white mt-3">{top3[0].name}</h4>
            <span className="text-[10px] text-amber-400 font-semibold">{top3[0].bloodGroup}</span>
            <div className="mt-3 text-3xl font-black text-amber-400">{top3[0].trustScore}</div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Trust Score</span>
            <div className="mt-2 flex justify-center gap-1">
              {top3[0].badges.map((b, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[8px] font-bold text-amber-400">{b}</span>
              ))}
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-slate-900/40 border border-amber-700/20 rounded-2xl p-5 text-center relative slide-up" style={{ minHeight: '200px' }}>
            <div className="absolute top-3 left-3">
              <Medal className="w-6 h-6 text-amber-600" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-amber-700/10 border border-amber-700/20 mx-auto flex items-center justify-center text-amber-600 text-2xl font-black uppercase mt-4">
              {top3[2].name.charAt(0)}
            </div>
            <h4 className="text-sm font-bold text-white mt-3">{top3[2].name}</h4>
            <span className="text-[10px] text-slate-500 font-semibold">{top3[2].bloodGroup}</span>
            <div className="mt-3 text-xl font-black text-amber-600">{top3[2].trustScore}</div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Trust Score</span>
            <div className="mt-2 flex justify-center gap-1">
              {top3[2].badges.map((b, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-amber-700/20 text-[8px] font-bold text-amber-600">{b}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Full Rankings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Rank</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Donor</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Blood Group</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Trust Score</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Donations</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Lives Saved</th>
                <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider font-bold px-6 py-3">Badges</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((donor, i) => (
                <tr
                  key={donor.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${
                    donor.email === currentUser?.email ? 'bg-indigo-500/5' : ''
                  }`}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                      {getRankIcon(donor.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold uppercase">
                        {donor.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{donor.name}</span>
                        <span className="text-[10px] text-slate-500">{donor.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${donor.trustScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white">{donor.trustScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-bold text-slate-300">{donor.donationCount}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-bold text-emerald-400">{donor.livesSaved}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1">
                      {donor.badges.length > 0 ? donor.badges.map((b, j) => (
                        <span key={j} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[8px] font-bold text-amber-400">{b}</span>
                      )) : (
                        <span className="text-[10px] text-slate-600">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
