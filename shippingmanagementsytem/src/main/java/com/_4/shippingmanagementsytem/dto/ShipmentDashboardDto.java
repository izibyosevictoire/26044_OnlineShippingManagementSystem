package com._4.shippingmanagementsytem.dto;

import java.util.List;

public record ShipmentDashboardDto(
        long totalShipments,
        long created,
        long inTransit,
        long delivered,
        long cancelled,
        List<ShipmentSummaryDto> recentShipments
) {
}

