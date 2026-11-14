package com.fabiomontenegro.crm.dto;

import com.fabiomontenegro.crm.model.enums.TaskPriority;
import com.fabiomontenegro.crm.model.enums.TaskStatus;
import com.fabiomontenegro.crm.model.Task;
import java.time.OffsetDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    OffsetDateTime dueDate,
    TaskStatus status,
    TaskPriority priority,
    Long customerId,
    String customerName,
    Long assingnedUserId,
    String assignedUserName,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAd

){
    public static TaskResponse fromEntity(Task task){
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getDueDate(),
            task.getStatus(),
            task.getPriority(),
            task.getCustomer() != null ? task.getCustomer().getId() : null,
            task.getCustomer() != null ? task.getCustomer().getName() : null,
            task.getAssignedUser() != null ? task.getAssignedUser().getId() : null,
            task.getAssignedUser() != null ? task.getAssignedUser().getName() : null,
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
