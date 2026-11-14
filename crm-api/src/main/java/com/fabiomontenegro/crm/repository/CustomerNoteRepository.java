package com.fabiomontenegro.crm.repository;

import com.fabiomontenegro.crm.model.CustomerNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerNoteRepository extends JpaRepository<CustomerNote, Long> {
    Page<CustomerNote> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
}
