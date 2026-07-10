package com.lifelink.repos;

import com.lifelink.models.QRVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QRVerificationRepository extends JpaRepository<QRVerification, Long> {
    Optional<QRVerification> findByQrUuid(String qrUuid);
}
