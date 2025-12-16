package com._4.shippingmanagementsytem.dto;

import java.util.List;

public record ShipmentPageDto(
        long totalElements,
        int totalPages,
        int size,
        int number,
        List<ShipmentSummaryDto> content
) {
}
