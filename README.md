
## Online Shipping Management System

A comprehensive full-stack shipping management system designed for Rwanda, enabling businesses to manage shipments, track deliveries, process payments, and handle customer information efficiently.

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Key Features Explained](#key-features-explained)
- [Development](#development)

##  Overview

This Online Shipping Management System is a full-stack web application that streamlines shipping operations for businesses operating in Rwanda. The system provides:

- **User Management**: Role-based access control (Admin, Customer)
- **Shipment Tracking**: Real-time tracking of shipments with unique tracking numbers
- **Product Management**: Organize products by categories with pricing and weight information
- **Payment Processing**: Handle payments through multiple methods (Cash, Card, Mobile Money)
- **Location Management**: Rwanda-specific location hierarchy (Province → District → Sector → Cell → Village)
- **Secure Authentication**: Two-factor authentication (2FA) and password reset functionality

##  Features

### Authentication & Security
- User registration and login
- Two-factor authentication (2FA) via email OTP
- Password reset functionality via email
- Role-based access control (Admin, Customer)
- JWT-based authentication
- Secure password hashing with BCrypt

### Shipment Management
- Create and manage shipments with unique tracking numbers
- Track shipments by tracking number
- Multiple shipment statuses: CREATED, IN_TRANSIT, DELIVERED, CANCELLED
- Associate multiple products with shipments
- Store shipment details (special instructions, estimated delivery date, total cost)

### Product Management
- Create and manage products with categories
- Product search functionality
- Track product pricing and weight
- Organize products by categories

### Payment Processing
- Multiple payment methods: Cash, Card, Mobile Money
- Payment status tracking: PENDING, PAID, FAILED
- Link payments to shipments
- View payment history by shipment tracking number

### User Management
- User registration with location information
- Search users by location (province, district, sector, cell, village)
- Search users by contact information (email, phone)
- Pagination and sorting support

### Location Management
- Rwanda-specific location hierarchy
- Enum-based location system for consistency
- API endpoints to retrieve location lists for dropdowns

##  Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.8
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT
- **Email**: Spring Mail (Gmail SMTP)
- **Build Tool**: Maven
- **Libraries**: Lombok, Jackson

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **State Management**: React Context API

##  Project Structure

```
online-shipping system/
├── shipping-frontend/          # React frontend application
│   ├── src/
│   │   ├── api/                # API service modules
│   │   │   ├── auth.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── payments.js
│   │   │   ├── products.js
│   │   │   ├── shipments.js
│   │   │   └── users.js
│   │   ├── components/         # React components
│   │   │   ├── layout/        # Layout components (AppLayout, Sidebar, Topbar, Footer)
│   │   │   └── ui/            # Reusable UI components (Button, Pagination)
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── shipments/     # Shipment management
│   │   │   ├── products/      # Product management
│   │   │   ├── payments/      # Payment management
│   │   │   ├── users/         # User management
│   │   │   └── locations/     # Location management
│   │   ├── App.jsx            # Main app component with routing
│   │   └── main.jsx           # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── shippingmanagementsytem/    # Spring Boot backend application
    ├── src/main/java/com/_4/shippingmanagementsytem/
    │   ├── controller/        # REST controllers
    │   ├── entity/            # JPA entities
    │   ├── repository/        # Spring Data repositories
    │   ├── service/           # Business logic services
    │   ├── config/            # Configuration classes
    │   ├── dto/               # Data Transfer Objects
    │   └── enums/             # Enumeration types
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

##  Database Schema

### Core Entities

#### User
- Stores user information (fullName, email, phone, role)
- Authentication fields (passwordHash, resetToken, twoFactorCode)
- Linked to Location entity

#### Location
- Rwanda-specific location hierarchy
- Fields: province, district, sector, cell, village
- All fields are enums for data consistency

#### Product
- Product information (name, description, price, weight)
- Linked to Category entity
- Many-to-many relationship with Shipment

#### Category
- Product categorization (name, description)

#### Shipment
- Core shipping entity with tracking number
- Status: CREATED, IN_TRANSIT, DELIVERED, CANCELLED
- Linked to User (customer) and multiple Products
- One-to-one relationship with ShipmentDetail

#### ShipmentDetail
- Additional shipment information
- Fields: specialInstructions, estimatedDeliveryDate, totalCost
- One-to-one with Shipment

#### Payment
- Payment records linked to shipments
- Payment methods: CASH, CARD, MOBILE_MONEY
- Payment status: PENDING, PAID, FAILED
- Many-to-one relationship with Shipment

### Entity Relationships

```
User ──(Many-to-One)──> Location
User ──(One-to-Many)──> Shipment (as customer)
Shipment ──(Many-to-Many)──> Product
Shipment ──(One-to-One)──> ShipmentDetail
Shipment ──(One-to-Many)──> Payment
Product ──(Many-to-One)──> Category
```

##  Installation & Setup

### Prerequisites

- **Java 21** or higher
- **Node.js** 18+ and npm
- **PostgreSQL** 12+ database
- **Maven** 3.6+ (or use Maven Wrapper included)
- **Gmail account** (for email functionality)

### Backend Setup

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Set up PostgreSQL database**:
   ```sql
   CREATE DATABASE rwandashipdb;
   ```

3. **Configure database connection** in `shippingmanagementsytem/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/rwandashipdb
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Configure email settings** in `application.properties`:
   ```properties
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   app.mail.from=your_email@gmail.com
   ```
   > **Note**: For Gmail, you'll need to generate an App Password in your Google Account settings.

5. **Build and run the backend**:
   ```bash
   cd shippingmanagementsytem
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd shipping-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - The frontend is configured to connect to `http://localhost:8080` by default
   - Update `src/api/axiosInstance.js` if your backend runs on a different port

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

Key configuration options:

- **Database**: PostgreSQL connection settings
- **JPA**: Hibernate auto-update mode (`spring.jpa.hibernate.ddl-auto=update`)
- **Email**: SMTP settings for Gmail
- **CORS**: Configured to allow requests from `http://localhost:5173`

### Frontend Configuration

- **API Base URL**: Configured in `src/api/axiosInstance.js`
- **Authentication**: Token stored in localStorage
- **Routing**: Protected routes with role-based access

##  Running the Application

### Development Mode

1. **Start PostgreSQL** (ensure it's running)

2. **Start the backend**:
   ```bash
   cd shippingmanagementsytem
   ./mvnw spring-boot:run
   ```

3. **Start the frontend** (in a new terminal):
   ```bash
   cd shipping-frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Production Build

**Backend**:
```bash
cd shippingmanagementsytem
./mvnw clean package
java -jar target/shippingmanagementsytem-0.0.1-SNAPSHOT.jar
```

**Frontend**:
```bash
cd shipping-frontend
npm run build
# Serve the dist/ directory with a web server
```

##  API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login (returns 2FA requirement)
- `POST /api/auth/verify-2fa` - Verify two-factor authentication code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Endpoints

- `POST /api/users` - Create user
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/by-province-code/{code}` - Get users by province code
- `GET /api/users/by-district/{district}` - Get users by district
- `GET /api/users/by-email?email={email}` - Get user by email
- `GET /api/users/by-phone?phone={phone}` - Get user by phone

### Shipment Endpoints

- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - Get all shipments (paginated)
- `GET /api/shipments/{id}` - Get shipment by ID
- `GET /api/shipments/track/{trackingNumber}` - Track shipment by tracking number
- `PUT /api/shipments/{id}` - Update shipment
- `DELETE /api/shipments/{id}` - Delete shipment

### Product Endpoints

- `POST /api/products` - Create product
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?q={query}` - Search products by name
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Payment Endpoints

- `POST /api/payments` - Create payment
- `GET /api/payments` - Get all payments (paginated)
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/by-tracking/{trackingNumber}` - Get payments by shipment tracking number
- `GET /api/payments/by-status/{status}` - Get payments by status

### Location Endpoints

- `POST /api/locations` - Create location
- `GET /api/locations/provinces` - Get all provinces
- `GET /api/locations/districts` - Get all districts
- `GET /api/locations/sectors` - Get all sectors
- `GET /api/locations/cells` - Get all cells
- `GET /api/locations/villages` - Get all villages

For detailed API test samples, see `shippingmanagementsytem/API_TEST_SAMPLES.md`

##  Authentication & Authorization

### Authentication Flow

1. **Registration**: User signs up with email, password, and location information
2. **Login**: User logs in with email and password
3. **2FA**: System sends OTP code to user's email
4. **Verification**: User enters OTP code to complete login
5. **Token**: Upon successful verification, JWT token is issued and stored

### Password Reset Flow

1. User requests password reset via email
2. System generates reset token and sends link via email
3. User clicks link and enters new password
4. System validates token and updates password

### Role-Based Access Control

- **ADMIN**: Full access to all features (dashboard, users, products, payments, shipments)
- **CUSTOMER**: Access to shipments and tracking functionality

Protected routes in the frontend automatically redirect unauthorized users.

##  Key Features Explained

### Two-Factor Authentication (2FA)

The system implements email-based 2FA for enhanced security:
- After login, a 6-digit OTP code is sent to the user's email
- The code expires after 5 minutes
- Users must enter the code to complete authentication

### Shipment Tracking

- Each shipment has a unique tracking number
- Customers can track shipments using the tracking number
- Shipment status updates reflect the current state of delivery

### Location Hierarchy

The system uses Rwanda's administrative structure:
- **Province** → **District** → **Sector** → **Cell** → **Village**
- All location fields are enums, ensuring data consistency
- Users can search and filter by any level of the hierarchy

### Payment Processing

- Payments are linked to shipments
- Multiple payment methods supported (Cash, Card, Mobile Money)
- Payment status tracking (PENDING, PAID, FAILED)
- Payment history can be viewed by shipment

##  Development

### Backend Development

- **Package**: `com._4.shippingmanagementsytem`
- **Main Class**: `ShippingmanagementsytemApplication`
- **Database**: Hibernate auto-updates schema on startup
- **Hot Reload**: Spring Boot DevTools enabled for automatic restarts

### Frontend Development

- **Entry Point**: `src/main.jsx`
- **Routing**: Configured in `src/App.jsx`
- **State Management**: React Context API for authentication
- **API Calls**: Centralized in `src/api/` directory
- **Styling**: Tailwind CSS utility classes

### Code Style

- **Backend**: Java 21 with Lombok for boilerplate reduction
- **Frontend**: React functional components with hooks
- **Naming**: Follows Java/JavaScript conventions

### Testing

- Backend includes Spring Boot Test dependencies
- API test samples provided in `API_TEST_SAMPLES.md`
- Use Postman or similar tools to test API endpoints

##  Notes

- The database schema is automatically created/updated on first run (Hibernate `ddl-auto=update`)
- Email functionality requires Gmail SMTP configuration
- CORS is configured to allow frontend-backend communication
- Authentication tokens are stored in browser localStorage
- The system is designed specifically for Rwanda's location structure

##  Contributing

This is a project for managing shipping operations. For questions or issues, please refer to the project documentation or contact the development team.

---

**Project ID and NAMES**: 26044 IZIBYOSE VICTOIRE  
**Description**: Online Shipping Management System Based in Rwanda
