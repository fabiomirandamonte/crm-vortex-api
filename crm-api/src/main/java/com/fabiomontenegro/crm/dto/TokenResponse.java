package com.fabiomontenegro.crm.dto;

public record TokenResponse(
        String token,
        long expiresIn,
        String role
) {}