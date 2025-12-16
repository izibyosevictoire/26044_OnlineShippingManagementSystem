package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.dto.PaymentSummaryDto;
import com._4.shippingmanagementsytem.entity.Payment;
import com._4.shippingmanagementsytem.entity.Product;
import com._4.shippingmanagementsytem.entity.Shipment;
import com._4.shippingmanagementsytem.entity.User;
import com._4.shippingmanagementsytem.repository.PaymentRepository;
import com._4.shippingmanagementsytem.repository.ProductRepository;
import com._4.shippingmanagementsytem.repository.ShipmentRepository;
import com._4.shippingmanagementsytem.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final UserRepository userRepository;
    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;

    public SearchController(UserRepository userRepository,
                            ShipmentRepository shipmentRepository,
                            PaymentRepository paymentRepository,
                            ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.shipmentRepository = shipmentRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<?> globalSearch(@RequestParam("q") String query) {
        String term = query.trim();
        if (term.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "users", List.of(),
                    "shipments", List.of(),
                    "payments", List.of(),
                    "products", List.of()
            ));
        }

        Pageable limit = PageRequest.of(0, 5);

        List<User> users = userRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, limit)
                .getContent();

        List<Shipment> shipments = shipmentRepository
                .findByTrackingNumberContainingIgnoreCase(term, limit)
                .getContent();

        List<PaymentSummaryDto> payments = paymentRepository
                .findByShipment_TrackingNumberContainingIgnoreCase(term, limit)
                .map(this::toPaymentDto)
                .getContent();

        // include payments by product name as well, merge distinct
        List<PaymentSummaryDto> paymentsByProduct = paymentRepository
                .findByShipment_Products_NameContainingIgnoreCase(term, limit)
                .map(this::toPaymentDto)
                .getContent();

        if (!paymentsByProduct.isEmpty()) {
            paymentsByProduct.stream()
                    .filter(p -> payments.stream().noneMatch(existing -> existing.id().equals(p.id())))
                    .forEach(payments::add);
        }

        List<Product> products = productRepository
                .findByNameContainingIgnoreCase(term, limit)
                .getContent();

        return ResponseEntity.ok(Map.of(
                "users", users,
                "shipments", shipments,
                "payments", payments,
                "products", products
        ));
    }

    private PaymentSummaryDto toPaymentDto(Payment payment) {
        String tracking = payment.getShipment() != null ? payment.getShipment().getTrackingNumber() : null;
        List<String> productNames = payment.getShipment() != null && payment.getShipment().getProducts() != null
                ? payment.getShipment().getProducts().stream()
                    .map(p -> p.getName() == null ? "" : p.getName())
                    .filter(name -> !name.isBlank())
                    .toList()
                : List.of();
        String primaryProductName = productNames.isEmpty() ? null : productNames.get(0);
        if (primaryProductName == null && tracking != null) {
            primaryProductName = tracking;
        }

        return new PaymentSummaryDto(
                payment.getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getPaymentDate(),
                payment.getShipment() != null ? payment.getShipment().getId() : null,
                tracking,
                primaryProductName,
                productNames
        );
    }
}