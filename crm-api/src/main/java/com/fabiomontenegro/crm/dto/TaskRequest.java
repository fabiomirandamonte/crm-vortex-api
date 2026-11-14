package com.fabiomontenegro.crm.dto;

import java.time.OffsetDateTime;
import com.fabiomontenegro.crm.model.enums.TaskPriority;
import com.fabiomontenegro.crm.model.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record TaskRequest (

    @NotBlank(message = "O título da tarefa é obrigatório")
    @Size(min = 3, max = 150, message = "O título deve ter entre 3 e 150 caracteres")
    String title,
    String description,
    
    @FutureOrPresent(message = "A data de vencimento deve ser atual ou futura")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    OffsetDateTime dueDate,

    @NotNull(message = "O status da tarefa é obrigatório")
    TaskStatus status,

    @NotNull(message = "A prioridade é obrigatória")
    TaskPriority priority,

    @NotNull(message = "O ID do cliente vinculado é obrigatório")
    Long customerId,

    @NotNull(message = "O ID do usuário responsável é obrigatório")
    Long assignedUserId
){}
