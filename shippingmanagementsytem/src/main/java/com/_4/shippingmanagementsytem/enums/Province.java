package com._4.shippingmanagementsytem.enums;

import java.util.Arrays;
import java.util.Optional;

public enum Province {
    KIGALI("01", "Kigali"),
    NORTHERN("02", "Northern"),
    SOUTHERN("03", "Southern"),
    EASTERN("04", "Eastern"),
    WESTERN("05", "Western");

    private final String code;
    private final String displayName;

    Province(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Optional<Province> fromCode(String code) {
        return Arrays.stream(values())
                .filter(p -> p.code.equalsIgnoreCase(code))
                .findFirst();
    }

    public static Optional<Province> fromName(String name) {
        return Arrays.stream(values())
                .filter(p -> p.displayName.equalsIgnoreCase(name) || p.name().equalsIgnoreCase(name))
                .findFirst();
    }
}
