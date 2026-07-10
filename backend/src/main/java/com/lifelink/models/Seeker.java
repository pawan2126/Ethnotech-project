package com.lifelink.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seekers")
public class Seeker {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @OneToOne
 @JoinColumn(name = "user_id", referencedColumnName = "id")
 private User user;

 @Column(nullable = false)
 private String city;

 @Column(nullable = false)
 private String phoneNumber;

 // Additional fields like lastRequestDate, etc.
 @Column(name = "contact_person")
 private String contactPerson;
 @Column(name = "current_latitude")
 private double currentLatitude;
 @Column(name = "current_longitude")
 private double currentLongitude;
 private LocalDateTime lastRequestDate;

 // Getters and Setters
 public Long getId() { return id; }
 public void setId(Long id) { this.id = id; }
 public String getContactPerson() { return contactPerson; }
 public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
 public double getCurrentLatitude() { return currentLatitude; }
 public void setCurrentLatitude(double currentLatitude) { this.currentLatitude = currentLatitude; }
 public double getCurrentLongitude() { return currentLongitude; }
 public void setCurrentLongitude(double currentLongitude) { this.currentLongitude = currentLongitude; }
 public User getUser() { return user; }
 public void setUser(User user) { this.user = user; }
 public String getCity() { return city; }
 public void setCity(String city) { this.city = city; }
 public String getPhoneNumber() { return phoneNumber; }
 public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
 public LocalDateTime getLastRequestDate() { return lastRequestDate; }
 public void setLastRequestDate(LocalDateTime lastRequestDate) { this.lastRequestDate = lastRequestDate; }
}
