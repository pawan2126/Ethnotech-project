package com.lifelink.repos;

import com.lifelink.models.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(String status);
    List<BloodRequest> findByBloodGroupAndStatus(String bloodGroup, String status);
}
