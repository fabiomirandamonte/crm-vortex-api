package com.fabiomontenegro.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CustomerNoteRequest(
    @NotNull(message = "O ID do cliente é obrigatório")
    Long customerId,

    @NotBlank(message = "O conteúdo da nota não pode estar vazio")
    String content

){}
