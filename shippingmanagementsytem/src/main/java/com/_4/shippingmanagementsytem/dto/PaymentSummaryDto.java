package com._4.shippingmanagementsytem.dto;

import com._4.shippingmanagementsytem.enums.PaymentMethod;
import com._4.shippingmanagementsytem.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PaymentSummaryDto(
        Long id,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        PaymentStatus status,
        LocalDateTime paymentDate,
        Long shipmentId,
        String shipmentTrackingNumber,
        String primaryProductName,
        List<String> productNames
) {
}

