package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.entity.ShipmentDetail;
import com._4.shippingmanagementsytem.repository.ShipmentDetailRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/shipment-details")
public class ShipmentDetailController {

    private final ShipmentDetailRepository shipmentDetailRepository;

    public ShipmentDetailController(ShipmentDetailRepository shipmentDetailRepository) {
        this.shipmentDetailRepository = shipmentDetailRepository;
    }

    @PostMapping
    public ResponseEntity<ShipmentDetail> create(@RequestBody ShipmentDetail detail) {
        ShipmentDetail saved = shipmentDetailRepository.save(detail);
        return ResponseEntity.created(URI.create("/api/shipment-details/" + saved.getId())).body(saved);
    }

    @GetMapping
    public Page<ShipmentDetail> getAll(Pageable pageable) {
        return shipmentDetailRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDetail> getById(@PathVariable Long id) {
        return shipmentDetailRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-tracking/{trackingNumber}")
    public ResponseEntity<ShipmentDetail> getByTracking(@PathVariable String trackingNumber) {
        return shipmentDetailRepository.findByShipment_TrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShipmentDetail> update(@PathVariable Long id, @RequestBody ShipmentDetail updated) {
        return shipmentDetailRepository.findById(id)
                .map(existing -> {
                    existing.setSpecialInstructions(updated.getSpecialInstructions());
                    existing.setEstimatedDeliveryDate(updated.getEstimatedDeliveryDate());
                    existing.setTotalCost(updated.getTotalCost());
                    existing.setShipment(updated.getShipment());
                    return ResponseEntity.ok(shipmentDetailRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!shipmentDetailRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        shipmentDetailRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
