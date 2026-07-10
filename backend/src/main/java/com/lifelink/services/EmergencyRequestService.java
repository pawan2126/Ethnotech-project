package com.lifelink.services;

import com.lifelink.models.EmergencyRequest;
import com.lifelink.models.Donor;
import com.lifelink.models.DonorResponse;
import com.lifelink.repos.EmergencyRequestRepository;
import com.lifelink.repos.DonorResponseRepository;
import com.lifelink.repos.DonorRepository;
import com.lifelink.services.NotificationService;
import com.lifelink.models.DonorMatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;

@Service
public class EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository requestRepo;

    @Autowired
    private DonorRepository donorRepo;

    @Autowired
    private DonorResponseRepository responseRepo;

    @Autowired
    private NotificationService notificationService;

    // Create a new emergency request with status "Pending"
    public EmergencyRequest createRequest(EmergencyRequest request) {
        request.setStatus(EmergencyRequest.RequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        return requestRepo.save(request);
    }

    // Find pending requests (could be used by admin dashboard)
    public List<EmergencyRequest> getPendingRequests() {
        return requestRepo.findByStatus("Pending");
    }

    // Match eligible donors (placeholder AI logic)
    public List<DonorMatch> matchDonors(EmergencyRequest request) {
        // Basic eligibility filtering – real implementation would call Gemini AI
        List<Donor> allDonors = donorRepo.findAll();
        List<DonorMatch> matches = new ArrayList<>();
        for (Donor donor : allDonors) {
            if (!donor.getBloodGroup().equalsIgnoreCase(request.getBloodGroup())) continue;
            // Placeholder: distance check & availability omitted
            // Check last donation date (eligible if >90 days ago)
            if (donor.getLastDonationDate() != null && donor.getLastDonationDate().isAfter(java.time.LocalDate.now().minusDays(90))) continue;
            // Simple scoring placeholder
            double score = 70; // placeholder score
            matches.add(new DonorMatch(donor, score, "Basic compatibility"));
            // Notify donor immediately
            notificationService.notifyEmergencyDonor(donor, request, score);
        }
        // Sort descending by score
        matches.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return matches;
    }

    // Record donor response (accept/decline)
    public DonorResponse recordResponse(Long donorId, Long requestId, String status) {
        Optional<Donor> donorOpt = donorRepo.findById(donorId);
        Optional<EmergencyRequest> reqOpt = requestRepo.findById(requestId);
        if (donorOpt.isEmpty() || reqOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid donor or request ID");
        }
        DonorResponse response = new DonorResponse(donorOpt.get(), reqOpt.get(), status);
        return responseRepo.save(response);
    }


}
