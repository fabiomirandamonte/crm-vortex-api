package com.fabiomontenegro.crm.service;

import com.fabiomontenegro.crm.dto.CustomerRequest;
import com.fabiomontenegro.crm.dto.CustomerResponse;
import com.fabiomontenegro.crm.exception.ResourceNotFoundException;
import com.fabiomontenegro.crm.model.Customer;
import com.fabiomontenegro.crm.model.FunnelStage;
import com.fabiomontenegro.crm.model.User;
import com.fabiomontenegro.crm.repository.CustomerRepository;
import com.fabiomontenegro.crm.repository.FunnelStageRepository;
import com.fabiomontenegro.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final FunnelStageRepository funnelStageRepository;
    private final UserRepository userRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            FunnelStageRepository funnelStageRepository,
            UserRepository userRepository
    ) {
        this.customerRepository = customerRepository;
        this.funnelStageRepository = funnelStageRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(CustomerResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        return CustomerResponse.fromEntity(customer);
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        FunnelStage funnelStage = funnelStageRepository.findById(request.funnelStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Etapa do funil não encontrada com o ID: " + request.funnelStageId()));

        User assignedTo = null;
        if (request.assignedToUserId() != null) {
            assignedTo = userRepository.findById(request.assignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário responsável não encontrado com o ID: " + request.assignedToUserId()));
        }

        Customer customer = new Customer();
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setCompanyName(request.company());
        customer.setFunnelStage(funnelStage);
        customer.setAssignedUser(assignedTo);

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerResponse.fromEntity(savedCustomer);
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));

        FunnelStage funnelStage = funnelStageRepository.findById(request.funnelStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Etapa do funil não encontrada com o ID: " + request.funnelStageId()));

        User assignedTo = null;
        if (request.assignedToUserId() != null) {
            assignedTo = userRepository.findById(request.assignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário responsável não encontrado com o ID: " + request.assignedToUserId()));
        }

        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setCompanyName(request.company());
        customer.setFunnelStage(funnelStage);
        customer.setAssignedUser(assignedTo);

        Customer updatedCustomer = customerRepository.save(customer);
        return CustomerResponse.fromEntity(updatedCustomer);
    }

    @Transactional
    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado com o ID: " + id);
        }
        customerRepository.deleteById(id);
    }
}