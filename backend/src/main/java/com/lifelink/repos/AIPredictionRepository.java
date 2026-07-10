package com.lifelink.repos;

import com.lifelink.models.AIPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AIPredictionRepository extends JpaRepository<AIPrediction, Long> {
    List<AIPrediction> findByCity(String city);
}
