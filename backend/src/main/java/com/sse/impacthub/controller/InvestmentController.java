package com.sse.impacthub.controller;

import com.sse.impacthub.entity.Investment;
import com.sse.impacthub.entity.Ngo;
import com.sse.impacthub.entity.User;
import com.sse.impacthub.repository.InvestmentRepository;
import com.sse.impacthub.repository.NgoRepository;
import com.sse.impacthub.repository.UserRepository;
import com.sse.impacthub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * POST /api/invest
     *
     * SEBI / ZCZP Bond eligibility rules enforced:
     *  1. User must have a verified PAN (KYC)
     *  2. User must have a registered Demat Account Number
     *  3. Minimum investment is ₹1,000
     *  4. NGO must exist in the database
     */
    @PostMapping("/invest")
    public ResponseEntity<?> createInvestment(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {

        // ── Authenticate via JWT ───────────────────────────────────────────
        String token = authHeader.replace("Bearer ", "");
        String email;
        try {
            email = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired session. Please login again."));
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not found. Please login again."));
        }

        // ── KYC Check: PAN required ────────────────────────────────────────
        if (user.getPan() == null || user.getPan().isBlank()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "PAN card not verified.",
                "action", "COMPLETE_KYC",
                "message", "You must complete KYC by submitting your PAN number before purchasing ZCZP bonds."
            ));
        }

        // ── KYC Check: Demat account required ─────────────────────────────
        if (user.getDematAccountNumber() == null || user.getDematAccountNumber().isBlank()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Demat account not linked.",
                "action", "COMPLETE_KYC",
                "message", "A Demat account is mandatory to hold ZCZP bonds as per SEBI regulations. Please complete your KYC."
            ));
        }

        // ── KYC Check: Overall KYC flag ────────────────────────────────────
        if (!user.isKycVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "KYC not verified.",
                "action", "COMPLETE_KYC",
                "message", "Your KYC is pending. Please submit your PAN and Demat account number to start investing."
            ));
        }

        // ── Parse & validate investment amount ────────────────────────────
        Double amount;
        try {
            amount = Double.valueOf(request.get("amount").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid investment amount."));
        }

        if (amount < 1000) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Minimum investment is ₹1,000."
            ));
        }

        // ── Fetch NGO ─────────────────────────────────────────────────────
        Long ngoId;
        try {
            ngoId = Long.valueOf(request.get("ngoId").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid NGO ID."));
        }

        Ngo ngo = ngoRepository.findById(ngoId).orElse(null);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "NGO not found."));
        }

        // ── Create Investment ─────────────────────────────────────────────
        Investment investment = new Investment();
        investment.setUser(user);
        investment.setNgo(ngo);
        investment.setAmount(amount);
        investment.setInvestmentDate(LocalDateTime.now());
        investment.setTransactionId("ZCZP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        investmentRepository.save(investment);

        // Update NGO raised amount
        ngo.setRaisedAmount((ngo.getRaisedAmount() == null ? 0.0 : ngo.getRaisedAmount()) + amount);
        ngoRepository.save(ngo);

        return ResponseEntity.ok(Map.of(
            "investment", investment,
            "message", "Investment successful! ZCZP bond issued to your Demat account " + user.getDematAccountNumber()
        ));
    }

    /**
     * GET /api/portfolio/{userId}
     * Returns all investments for the currently logged-in user.
     */
    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<?> getPortfolio(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email;
        try {
            email = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid session."));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied."));
        }

        List<Investment> investments = investmentRepository.findByUserId(userId);
        return ResponseEntity.ok(investments);
    }
}
