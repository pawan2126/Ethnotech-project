package com.lifelink.repos;

import com.lifelink.models.DonorResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DonorResponseRepository extends JpaRepository<DonorResponse, Long> {
    Optional<DonorResponse> findByDonorIdAndRequestId(Long donorId, Long requestId);
}
