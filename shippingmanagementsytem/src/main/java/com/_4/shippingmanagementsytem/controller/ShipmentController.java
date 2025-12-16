package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.dto.ShipmentDashboardDto;
import com._4.shippingmanagementsytem.dto.ShipmentPageDto;
import com._4.shippingmanagementsytem.dto.ShipmentSummaryDto;
import com._4.shippingmanagementsytem.entity.Shipment;
import com._4.shippingmanagementsytem.enums.ShipmentStatus;
import com._4.shippingmanagementsytem.repository.ShipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;

    public ShipmentController(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    @GetMapping("/summary")
    public ShipmentDashboardDto getDashboardSummary() {
        long total = shipmentRepository.count();
        long created = shipmentRepository.countByStatus(ShipmentStatus.CREATED);
        long inTransit = shipmentRepository.countByStatus(ShipmentStatus.IN_TRANSIT);
        long delivered = shipmentRepository.countByStatus(ShipmentStatus.DELIVERED);
        long cancelled = shipmentRepository.countByStatus(ShipmentStatus.CANCELLED);

        List<ShipmentSummaryDto> recent = shipmentRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(shipment -> new ShipmentSummaryDto(
                        shipment.getId(),
                        shipment.getTrackingNumber(),
                        shipment.getCreatedAt(),
                        shipment.getStatus(),
                        shipment.getOriginAddress(),
                        shipment.getDestinationAddress(),
                        shipment.getProducts() == null
                                ? List.of()
                                : shipment.getProducts().stream()
                                    .map(p -> new ShipmentSummaryDto.ProductDto(p.getId(), p.getName()))
                                    .toList()
                ))
                .toList();

        return new ShipmentDashboardDto(
                total,
                created,
                inTransit,
                delivered,
                cancelled,
                recent
        );
    }

    @PostMapping
    public ResponseEntity<Shipment> create(@RequestBody Shipment shipment) {
        if (shipmentRepository.existsByTrackingNumber(shipment.getTrackingNumber())) {
            return ResponseEntity.badRequest().build();
        }
        if (shipment.getCreatedAt() == null) {
            shipment.setCreatedAt(java.time.LocalDateTime.now());
        }
        Shipment saved = shipmentRepository.save(shipment);
        return ResponseEntity.created(URI.create("/api/shipments/" + saved.getId())).body(saved);
    }

    @GetMapping
    public ShipmentPageDto getAll(Pageable pageable) {
        Page<Shipment> page = shipmentRepository.findAll(pageable);

        List<ShipmentSummaryDto> content = page.getContent().stream()
                .map(shipment -> new ShipmentSummaryDto(
                        shipment.getId(),
                        shipment.getTrackingNumber(),
                        shipment.getCreatedAt(),
                        shipment.getStatus(),
                        shipment.getOriginAddress(),
                        shipment.getDestinationAddress(),
                        shipment.getProducts() == null
                                ? List.of()
                                : shipment.getProducts().stream()
                                        .map(p -> new ShipmentSummaryDto.ProductDto(p.getId(), p.getName()))
                                        .toList()
                ))
                .toList();

        return new ShipmentPageDto(
                page.getTotalElements(),
                page.getTotalPages(),
                page.getSize(),
                page.getNumber(),
                content
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getById(@PathVariable Long id) {
        return shipmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<Shipment> getByTrackingNumber(@PathVariable String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-customer/{customerId}")
    public Page<Shipment> getByCustomer(@PathVariable Long customerId, Pageable pageable) {
        return shipmentRepository.findByCustomer_Id(customerId, pageable);
    }

    @GetMapping("/by-status/{status}")
    public Page<Shipment> getByStatus(@PathVariable ShipmentStatus status, Pageable pageable) {
        return shipmentRepository.findByStatus(status, pageable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shipment> update(@PathVariable Long id, @RequestBody Shipment updated) {
        return shipmentRepository.findById(id)
                .map(existing -> {
                    existing.setTrackingNumber(updated.getTrackingNumber());
                    existing.setStatus(updated.getStatus());
                    existing.setOriginAddress(updated.getOriginAddress());
                    existing.setDestinationAddress(updated.getDestinationAddress());
                    existing.setCustomer(updated.getCustomer());
                    existing.setProducts(updated.getProducts());
                    return ResponseEntity.ok(shipmentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!shipmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        shipmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
