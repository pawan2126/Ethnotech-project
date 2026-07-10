package com.lifelink.repos;

import com.lifelink.models.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    List<BloodInventory> findByOwnerTypeAndOwnerId(String ownerType, Long ownerId);
    Optional<BloodInventory> findByOwnerTypeAndOwnerIdAndBloodGroup(String ownerType, Long ownerId, String bloodGroup);
}
