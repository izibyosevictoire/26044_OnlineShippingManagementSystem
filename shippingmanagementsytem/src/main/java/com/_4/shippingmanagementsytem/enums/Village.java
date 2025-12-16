package com._4.shippingmanagementsytem.enums;

public enum Village {
    // Sample villages in Bibare cell
    BIBARE_I(Cell.BIBARE),
    BIBARE_II(Cell.BIBARE),

   KINIHIRA(Cell.NYAGATARE),
    

    // Sample village in Cyivugiza cell
    CYIVUGIZA_I(Cell.CYIVUGIZA);

    private final Cell cell;

    Village(Cell cell) {
        this.cell = cell;
    }

    public Cell getCell() {
        return cell;
    }
}
