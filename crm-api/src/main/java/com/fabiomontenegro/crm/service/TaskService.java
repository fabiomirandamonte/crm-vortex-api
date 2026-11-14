package com.fabiomontenegro.crm.service;

import com.fabiomontenegro.crm.dto.TaskRequest;
import com.fabiomontenegro.crm.dto.TaskResponse;
import com.fabiomontenegro.crm.exception.ResourceNotFoundException;
import com.fabiomontenegro.crm.model.Customer;
import com.fabiomontenegro.crm.model.Task;
import com.fabiomontenegro.crm.model.User;
import com.fabiomontenegro.crm.repository.CustomerRepository;
import com.fabiomontenegro.crm.repository.TaskRepository;
import com.fabiomontenegro.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, CustomerRepository customerRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> findAll(Pageable pageable) {
        return taskRepository.findAll(pageable).map(TaskResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com o ID: " + id));
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public TaskResponse create(TaskRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + request.customerId()));

        // Busca o usuário responsável (se enviado, senão define o próprio logado)
        User assignedUser = userRepository.findById(request.assignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário responsável não encontrado com o ID: " + request.assignedUserId()));

        // Pega o e-mail do usuário autenticado no token JWT atual
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado no sistema"));

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .status(request.status())
                .priority(request.priority())
                .customer(customer)
                .assignedUser(assignedUser)
                .createdBy(currentUser) // Preenche obrigatoriamente quem criou a tarefa!
                .build();

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com o ID: " + id));

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + request.customerId()));

        User assignedUser = userRepository.findById(request.assignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário responsável não encontrado com o ID: " + request.assignedUserId()));

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setCustomer(customer);
        task.setAssignedUser(assignedUser);

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarefa não encontrada com o ID: " + id);
        }
        taskRepository.deleteById(id);
    }
}