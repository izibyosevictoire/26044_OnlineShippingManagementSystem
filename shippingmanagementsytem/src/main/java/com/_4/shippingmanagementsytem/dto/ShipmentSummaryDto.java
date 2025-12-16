package com._4.shippingmanagementsytem.dto;

import com._4.shippingmanagementsytem.enums.ShipmentStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ShipmentSummaryDto(
        Long id,
        String trackingNumber,
        LocalDateTime createdAt,
        ShipmentStatus status,
        String originAddress,
        String destinationAddress,
        List<ProductDto> products
) {
    public record ProductDto(Long id, String name) {}
}
