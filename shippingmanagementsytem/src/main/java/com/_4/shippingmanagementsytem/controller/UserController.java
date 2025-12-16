package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.entity.User;
import com._4.shippingmanagementsytem.enums.*;
import com._4.shippingmanagementsytem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        if (user.getPhone() != null && userRepository.existsByPhone(user.getPhone())) {
            return ResponseEntity.badRequest().build();
        }
        User saved = userRepository.save(user);
        return ResponseEntity.created(URI.create("/api/users/" + saved.getId())).body(saved);
    }

    @GetMapping
    public Page<User> getAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(updated.getFullName());
                    existing.setEmail(updated.getEmail());
                    existing.setPhone(updated.getPhone());
                    existing.setRole(updated.getRole());
                    existing.setLocation(updated.getLocation());
                    return ResponseEntity.ok(userRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Special endpoints: find users by province code or name

    @GetMapping("/by-province-code/{provinceCode}")
    public Page<User> getByProvinceCode(@PathVariable String provinceCode, Pageable pageable) {
        Province province = Province.fromCode(provinceCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid province code"));
        return userRepository.findByLocation_Province(province, pageable);
    }

    @GetMapping("/by-province-name/{provinceName}")
    public Page<User> getByProvinceName(@PathVariable String provinceName, Pageable pageable) {
        Province province = Province.fromName(provinceName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid province name"));
        return userRepository.findByLocation_Province(province, pageable);
    }

    @GetMapping("/by-role/{role}")
    public List<User> getByRole(@PathVariable UserRole role) {
        return userRepository.findByRole(role, Sort.by("fullName"));
    }

    // Additional location-based filters using enums directly

    @GetMapping("/by-district/{district}")
    public Page<User> getByDistrict(@PathVariable District district, Pageable pageable) {
        return userRepository.findByLocation_District(district, pageable);
    }

    @GetMapping("/by-sector/{sector}")
    public Page<User> getBySector(@PathVariable Sector sector, Pageable pageable) {
        return userRepository.findByLocation_Sector(sector, pageable);
    }

    @GetMapping("/by-cell/{cell}")
    public Page<User> getByCell(@PathVariable Cell cell, Pageable pageable) {
        return userRepository.findByLocation_Cell(cell, pageable);
    }

    @GetMapping("/by-village/{village}")
    public Page<User> getByVillage(@PathVariable Village village, Pageable pageable) {
        return userRepository.findByLocation_Village(village, pageable);
    }

    // Email / phone-based search

    @GetMapping("/by-email")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-phone")
    public ResponseEntity<User> getByPhone(@RequestParam String phone) {
        return userRepository.findByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
