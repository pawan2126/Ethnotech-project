package com.lifelink.repos;

import com.lifelink.models.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeekerRepository extends JpaRepository<Seeker, Long> {
    Optional<Seeker> findByUserId(Long userId);
}
