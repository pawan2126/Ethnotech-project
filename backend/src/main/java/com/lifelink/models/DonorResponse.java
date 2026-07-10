package com.lifelink.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donor_responses")
public class DonorResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private EmergencyRequest request;

    @Column(name = "response_status", nullable = false, length = 20)
    private String responseStatus; // ACCEPTED, DECLINED, MAYBE

    @Column(name = "response_time")
    private LocalDateTime responseTime = LocalDateTime.now();

    // Constructors
    public DonorResponse() {}

    public DonorResponse(Donor donor, EmergencyRequest request, String responseStatus) {
        this.donor = donor;
        this.request = request;
        this.responseStatus = responseStatus;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }
    public EmergencyRequest getRequest() { return request; }
    public void setRequest(EmergencyRequest request) { this.request = request; }
    public String getResponseStatus() { return responseStatus; }
    public void setResponseStatus(String responseStatus) { this.responseStatus = responseStatus; }
    public LocalDateTime getResponseTime() { return responseTime; }
    public void setResponseTime(LocalDateTime responseTime) { this.responseTime = responseTime; }
}
