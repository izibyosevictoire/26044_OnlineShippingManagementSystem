package com._4.shippingmanagementsytem.entity;

import com._4.shippingmanagementsytem.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(unique = true, nullable = false)
    private String trackingNumber;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private String originAddress;

    private String destinationAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private User customer;

    @ManyToMany
    @JoinTable(
            name = "shipment_products",
            joinColumns = @JoinColumn(name = "shipment_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @ToString.Exclude
    private Set<Product> products;

    @OneToOne(mappedBy = "shipment", cascade = CascadeType.ALL)
    private ShipmentDetail shipmentDetail;
}
