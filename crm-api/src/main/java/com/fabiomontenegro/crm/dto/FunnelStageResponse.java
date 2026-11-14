package com.fabiomontenegro.crm.dto;

import com.fabiomontenegro.crm.model.FunnelStage;

public record FunnelStageResponse (
    Long id,
    String name, 
    Integer stageOrder,
    String description
) {
    public static FunnelStageResponse fromEntity(FunnelStage stage) {
        return new FunnelStageResponse(
            stage.getId(),
            stage.getName(),
            stage.getStageOrder(),
            stage.getDescription()
        );
    }
}
    

    


