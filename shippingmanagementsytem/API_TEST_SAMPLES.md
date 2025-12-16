# Shipping Management System – API Test Samples

Base URL (default Spring Boot):

`http://localhost:8080`

Follow the calls in order for a smooth end‑to‑end test.

---

## 1. Create a Location

**Endpoint**

`POST /api/locations`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "province": "KIGALI",
  "district": "GASABO",
  "sector": "KIMIRONKO",
  "cell": "BIBARE",
  "village": "BIBARE_I"
}
```

**Notes**
- Response will contain an `id`. Assume it is `1` for the next requests (replace with the actual value you get).

---

## 2. Create a User (Customer) Linked to Location

**Endpoint**

`POST /api/users`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "fullName": "Alice Customer",
  "email": "alice@example.com",
  "phone": "0780000000",
  "role": "CUSTOMER",
  "location": {
    "id": 1
  }
}
```

---

## 3. Get Users (Pagination + Sorting)

**Endpoint**

`GET /api/users?page=0&size=5&sort=fullName,asc`

**Description**
- Returns first page of users, sorted by `fullName` ascending.

---

## 4. Get Users by Province / District / Sector / Cell / Village / Contact

### 4.1 By Province Code (01 = Kigali)

**Endpoint**

`GET /api/users/by-province-code/01?page=0&size=5`

### 4.2 By Province Name (Kigali)

**Endpoint**

`GET /api/users/by-province-name/Kigali?page=0&size=5`

### 4.3 By District (GASABO)

**Endpoint**

`GET /api/users/by-district/GASABO?page=0&size=5`

### 4.4 By Sector (KIMIRONKO)

**Endpoint**

`GET /api/users/by-sector/KIMIRONKO?page=0&size=5`

### 4.5 By Cell (BIBARE)

**Endpoint**

`GET /api/users/by-cell/BIBARE?page=0&size=5`

### 4.6 By Village (BIBARE_I)

**Endpoint**

`GET /api/users/by-village/BIBARE_I?page=0&size=5`

### 4.7 By Email

**Endpoint**

`GET /api/users/by-email?email=alice@example.com`

### 4.8 By Phone

**Endpoint**

`GET /api/users/by-phone?phone=0780000000`

**Description**
- Demonstrates multiple `findBy...` queries on nested location fields and on contact fields (email/phone), plus pagination.

---

## 5. Create a Category

**Endpoint**

`POST /api/categories`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

**Note**
- Assume returned category `id` is `1` for later examples.

---

## 6. Create a Product in that Category

**Endpoint**

`POST /api/products`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "name": "Smartphone X",
  "description": "Mid-range Android smartphone",
  "price": 300.0,
  "weight": 0.3,
  "category": {
    "id": 1
  }
}
```

**Note**
- Assume returned product `id` is `1`.

---

## 7. Search Products by Name (Pagination)

**Endpoint**

`GET /api/products/search?q=phone&page=0&size=10`

**Description**
- Demonstrates `findByNameContainingIgnoreCase` with pagination.

---

## 8. Create a Shipment (User + Product)

**Endpoint**

`POST /api/shipments`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "trackingNumber": "TRK-001",
  "status": "CREATED",
  "originAddress": "Kigali, Rwanda",
  "destinationAddress": "Musanze, Rwanda",
  "customer": {
    "id": 1
  },
  "products": [
    {
      "id": 1
    }
  ]
}
```

**Notes**
- Uses existing `User` (id `1`) and `Product` (id `1`).
- `createdAt` will be set automatically if not provided.
- Assume returned shipment `id` is `1`.

---

## 9. Track Shipment by Tracking Number

**Endpoint**

`GET /api/shipments/track/TRK-001`

**Description**
- Demonstrates `findByTrackingNumber`.

---

## 10. Create Shipment Detail (One-to-One)

**Endpoint**

`POST /api/shipment-details`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "shipment": {
    "id": 1
  },
  "specialInstructions": "Handle with care",
  "estimatedDeliveryDate": "2025-12-31",
  "totalCost": 350.0
}
```

**Description**
- Demonstrates the one-to-one relationship `Shipment` ↔ `ShipmentDetail`.

---

## 11. Get Shipment Detail by Tracking Number

**Endpoint**

`GET /api/shipment-details/by-tracking/TRK-001`

**Description**
- Uses `findByShipment_TrackingNumber` in `ShipmentDetailRepository`.

---

## 12. Create a Payment for the Shipment

**Endpoint**

`POST /api/payments`

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "shipment": {
    "id": 1
  },
  "amount": 350.0,
  "paymentMethod": "MOBILE_MONEY",
  "status": "PAID",
  "paymentDate": "2025-12-15T10:00:00"
}
```

**Description**
- Demonstrates many-to-one `Payment` → `Shipment`.

---

## 13. Get Payments by Shipment Tracking (Pagination)

**Endpoint**

`GET /api/payments/by-tracking/TRK-001?page=0&size=10`

**Description**
- Demonstrates `findByShipment_TrackingNumber` with pagination.

---

## 14. Enum Lists for Frontend Dropdowns

These endpoints help your frontend build location dropdowns.

**Provinces**

`GET /api/locations/provinces`

**Districts**

`GET /api/locations/districts`

**Sectors**

`GET /api/locations/sectors`

**Cells**

`GET /api/locations/cells`

**Villages**

`GET /api/locations/villages`

**Description**
- Each endpoint returns a simple array of enum values, e.g. `["KIGALI","NORTHERN", ...]` for provinces.
