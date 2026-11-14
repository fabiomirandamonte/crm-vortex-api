package com.fabiomontenegro.crm.controller;

import com.fabiomontenegro.crm.dto.FunnelStageRequest;
import com.fabiomontenegro.crm.dto.FunnelStageResponse;
import com.fabiomontenegro.crm.service.FunnelStageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/funnel-stages")
public class FunnelStageController {

    private final FunnelStageService funnelStageService;

    public FunnelStageController(FunnelStageService funnelStageService){
        this.funnelStageService = funnelStageService;
    }

    @GetMapping
    public ResponseEntity<List<FunnelStageResponse>> findAll() {
        return ResponseEntity.ok(funnelStageService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FunnelStageResponse> findById(@PathVariable Long id){
        return ResponseEntity.ok(funnelStageService.findById(id));
    }

    @PostMapping
    public ResponseEntity<FunnelStageResponse> create(@Valid @RequestBody FunnelStageRequest request) {
        FunnelStageResponse response = funnelStageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FunnelStageResponse> update(@PathVariable Long id, @Valid @RequestBody FunnelStageRequest request) {
        FunnelStageResponse response = funnelStageService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        funnelStageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
