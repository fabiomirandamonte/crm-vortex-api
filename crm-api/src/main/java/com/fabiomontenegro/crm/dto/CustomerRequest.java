package com.fabiomontenegro.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record CustomerRequest (

    @NotBlank(message = "O nome do cliente é obrigatório")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    String name,

   @NotBlank(message = "O e-mail é obrigatório")
   @Email(message = "E-mail em formato inválido")
   String email,

   @NotBlank(message = "O telefone é obrigatório")
   String phone,
   String company,

   @NotNull(message = "A etapa do funil (funnelStageId) é obrigatória")
   Long funnelStageId,
   Long assignedToUserId

) {}





    

