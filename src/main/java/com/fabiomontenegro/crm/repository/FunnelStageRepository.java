package com.fabiomontenegro.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fabiomontenegro.crm.model.FunnelStage;
import java.util.List;

public interface FunnelStageRepository extends JpaRepository<FunnelStage, Long> {
    List<FunnelStage> findAllByOrderByStageOrderAsc();
    
}
