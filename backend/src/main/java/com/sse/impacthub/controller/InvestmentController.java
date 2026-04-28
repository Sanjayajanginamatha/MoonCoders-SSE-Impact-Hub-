package com.sse.impacthub.controller;

import com.sse.impacthub.entity.Investment;
import com.sse.impacthub.entity.Ngo;
import com.sse.impacthub.entity.User;
import com.sse.impacthub.repository.InvestmentRepository;
import com.sse.impacthub.repository.NgoRepository;
import com.sse.impacthub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class InvestmentController {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @PostMapping("/invest")
    public ResponseEntity<?> createInvestment(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long ngoId = Long.valueOf(request.get("ngoId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());

        User user = userRepository.findById(userId).orElseThrow();
        Ngo ngo = ngoRepository.findById(ngoId).orElseThrow();

        Investment investment = new Investment();
        investment.setUser(user);
        investment.setNgo(ngo);
        investment.setAmount(amount);
        investment.setInvestmentDate(LocalDateTime.now());
        investment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        investmentRepository.save(investment);

        // Update NGO raised amount
        ngo.setRaisedAmount(ngo.getRaisedAmount() + amount);
        ngoRepository.save(ngo);

        return ResponseEntity.ok(investment);
    }

    @GetMapping("/portfolio/{userId}")
    public List<Investment> getPortfolio(@PathVariable Long userId) {
        return investmentRepository.findByUserId(userId);
    }
}
