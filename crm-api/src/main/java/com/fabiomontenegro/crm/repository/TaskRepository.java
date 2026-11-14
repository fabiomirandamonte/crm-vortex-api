package com.fabiomontenegro.crm.repository;

import com.fabiomontenegro.crm.model.Task;
import com.fabiomontenegro.crm.model.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByAssignedUserId(Long userId, Pageable pageable);
    List<Task> findByAssignedUserIdAndDueDateBeforeAndStatusNot(Long userId, OffsetDateTime date, TaskStatus status);
}
