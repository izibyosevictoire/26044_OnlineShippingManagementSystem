package com._4.shippingmanagementsytem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "shipment_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "shipment_id", unique = true)
    @ToString.Exclude
    @JsonIgnore
    private Shipment shipment;

    private String specialInstructions;

    private LocalDate estimatedDeliveryDate;

    private BigDecimal totalCost;
}
