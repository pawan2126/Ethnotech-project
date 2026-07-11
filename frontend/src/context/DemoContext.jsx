import React, { createContext, useState, useEffect, useCallback } from 'react';
import { checkBackendHealth, loginUser as apiLogin, getNotifications as apiGetNotifications } from '../services/api';

export const DemoContext = createContext();

const initialLanguages = {
  en: {
    dashboard: "Dashboard",
    donors: "Donors",
    seekers: "Seekers",
    hospitals: "Hospitals",
    bloodBanks: "Blood Banks",
    volunteers: "Volunteers",
    superAdmin: "Super Admin",
    sosButton: "SOS Emergency Request",
    chatbot: "AI Assistant",
    inventory: "Blood Inventory",
    badges: "Hero Badges",
    eligibility: "Eligibility Checker",
    activeRequests: "Active Emergencies",
    auditLogs: "Audit Compliance Logs",
    predictiveAlerts: "AI Shortage Alerts",
    availability: "Donor Availability",
    certificates: "Donation Certificates",
    leaderboard: "Leaderboard",
    searchPlaceholder: "Search by blood group or city...",
    notes: "Emergency request notes...",
    needUnits: "Units Needed",
    trustScore: "Trust Score",
    acceptTask: "Accept Route Task",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    donors: "रक्तदाता",
    seekers: "रक्त खोजी",
    hospitals: "अस्पताल",
    bloodBanks: "ब्लड बैंक",
    volunteers: "स्वयंसेवक",
    superAdmin: "सुपर एडमिन",
    sosButton: "एसओएस आपातकालीन अनुरोध",
    chatbot: "एआई सहायक",
    inventory: "रक्त सूची",
    badges: "वीरता बैज",
    eligibility: "योग्यता चेकर",
    activeRequests: "सक्रिय आपात स्थिति",
    auditLogs: "ऑडिट अनुपालन लॉग",
    predictiveAlerts: "एआई कमी अलर्ट",
    availability: "रक्तदाता उपलब्धता",
    certificates: "दान प्रमाणपत्र",
    leaderboard: "लीडरबोर्ड",
    searchPlaceholder: "रक्त समूह या शहर द्वारा खोजें...",
    notes: "आपातकालीन अनुरोध नोट...",
    needUnits: "आवश्यक इकाइयाँ",
    trustScore: "विश्वास स्कोर",
    acceptTask: "मार्ग कार्य स्वीकार करें",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    donors: "రక్తదాతలు",
    seekers: "రక్తగ్రహీతలు",
    hospitals: "ఆసుపత్రులు",
    bloodBanks: "బ్లడ్ బ్యాంకులు",
    volunteers: "స్వచ్ఛంద సేవకులు",
    superAdmin: "సూపర్ అడ్మిన్",
    sosButton: "SOS అత్యవసర అభ్యర్థన",
    chatbot: "AI అసిస్టెంట్",
    inventory: "రక్త నిల్వలు",
    badges: "హీరో బ్యాడ్జీలు",
    eligibility: "అర్హత తనిఖీ",
    activeRequests: "క్రియాశీల అత్యవసరాలు",
    auditLogs: "ఆడిట్ లాగ్స్",
    predictiveAlerts: "AI కొరత హెచ్చరికలు",
    availability: "రక్తదాత లభ్యత",
    certificates: "రక్తదాన ధృవీకరణ పత్రాలు",
    leaderboard: "లీడర్‌బోర్డ్",
    searchPlaceholder: "బ్లడ్ గ్రూప్ లేదా నగరం ద్వారా శోధించండి...",
    notes: "అత్యవసర అభ్యర్థన గమనికలు...",
    needUnits: "కావలసిన యూనిట్లు",
    trustScore: "ట్రస్ట్ స్కోర్",
    acceptTask: "రవాణా పనిని స్వీకరించు",
  }
};

