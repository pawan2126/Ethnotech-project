package com.lifelink.models;

public class DonorMatch {
    private Donor donor;
    private double score;
    private String reason;

    public DonorMatch() {}

    public DonorMatch(Donor donor, double score, String reason) {
        this.donor = donor;
        this.score = score;
        this.reason = reason;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
