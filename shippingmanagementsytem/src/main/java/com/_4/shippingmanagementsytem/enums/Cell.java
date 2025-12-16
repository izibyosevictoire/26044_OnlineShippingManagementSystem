package com._4.shippingmanagementsytem.enums;

public enum Cell {
    // Sample cells in Kimironko sector
    BIBARE(Sector.KIMIRONKO),
    MUNEZERO(Sector.GISOZI),

    // Sample cells in Kacyiru sector
    KACYIRU_CELL(Sector.KACYIRU),
    NYAGATARE(Sector.NYAGATARE),
    NTUNGA(Sector.KIGABIRO),
    

    // Sample cells in Nyamirambo sector
    CYIVUGIZA(Sector.NYAMIRAMBO);
    

    private final Sector sector;

    Cell(Sector sector) {
        this.sector = sector;
    }

    public Sector getSector() {
        return sector;
    }
}
