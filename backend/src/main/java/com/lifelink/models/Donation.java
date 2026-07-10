package com.lifelink.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "camp_id")
    private BloodCamp camp;

    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    private Integer units = 1;

    @Column(nullable = false, length = 20)
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, FAILED

    @Column(name = "qr_code", unique = true, length = 255)
    private String qrCode;

    public Donation() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public BloodCamp getCamp() { return camp; }
    public void setCamp(BloodCamp camp) { this.camp = camp; }
    public LocalDate getDonationDate() { return donationDate; }
    public void setDonationDate(LocalDate donationDate) { this.donationDate = donationDate; }
    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
}
