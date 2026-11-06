package com.fabiomontenegro.crm;

import com.fabiomontenegro.crm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class CrmApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmApiApplication.class, args);
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("admin@crm.com").ifPresent(user -> {
                String encodedPassword = new BCryptPasswordEncoder().encode("admin123");
                user.setPassword(encodedPassword); // Usando o método correto gerado pelo Lombok!
                userRepository.save(user);
                System.out.println(">>> SENHA DO ADMIN ATUALIZADA COM SUCESSO PARA: admin123");
            });
        };
    }
}