package com.fabiomontenegro.crm.service;

import com.fabiomontenegro.crm.dto.FunnelStageRequest;
import com.fabiomontenegro.crm.dto.FunnelStageResponse;
import com.fabiomontenegro.crm.exception.ResourceNotFoundException;
import com.fabiomontenegro.crm.model.FunnelStage;
import com.fabiomontenegro.crm.repository.FunnelStageRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service 
public class FunnelStageService {

    private final FunnelStageRepository funnelStageRepository;

    public FunnelStageService(FunnelStageRepository funnelStageRepository){
        this.funnelStageRepository = funnelStageRepository;
    }

    @Transactional(readOnly = true)
    public List<FunnelStageResponse> findAll(){
        return funnelStageRepository.findAllByOrderByStageOrderAsc().stream()
            .map(FunnelStageResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FunnelStageResponse findById(Long id){
        FunnelStage stage = funnelStageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estágio do funil não encontrado com o ID: \" + id)"));
        return FunnelStageResponse.fromEntity(stage);
    }

    @Transactional
    public FunnelStageResponse create(FunnelStageRequest request) {
        FunnelStage stage = FunnelStage.builder()
            .name(request.name())
            .stageOrder(request.stageOrder())
            .description(request.description())
            .build();
        
            FunnelStage savedStage = funnelStageRepository.save(stage);
            return FunnelStageResponse.fromEntity(savedStage);
    }

    @Transactional
    public FunnelStageResponse update(Long id, FunnelStageRequest request){
        FunnelStage stage = funnelStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estágio do funil não encontrado com o ID: " + id));
        
        stage.setName(request.name());
        stage.setStageOrder(request.stageOrder());
        stage.setDescription(request.description());

        FunnelStage updatedStage = funnelStageRepository.save(stage);
        return FunnelStageResponse.fromEntity(updatedStage);
    }

    @Transactional 
    public void delete(Long id){
        if (!funnelStageRepository.existsById(id)){
            throw new ResourceNotFoundException("Estágio do funil não encontrado com o ID: " + id);
        }
        funnelStageRepository.deleteAllById(null);
    }
}
