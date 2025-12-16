package com._4.shippingmanagementsytem.enums;

public enum District {
  // Kigali Province
  GASABO(Province.KIGALI),
  KICUKIRO(Province.KIGALI),
  NYARUGENGE(Province.KIGALI),

  // Example for other provinces (you can extend this list as needed)
  GICUMBI(Province.NORTHERN),
  MUSANZE(Province.NORTHERN),
  BURERA(Province.NORTHERN),
  GAKENKE(Province.NORTHERN),
  RULINDO(Province.NORTHERN),

  HUYE(Province.SOUTHERN),
  NYANZA(Province.SOUTHERN),
  GISAGARA(Province.SOUTHERN),
  KAMONYI(Province.SOUTHERN),
  MUHANGA(Province.SOUTHERN),
  NYAMAGABE(Province.SOUTHERN),
  NYARUGURU(Province.SOUTHERN),
  RUHANGO(Province.SOUTHERN),

  NYAGATARE(Province.EASTERN),
  KAYONZA(Province.EASTERN),
  KIREHE(Province.EASTERN),
  GATSIBO(Province.EASTERN),
  BUGESERA(Province.EASTERN),
  RWAMAGANA(Province.EASTERN),
  NGOMA(Province.EASTERN),

  RUBAVU(Province.WESTERN),
  KARONGI(Province.WESTERN),
  NGORORERO(Province.WESTERN),
  NYABIHU(Province.WESTERN),
  NYAMASHEKE(Province.WESTERN),
  RUTSIRO(Province.WESTERN),
  RUSIZI(Province.WESTERN);

  private final Province province;

  District(Province province) {
    this.province = province;
  }

  public Province getProvince() {
    return province;
  }
}
