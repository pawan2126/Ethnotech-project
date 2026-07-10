package com.lifelink.repos;

import com.lifelink.models.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUserId(Long userId);
    List<Donor> findByBloodGroupAndIsAvailable(String bloodGroup, Boolean isAvailable);
}
