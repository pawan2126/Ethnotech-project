import React, { useState, useContext, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { searchDonors, triggerSos as apiTriggerSos, getActiveRequests } from '../services/api';
import { Search, AlertCircle, Heart, Phone, MapPin, Sparkles, Navigation, Send, MessageSquare, Compass } from 'lucide-react';

const SeekerDashboard = () => {
  const { donors, sosRequests, setSosRequests, triggerSos, isDemoMode } = useContext(DemoContext);

  const [searchBg, setSearchBg] = useState('O-');
  const [searchCity, setSearchCity] = useState('Whitefield');
  const [matchedResults, setMatchedResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  // SOS Form
  const [sosBg, setSosBg] = useState('O-');
  const [sosUnits, setSosBgUnits] = useState(2);
  const [sosNotes, setSosNotes] = useState('');
  const [sosLat, setSosLat] = useState('12.9716');
  const [sosLng, setSosLng] = useState('77.5946');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [sosSending, setSosSending] = useState(false);

  // Active Emergency Feeds from backend/context
  const [liveRequests, setLiveRequests] = useState([]);

  // Chat Simulated State
  const [chatRequest, setChatRequest] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { id: 1, sender: 'donor', text: 'Hi, I received the SOS broadcast. I am near Whitefield, is the transport arranged?' },
    { id: 2, sender: 'seeker', text: 'Yes, Vikram from volunteer network has accepted the transit assignment. Thank you so much!' }
  ]);

  // Load active requests
  useEffect(() => {
    if (isDemoMode) {
      setLiveRequests(sosRequests);
    } else {
      getActiveRequests()
        .then(setLiveRequests)
        .catch(() => setLiveRequests(sosRequests));
    }
  }, [sosRequests, isDemoMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearched(true);

    if (isDemoMode) {
      const results = donors.filter(d => 
        d.bloodGroup === searchBg && 
        d.isAvailable &&
        d.address.toLowerCase().includes(searchCity.toLowerCase())
      );
      setMatchedResults(results);
      setSearching(false);
    } else {
      try {
        const results = await searchDonors(searchBg, searchCity);
        setMatchedResults(results);
      } catch (err) {
        // fallback
        const results = donors.filter(d => 
          d.bloodGroup === searchBg && 
          d.isAvailable &&
          d.address.toLowerCase().includes(searchCity.toLowerCase())
        );
        setMatchedResults(results);
      } finally {
        setSearching(false);
      }
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSosLat(pos.coords.latitude.toFixed(4));
        setSosLng(pos.coords.longitude.toFixed(4));
        setGettingLocation(false);
      },
      () => {
        setGettingLocation(false);
        alert("Unable to retrieve location. Using default coordinates.");
      }
    );
  };

  const handleSos = async (e) => {
    e.preventDefault();
    if (!sosNotes.trim()) {
      alert("Please enter emergency notes so donors know the situation.");
      return;
    }

    setSosSending(true);

    if (isDemoMode) {
      const success = triggerSos(sosBg, sosUnits, sosNotes, sosLat, sosLng);
      setSosSending(false);
      if (success) {
        alert(`🚨 SOS Broadcasted! Matching ${sosBg} donors in the area have been notified instantly.`);
        setSosNotes('');
      }
    } else {
      try {
        const payload = {
          bloodGroup: sosBg,
          unitsNeeded: parseInt(sosUnits),
          notes: sosNotes,
          latitude: parseFloat(sosLat),
          longitude: parseFloat(sosLng)
        };
        const response = await apiTriggerSos(payload);
        
        // Update local list
        setSosRequests(prev => [response, ...prev]);
        setSosNotes('');
        alert(`🚨 SOS Broadcasted! AI Guard has successfully processed & broadcasted your request to compatible donors.`);
      } catch (err) {
        alert(`⚠️ SOS Blocked or Failed:\n${err.message}`);
      } finally {
        setSosSending(false);
      }
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLogs([...chatLogs, { id: Date.now(), sender: 'seeker', text: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Overview */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-2xl font-extrabold text-white">Seeker Command Dashboard</h2>
        <p className="text-sm text-slate-400">Search matching eligible donors instantly or broadcast a critical SOS emergency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & SOS form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Search Donors */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-red-500" />
              <span>Search Available Donors</span>
            </h3>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Blood Group</label>
                <select
                  value={searchBg}
                  onChange={(e) => setSearchBg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                >
                  <option value="O-">O- (Universal)</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">City / Area</label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="e.g. Whitefield"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/20 disabled:opacity-50"
                >
                  {searching ? 'Finding...' : 'Find Matching Donors'}
                </button>
              </div>
            </form>

            {searched && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">Search Results ({matchedResults.length} Donors found)</h4>
                {matchedResults.length === 0 ? (
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                    No active available donors matching your query. Consider launching an SOS broadcast.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchedResults.map(d => (
                      <div key={d.id} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-sm text-white">{d.name || d.email?.split('@')[0]}</h5>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{d.address || 'Bengaluru'}</span>
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-bold text-xs">
                            {d.bloodGroup}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Trust Score: <span className="text-emerald-400">{d.trustScore || 100}%</span>
                          </span>
                          <a 
                            href={`tel:${d.phone || '+919999888877'}`}
                            className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Contact</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SOS Broadcast Form */}
          <div className="bg-gradient-to-r from-red-950/20 to-slate-900/40 p-6 rounded-2xl border border-red-500/10">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
              <span>One-Click SOS Emergency Broadcast</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Instantly page compatible donors, local ambulances, and community volunteers within 15km.
            </p>

            <form onSubmit={handleSos} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Blood Group Needed</label>
                  <select
                    value={sosBg}
                    onChange={(e) => setSosBg(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                  >
                    <option value="O-">O- (Universal)</option>
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sosUnits}
                    onChange={(e) => setSosBgUnits(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={sosLat}
                    onChange={(e) => setSosLat(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={sosLng}
                    onChange={(e) => setSosLng(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={gettingLocation}
                    className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Compass className={`w-3.5 h-3.5 ${gettingLocation ? 'animate-spin' : ''}`} />
                    <span>{gettingLocation ? 'Locating...' : 'Get Location'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Emergency Notes (AI Spam Filter Active)</label>
                <textarea
                  value={sosNotes}
                  onChange={(e) => setSosNotes(e.target.value)}
                  placeholder="Urgent O- units required at City General Hospital ICU ward 2. Patient requires bypass transfusion immediately."
                  rows="3"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                />
                <span className="text-[10px] text-slate-500 block mt-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gemini AI scans notes to filter commercial trade and fake request profiles.</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={sosSending}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-red-600/30 pulse-sos uppercase tracking-wider"
              >
                {sosSending ? 'Broadcasting SOS...' : 'Trigger SOS Network Alert'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Compatibility chart & chat channels */}
        <div className="space-y-6">
          {/* Compatibility quick chart */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Blood Match Matrix</h3>
            <p className="text-xs text-slate-400 mb-4">Quick compatibility reference guides.</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg">
                <span className="font-bold text-red-500">O- Negative</span>
                <span className="text-slate-400 font-semibold text-[10px]">Universal Donor (All groups)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg">
                <span className="font-bold text-red-500">AB+ Positive</span>
                <span className="text-slate-400 font-semibold text-[10px]">Universal Recipient (All groups)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg">
                <span className="font-bold text-slate-300">A+ Positive</span>
                <span className="text-slate-500 font-semibold text-[10px]">A+, AB+ recipients only</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg">
                <span className="font-bold text-slate-300">B+ Positive</span>
                <span className="text-slate-500 font-semibold text-[10px]">B+, AB+ recipients only</span>
              </div>
            </div>
          </div>

          {/* Active Emergencies Tracker */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Active Emergency Feeds</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {liveRequests.map(r => (
                <div key={r.id} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{r.seekerName || 'Emergency Seeker'}</span>
                    <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded font-bold">{r.bloodGroup}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{r.notes}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-900 text-[9px] text-slate-500">
                    <span>Units: {r.unitsNeeded}</span>
                    <button
                      onClick={() => setChatRequest(r)}
                      className="flex items-center gap-1 text-red-500 hover:underline"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Join Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live emergency chat room */}
          {chatRequest && (
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-red-500/20 flex flex-col h-64 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-white">Emergency Coordination Chat</h4>
                  <span className="text-[9px] text-slate-500">Request ID: #{chatRequest.id} ({chatRequest.bloodGroup})</span>
                </div>
                <button 
                  onClick={() => setChatRequest(null)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Chat Timeline */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1">
                {chatLogs.map(c => (
                  <div key={c.id} className={`flex flex-col ${c.sender === 'seeker' ? 'items-end' : ''}`}>
                    <span className="text-[8px] text-slate-500 uppercase font-bold px-1">{c.sender}</span>
                    <p className={`p-2 rounded-xl text-[10px] max-w-[85%] ${
                      c.sender === 'seeker' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-red-500 text-inherit"
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white rounded-lg p-1.5 hover:bg-red-700 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
