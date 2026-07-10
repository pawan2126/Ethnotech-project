package com.lifelink.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "badges")
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "badge_name", nullable = false, length = 100)
    private String badgeName;

    @Column(name = "badge_type", nullable = false, length = 30)
    private String badgeType; // HERO, GOLD, PLATINUM, COMMUNITY_STAR

    @Column(name = "awarded_date", nullable = false)
    private LocalDate awardedDate = LocalDate.now();

    public Badge() {}

    public Badge(Donor donor, String badgeName, String badgeType) {
        this.donor = donor;
        this.badgeName = badgeName;
        this.badgeType = badgeType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    public String getBadgeType() { return badgeType; }
    public void setBadgeType(String badgeType) { this.badgeType = badgeType; }
    public LocalDate getAwardedDate() { return awardedDate; }
    public void setAwardedDate(LocalDate awardedDate) { this.awardedDate = awardedDate; }
}
