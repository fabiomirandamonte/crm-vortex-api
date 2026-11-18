package com.fabiomontenegro.crm.dto;

import com.fabiomontenegro.crm.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;

    public static UserResponse fromEntity(User user) {
        String roleName = user.getRole() != null ? user.getRole().getName() : "USER";
        // Remove o prefixo "ROLE_" caso exista no banco (ex: "ROLE_ADMIN" -> "ADMIN")
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(roleName)
                .build();
    }
}