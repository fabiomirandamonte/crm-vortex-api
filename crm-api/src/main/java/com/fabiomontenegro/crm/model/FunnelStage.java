package com.fabiomontenegro.crm.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "funnel_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class FunnelStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "stage_order", nullable = false, unique = true)
    private Integer stageOrder;

    @Column(length = 255)
    private String description;
}