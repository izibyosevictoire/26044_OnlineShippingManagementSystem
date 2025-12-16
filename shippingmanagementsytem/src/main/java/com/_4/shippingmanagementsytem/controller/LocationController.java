package com._4.shippingmanagementsytem.controller;

import com._4.shippingmanagementsytem.entity.Location;
import com._4.shippingmanagementsytem.enums.Province;
import com._4.shippingmanagementsytem.enums.District;
import com._4.shippingmanagementsytem.enums.Sector;
import com._4.shippingmanagementsytem.enums.Cell;
import com._4.shippingmanagementsytem.enums.Village;
import com._4.shippingmanagementsytem.repository.LocationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Arrays;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @PostMapping
    public ResponseEntity<Location> create(@RequestBody Location location) {
        Location saved = locationRepository.save(location);
        return ResponseEntity.created(URI.create("/api/locations/" + saved.getId())).body(saved);
    }

    @GetMapping
    public Page<Location> getAll(Pageable pageable) {
        return locationRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable Long id) {
        return locationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> update(@PathVariable Long id, @RequestBody Location updated) {
        return locationRepository.findById(id)
                .map(existing -> {
                    existing.setProvince(updated.getProvince());
                    existing.setDistrict(updated.getDistrict());
                    existing.setSector(updated.getSector());
                    existing.setCell(updated.getCell());
                    existing.setVillage(updated.getVillage());
                    return ResponseEntity.ok(locationRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!locationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        locationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Enum lists for dropdowns

    @GetMapping("/provinces")
    public Province[] getProvinces() {
        return Province.values();
    }

    @GetMapping("/districts")
    public District[] getDistricts() {
        return District.values();
    }

    @GetMapping("/sectors")
    public Sector[] getSectors() {
        return Sector.values();
    }

    @GetMapping("/cells")
    public Cell[] getCells() {
        return Cell.values();
    }

    @GetMapping("/villages")
    public Village[] getVillages() {
        return Village.values();
    }

    // Hierarchical endpoints for province -> district -> sector -> cell -> village

    @GetMapping("/provinces/{province}/districts")
    public District[] getDistrictsByProvince(@PathVariable Province province) {
        return Arrays.stream(District.values())
                .filter(d -> d.getProvince() == province)
                .toArray(District[]::new);
    }

    @GetMapping("/districts/{district}/sectors")
    public Sector[] getSectorsByDistrict(@PathVariable District district) {
        return Arrays.stream(Sector.values())
                .filter(s -> s.getDistrict() == district)
                .toArray(Sector[]::new);
    }

    @GetMapping("/sectors/{sector}/cells")
    public Cell[] getCellsBySector(@PathVariable Sector sector) {
        return Arrays.stream(Cell.values())
                .filter(c -> c.getSector() == sector)
                .toArray(Cell[]::new);
    }

    @GetMapping("/cells/{cell}/villages")
    public Village[] getVillagesByCell(@PathVariable Cell cell) {
        return Arrays.stream(Village.values())
                .filter(v -> v.getCell() == cell)
                .toArray(Village[]::new);
    }
}
