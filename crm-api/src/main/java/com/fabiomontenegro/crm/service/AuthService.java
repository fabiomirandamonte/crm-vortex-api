package com.fabiomontenegro.crm.service;

import com.fabiomontenegro.crm.dto.LoginRequest;
import com.fabiomontenegro.crm.dto.TokenResponse;
import com.fabiomontenegro.crm.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider){
        this.authenticationManager = authenticationManager;
          this.tokenProvider = tokenProvider;
    }

    public TokenResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        String jwt = tokenProvider.generateToken(authentication);
        return new TokenResponse(jwt, tokenProvider.getExpirationMs());
    }
    
}
