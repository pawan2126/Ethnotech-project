import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider, DemoContext } from './context/DemoContext';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorDashboard from './pages/DonorDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import BloodBankDashboard from './pages/BloodBankDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { Heart, Bell, LogOut } from 'lucide-react';
import DonorDonations from './pages/DonorDonations';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isDemoMode } = useContext(DemoContext);
  if (!currentUser && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const DashboardContainer = () => {
  const { role, darkMode, strings, notifications, logout } = useContext(DemoContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotes = notifications.filter(n => !n.isRead);

  // Switch dashboards based on active role
  const renderDashboard = () => {
    switch (role) {
      case 'DONOR':
        return <DonorDashboard />;
      case 'SEEKER':
        return <SeekerDashboard />;
      case 'HOSPITAL_ADMIN':
        return <HospitalDashboard />;
      case 'BLOOD_BANK_ADMIN':
        return <BloodBankDashboard />;
      case 'VOLUNTEER':
        return <VolunteerDashboard />;
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 backdrop-blur-md z-20 ${
          darkMode ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Emergency Mode: <span className="text-red-500">{role.replace('_', ' ')}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-slate-800/10 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Bell className="w-4.5 h-4.5 text-slate-400" />
              {unreadNotes.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-xl border p-4 max-h-96 overflow-y-auto z-50 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <h4 className="text-xs font-bold mb-3">System Alerts & Broadcasts</h4>
                {notifications.length === 0 ? (
                  <p className="text-[10px] text-slate-500">No recent notifications.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/20 text-xs">
                        <h5 className="font-bold">{n.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.message}</p>
                        <span className="text-[8px] text-slate-500 block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow p-8 overflow-y-auto">
          {renderDashboard()}
        </main>
      </div>

      {/* Floating Chatbot Assistant */}
      <Chatbot />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donations"
            element={
              <ProtectedRoute>
                <DonorDonations />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  );
};

export default App;
