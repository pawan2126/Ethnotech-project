import React, { useContext, useState, useEffect } from 'react';
import { DemoContext } from '../context/DemoContext';
import { getInventory, verifyQrDonation as apiVerifyQrDonation, updateInventory, apiFetch } from '../services/api';
import { Database, QrCode, AlertCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

const HospitalDashboard = () => {
  const { currentUser, isDemoMode, inventory, setInventory, verifyQrDonation, sosRequests, addAuditLog } = useContext(DemoContext);
  
  const hospitalId = currentUser?.id || 1;
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);

  // QR scanner simulator state
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Manual stock update state
  const [updateBg, setUpdateBg] = useState('O-');
  const [updateUnits, setUpdateUnits] = useState(1);
  const [updating, setUpdating] = useState(false);
  // Emergency request form state
  const [emPatientName, setEmPatientName] = useState('');
  const [emBloodGroup, setEmBloodGroup] = useState('O-');
  const [emUnitsRequired, setEmUnitsRequired] = useState(1);
  const [emCity, setEmCity] = useState('');
  const [emHospitalName, setEmHospitalName] = useState('');
  const [emHospitalLocation, setEmHospitalLocation] = useState('');
  const [emContactNumber, setEmContactNumber] = useState('');
  const [emEmergencyLevel, setEmEmergencyLevel] = useState('CRITICAL');
  const [emRequiredBefore, setEmRequiredBefore] = useState('');
  const [emAdditionalNotes, setEmAdditionalNotes] = useState('');
  const [emSubmitting, setEmSubmitting] = useState(false);
  // Load inventory
  const loadStock = () => {
    if (isDemoMode) {
      setStock(inventory.filter(i => i.type === 'HOSPITAL'));
    } else {
      setLoading(true);
      getInventory('HOSPITAL', hospitalId)
        .then(setStock)
        .catch(() => setStock(inventory.filter(i => i.type === 'HOSPITAL')))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadStock();
  }, [inventory, isDemoMode, hospitalId]);

  const handleQrScan = async (e) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;

    setVerifying(true);
    setScanResult(null);

    if (isDemoMode) {
      const result = verifyQrDonation(qrCodeInput, hospitalId);
      setVerifying(false);
      if (result.success) {
        setScanResult({
          success: true,
          message: `Donation verified! Donor ${result.donorName} (${result.bloodGroup}) registered. Inventory incremented +1.`
        });
        setQrCodeInput('');
      } else {
        setScanResult({
          success: false,
          message: result.message || "Invalid or already scanned QR code."
        });
      }
    } else {
      try {
        const result = await apiVerifyQrDonation(qrCodeInput, hospitalId);
        setScanResult({
          success: true,
          message: `Donation verified successfully! Donor ${result.donorName} (${result.bloodGroup}) registered. Inventory incremented +${result.units || 1}.`
        });
        setQrCodeInput('');
        loadStock(); // Reload updated backend inventory
      } catch (err) {
        setScanResult({
          success: false,
          message: err.message || "Invalid or already scanned QR code."
        });
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const unitsNum = parseInt(updateUnits);

    if (isDemoMode) {
      const updatedInv = [...inventory];
      const groupIndex = updatedInv.findIndex(i => i.bloodGroup === updateBg && i.type === "HOSPITAL");
      
      if (groupIndex !== -1) {
        updatedInv[groupIndex].units += unitsNum;
      } else {
        updatedInv.push({
          id: updatedInv.length + 1,
          owner: "City General Hospital",
          bloodGroup: updateBg,
          units: unitsNum,
          type: "HOSPITAL"
        });
      }
      
      setInventory(updatedInv);
      addAuditLog(currentUser?.email || "hospital_admin@citygeneral.org", `Manually updated inventory for ${updateBg} by +${unitsNum} units`);
      setUpdating(false);
      alert(`Blood inventory for ${updateBg} successfully updated!`);
    } else {
      try {
        await updateInventory({
          ownerType: 'HOSPITAL',
          ownerId: hospitalId,
          bloodGroup: updateBg,
          units: unitsNum
        });
        addAuditLog(currentUser?.email || "hospital_admin@citygeneral.org", `Manually updated inventory for ${updateBg} by +${unitsNum} units`);
        alert(`Blood inventory for ${updateBg} successfully updated!`);
        loadStock();
      } catch (err) {
        alert(`Failed to update stock on backend: ${err.message}`);
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setEmSubmitting(true);
    const payload = {
      seeker: { id: hospitalId },
      patientName: emPatientName,
      bloodGroup: emBloodGroup,
      unitsRequired: Number(emUnitsRequired),
      city: emCity,
      hospitalName: emHospitalName,
      hospitalLocation: emHospitalLocation,
      contactNumber: emContactNumber,
      emergencyLevel: emEmergencyLevel,
      requiredBefore: emRequiredBefore || null,
      additionalNotes: emAdditionalNotes,
      status: 'PENDING'
    };
    try {
      const res = await apiFetch('/hospital/emergency-request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      console.log('Emergency request response', res);
      alert('Emergency request sent successfully!');
      // Reset form
      setEmPatientName('');
      setEmBloodGroup('O-');
      setEmUnitsRequired(1);
      setEmCity('');
      setEmHospitalName('');
      setEmHospitalLocation('');
      setEmContactNumber('');
      setEmEmergencyLevel('CRITICAL');
      setEmRequiredBefore('');
      setEmAdditionalNotes('');
    } catch (err) {
      console.error(err);
      alert('Failed to send emergency request: ' + err.message);
    } finally {
      setEmSubmitting(false);
    }
  };

  // Pure SVG Bar graph to show inventory levels beautifully
  const renderChart = () => {
    if (stock.length === 0) return null;
    const maxVal = Math.max(...stock.map(s => s.units), 10);
    
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 mt-6">
        <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Inventory Metrics Visualization</h4>
        <div className="flex items-end justify-between h-44 px-4 pt-4 border-b border-l border-slate-850">
          {stock.map(s => {
            const pct = (s.units / maxVal) * 100;
            return (
              <div key={s.id || s.bloodGroup} className="flex flex-col items-center w-12 group">
                <span className="text-[10px] text-slate-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{s.units}u</span>
                <div 
                  className="w-8 rounded-t bg-gradient-to-t from-red-600/40 to-red-500 hover:from-red-500 hover:to-rose-400 transition-all duration-500"
                  style={{ height: `${Math.max(pct, 5)}%` }}
                />
                <span className="text-[10px] font-bold text-white mt-2">{s.bloodGroup}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Hospital Administration Panel</h2>
          <p className="text-sm text-slate-400">Monitor blood inventory logs, verify QR codes, and trigger donor requests.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 animate-bounce" />
          <span>License Active & Approved</span>
        </div>
      </div>
  {/* Emergency Request Form */}
  <div className="mt-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <span>Send Emergency Request</span>
    </h3>
    <form onSubmit={handleEmergencySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Patient Name</label>
        <input type="text" value={emPatientName} onChange={e => setEmPatientName(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" required />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Blood Group</label>
        <select value={emBloodGroup} onChange={e => setEmBloodGroup(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500">
          <option value="O-">O- Negative</option>
          <option value="O+">O+ Positive</option>
          <option value="A+">A+ Positive</option>
          <option value="B+">B+ Positive</option>
          <option value="AB+">AB+ Positive</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Units Required</label>
        <input type="number" min="1" value={emUnitsRequired} onChange={e => setEmUnitsRequired(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
        <input type="text" value={emCity} onChange={e => setEmCity(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Hospital Name</label>
        <input type="text" value={emHospitalName} onChange={e => setEmHospitalName(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Hospital Location</label>
        <input type="text" value={emHospitalLocation} onChange={e => setEmHospitalLocation(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Contact Number</label>
        <input type="text" value={emContactNumber} onChange={e => setEmContactNumber(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Emergency Level</label>
        <select value={emEmergencyLevel} onChange={e => setEmEmergencyLevel(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500">
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Required Before (ISO)</label>
        <input type="datetime-local" value={emRequiredBefore} onChange={e => setEmRequiredBefore(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" />
      </div>
      <div className="col-span-2">
        <label className="text-xs font-semibold text-slate-400 block mb-1">Additional Notes</label>
        <textarea value={emAdditionalNotes} onChange={e => setEmAdditionalNotes(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500" rows={2} />
      </div>
      <div className="col-span-2 flex items-end">
        <button type="submit" disabled={emSubmitting}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition">
          {emSubmitting ? 'Sending...' : 'Send Emergency Request'}
        </button>
      </div>
    </form>
  </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stock Inventory Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Summary */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-red-500" />
              <span>Hospital Blood Stock Logs</span>
            </h3>

            {loading ? (
              <p className="text-xs text-slate-500">Loading stock records...</p>
            ) : stock.length === 0 ? (
              <p className="text-xs text-slate-500">No stock logs reported yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stock.map(s => (
                  <div key={s.id || s.bloodGroup} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 bg-red-600" style={{ width: `${Math.min(100, (s.units / 30) * 100)}%` }} />
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-lg text-white">{s.bloodGroup}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.units < 5 ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.units < 5 ? 'CRITICAL LOW' : 'STABLE'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-black text-slate-100">{s.units}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Units available</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Render Inventory Chart */}
          {renderChart()}

          {/* Manual Stock Adjustments */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-red-500" />
              <span>Inventory Stock Editor</span>
            </h3>

            <form onSubmit={handleStockUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Blood Group</label>
                <select
                  value={updateBg}
                  onChange={(e) => setUpdateBg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                >
                  <option value="O-">O- Negative</option>
                  <option value="O+">O+ Positive</option>
                  <option value="A+">A+ Positive</option>
                  <option value="B+">B+ Positive</option>
                  <option value="AB+">AB+ Positive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Adjust Units</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={updateUnits}
                  onChange={(e) => setUpdateUnits(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  {updating ? 'Updating...' : 'Adjust Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: QR Scanner & Critical Alerts */}
        <div className="space-y-6">
          {/* QR Donation Verification Simulator */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-red-500" />
              <span>QR Verification Scanner</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Scan donor QR codes to register successful donations, update donor intervals, and restock units.
            </p>

            <form onSubmit={handleQrScan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Scan Input (Enter Code String)</label>
                <input
                  type="text"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  placeholder="e.g. donation-1"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-red-500 text-inherit font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Demo Tip: Enter 'donation-1' to verify Pawans donation.
                </span>
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                {verifying ? 'Verifying QR Code...' : 'Scan & Verify Donation'}
              </button>
            </form>

            {scanResult && (
              <div className={`mt-4 p-3 rounded-xl border text-xs ${
                scanResult.success 
                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                  : 'bg-red-950/20 border-red-900/30 text-red-400'
              }`}>
                {scanResult.message}
              </div>
            )}
          </div>

          {/* Incoming SOS Tracker */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>Pending Emergency SOS</span>
            </h3>
            <div className="space-y-3">
              {sosRequests.slice(0, 2).map(req => (
                <div key={req.id} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-red-400">Trauma Request ({req.bloodGroup})</span>
                    <span className="text-[10px] text-slate-500">{req.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{req.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
