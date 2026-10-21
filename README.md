# Agricultural Marketplace 🌾

> A unified nationwide platform connecting producers, cooperatives, and commercial/retail buyers.

[![CI Pipeline](https://github.com/Segn11/agri-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/Segn11/agri-marketplace/actions)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)

---

## 📌 Project Overview
In many agricultural communities, smallholder farmers face steep barriers reaching retail customers, discovering transparent market prices, and advertising their yields. Intermediaries often capture excessive profit margins while buyers struggle to locate reliable produce suppliers.

The **Agricultural Marketplace** resolves this bottleneck through a direct, modern, 3-tier web platform where:
- **Farmers** publish crop listings, manage quantities, and accept orders.
- **Buyers** search, filter, compare regional produce prices, and place direct orders.
- **Fair Coordination**: Direct contact information is disclosed once orders are confirmed by farmers to arrange delivery/pickup and payment.
- **Trust & Accountability**: Verified buyers rate and review farmers following completed transactions.

---

## 🏛️ System Architecture

```
                    ┌────────────────────────────────────────┐
                    │      Presentation Tier (Frontend)      │
                    │   Next.js 14 App Router + Tailwind CSS │
                    └───────────────────┬────────────────────┘
                                        │ HTTPS / REST (Bearer JWT)
                                        ▼
                    ┌────────────────────────────────────────┐
                    │     Application Tier (Backend API)     │
                    │    Spring Boot 3 + Spring Security     │
                    │  (Domain-Driven Layered Architecture)  │
                    └───────────────────┬────────────────────┘
                                        │ JPA / Hibernate / Flyway
                                        ▼
                    ┌────────────────────────────────────────┐
                    │       Data Tier (Database Layer)       │
                    │         PostgreSQL 16 Database         │
                    └────────────────────────────────────────┘
```

## 🔄 Request and Data Flow

- A user interacts with the Next.js frontend and authenticates through the Spring Security/JWT API.
- The frontend sends REST requests with JWT access tokens in Authorization headers to backend controllers.
- Domain services validate permissions and business rules for products, orders, reviews, reports, notifications, and administration.
- Repositories persist and retrieve data through JPA/Hibernate against PostgreSQL.
- Flyway migrations manage schema evolution, while the frontend updates the user-facing state from API responses.

## 🧭 Architecture Guidelines

- Keep controllers focused on HTTP concerns and place business rules in module services.
- Use DTOs/API response wrappers at the API boundary rather than exposing persistence entities directly.
- Enforce authorization on protected endpoints and keep contact information masked until order acceptance.
- Use transactional stock updates and optimistic locking to prevent overselling.
- Add matching tests for module services, security rules, and important order-state transitions.

---

## 📂 Modern Folder Structure

```
agri-marketplace/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Automated build, test, and linting pipeline
├── backend/                           # Spring Boot 3 + Java 17 REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agrimarketplace/
│   │   │   │   ├── common/            # Generic ApiResponse, PagedResponse, GlobalExceptionHandler
│   │   │   │   ├── config/            # SecurityConfig, WebMvcConfig, OpenApiConfig
│   │   │   │   ├── security/          # JWT Provider, AuthFilter, UserPrincipal, UserDetailsService
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/          # Registration, Login, Token generation
│   │   │   │   │   ├── user/          # User and FarmerProfile entities, services, repos
│   │   │   │   │   ├── product/       # Products, Categories, Images, Search filters
│   │   │   │   │   ├── order/         # Order lifecycle, items, transactional stock control
│   │   │   │   │   ├── review/        # Ratings and reviews for completed orders
│   │   │   │   │   ├── report/        # Flagging listings, users, or inappropriate content
│   │   │   │   │   ├── notification/  # In-app notification engine
│   │   │   │   │   └── admin/         # Administrative stats, moderation, user audits
│   │   │   │   └── AgriMarketplaceApplication.java
│   │   │   └── resources/
│   │   │       ├── db/migration/      # Flyway SQL migrations (V1 schema, V2 seed categories)
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       └── application-prod.yml
│   │   └── test/                      # JUnit 5 & Mockito test suites
│   └── pom.xml                        # Maven dependency configuration
├── frontend/                          # Next.js 14 (App Router) + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/                # Login & Registration flows (Farmer, Buyer, Admin)
│   │   │   ├── (marketplace)/         
│   │   │   │   ├── products/          # Spot trading catalog with filters & instant procurement
│   │   │   │   │   └── [id]/          # Dedicated Product Details (Assay specs, moisture, growers)
│   │   │   │   ├── mandi/             # Live Ethiopian Mandi & ECX regional terminal rates
│   │   │   │   ├── auctions/          # Institutional e-Auctions & bulk reverse tenders (EGTE, Kaliti)
│   │   │   │   ├── storage/           # Certified public silos (e-NWR) & storage fee calculator
│   │   │   │   ├── quality/           # ECX Standard Quality Assay & certificate verification
│   │   │   │   └── cart/              # Procurement Cart & Settlement with Telebirr / CBE Birr
│   │   │   ├── (dashboard)/
│   │   │   │   ├── farmer/            # Farmer crop inventory, price adjustments & fulfillment
│   │   │   │   ├── buyer/             # Buyer 4-step order tracker, phone disclosure & reviews
│   │   │   │   └── admin/             # Oversight, arbitration disputes & account moderation
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx             # Root layout with CartProvider and Procurement Drawer
│   │   │   └── page.tsx               # Ethiopian AgriBazaar landing page with ticker & services
│   │   ├── components/
│   │   │   ├── cart/                  # Slide-over procurement cart drawer
│   │   │   ├── ui/                    # Reusable Button, Card, Badge, Input primitives
│   │   │   └── layout/                # Responsive Navbar (Cart badge, user session) & Footer
│   │   ├── context/                   # Global Cart Context & persistent state
│   │   ├── lib/                       # Commodities repo, ethiopia-data (Mandi, auctions, silos), formatters
│   │   └── types/                     # Shared TypeScript interfaces (Product, CartItem, Order)
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docs/
│   └── SRS_ARCHITECTURE.md            # Detailed Software Requirements & ERD Specs
├── .env.example                       # Environment variables template
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- **Java 17+** (JDK)
  > If Java 17 is not yet installed on Windows, install it via:
  > ```powershell
  > winget install EclipseAdoptium.Temurin.17.JDK
  > ```
- **Node.js 20+** & **npm**
- **PostgreSQL 14+** running locally

### 1. Database Setup
Create the local PostgreSQL database:
```sql
CREATE DATABASE agri_marketplace;
CREATE USER agri_user WITH ENCRYPTED PASSWORD 'agri_password';
GRANT ALL PRIVILEGES ON DATABASE agri_marketplace TO agri_user;
```

### 2. Backend Setup (Spring Boot 3)
A self-provisioning Maven Wrapper (`mvnw.cmd`) is included in the project:
```powershell
cd backend
.\mvnw clean install
.\mvnw spring-boot:run
```
- API will be accessible at: `http://localhost:8080/api`
- Swagger OpenAPI documentation: `http://localhost:8080/swagger-ui.html`
- **Pre-Seeded Demo Accounts**:
  - **Admin**: `admin@agri.com` / `password`
  - **Farmer**: `farmer@agri.com` / `password`
  - **Buyer**: `buyer@agri.com` / `password`

### 3. Frontend Setup (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: `http://localhost:3000`

---

## 🔒 Key Design Implementations

1. **Anti-Overselling Concurrency Protection (FR-5.4)**
   - Products feature optimistic concurrency control (`@Version`).
   - Order acceptance utilizes transactional stock deductions (`@Transactional`) ensuring atomic verification of available quantities.

2. **Contact Privacy Guard (FR-4.7, NFR-9)**
   - Farmer and Buyer direct phone numbers remain masked while orders are in `PENDING` state.
   - Upon farmer acceptance (`ACCEPTED`), full telephone contact information is revealed to both parties.

3. **Verified Reviews (FR-7.1, FR-7.2)**
   - Ratings (1 to 5) and feedback can only be submitted for completed orders.
   - Enforces exactly one review per order to preserve authentic marketplace trust.

---

## 📚 Documentation

- See [`docs/SRS_ARCHITECTURE.md`](docs/SRS_ARCHITECTURE.md) for the detailed software requirements and ERD specifications.

---

## 📄 License
This project is licensed under the MIT License.
