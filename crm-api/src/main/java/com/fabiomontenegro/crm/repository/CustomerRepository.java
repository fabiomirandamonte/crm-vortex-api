package com.fabiomontenegro.crm.repository;

import com.fabiomontenegro.crm.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CustomerRepository extends JpaRepository<Customer, Long>{
    Page<Customer> findByFunnelStageId(Long stageId, Pageable pageable);
    Page<Customer> findByAssignedUserId(Long userId, Pageable pageable);
}
