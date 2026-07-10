package com.lifelink.models;

public class DonationDto {
    private Long id;
    private String donationDate;
    private Integer units;
    private String status;
    private String hospitalName;

    public DonationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDonationDate() { return donationDate; }
    public void setDonationDate(String donationDate) { this.donationDate = donationDate; }

    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
}
