package com._4.shippingmanagementsytem.repository;

import com._4.shippingmanagementsytem.entity.Location;
import com._4.shippingmanagementsytem.enums.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByProvince(Province province);
}