export const DemoProvider = ({ children }) => {
  // ==========================================
  // AUTH STATE
  // ==========================================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isOnline, setIsOnline] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!currentUser);

  // ==========================================
  // UI STATE
  // ==========================================
  const [role, setRole] = useState(currentUser?.role || 'SUPER_ADMIN');
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('en');
  const [showChatbot, setShowChatbot] = useState(false);

  // ==========================================
  // MOCK DATA (fallback for demo/offline mode)
  // ==========================================
  const [users, setUsers] = useState([
    { id: 1, email: "donor_pawan@gmail.com", role: "DONOR", status: "ACTIVE", phone: "+91 9876543210" },
    { id: 2, email: "seeker_rahul@gmail.com", role: "SEEKER", status: "ACTIVE", phone: "+91 9988776655" },
    { id: 3, email: "admin@citygeneral.org", role: "HOSPITAL_ADMIN", status: "ACTIVE", phone: "+91 8877665544" },
    { id: 4, email: "manager@redcrossbank.org", role: "BLOOD_BANK_ADMIN", status: "ACTIVE", phone: "+91 7766554433" },
    { id: 5, email: "volunteer_vikram@gmail.com", role: "VOLUNTEER", status: "ACTIVE", phone: "+91 6655443322" },
  ]);

  const [donors, setDonors] = useState([
    { id: 1, name: "Golla Pawan", email: "donor_pawan@gmail.com", bloodGroup: "O-", lastDonationDate: "2026-04-10", isAvailable: true, trustScore: 95, address: "Whitefield, Bengaluru", latitude: 12.9698, longitude: 77.7499, badges: ["HERO", "GOLD"], phone: "+91 9876543210" },
    { id: 2, name: "Sneha Reddy", email: "sneha@gmail.com", bloodGroup: "B+", lastDonationDate: "2026-06-01", isAvailable: true, trustScore: 85, address: "Indiranagar, Bengaluru", latitude: 12.9718, longitude: 77.6411, badges: ["HERO"], phone: "+91 9123456780" },
    { id: 3, name: "Anish Sharma", email: "anish@gmail.com", bloodGroup: "O-", lastDonationDate: "2026-05-25", isAvailable: true, trustScore: 90, address: "Koramangala, Bengaluru", latitude: 12.9279, longitude: 77.6271, badges: [], phone: "+91 9234567891" },
    { id: 4, name: "Kiran Kumar", email: "kiran@gmail.com", bloodGroup: "AB+", lastDonationDate: "2025-12-15", isAvailable: true, trustScore: 100, address: "Jayanagar, Bengaluru", latitude: 12.9250, longitude: 77.5938, badges: ["HERO", "GOLD", "PLATINUM"], phone: "+91 9345678902" },
    { id: 5, name: "Priya Patel", email: "priya@gmail.com", bloodGroup: "O+", lastDonationDate: "2026-06-20", isAvailable: false, trustScore: 80, address: "Hebbal, Bengaluru", latitude: 13.0354, longitude: 77.5988, badges: [], phone: "+91 9456789013" }
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, owner: "City General Hospital", bloodGroup: "O+", units: 18, type: "HOSPITAL" },
    { id: 2, owner: "City General Hospital", bloodGroup: "O-", units: 2, type: "HOSPITAL" },
    { id: 3, owner: "City General Hospital", bloodGroup: "AB+", units: 25, type: "HOSPITAL" },
    { id: 4, owner: "Red Cross Blood Bank", bloodGroup: "O-", units: 4, type: "BLOOD_BANK" },
    { id: 5, owner: "Red Cross Blood Bank", bloodGroup: "A+", units: 35, type: "BLOOD_BANK" },
    { id: 6, owner: "Red Cross Blood Bank", bloodGroup: "B+", units: 42, type: "BLOOD_BANK" },
  ]);

  const [sosRequests, setSosRequests] = useState([
    { id: 101, seekerName: "Rahul Kumar", seekerPhone: "+91 9988776655", bloodGroup: "O-", unitsNeeded: 3, notes: "Car accident victim, internal bleeding. Emergency case in City General ICU.", latitude: 12.9730, longitude: 77.5960, status: "OPEN", time: "10 mins ago", urgent: true },
    { id: 102, seekerName: "Vijay Prasad", seekerPhone: "+91 9944332211", bloodGroup: "B+", unitsNeeded: 2, notes: "Scheduled bypass surgery tomorrow morning. Patient needs matching units.", latitude: 12.9812, longitude: 77.6044, status: "OPEN", time: "1 hour ago", urgent: false },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, userId: 1, title: "GEMINI AI Shortage Alert", message: "Critical low O- Negative inventory forecasted in Bengaluru Whitefield area. We recommend activating your availability.", type: "RECOMMENDATION", time: "Just now", isRead: false },
    { id: 2, userId: 1, title: "Emergency SOS Broadcast", message: "URGENT: A+ blood units required at St. Johns Hospital. 2 matching donors needed.", type: "SOS", time: "30 mins ago", isRead: false },
    { id: 3, userId: 3, title: "System Update", message: "Your license key HOSP-882264 was renewed by Super Admin compliance.", type: "SYSTEM", time: "1 day ago", isRead: true },
  ]);

  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "Vikram Malhotra", status: "IDLE", address: "Marathahalli, Bengaluru", assignedTask: null }
  ]);

  const [volunteerAssignments, setVolunteerAssignments] = useState([
    { id: 501, volunteerId: 1, requestId: 101, task: "Collect 2 units of O- from Red Cross Blood Bank and deliver to City General Hospital ICU.", status: "ACCEPTED", distance: "4.8 km", eta: "12 mins" }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: "2026-07-08 10:15:30", user: "manager@redcrossbank.org", action: "Dispatched 2 units of O- to City General", ipAddress: "192.168.1.104" },
    { id: 2, timestamp: "2026-07-08 09:42:15", user: "donor_pawan@gmail.com", action: "Updated availability to AVAILABLE", ipAddress: "192.168.1.52" },
    { id: 3, timestamp: "2026-07-08 08:30:11", user: "system_gemini", action: "AI Demand Forecast pipeline computed city-wide", ipAddress: "127.0.0.1" },
  ]);

  const [chatbotMessages, setChatbotMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! I am LifeLink AI. Ask me anything about blood compatibility, donor eligibility, emergency SOS broadcasts, or system instructions." }
  ]);

  const [bloodCamps, setBloodCamps] = useState([
    { id: 1, name: "Mega Blood Drive 2026", organizer: "Red Cross Blood Bank", location: "Koramangala Community Hall, Bengaluru", date: "2026-07-20", time: "9:00 AM - 4:00 PM", capacity: 200, registered: 142, bloodGroupsNeeded: ["O-", "O+", "A+", "B+"], latitude: 12.9279, longitude: 77.6271, status: "UPCOMING", description: "Annual mega blood donation drive. Free health checkups and refreshments for all donors." },
    { id: 2, name: "Emergency O- Collection Camp", organizer: "City General Hospital", location: "Whitefield Tech Park, Bengaluru", date: "2026-07-15", time: "10:00 AM - 2:00 PM", capacity: 50, registered: 38, bloodGroupsNeeded: ["O-"], latitude: 12.9698, longitude: 77.7499, status: "UPCOMING", description: "Targeted collection for critically low O- inventory levels." },
    { id: 3, name: "College Donor Awareness Camp", organizer: "St. Johns Hospital", location: "REVA University, Bengaluru", date: "2026-07-25", time: "8:00 AM - 5:00 PM", capacity: 300, registered: 89, bloodGroupsNeeded: ["ALL"], latitude: 13.1159, longitude: 77.6341, status: "UPCOMING", description: "Youth-focused donation camp with educational sessions on blood safety and compatibility." },
    { id: 4, name: "Corporate Donation Day", organizer: "Red Cross Blood Bank", location: "Manyata Tech Park, Bengaluru", date: "2026-07-05", time: "9:00 AM - 3:00 PM", capacity: 150, registered: 150, bloodGroupsNeeded: ["A+", "B+", "AB+"], latitude: 13.0472, longitude: 77.6215, status: "COMPLETED", description: "Corporate partnership drive. Sponsored refreshments and certificates provided." },
  ]);

  // Computed leaderboard from donors
  const leaderboard = [...donors]
    .sort((a, b) => b.trustScore - a.trustScore)
    .map((d, i) => ({ ...d, rank: i + 1, donationCount: Math.floor(d.trustScore / 10) + Math.floor(Math.random() * 3) }));

  // ==========================================
  // AUTH FUNCTIONS
  // ==========================================

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      const userObj = {
        id: data.id,
        email: data.email,
        role: data.role,
        phone: data.phone,
        status: data.status,
        token: data.token,
        profileId: data.profileId,
        bloodGroup: data.bloodGroup,
        isAvailable: data.isAvailable,
        trustScore: data.trustScore,
      };
      setCurrentUser(userObj);
      setRole(userObj.role);
      setIsDemoMode(false);
      localStorage.setItem('lifelink_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsDemoMode(true);
    setRole('SUPER_ADMIN');
    localStorage.removeItem('lifelink_user');
  }, []);

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setCurrentUser(null);
    localStorage.removeItem('lifelink_user');
  }, []);

  // ==========================================
  // BACKEND HEALTH CHECK
  // ==========================================
  useEffect(() => {
    checkBackendHealth().then(setIsOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setIsOnline);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ==========================================
  // BUSINESS LOGIC (DEMO MODE FALLBACKS)
  // ==========================================

  const checkEligibility = (lastDate) => {
    if (!lastDate) return true;
    const diff = Math.floor((new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24));
    return diff >= 90;
  };

  const triggerSos = (bloodGroup, units, notes, lat, lng) => {
    const newRequest = {
      id: Math.floor(Math.random() * 1000) + 200,
      seekerName: currentUser?.email?.split('@')[0] || "Current User",
      seekerPhone: currentUser?.phone || "+91 9998887776",
      bloodGroup,
      unitsNeeded: parseInt(units),
      notes,
      latitude: parseFloat(lat || 12.9716),
      longitude: parseFloat(lng || 77.5946),
      status: "OPEN",
      time: "Just now",
      urgent: true
    };
    
    // Auto fraud filter
    let flagged = false;
    let fraudReason = "";
    if (notes.toLowerCase().includes("money") || notes.toLowerCase().includes("cash") || notes.toLowerCase().includes("buy")) {
      flagged = true;
      fraudReason = "SOS description flagged: Financial or monetary terms detected by AI Guard.";
    }

    if (flagged) {
      alert(`⚠️ SOS Blocked by LifeLink AI Guard:\n${fraudReason}`);
      return false;
    }

    setSosRequests(prev => [newRequest, ...prev]);
    
    // Broadcast notifications to compatible donors
    const matched = donors.filter(d => d.bloodGroup === bloodGroup && d.isAvailable);
    matched.forEach(m => {
      setNotifications(prev => [
        {
          id: Math.random(),
          userId: m.id,
          title: "🚨 URGENT: EMERGENCY SOS",
          message: `Need ${units} units of ${bloodGroup} at your nearby location immediately. Contact seeker!`,
          type: "SOS",
          time: "Just now",
          isRead: false
        },
        ...prev
      ]);
    });

    addAuditLog(currentUser?.email || "seeker_demo@gmail.com", `SOS Request broadcasted for ${bloodGroup} (${units} units)`);
    return true;
  };

  const verifyQrDonation = (qrString, hospitalId) => {
    const donorId = parseInt(qrString.split('-')[1]);
    const donorIndex = donors.findIndex(d => d.id === donorId);
    if (donorIndex !== -1) {
      const updatedDonors = [...donors];
      const donor = updatedDonors[donorIndex];
      donor.lastDonationDate = new Date().toISOString().split('T')[0];
      donor.isAvailable = false;
      donor.trustScore = Math.min(100, donor.trustScore + 10);
      
      if (donor.badges.length < 3) {
        donor.badges.push("HERO");
      }
      setDonors(updatedDonors);

      const updatedInv = [...inventory];
      const groupIndex = updatedInv.findIndex(i => i.bloodGroup === donor.bloodGroup && i.type === "HOSPITAL");
      if (groupIndex !== -1) {
        updatedInv[groupIndex].units += 1;
      } else {
        updatedInv.push({
          id: updatedInv.length + 1,
          owner: "City General Hospital",
          bloodGroup: donor.bloodGroup,
          units: 1,
          type: "HOSPITAL"
        });
      }
      setInventory(updatedInv);

      setNotifications(prev => [
        {
          id: Math.random(),
          userId: donor.id,
          title: "Donation Verified!",
          message: "Thank you! Your donation was registered. You are marked unavailable for 3 months.",
          type: "BADGE",
          time: "Just now",
          isRead: false
        },
        ...prev
      ]);

      addAuditLog("hospital_admin@citygeneral.org", `Verified QR donation for ${donor.name} (Group: ${donor.bloodGroup})`);
      return { success: true, donorName: donor.name, bloodGroup: donor.bloodGroup };
    }
    return { success: false, message: "Invalid QR scan value." };
  };

  const addAuditLog = (userEmail, actionText) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: userEmail,
      action: actionText,
      ipAddress: "192.168.1." + Math.floor(Math.random() * 200 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const registerForCamp = useCallback((campId) => {
    setBloodCamps(prev => prev.map(c =>
      c.id === campId && c.registered < c.capacity
        ? { ...c, registered: c.registered + 1 }
        : c
    ));
    addAuditLog(currentUser?.email || "demo_donor@gmail.com", `Registered for blood camp #${campId}`);
  }, [currentUser]);

  const strings = initialLanguages[lang];

  return (
    <DemoContext.Provider value={{
      // Auth
      currentUser, setCurrentUser,
      isOnline, isDemoMode, setIsDemoMode,
      login, logout, enterDemoMode,

      // UI
      role, setRole,
      darkMode, setDarkMode,
      lang, setLang,
      strings,
      showChatbot, setShowChatbot,

      // Data
      users, setUsers,
      donors, setDonors,
      inventory, setInventory,
      sosRequests, setSosRequests,
      notifications, setNotifications,
      volunteers, setVolunteers,
      volunteerAssignments, setVolunteerAssignments,
      auditLogs, setAuditLogs,
      chatbotMessages, setChatbotMessages,
      bloodCamps, setBloodCamps,
      leaderboard,

      // Actions
      triggerSos,
      verifyQrDonation,
      checkEligibility,
      addAuditLog,
      markAllRead,
      deleteNotification,
      registerForCamp,
    }}>
      {children}
    </DemoContext.Provider>
  );
};
