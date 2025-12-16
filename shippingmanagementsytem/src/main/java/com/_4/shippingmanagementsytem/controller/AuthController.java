package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.entity.User;
import com._4.shippingmanagementsytem.enums.UserRole;
import com._4.shippingmanagementsytem.repository.UserRepository;
import com._4.shippingmanagementsytem.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // --- DTOs ---

    public record SignupRequest(String fullName, String email, String phone, String password, UserRole role) {}

    public record LoginRequest(String email, String password) {}

    public record TwoFactorRequest(String email, String code) {}

    public record ForgotPasswordRequest(String email) {}

    public record ResetPasswordRequest(String token, String newPassword) {}

    // --- Endpoints ---

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }

        UserRole role = request.role() != null ? request.role() : UserRole.CUSTOMER;

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .role(role)
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        User saved = userRepository.save(user);

        return ResponseEntity.created(URI.create("/api/users/" + saved.getId()))
                .body(Map.of(
                        "id", saved.getId(),
                        "fullName", saved.getFullName(),
                        "email", saved.getEmail(),
                        "role", saved.getRole()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        // Generate a 6-digit 2FA code valid for 5 minutes
        String code = String.format("%06d", (int) (Math.random() * 1_000_000));
        user.setTwoFactorCode(code);
        user.setTwoFactorExpiresAt(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendTwoFactorCode(user.getEmail(), code);

        return ResponseEntity.ok(Map.of(
                "message", "2FA code sent to email",
                "email", user.getEmail()
        ));
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody TwoFactorRequest request) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid verification request"));
        }
        User user = userOpt.get();

        if (user.getTwoFactorCode() == null || user.getTwoFactorExpiresAt() == null) {
            return ResponseEntity.status(400).body(Map.of("message", "No active 2FA challenge"));
        }

        if (user.getTwoFactorExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("message", "2FA code has expired"));
        }

        if (!user.getTwoFactorCode().equals(request.code())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid 2FA code"));
        }

        // Clear 2FA fields
        user.setTwoFactorCode(null);
        user.setTwoFactorExpiresAt(null);
        userRepository.save(user);

        // For simplicity, we return a fake token and user info; frontend will store this.
        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.email());
        if (userOpt.isEmpty()) {
            // Do not reveal whether email exists
            return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent."));
        }
        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiresAt(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetLink(user.getEmail(), token);

        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.token());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired reset token"));
        }
        User user = userOpt.get();
        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired reset token"));
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }
}