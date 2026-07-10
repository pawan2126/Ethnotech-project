package com.lifelink.repos;

import com.lifelink.models.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorId(Long donorId);
    Page<Donation> findByDonorId(Long donorId, Pageable pageable);
    Optional<Donation> findByQrCode(String qrCode);
}
