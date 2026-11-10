package com.fabiomontenegro.crm.service;

import com.fabiomontenegro.crm.dto.CustomerNoteRequest;
import com.fabiomontenegro.crm.dto.CustomerNoteResponse;
import com.fabiomontenegro.crm.exception.ResourceNotFoundException;
import com.fabiomontenegro.crm.model.Customer;
import com.fabiomontenegro.crm.model.CustomerNote;
import com.fabiomontenegro.crm.model.User;
import com.fabiomontenegro.crm.repository.CustomerNoteRepository;
import com.fabiomontenegro.crm.repository.CustomerRepository;
import com.fabiomontenegro.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CustomerNoteService {

    private final CustomerNoteRepository customerNoteRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerNoteService(CustomerNoteRepository customerNoteRepository, 
                                CustomerRepository customerRepository,
                                UserRepository userRepository){
        this.customerNoteRepository = customerNoteRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional(readOnly = true)
    public Page<CustomerNoteResponse> findByCustomerId(Long customerId, Pageable pageable){
        if(!customerRepository.existsById(customerId)){
            throw new ResourceNotFoundException("Cliente não encontrado com o ID: " + customerId +"null");
        }
        return customerNoteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(CustomerNoteResponse::fromEntity);
    }

    @Transactional
    public CustomerNoteResponse create(CustomerNoteRequest request) {
        // Recupera o email (username) do usuário autenticado atual via SecurityContextHolder
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado: " + userEmail));

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + request.customerId()));
        
        CustomerNote note = CustomerNote.builder()
                .customer(customer)
                .author(authenticatedUser)
                .content(request.content())
                .build();

        CustomerNote savedNote = customerNoteRepository.save(note);
        return CustomerNoteResponse.fromEntity(savedNote);
    }

    @Transactional
    public CustomerNoteResponse update(Long id, CustomerNoteRequest request){
        CustomerNote note = customerNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota não encontrada com ID: " + id));

         note.setContent(request.content());
         
         if(!note.getCustomer().getId().equals(request.customerId())){
            Customer newCustomer = customerRepository.findById(request.customerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + request.customerId()));
            note.setCustomer(newCustomer);
         }

         CustomerNote updatedNote = customerNoteRepository.save(note);
         return CustomerNoteResponse.fromEntity(updatedNote);
    }
    
    @Transactional
    public void delete(Long id) {
        CustomerNote note = customerNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota não encontrada com o ID: " + id));
        customerNoteRepository.delete(note);
    }

    
}
