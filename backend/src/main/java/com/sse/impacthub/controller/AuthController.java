package com.sse.impacthub.controller;

import com.sse.impacthub.entity.User;
import com.sse.impacthub.repository.UserRepository;
import com.sse.impacthub.security.EmailService;
import com.sse.impacthub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // ─────────────────────────────────────────────
    // LOGIN — real credential check, no bypass
    // ─────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password. Please try again."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────
    // REGISTER (basic — no KYC yet)
    // ─────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered."));
        }

        // Validate PAN format if provided
        if (user.getPan() != null && !user.getPan().isBlank()) {
            if (!user.getPan().matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid PAN format. Example: ABCDE1234F"));
            }
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // PAN is verified if provided and valid
        boolean hasPan = user.getPan() != null && !user.getPan().isBlank();
        boolean hasDemat = user.getDematAccountNumber() != null && !user.getDematAccountNumber().isBlank();
        user.setPanVerified(hasPan);
        // KYC is fully verified only when BOTH PAN and Demat account are provided
        user.setKycVerified(hasPan && hasDemat);

        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            // Non-blocking — registration succeeds even if email fails
        }

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    // ─────────────────────────────────────────────
    // KYC UPDATE — submit PAN + Demat for existing user
    // ─────────────────────────────────────────────
    @PutMapping("/kyc")
    public ResponseEntity<?> submitKyc(@RequestBody Map<String, String> request,
                                        @RequestHeader("Authorization") String authHeader) {
        String pan = request.get("pan");
        String dematAccountNumber = request.get("dematAccountNumber");

        if (pan == null || !pan.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid PAN. Must be 10 characters like ABCDE1234F"));
        }

        if (dematAccountNumber == null || dematAccountNumber.isBlank()) {
            // Allow PAN-only KYC — Demat is optional at this stage
        }

        // Extract email from JWT token
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();
        user.setPan(pan.toUpperCase());
        user.setPanVerified(true);

        // If Demat account is also provided, set it and mark full KYC as verified
        if (dematAccountNumber != null && !dematAccountNumber.isBlank()) {
            user.setDematAccountNumber(dematAccountNumber);
            user.setKycVerified(true);
        }
        // If user already has a Demat account saved, mark full KYC as verified
        else if (user.getDematAccountNumber() != null && !user.getDematAccountNumber().isBlank()) {
            user.setKycVerified(true);
        }

        userRepository.save(user);

        String message = user.isKycVerified()
            ? "KYC verified successfully! You can now purchase ZCZP bonds."
            : "PAN verified! Please link your Demat account to complete KYC and start investing.";

        return ResponseEntity.ok(Map.of(
            "message", message,
            "user", user
        ));
    }

    // ─────────────────────────────────────────────
    // PAN-ONLY VERIFICATION — for users who don't have a Demat account yet
    // ─────────────────────────────────────────────
    @PutMapping("/verify-pan")
    public ResponseEntity<?> verifyPanOnly(@RequestBody Map<String, String> request,
                                            @RequestHeader("Authorization") String authHeader) {
        String pan = request.get("pan");

        if (pan == null || !pan.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid PAN. Must be 10 characters like ABCDE1234F"));
        }

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();
        user.setPan(pan.toUpperCase());
        user.setPanVerified(true);

        // If user already has Demat, mark full KYC verified
        if (user.getDematAccountNumber() != null && !user.getDematAccountNumber().isBlank()) {
            user.setKycVerified(true);
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", user.isKycVerified()
                ? "PAN verified and KYC complete! You can now purchase ZCZP bonds."
                : "PAN verified successfully! Link your Demat account to complete KYC.",
            "user", user
        ));
    }

    // ─────────────────────────────────────────────
    // DEMAT-ONLY LINKING — for users who already have PAN verified
    // ─────────────────────────────────────────────
    @PutMapping("/link-demat")
    public ResponseEntity<?> linkDemat(@RequestBody Map<String, String> request,
                                        @RequestHeader("Authorization") String authHeader) {
        String dematAccountNumber = request.get("dematAccountNumber");

        if (dematAccountNumber == null || dematAccountNumber.isBlank() || dematAccountNumber.trim().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid Demat account number (minimum 8 characters)."));
        }

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();
        user.setDematAccountNumber(dematAccountNumber.trim());

        // If PAN is already verified, mark full KYC as verified
        if (user.isPanVerified()) {
            user.setKycVerified(true);
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", user.isKycVerified()
                ? "Demat account linked and KYC complete! You can now purchase ZCZP bonds."
                : "Demat account linked! Please verify your PAN to complete KYC.",
            "user", user
        ));
    }

    // ─────────────────────────────────────────────
    // UPDATE PROFILE
    // ─────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request,
                                           @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();
        if (request.containsKey("name")) user.setName(request.get("name"));
        if (request.containsKey("phone")) user.setPhone(request.get("phone"));
        if (request.containsKey("profileImage")) user.setProfileImage(request.get("profileImage"));
        if (request.containsKey("dob")) user.setDob(request.get("dob"));
        if (request.containsKey("gender")) user.setGender(request.get("gender"));
        if (request.containsKey("address")) user.setAddress(request.get("address"));
        if (request.containsKey("city")) user.setCity(request.get("city"));
        if (request.containsKey("state")) user.setState(request.get("state"));
        if (request.containsKey("pincode")) user.setPincode(request.get("pincode"));
        if (request.containsKey("occupation")) user.setOccupation(request.get("occupation"));
        if (request.containsKey("aadhar")) user.setAadhar(request.get("aadhar"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully!",
            "user", user
        ));
    }

    // ─────────────────────────────────────────────
    // FORGOT PASSWORD
    // ─────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRepository.save(user);

            try {
                emailService.sendResetToken(email, token);
                return ResponseEntity.ok(Map.of("message", "Reset link sent to your email!"));
            } catch (Exception e) {
                return ResponseEntity.ok(Map.of(
                    "message", "Error sending email, token generated for simulation.",
                    "token", token
                ));
            }
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Email not found!"));
    }

    // ─────────────────────────────────────────────
    // RESET PASSWORD
    // ─────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token!"));
    }
}
