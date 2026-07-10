import React, { useEffect, useState, useContext } from 'react';
import { DemoContext } from '../context/DemoContext';
import { getDonorDonations } from '../services/api';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

const DonorDonations = () => {
  const { currentUser, isDemoMode } = useContext(DemoContext);
  const donorId = currentUser?.id || 1;
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // zero-based page index
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated donations or use fallback
  useEffect(() => {
    if (!donorId) return;

    if (isDemoMode) {
      // Mock historical data
      const mockDonations = [
        { id: 1, donationDate: "2026-04-10", units: 1, hospitalName: "City General Hospital", status: "COMPLETED" },
        { id: 2, donationDate: "2026-01-05", units: 1, hospitalName: "Red Cross Donation Camp", status: "COMPLETED" }
      ];
      setDonations(mockDonations);
      setTotalPages(1);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
      getDonorDonations(donorId, currentPage, itemsPerPage)
        .then(data => {
          setDonations(data.content || []);
          setTotalPages(data.totalPages ?? 1);
          setError(null);
          setLoading(false);
        })
        .catch(err => {
          // Fallback if backend goes down
          const mockDonations = [
            { id: 1, donationDate: "2026-04-10", units: 1, hospitalName: "City General Hospital", status: "COMPLETED" }
          ];
          setDonations(mockDonations);
          setTotalPages(1);
          setLoading(false);
        });
    }
  }, [donorId, currentPage, isDemoMode]);

  if (loading) return <p className="text-slate-400 text-xs">Loading donations history...</p>;

  return (
    <div className="mt-8 bg-slate-900/40 p-6 rounded-2xl overflow-hidden border border-slate-800 animate-fade-in">
      <h3 className="text-base font-bold text-white mb-4">Your Donation History</h3>
      {donations.length === 0 ? (
        <p className="text-xs text-slate-500">No donations recorded yet.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {donations.map(d => (
              <div key={d.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-200">{d.donationDate || 'Pending'}</span>
                  <span className="text-xs font-semibold text-slate-100">{d.units} unit(s)</span>
                  {d.hospitalName && (
                    <span className="text-[10px] text-slate-400">at {d.hospitalName}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {d.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${d.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>{d.status}</span>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded disabled:opacity-50 font-bold"
              >
                Prev
              </button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded disabled:opacity-50 font-bold"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonorDonations;
