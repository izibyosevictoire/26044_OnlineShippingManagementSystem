package com._4.shippingmanagementsytem.repository;

import com._4.shippingmanagementsytem.entity.Shipment;
import com._4.shippingmanagementsytem.enums.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    boolean existsByTrackingNumber(String trackingNumber);

    long countByStatus(ShipmentStatus status);

    Page<Shipment> findByCustomer_Id(Long customerId, Pageable pageable);

    Page<Shipment> findByStatus(ShipmentStatus status, Pageable pageable);

    Page<Shipment> findByTrackingNumberContainingIgnoreCase(String trackingNumber, Pageable pageable);

    java.util.List<Shipment> findTop5ByOrderByCreatedAtDesc();
}
