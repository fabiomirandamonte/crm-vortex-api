package com.fabiomontenegro.crm.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fabiomontenegro.crm.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
