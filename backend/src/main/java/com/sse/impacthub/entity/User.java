package com.sse.impacthub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // PAN card — required for ZCZP bond investment & 80G certificate
    @Column(length = 10)
    private String pan;

    // Demat account number — required by SEBI to hold ZCZP bonds
    @Column(length = 20)
    private String dematAccountNumber;

    // Phone number
    private String phone;

    // PAN card verified separately (can be done without Demat account)
    private boolean panVerified = false;

    // KYC is fully verified when BOTH PAN and Demat account are submitted and validated
    private boolean kycVerified = false;

    // Impact/gamification points earned through investments
    private int impactPoints = 0;

    // Password reset token
    private String resetToken;

    // Computed helper — true if eligible to buy ZCZP bonds
    @Transient
    public boolean isEligibleForZczpBonds() {
        return kycVerified
            && pan != null && pan.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")
            && dematAccountNumber != null && !dematAccountNumber.isBlank();
    }
}
