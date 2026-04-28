package com.sse.impacthub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ngos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Double targetAmount;
    private Double raisedAmount;
    
    @ElementCollection
    private List<String> sdgTags;
    
    private Boolean is80gEligible;
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String impactMetrics;
}
