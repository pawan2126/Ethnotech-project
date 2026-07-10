/**
 * LifeLink AI — Centralized API Service Layer
 * Provides all backend REST API calls with graceful fallback.
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api';

// Generic fetch wrapper with timeout and error handling
export async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Backend may be offline.');
    }
    throw err;
  }
}

// ==========================================
// AUTH
// ==========================================

export async function loginUser(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// DONORS
// ==========================================

export async function searchDonors(bloodGroup, city) {
  return apiFetch(`/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);
}

export async function getEligibility(donorId) {
  return apiFetch(`/donors/eligibility/${donorId}`);
}

export async function toggleAvailability(donorId, available) {
  return apiFetch('/donors/availability', {
    method: 'POST',
    body: JSON.stringify({ donorId, available }),
  });
}

// ==========================================
// SEEKER & SOS
// ==========================================

export async function triggerSos(payload) {
  return apiFetch('/seeker/sos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getActiveRequests() {
  return apiFetch('/seeker/requests');
}

// ==========================================
// INVENTORY
// ==========================================

export async function getInventory(ownerType, ownerId) {
  return apiFetch(`/inventory?ownerType=${ownerType}&ownerId=${ownerId}`);
}

export async function updateInventory(payload) {
  return apiFetch('/inventory/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==========================================
// DONATIONS
// ==========================================

export async function verifyQrDonation(qrCode, hospitalId) {
  return apiFetch('/donations/verify-qr', {
    method: 'POST',
    body: JSON.stringify({ qrCode, hospitalId: String(hospitalId) }),
  });
}

export async function getDonorDonations(donorId, page = 0, size = 5) {
  return apiFetch(`/donations/donor/${donorId}?page=${page}&size=${size}`);
}

// ==========================================
// AI CHATBOT & PREDICTIONS
// ==========================================

export async function chatWithAI(message, role) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, role }),
  });
}

export async function getShortagePrediction(city) {
  return apiFetch(`/predictions/shortage?city=${encodeURIComponent(city)}`);
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export async function getNotifications(userId) {
  return apiFetch(`/notifications?userId=${userId}`);
}

export async function markNotificationRead(notificationId) {
  return apiFetch('/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ notificationId }),
  });
}

// ==========================================
// ADMIN
// ==========================================

export async function getAuditLogs() {
  return apiFetch('/admin/audit-logs');
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_BASE}/seeker/requests`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

// ==========================================
// BLOOD CAMPS
// ==========================================

export async function getBloodCamps() {
  return apiFetch('/camps');
}

export async function registerForCamp(campId, donorId) {
  return apiFetch('/camps/register', {
    method: 'POST',
    body: JSON.stringify({ campId, donorId }),
  });
}

// ==========================================
// ANALYTICS
// ==========================================

export async function getAnalytics() {
  return apiFetch('/analytics');
}

// ==========================================
// LEADERBOARD
// ==========================================

export async function getLeaderboard() {
  return apiFetch('/leaderboard');
}

// ==========================================
// PROFILE
// ==========================================

export async function updateProfile(userId, data) {
  return apiFetch(`/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

