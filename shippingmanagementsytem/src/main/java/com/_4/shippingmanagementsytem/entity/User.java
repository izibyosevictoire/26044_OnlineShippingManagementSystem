package com._4.shippingmanagementsytem.entity;

import com._4.shippingmanagementsytem.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    // --- Authentication fields ---

    /**
     * BCrypt-hashed password for login.
     */
    @Column(nullable = false)
    private String passwordHash;

    /**
     * One-time token for email-based password reset.
     */
    private String resetToken;

    private java.time.LocalDateTime resetTokenExpiresAt;

    /**
     * Short-lived numeric code for email-based 2FA.
     */
    private String twoFactorCode;

    private java.time.LocalDateTime twoFactorExpiresAt;

    // --- Relationships ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    @ToString.Exclude
    private Location location;
}
