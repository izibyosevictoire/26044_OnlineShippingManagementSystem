package com._4.shippingmanagementsytem.entity;

import com._4.shippingmanagementsytem.enums.Province;
import com._4.shippingmanagementsytem.enums.District;
import com._4.shippingmanagementsytem.enums.Sector;
import com._4.shippingmanagementsytem.enums.Cell;
import com._4.shippingmanagementsytem.enums.Village;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Province province;

    @Enumerated(EnumType.STRING)
    private District district;

    @Enumerated(EnumType.STRING)
    private Sector sector;

    @Enumerated(EnumType.STRING)
    private Cell cell;

    @Enumerated(EnumType.STRING)
    private Village village;
}
