-- ==========================================
-- LifeLink AI — Seed Data
-- ==========================================

-- Users (password = plaintext for demo)
INSERT INTO users (email, password_hash, phone, role, status, created_at) VALUES
('donor_pawan@gmail.com', 'password123', '+919876543210', 'DONOR', 'ACTIVE', CURRENT_TIMESTAMP),
('seeker_rahul@gmail.com', 'password123', '+919988776655', 'SEEKER', 'ACTIVE', CURRENT_TIMESTAMP),
('admin@citygeneral.org', 'password123', '+918877665544', 'HOSPITAL_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('manager@redcrossbank.org', 'password123', '+917766554433', 'BLOOD_BANK_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('volunteer_vikram@gmail.com', 'password123', '+916655443322', 'VOLUNTEER', 'ACTIVE', CURRENT_TIMESTAMP),
('super_admin@lifelink.gov', 'password123', '+919999888877', 'SUPER_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
('sneha@gmail.com', 'password123', '+919123456780', 'DONOR', 'ACTIVE', CURRENT_TIMESTAMP),
('anish@gmail.com', 'password123', '+919234567891', 'DONOR', 'ACTIVE', CURRENT_TIMESTAMP),
('kiran@gmail.com', 'password123', '+919345678902', 'DONOR', 'ACTIVE', CURRENT_TIMESTAMP),
('priya@gmail.com', 'password123', '+919456789013', 'DONOR', 'ACTIVE', CURRENT_TIMESTAMP);

-- Donors
INSERT INTO donors (user_id, blood_group, last_donation_date, is_available, trust_score, latitude, longitude, address) VALUES
(1, 'O-', '2026-04-10', true, 95, 12.9698, 77.7499, 'Whitefield, Bengaluru'),
(7, 'B+', '2026-06-01', true, 85, 12.9718, 77.6411, 'Indiranagar, Bengaluru'),
(8, 'O-', '2026-05-25', true, 90, 12.9279, 77.6271, 'Koramangala, Bengaluru'),
(9, 'AB+', '2025-12-15', true, 100, 12.9250, 77.5938, 'Jayanagar, Bengaluru'),
(10, 'O+', '2026-06-20', false, 80, 13.0354, 77.5988, 'Hebbal, Bengaluru');

-- Seekers
INSERT INTO seekers (user_id, city, phone_number, contact_person, current_latitude, current_longitude) VALUES (2, 'Bengaluru', '+919988776655', 'Rahul Kumar', 12.9730, 77.5960);

-- Hospitals
INSERT INTO hospitals (user_id, name, address, latitude, longitude, license_number, is_approved) VALUES
(3, 'City General Hospital', 'MG Road, Bengaluru', 12.9730, 77.5960, 'HOSP-882264', true);

-- Blood Banks
INSERT INTO blood_banks (user_id, name, address, latitude, longitude, license_number, is_verified) VALUES
(4, 'Red Cross Blood Bank', 'Brigade Road, Bengaluru', 12.9700, 77.5930, 'BB-RC00123', true);

-- Volunteers
INSERT INTO volunteers (user_id, name, address, status) VALUES
(5, 'Vikram Malhotra', 'Marathahalli, Bengaluru', 'IDLE');

-- Blood Inventory (Hospital)
INSERT INTO blood_inventory (owner_type, owner_id, blood_group, units_available, updated_at) VALUES
('HOSPITAL', 1, 'O+', 18, CURRENT_TIMESTAMP),
('HOSPITAL', 1, 'O-', 2, CURRENT_TIMESTAMP),
('HOSPITAL', 1, 'AB+', 25, CURRENT_TIMESTAMP),
('BLOOD_BANK', 1, 'O-', 4, CURRENT_TIMESTAMP),
('BLOOD_BANK', 1, 'A+', 35, CURRENT_TIMESTAMP),
('BLOOD_BANK', 1, 'B+', 42, CURRENT_TIMESTAMP);

-- Blood Requests (SOS)
INSERT INTO blood_requests (seeker_id, blood_group, units_needed, latitude, longitude, notes, status, urgent, created_at) VALUES
(1, 'O-', 3, 12.9730, 77.5960, 'Car accident victim, internal bleeding. Emergency case in City General ICU.', 'OPEN', true, CURRENT_TIMESTAMP),
(1, 'B+', 2, 12.9812, 77.6044, 'Scheduled bypass surgery tomorrow morning. Patient needs matching units.', 'OPEN', false, CURRENT_TIMESTAMP);

-- Donations
INSERT INTO donations (donor_id, hospital_id, units, qr_code, status, donation_date) VALUES
(1, 1, 1, 'donation-1', 'COMPLETED', '2026-04-10'),
(1, 1, 1, 'donation-1-jan', 'COMPLETED', '2026-01-05'),
(2, 1, 1, 'donation-2', 'PENDING', '2026-02-15');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
(1, 'GEMINI AI Shortage Alert', 'Critical low O- Negative inventory forecasted in Bengaluru Whitefield area. We recommend activating your availability.', 'RECOMMENDATION', false, CURRENT_TIMESTAMP),
(1, 'Emergency SOS Broadcast', 'URGENT: A+ blood units required at St. Johns Hospital. 2 matching donors needed.', 'SOS', false, CURRENT_TIMESTAMP),
(3, 'System Update', 'Your license key HOSP-882264 was renewed by Super Admin compliance.', 'SYSTEM', true, CURRENT_TIMESTAMP);
