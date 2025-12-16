package com._4.shippingmanagementsytem.repository;

import com._4.shippingmanagementsytem.entity.User;
import com._4.shippingmanagementsytem.enums.Cell;
import com._4.shippingmanagementsytem.enums.District;
import com._4.shippingmanagementsytem.enums.Province;
import com._4.shippingmanagementsytem.enums.Sector;
import com._4.shippingmanagementsytem.enums.UserRole;
import com._4.shippingmanagementsytem.enums.Village;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Location-based queries
    Page<User> findByLocation_Province(Province province, Pageable pageable);
    Page<User> findByLocation_District(District district, Pageable pageable);
    Page<User> findByLocation_Sector(Sector sector, Pageable pageable);
    Page<User> findByLocation_Cell(Cell cell, Pageable pageable);
    Page<User> findByLocation_Village(Village village, Pageable pageable);

    // Email / phone queries
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    // Password reset / auth helpers
    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByResetToken(String resetToken);

    // Global search helper
    org.springframework.data.domain.Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String fullName,
            String email,
            org.springframework.data.domain.Pageable pageable
    );

    // Role queries with sorting
    List<User> findByRole(UserRole role, Sort sort);
}
