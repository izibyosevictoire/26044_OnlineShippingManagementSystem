package com._4.shippingmanagementsytem.repository;

import com._4.shippingmanagementsytem.entity.ShipmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentDetailRepository extends JpaRepository<ShipmentDetail, Long> {

    Optional<ShipmentDetail> findByShipment_TrackingNumber(String trackingNumber);
}
