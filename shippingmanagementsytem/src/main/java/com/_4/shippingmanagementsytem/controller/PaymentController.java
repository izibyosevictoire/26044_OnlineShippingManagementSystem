package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.dto.PaymentSummaryDto;
import com._4.shippingmanagementsytem.entity.Payment;
import com._4.shippingmanagementsytem.enums.PaymentStatus;
import com._4.shippingmanagementsytem.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    public ResponseEntity<Payment> create(@RequestBody Payment payment) {
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.created(URI.create("/api/payments/" + saved.getId())).body(saved);
    }

    @GetMapping
    public Page<PaymentSummaryDto> getAll(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(this::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-tracking/{trackingNumber}")
    public Page<Payment> getByShipmentTracking(@PathVariable String trackingNumber, Pageable pageable) {
        return paymentRepository.findByShipment_TrackingNumber(trackingNumber, pageable);
    }

    @GetMapping("/by-status/{status}")
    public List<Payment> getByStatus(@PathVariable PaymentStatus status) {
        return paymentRepository.findByStatus(status, Sort.by("paymentDate").descending());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable Long id, @RequestBody Payment updated) {
        return paymentRepository.findById(id)
                .map(existing -> {
                    existing.setAmount(updated.getAmount());
                    existing.setPaymentMethod(updated.getPaymentMethod());
                    existing.setStatus(updated.getStatus());
                    existing.setPaymentDate(updated.getPaymentDate());
                    existing.setShipment(updated.getShipment());
                    return ResponseEntity.ok(paymentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!paymentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private PaymentSummaryDto toDto(Payment payment) {
        String trackingNumber = payment.getShipment() != null ? payment.getShipment().getTrackingNumber() : null;
        List<String> productNames = payment.getShipment() != null && payment.getShipment().getProducts() != null
                ? payment.getShipment().getProducts().stream()
                    .map(p -> p.getName() == null ? "" : p.getName())
                    .filter(name -> !name.isBlank())
                    .toList()
                : List.of();
        String primaryProductName = productNames.isEmpty() ? null : productNames.get(0);
        if (primaryProductName == null && trackingNumber != null) {
            // fallback so frontend doesn't show an empty placeholder
            primaryProductName = trackingNumber;
        }

        return new PaymentSummaryDto(
                payment.getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getPaymentDate(),
                payment.getShipment() != null ? payment.getShipment().getId() : null,
                trackingNumber,
                primaryProductName,
                productNames
        );
    }
}
