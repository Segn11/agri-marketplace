# Agricultural Marketplace: System Architecture & Technical Specification

## 1. System Overview
The **Agricultural Marketplace** is a robust three-tier web platform designed to directly connect local agricultural producers (farmers) with consumers, retailers, and restaurants. The platform eliminates intermediaries, stabilizes fair price discovery, provides real-time stock and order management, and establishes trust through reviews and transparent contact exchange upon order confirmation.

Target deployment: **Nekemte and surrounding agricultural communities**.

---

## 2. High-Level Architecture (3-Tier)

```mermaid
graph TD
    subgraph Client Tier [Presentation Tier - Next.js 14 App Router]
        FarmerUI[Farmer Dashboard & Management]
        BuyerUI[Marketplace Discovery & Orders]
        AdminUI[Admin Moderation & Analytics]
    end

    subgraph Service Tier [Application Tier - Spring Boot 3 REST API]
        AuthModule[Auth & JWT Security]
        ProductModule[Product & Category Engine]
        OrderModule[Order Lifecycle & Inventory Control]
        ReviewModule[Review & Rating Service]
        AdminModule[Moderation & Audit Service]
    end

    subgraph Data Tier [Persistence Tier]
        Postgres[(PostgreSQL 16 Database)]
        Storage[(Media Storage / Local Disk / S3)]
    end

    Client Tier -->|HTTPS / JSON REST API / Bearer JWT| Service Tier
    Service Tier -->|JPA / Hibernate / JDBC| Postgres
    Service Tier -->|Multipart Files| Storage
```

---

## 3. Domain Model & Entity Relationship (ERD)

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : owns
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    USERS ||--o| FARMER_PROFILES : has
    USERS ||--o{ NOTIFICATIONS : receives
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ PRODUCT_IMAGES : contains
    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o| REVIEWS : enables

    USERS {
        UUID id PK
        string full_name
        string email UK
        string phone UK
        string password_hash
        string role "FARMER | BUYER | ADMIN"
        string location
        string status "ACTIVE | SUSPENDED"
        timestamp created_at
        timestamp updated_at
    }

    FARMER_PROFILES {
        UUID id PK
        UUID user_id FK
        string farm_name
        string farm_location
        text description
        boolean is_verified
    }

    CATEGORIES {
        UUID id PK
        string name UK
        string description
        string slug
    }

    PRODUCTS {
        UUID id PK
        UUID farmer_id FK
        UUID category_id FK
        string name
        text description
        numeric unit_price
        string unit "KG | QUINTAL | PIECE | LITER | CRATE"
        integer quantity_available
        integer version "Optimistic Lock"
        string location
        string status "ACTIVE | INACTIVE | OUT_OF_STOCK"
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_IMAGES {
        UUID id PK
        UUID product_id FK
        string image_url
        boolean is_primary
    }

    ORDERS {
        UUID id PK
        UUID buyer_id FK
        UUID farmer_id FK
        string status "PENDING | ACCEPTED | READY | COMPLETED | REJECTED | CANCELLED"
        text note
        string delivery_preference "PICKUP | FARMER_DELIVERY"
        numeric total_price
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        UUID id PK
        UUID order_id FK
        UUID product_id FK
        integer quantity
        numeric unit_price
    }

    REVIEWS {
        UUID id PK
        UUID order_id FK, UK
        UUID product_id FK
        UUID buyer_id FK
        integer rating "1 to 5"
        text comment
        timestamp created_at
    }

    REPORTS {
        UUID id PK
        UUID reporter_id FK
        string target_type "LISTING | USER | REVIEW"
        UUID target_id
        text reason
        string status "OPEN | RESOLVED | DISMISSED"
        text resolution_notes
        timestamp created_at
    }

    NOTIFICATIONS {
        UUID id PK
        UUID user_id FK
        string message
        string type
        boolean is_read
        timestamp created_at
    }
```

---

## 4. Order Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING : Buyer places order (Validates stock)
    
    PENDING --> CANCELLED : Buyer cancels (Stock unreserved)
    PENDING --> REJECTED : Farmer rejects with reason
    PENDING --> ACCEPTED : Farmer accepts (Stock deducted; Contact details revealed)

    ACCEPTED --> READY : Farmer marks ready for delivery/pickup
    READY --> COMPLETED : Order fulfilled (Buyer enabled to write 1 review)
    ACCEPTED --> CANCELLED : Mutual / Admin cancellation (Stock restored)
    
    COMPLETED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```

---

## 5. Concurrency & Overselling Prevention
To satisfy **FR-5.4** and **NFR-3**:
1. **Optimistic Locking**: Product entities carry a `@Version` field. Concurrent checkout updates detect version conflicts and handle rollback gracefully.
2. **Transactional Deductions**: Deductions execute inside `@Transactional(isolation = Isolation.READ_COMMITTED)` blocks with atomic quantity checks (`quantity_available >= requested_quantity`).
3. **Automatic Status Transitions**: When `quantity_available` reaches 0, the product automatically transitions to `OUT_OF_STOCK`.

---

## 6. Role-Based Access Control (RBAC) Matrix

| Endpoint Group | Method | Description | Roles Permitted |
|---|---|---|---|
| `/api/auth/**` | POST | Register, Login, Token Refresh | Public |
| `/api/products` (list) | GET | Browse & Search listings | Public |
| `/api/products/{id}` | GET | View product details | Public |
| `/api/products` (create) | POST | Create new listing | `ROLE_FARMER` |
| `/api/products/{id}` | PUT/DELETE | Modify or deactivate listing | `ROLE_FARMER` (Owner), `ROLE_ADMIN` |
| `/api/orders` | POST | Place new order | `ROLE_BUYER` |
| `/api/orders/{id}/cancel` | PATCH | Cancel pending order | `ROLE_BUYER` (Owner), `ROLE_ADMIN` |
| `/api/orders/{id}/status` | PATCH | Accept, Ready, Complete, Reject | `ROLE_FARMER` (Seller), `ROLE_ADMIN` |
| `/api/reviews` | POST | Leave review on completed order | `ROLE_BUYER` (Verified customer) |
| `/api/admin/**` | GET/POST/PATCH | User moderation, reports, categories | `ROLE_ADMIN` |
