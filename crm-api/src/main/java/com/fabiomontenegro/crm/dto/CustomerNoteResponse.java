package com.fabiomontenegro.crm.dto;

import java.time.OffsetDateTime;

import com.fabiomontenegro.crm.model.CustomerNote;

public record CustomerNoteResponse (
    Long id,
    Long customerId,
    String customerName,
    Long authorId,
    String authorName,
    String content,
    OffsetDateTime createdAt

){
    public static CustomerNoteResponse fromEntity(CustomerNote note){
        return new CustomerNoteResponse(
            note.getId(),
            note.getCustomer().getId(),
            note.getCustomer().getName(),
            note.getAuthor().getId(),
            note.getAuthor().getName(),
            note.getContent(),
            note.getCreatedAt()
        );
    }
}
