package com.lifelink.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_predictions")
public class AIPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "blood_group", nullable = false, length = 5)
    private String bloodGroup;

    @Column(name = "predicted_shortage_units", nullable = false)
    private Integer predictedShortageUnits = 0;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel = "LOW"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "prediction_date")
    private LocalDateTime predictionDate = LocalDateTime.now();

    public AIPrediction() {}

    public AIPrediction(String city, String bloodGroup, Integer predictedShortageUnits, String riskLevel) {
        this.city = city;
        this.bloodGroup = bloodGroup;
        this.predictedShortageUnits = predictedShortageUnits;
        this.riskLevel = riskLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public Integer getPredictedShortageUnits() { return predictedShortageUnits; }
    public void setPredictedShortageUnits(Integer predictedShortageUnits) { this.predictedShortageUnits = predictedShortageUnits; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public LocalDateTime getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDateTime predictionDate) { this.predictionDate = predictionDate; }
}
