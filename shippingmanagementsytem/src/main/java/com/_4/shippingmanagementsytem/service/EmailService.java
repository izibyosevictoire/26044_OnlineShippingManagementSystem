package com._4.shippingmanagementsytem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTwoFactorCode(String email, String code) {
        String subject = "Your login OTP code";
        String text = "Your one-time login code is: " + code + "\n\n" +
                "This code will expire in 5 minutes.";

        sendEmail(email, subject, text);
    }

    public void sendPasswordResetLink(String email, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Reset your password";
        String text = "Click the link below to reset your password:\n" + resetLink + "\n\n" +
                "If you did not request this, you can ignore this email.";

        sendEmail(email, subject, text);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Sent email to {} with subject '{}'", to, subject);
        } catch (Exception e) {
            // For assignment/demo purposes, also log the content so you can see the OTP even if email fails
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            log.info("[FALLBACK] Email to {} | Subject: {} | Text: {}", to, subject, text);
        }
    }
}
