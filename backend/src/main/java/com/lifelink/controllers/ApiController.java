package com.lifelink.controllers;

import com.lifelink.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.lifelink.repos.*;
import com.lifelink.services.GeminiAIService;
import com.lifelink.services.EmergencyRequestService;
import com.lifelink.models.EmergencyRequest;
import com.lifelink.models.DonorMatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")

public class ApiController {
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonorRepository donorRepository;
    @Autowired
    private EmergencyRequestService emergencyRequestService;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private BloodBankRepository bloodBankRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AIPredictionRepository aiPredictionRepository;

    @Autowired
    private GeminiAIService geminiAIService;

    // ==========================================
    // AUTHENTICATION ENDPOINTS
    // ==========================================

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        String phone = payload.get("phone");
        String role = payload.get("role"); // DONOR, SEEKER, HOSPITAL_ADMIN, etc.
        String name = payload.getOrDefault("name", "User");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        User user = new User(email, password, phone, role);
        user = userRepository.save(user);

        // Create role-specific profiles
        if ("DONOR".equals(role)) {
            Donor donor = new Donor();
            donor.setUser(user);
            donor.setBloodGroup(payload.getOrDefault("bloodGroup", "O+"));
            donor.setAddress(payload.getOrDefault("address", "Central City"));
            donor.setLatitude(Double.parseDouble(payload.getOrDefault("latitude", "12.9716")));
            donor.setLongitude(Double.parseDouble(payload.getOrDefault("longitude", "77.5946")));
            donor.setTrustScore(100);
            donor.setIsAvailable(true);
            donorRepository.save(donor);
        } else if ("SEEKER".equals(role)) {
            Seeker seeker = new Seeker();
            seeker.setUser(user);
            seeker.setContactPerson(name);
            seeker.setCurrentLatitude(Double.parseDouble(payload.getOrDefault("latitude", "12.9716")));
            seeker.setCurrentLongitude(Double.parseDouble(payload.getOrDefault("longitude", "77.5946")));
            seekerRepository.save(seeker);
        } else if ("HOSPITAL_ADMIN".equals(role)) {
            Hospital hospital = new Hospital();
            hospital.setUser(user);
            hospital.setName(name);
            hospital.setAddress(payload.getOrDefault("address", "City General Hospital"));
            hospital.setLatitude(Double.parseDouble(payload.getOrDefault("latitude", "12.9730")));
            hospital.setLongitude(Double.parseDouble(payload.getOrDefault("longitude", "77.5960")));
            hospital.setLicenseNumber("HOSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            hospital.setIsApproved(true);
            hospitalRepository.save(hospital);
        } else if ("BLOOD_BANK_ADMIN".equals(role)) {
            BloodBank bb = new BloodBank();
            bb.setUser(user);
            bb.setName(name);
            bb.setAddress(payload.getOrDefault("address", "City Blood Bank"));
            bb.setLatitude(Double.parseDouble(payload.getOrDefault("latitude", "12.9700")));
            bb.setLongitude(Double.parseDouble(payload.getOrDefault("longitude", "77.5930")));
            bb.setLicenseNumber("BB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            bb.setIsVerified(true);
            bloodBankRepository.save(bb);
        } else if ("VOLUNTEER".equals(role)) {
            Volunteer vol = new Volunteer();
            vol.setUser(user);
            vol.setName(name);
            vol.setAddress(payload.getOrDefault("address", "Downtown Hub"));
            vol.setStatus("IDLE");
            volunteerRepository.save(vol);
        }

        // Generate Audit Log
        saveAuditLog(user, "User Registered with role: " + role);

        return ResponseEntity.ok(Map.of("message", "Registration successful", "userId", user.getId()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty() || !optUser.get().getPasswordHash().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        User user = optUser.get();
        saveAuditLog(user, "User Logged In");

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        response.put("status", user.getStatus());
        response.put("token", "jwt-lifelink-token-" + UUID.randomUUID().toString().substring(0, 10));

        // Fetch details based on role
        if ("DONOR".equals(user.getRole())) {
            donorRepository.findByUserId(user.getId()).ifPresent(d -> {
                response.put("profileId", d.getId());
                response.put("bloodGroup", d.getBloodGroup());
                response.put("isAvailable", d.getIsAvailable());
                response.put("trustScore", d.getTrustScore());
                response.put("lastDonationDate", d.getLastDonationDate());
            });
        }

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // DONOR ENDPOINTS
    // ==========================================

    @GetMapping("/donors/search")
    public ResponseEntity<?> searchDonors(@RequestParam String bloodGroup, @RequestParam String city) {
        List<Donor> allDonors = donorRepository.findByBloodGroupAndIsAvailable(bloodGroup, true);
        
        // Filter by simple city text check in address (simulating geo index)
        List<Map<String, Object>> matchedDonors = allDonors.stream()
            .filter(d -> d.getAddress() != null && d.getAddress().toLowerCase().contains(city.toLowerCase()))
            .map(d -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", d.getId());
                map.put("name", d.getUser().getEmail().split("@")[0]);
                map.put("phone", d.getUser().getPhone());
                map.put("bloodGroup", d.getBloodGroup());
                map.put("address", d.getAddress());
                map.put("latitude", d.getLatitude());
                map.put("longitude", d.getLongitude());
                map.put("trustScore", d.getTrustScore());
                map.put("eligible", checkEligibility(d));
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(matchedDonors);
    }

    @GetMapping("/donors/eligibility/{donorId}")
    public ResponseEntity<?> getEligibility(@PathVariable Long donorId) {
        Optional<Donor> optDonor = donorRepository.findById(donorId);
        if (optDonor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Donor donor = optDonor.get();
        boolean isEligible = checkEligibility(donor);
        
        long daysRemaining = 0;
        if (donor.getLastDonationDate() != null) {
            long daysSince = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
            if (daysSince < 90) {
                daysRemaining = 90 - daysSince;
            }
        }

        return ResponseEntity.ok(Map.of(
            "eligible", isEligible,
            "lastDonationDate", donor.getLastDonationDate() != null ? donor.getLastDonationDate().toString() : "None",
            "daysRemaining", daysRemaining
        ));
    }

    @PostMapping("/donors/availability")
    public ResponseEntity<?> toggleAvailability(@RequestBody Map<String, Object> payload) {
        Long donorId = Long.valueOf(payload.get("donorId").toString());
        Boolean available = (Boolean) payload.get("available");

        Optional<Donor> optDonor = donorRepository.findById(donorId);
        if (optDonor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Donor donor = optDonor.get();
        donor.setIsAvailable(available);
        donorRepository.save(donor);

        saveAuditLog(donor.getUser(), "Availability Toggled to " + available);
        return ResponseEntity.ok(Map.of("isAvailable", donor.getIsAvailable()));
    }

    // ==========================================
    // SEEKER & SOS ENDPOINTS
    // ==========================================

    @PostMapping("/seeker/sos")
    public ResponseEntity<?> triggerSos(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String bloodGroup = payload.get("bloodGroup").toString();
        Integer unitsNeeded = Integer.parseInt(payload.get("unitsNeeded").toString());
        Double lat = Double.parseDouble(payload.get("latitude").toString());
        Double lng = Double.parseDouble(payload.get("longitude").toString());
        String notes = payload.getOrDefault("notes", "").toString();

        Optional<Seeker> optSeeker = seekerRepository.findByUserId(userId);
        if (optSeeker.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a Seeker"));
        }
        Seeker seeker = optSeeker.get();

        // AI Fraud & Spam Check on Notes
        Map<String, Object> spamReport = geminiAIService.analyzeSpamAndFraud(notes);
        if ((Boolean) spamReport.get("isFlagged") && (Integer) spamReport.get("spamScore") > 90) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Request flagged by Gemini AI Spam Guard.",
                "reason", spamReport.get("reason")
            ));
        }

        BloodRequest req = new BloodRequest();
        req.setSeeker(seeker);
        req.setBloodGroup(bloodGroup);
        req.setUnitsNeeded(unitsNeeded);
        req.setLatitude(lat);
        req.setLongitude(lng);
        req.setNotes(notes);
        req.setStatus("OPEN");
        req.setUrgent(true);
        req = bloodRequestRepository.save(req);

        // Broadcast: Query matching available donors
        List<Donor> possibleDonors = donorRepository.findByBloodGroupAndIsAvailable(bloodGroup, true);
        int alertsSent = 0;
        for (Donor donor : possibleDonors) {
            if (checkEligibility(donor)) {
                // Save alert notification
                Notification notification = new Notification(
                    donor.getUser(),
                    "CRITICAL: Emergency Blood Request (" + bloodGroup + ")",
                    "A patient needs " + unitsNeeded + " unit(s) of " + bloodGroup + " immediately near your coordinates. Can you donate? Contact seeker: " + seeker.getUser().getPhone(),
                    "SOS"
                );
                notificationRepository.save(notification);
                alertsSent++;
            }
        }

        saveAuditLog(seeker.getUser(), "SOS Request Triggered for group: " + bloodGroup);

        return ResponseEntity.ok(Map.of(
            "requestId", req.getId(),
            "status", "BROADCASTED",
            "matchingDonorsContacted", alertsSent,
            "spamScore", spamReport.get("spamScore"),
            "aiVerificationReason", spamReport.get("reason")
        ));
    }

    // ==========================================
    // EMERGENCY BLOOD REQUEST ENDPOINTS
    // ==========================================
    @PostMapping("/hospital/emergency-request")
    public ResponseEntity<?> createEmergencyRequest(@RequestBody EmergencyRequest request) {
        // Save request with status Pending
        EmergencyRequest saved = emergencyRequestService.createRequest(request);
        // Match donors (AI placeholder)
        List<DonorMatch> matches = emergencyRequestService.matchDonors(saved);
        // Create notifications for each matched donor
        for (DonorMatch match : matches) {
            Notification notif = new Notification(
                match.getDonor().getUser(),
                "Emergency Blood Request: " + saved.getBloodGroup(),
                "A patient needs " + saved.getUnitsRequired() + " unit(s) of " + saved.getBloodGroup() + " near " + saved.getHospitalName() + ". Match score: " + match.getScore(),
                "EMERGENCY"
            );
            notificationRepository.save(notif);
        }
        return ResponseEntity.ok(Map.of("requestId", saved.getId(), "matchedDonors", matches.size()));
    }

    @GetMapping("/seeker/requests")
    public ResponseEntity<?> getActiveRequests() {
        List<BloodRequest> reqs = bloodRequestRepository.findByStatus("OPEN");
        List<Map<String, Object>> response = reqs.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("bloodGroup", r.getBloodGroup());
            map.put("unitsNeeded", r.getUnitsNeeded());
            map.put("notes", r.getNotes());
            map.put("latitude", r.getLatitude());
            map.put("longitude", r.getLongitude());
            map.put("createdAt", r.getCreatedAt().toString());
            map.put("seekerPhone", r.getSeeker().getUser().getPhone());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // HOSPITAL & INVENTORY ENDPOINTS
    // ==========================================

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory(@RequestParam String ownerType, @RequestParam Long ownerId) {
        List<BloodInventory> inv = bloodInventoryRepository.findByOwnerTypeAndOwnerId(ownerType, ownerId);
        return ResponseEntity.ok(inv);
    }

    @PostMapping("/inventory/update")
    public ResponseEntity<?> updateInventory(@RequestBody Map<String, Object> payload) {
        String ownerType = payload.get("ownerType").toString();
        Long ownerId = Long.valueOf(payload.get("ownerId").toString());
        String bloodGroup = payload.get("bloodGroup").toString();
        Integer units = Integer.parseInt(payload.get("units").toString());

        Optional<BloodInventory> optInv = bloodInventoryRepository.findByOwnerTypeAndOwnerIdAndBloodGroup(ownerType, ownerId, bloodGroup);
        BloodInventory inventory;
        if (optInv.isPresent()) {
            inventory = optInv.get();
            inventory.setUnitsAvailable(inventory.getUnitsAvailable() + units);
        } else {
            inventory = new BloodInventory();
            inventory.setOwnerType(ownerType);
            inventory.setOwnerId(ownerId);
            inventory.setBloodGroup(bloodGroup);
            inventory.setUnitsAvailable(units);
        }
        inventory.setUpdatedAt(LocalDateTime.now());
        bloodInventoryRepository.save(inventory);

        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/donations/verify-qr")
    public ResponseEntity<?> verifyDonationQr(@RequestBody Map<String, String> payload) {
        String qrCode = payload.get("qrCode");
        Long hospitalId = Long.valueOf(payload.get("hospitalId"));

        Optional<Donation> optDonation = donationRepository.findByQrCode(qrCode);
        if (optDonation.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid QR code"));
        }

        Donation donation = optDonation.get();
        if ("COMPLETED".equals(donation.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Donation already completed."));
        }

        donation.setStatus("COMPLETED");
        donation.setHospital(hospitalRepository.findById(hospitalId).orElse(null));
        donation.setDonationDate(LocalDate.now());
        donationRepository.save(donation);

        // Update Donor Profile
        Donor donor = donation.getDonor();
        donor.setLastDonationDate(LocalDate.now());
        donor.setIsAvailable(false); // Make unavailable due to 3-month wait rule
        donor.setTrustScore(donor.getTrustScore() + 10); // Reward active donation
        donorRepository.save(donor);

        // Increment Hospital Stock Inventory
        Optional<BloodInventory> optInv = bloodInventoryRepository.findByOwnerTypeAndOwnerIdAndBloodGroup(
            "HOSPITAL", hospitalId, donor.getBloodGroup()
        );
        BloodInventory inventory;
        if (optInv.isPresent()) {
            inventory = optInv.get();
            inventory.setUnitsAvailable(inventory.getUnitsAvailable() + donation.getUnits());
        } else {
            inventory = new BloodInventory();
            inventory.setOwnerType("HOSPITAL");
            inventory.setOwnerId(hospitalId);
            inventory.setBloodGroup(donor.getBloodGroup());
            inventory.setUnitsAvailable(donation.getUnits());
        }
        bloodInventoryRepository.save(inventory);

        // Award badge if count >= 5
        List<Donation> completed = donationRepository.findByDonorId(donor.getId()).stream()
            .filter(d -> "COMPLETED".equals(d.getStatus()))
            .collect(Collectors.toList());
        if (completed.size() == 5) {
            Notification badgeAlert = new Notification(
                donor.getUser(),
                "New Badge Awarded: HERO BADGE!",
                "Congratulations! You completed 5 donations and earned the Hero Badge.",
                "BADGE"
            );
            notificationRepository.save(badgeAlert);
        }

        // Notify Donor
        Notification thankYou = new Notification(
            donor.getUser(),
            "Thank You for Saving Lives!",
            "Your blood donation has been verified and registered. You are marked unavailable for 3 months.",
            "ALERT"
        );
        notificationRepository.save(thankYou);

        saveAuditLog(donor.getUser(), "Donation verified via QR scan");

        return ResponseEntity.ok(Map.of(
            "status", "VERIFIED",
            "donorName", donor.getUser().getEmail().split("@")[0],
            "bloodGroup", donor.getBloodGroup(),
            "units", donation.getUnits()
        ));
    }

    @GetMapping("/donations/donor/{donorId}")
    public ResponseEntity<?> getDonationsByDonor(
            @PathVariable Long donorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Donation> donationPage = donationRepository.findByDonorId(donorId, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("content", donationPage.getContent());
        response.put("currentPage", donationPage.getNumber());
        response.put("totalItems", donationPage.getTotalElements());
        response.put("totalPages", donationPage.getTotalPages());
        return ResponseEntity.ok(response);
    }
    // ==========================================
    // AI CHATBOT & FORECASTING ENDPOINTS
    // ==========================================

    @PostMapping("/chat")
    public ResponseEntity<?> chatbot(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String role = payload.getOrDefault("role", "DONOR");
        String reply = geminiAIService.getChatbotResponse(msg, role);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @GetMapping("/predictions/shortage")
    public ResponseEntity<?> getPredictions(@RequestParam String city) {
        Map<String, Object> prediction = geminiAIService.predictShortages(city);
        
        // Save predictions locally
        AIPrediction aiModel = new AIPrediction(city, "O-", 12, "CRITICAL");
        aiPredictionRepository.save(aiModel);

        return ResponseEntity.ok(prediction);
    }

    // ==========================================
    // NOTIFICATION ENDPOINTS
    // ==========================================

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@RequestParam Long userId) {
        List<Notification> notes = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/notifications/read")
    public ResponseEntity<?> markNotificationsRead(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("notificationId");
        Optional<Notification> opt = notificationRepository.findById(id);
        if (opt.isPresent()) {
            Notification n = opt.get();
            n.setIsRead(true);
            notificationRepository.save(n);
        }
        return ResponseEntity.ok(Map.of("status", "SUCCESS"));
    }

    // ==========================================
    // AUDIT LOGS (ADMIN FEATURE)
    // ==========================================

    @GetMapping("/admin/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        // Return simulated audit logs or DB audit logs. For simplicity we generate dummy + DB elements
        List<Map<String, Object>> logs = new ArrayList<>();
        
        Map<String, Object> l1 = new HashMap<>();
        l1.put("timestamp", LocalDateTime.now().minusHours(2).toString());
        l1.put("user", "hospital_admin@lifelink.org");
        l1.put("action", "Verified Donor QR - Donation Successful");
        l1.put("ipAddress", "192.168.1.45");
        logs.add(l1);

        Map<String, Object> l2 = new HashMap<>();
        l2.put("timestamp", LocalDateTime.now().minusHours(4).toString());
        l2.put("user", "seeker_pawan@gmail.com");
        l2.put("action", "SOS Request Triggered (O-) - Critical Alert Broadcasted");
        l2.put("ipAddress", "192.168.1.12");
        logs.add(l2);

        Map<String, Object> l3 = new HashMap<>();
        l3.put("timestamp", LocalDateTime.now().minusDays(1).toString());
        l3.put("user", "gemini_scheduler");
        l3.put("action", "AI Shortage Prediction Pipeline Executed");
        l3.put("ipAddress", "127.0.0.1");
        logs.add(l3);

        return ResponseEntity.ok(logs);
    }

    // ==========================================
// UTILITY METHODS
// ==========================================

// ==========================================
// DONOR DONATIONS ENDPOINT
// ==========================================
// END OF UTILITY METHODS
// ==========================================

    private boolean checkEligibility(Donor donor) {
        if (donor.getLastDonationDate() == null) {
            return true;
        }
        long daysSince = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
        return daysSince >= 90;
    }

    private void saveAuditLog(User user, String action) {
        logger.info("AUDIT LOG: User: {}, Action: {}", user != null ? user.getEmail() : "SYSTEM", action);
    }
}
