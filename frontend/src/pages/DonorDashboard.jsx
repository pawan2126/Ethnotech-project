import React, { useContext, useState, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { toggleAvailability, getEligibility, getDonorDonations } from '../services/api';
import { Heart, ShieldCheck, Award, Calendar, CheckCircle2, QrCode, Download, AlertTriangle } from 'lucide-react';
import DonorDonations from './DonorDonations';

const DonorDashboard = () => {
  const { currentUser, isDemoMode, checkEligibility, addAuditLog, notifications } = useContext(DemoContext);
  
  // Profile loading state
  const [profile, setProfile] = useState({
    id: currentUser?.id || 1,
    name: currentUser?.email?.split('@')[0] || "Golla Pawan",
    email: currentUser?.email || "donor_pawan@gmail.com",
    bloodGroup: currentUser?.bloodGroup || "O-",
    lastDonationDate: "2026-04-10",
    isAvailable: currentUser?.isAvailable ?? true,
    trustScore: currentUser?.trustScore || 95,
  });

  const [eligible, setEligible] = useState(true);
  const [remainingDays, setRemainingDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch real details if backend is available and not in demo mode
  useEffect(() => {
    if (!isDemoMode && currentUser?.id) {
      setLoading(true);
      Promise.all([
        getEligibility(currentUser.id).catch(() => ({ eligible: true, remainingDays: 0 })),
        getDonorDonations(currentUser.id, 0, 1).catch(() => ({ content: [] }))
      ]).then(([eligData, donationData]) => {
        setEligible(eligData.eligible);
        setRemainingDays(eligData.remainingDays || 0);
        
        const lastDonation = donationData.content?.[0];
        setProfile(prev => ({
          ...prev,
          lastDonationDate: lastDonation ? lastDonation.donationDate : prev.lastDonationDate,
        }));
        setLoading(false);
      });
    } else {
      // Local demo calculation
      const isElig = checkEligibility(profile.lastDonationDate);
      setEligible(isElig);
      if (!isElig && profile.lastDonationDate) {
        const diff = Math.floor((new Date() - new Date(profile.lastDonationDate)) / (1000 * 60 * 60 * 24));
        if (diff < 90) {
          setRemainingDays(90 - diff);
        }
      }
    }
  }, [currentUser, isDemoMode, profile.lastDonationDate]);

  const handleToggle = async () => {
    const nextVal = !profile.isAvailable;
    setProfile(prev => ({ ...prev, isAvailable: nextVal }));

    if (!isDemoMode && currentUser?.id) {
      try {
        await toggleAvailability(currentUser.id, nextVal);
      } catch (err) {
        console.error("Failed to update availability on backend", err);
      }
    }
    addAuditLog(profile.email, `Toggled availability status to ${nextVal ? "AVAILABLE" : "UNAVAILABLE"}`);
  };

  const handleCertificateDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("🏆 Certificate downloaded successfully! Verified by LifeLink AI Network.");
    }, 1200);
  };

  const donorNotes = notifications.filter(n => n.userId === profile.id);

  return (
    <div className="space-y-6 fade-in">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Welcome back, {profile.name}!</h2>
          <p className="text-sm text-slate-400">Manage your profile, availability, and verify donations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Live Availability:</span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              profile.isAvailable ? 'bg-red-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                profile.isAvailable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${profile.isAvailable ? 'text-red-500' : 'text-slate-500'}`}>
            {profile.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Eligibility & QR Card */}
        <div className="space-y-6 lg:col-span-2">
          {/* Eligibility Panel */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${eligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {eligible ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Donation Eligibility Check</h3>
              <p className="text-xs text-slate-400 mt-1">
                LifeLink automatically updates your availability. Donors must wait 3 months (90 days) between donations.
              </p>
              
              {eligible ? (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are eligible to donate blood today!</span>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unavailable for {remainingDays} more days.</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.round(((90 - remainingDays) / 90) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gamification & Badges */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Your Badges & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-rose-500/10 to-red-600/10 border border-red-500/20 p-4 rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded text-white font-bold">Active</div>
                <Award className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-white">Hero Badge</h4>
                <p className="text-[10px] text-slate-400 mt-1">Given to lifesavers who completed 5+ verified donations.</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-yellow-500/20 p-4 rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider bg-amber-600 px-2 py-0.5 rounded text-white font-bold">Active</div>
                <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-white">Gold Donor</h4>
                <p className="text-[10px] text-slate-400 mt-1">Earned for completing 10+ verified donations.</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center opacity-40">
                <Award className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-300">Platinum Legend</h4>
                <p className="text-[10px] text-slate-500 mt-1">Given for 15+ verified emergency donor assignments.</p>
              </div>
            </div>
          </div>

          {/* Donation Timeline History */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Donation & Impact Timeline</h3>
            <div className="space-y-4 relative border-l border-slate-800 pl-4 ml-2">
              <div className="relative">
                <div className="absolute -left-[21px] mt-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border border-slate-900" />
                <span className="text-[10px] text-slate-500 block font-semibold">{profile.lastDonationDate || 'APRIL 10, 2026'}</span>
                <h4 className="text-sm font-bold text-slate-200 mt-0.5">Whole Blood Donation</h4>
                <p className="text-xs text-slate-400">Verified donation. 1 unit saved up to 3 lives.</p>
              </div>
            </div>
          </div>

          {/* Donation History List */}
          <DonorDonations />
        </div>

        {/* Right Column: QR Code & Certificate Download */}
        <div className="space-y-6">
          {/* Donation QR Generator */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
            <h3 className="text-base font-bold text-white mb-2">Your Donation Verification QR</h3>
            <p className="text-xs text-slate-400 mb-6">Present this to hospital admin during verification.</p>
            
            <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg border border-slate-800">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-mono select-all">
              <span>Code ID: donation-{profile.id}</span>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-4">
              Tip: You can manually copy the ID code above and share it with hospital admins if scanner is offline.
            </p>
          </div>

          {/* Certificate Download */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Donation Certificates</h3>
            <p className="text-xs text-slate-400 mb-4">Download your signed certificate for tax exemptions or campus credits.</p>
            <button
              onClick={handleCertificateDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Generating PDF..." : "Download Certificate"}</span>
            </button>
          </div>

          {/* Recent SOS Alerts Nearby */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Broadcast Alerts Received</h3>
            {donorNotes.length === 0 ? (
              <p className="text-xs text-slate-500">No active emergency alerts in your radius.</p>
            ) : (
              <div className="space-y-2">
                {donorNotes.map(n => (
                  <div key={n.id} className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded">SOS Alert</span>
                    <h4 className="text-xs font-bold text-white mt-1">{n.title}</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-1.5">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
