package com.fabiomontenegro.crm.controller;

import com.fabiomontenegro.crm.dto.LoginRequest;
import com.fabiomontenegro.crm.dto.TokenResponse;
import com.fabiomontenegro.crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    // Endpoint GET para testes via navegador
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Serviço de Autenticação está online!");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        TokenResponse tokenResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }
}