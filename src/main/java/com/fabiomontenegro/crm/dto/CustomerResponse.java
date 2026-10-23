package com.fabiomontenegro.crm.dto;

import com.fabiomontenegro.crm.model.Customer;
import java.time.OffsetDateTime;

public record CustomerResponse(
    Long id,
    String name,
    String email,
    String phone,
    String company,
    Long funnelStageId,
    String funnelStageName,
    Long assignedToUserId,
    String assignedToUserName,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static CustomerResponse fromEntity(Customer customer) {
        return new CustomerResponse(
            customer.getId(),
            customer.getName(),
            customer.getEmail(),
            customer.getPhone(),
            customer.getCompanyName(), // Mapeado para o atributo companyName da entidade
            customer.getFunnelStage() != null ? customer.getFunnelStage().getId() : null,
            customer.getFunnelStage() != null ? customer.getFunnelStage().getName() : null,
            customer.getAssignedUser() != null ? customer.getAssignedUser().getId() : null, // Mapeado para assignedUser
            customer.getAssignedUser() != null ? customer.getAssignedUser().getName() : null,
            customer.getCreatedAt(),
            customer.getUpdatedAt()
        );
    }
}