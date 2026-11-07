package com.fabiomontenegro.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FunnelStageRequest (

    @NotBlank(message = "O nome do estágio é obrigatório")
    @Size(max = 50, message = "O nome do estágio deve ter no máximo 50 caracteres")
    String name,

    @NotNull(message = "A ordem do estágio é obrigatória")
    Integer stageOrder,

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
    String description

) {}


