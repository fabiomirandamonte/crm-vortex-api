package com.fabiomontenegro.crm.dto;

public record TokenResponse(
    String token,
    String type,
    Long expiresIn
) {
    public TokenResponse(String token, Long expiresIn){
        this(token, "Bearer", expiresIn);
    }
}
