package com.fabiomontenegro.crm.controller;

import com.fabiomontenegro.crm.dto.CustomerNoteRequest;
import com.fabiomontenegro.crm.dto.CustomerNoteResponse;
import com.fabiomontenegro.crm.service.CustomerNoteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customer-notes")
public class CustomerNoteController {

    private final CustomerNoteService customerNoteService;

    public CustomerNoteController(CustomerNoteService customerNoteService) {
        this.customerNoteService = customerNoteService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<CustomerNoteResponse>> findByCustomer(
            @PathVariable Long customerId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<CustomerNoteResponse> response = customerNoteService.findByCustomerId(customerId, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CustomerNoteResponse> create(@Valid @RequestBody CustomerNoteRequest request) {
        CustomerNoteResponse response = customerNoteService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerNoteResponse> update(
            @PathVariable Long id, 
            @Valid @RequestBody CustomerNoteRequest request) {
        CustomerNoteResponse response = customerNoteService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerNoteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}