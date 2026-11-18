package com.fabiomontenegro.crm.dto;

import com.fabiomontenegro.crm.model.Role; // Ajuste o pacote do enum Role se necessário
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "O nome completo é obrigatório")
    private String name;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    // Opcional na edição (se vier vazio no PUT, mantém a senha atual)
    private String password;

    @NotNull(message = "O perfil de permissão é obrigatório")
    private String role;
}