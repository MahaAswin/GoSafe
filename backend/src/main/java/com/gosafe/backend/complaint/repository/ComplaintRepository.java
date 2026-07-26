package com.gosafe.backend.complaint.repository;

import com.gosafe.backend.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Spring Data JPA Repository mapping database transactions to the complaints table.
 */
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
}
