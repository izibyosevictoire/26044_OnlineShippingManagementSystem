package com._4.shippingmanagementsytem.repository;

import com._4.shippingmanagementsytem.entity.Payment;
import com._4.shippingmanagementsytem.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @EntityGraph(attributePaths = {"shipment", "shipment.products"})
    Page<Payment> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"shipment", "shipment.products"})
    Page<Payment> findByShipment_TrackingNumber(String trackingNumber, Pageable pageable);

    @EntityGraph(attributePaths = {"shipment", "shipment.products"})
    Page<Payment> findByShipment_TrackingNumberContainingIgnoreCase(String trackingNumber, Pageable pageable);

    @EntityGraph(attributePaths = {"shipment", "shipment.products"})
    Page<Payment> findByShipment_Products_NameContainingIgnoreCase(String productName, Pageable pageable);

    List<Payment> findByStatus(PaymentStatus status, Sort sort);
}
