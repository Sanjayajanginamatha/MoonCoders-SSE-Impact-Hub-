package com.sse.impacthub.controller;

import com.sse.impacthub.entity.Ngo;
import com.sse.impacthub.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "*")
public class NgoController {

    @Autowired
    private NgoRepository ngoRepository;

    @GetMapping
    public List<Ngo> getAllNgos() {
        return ngoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(@PathVariable Long id) {
        return ngoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
