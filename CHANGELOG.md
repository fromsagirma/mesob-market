# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-25

### Added
- **Security Hardening**:
  - Enforced strict CORS origin validation and comprehensive HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
  - Rate limiting on authentication (`/api/auth/*`) and payment initialization (`/api/pay/*`) endpoints.
  - Safe TLS certificate validation on cloud database connections.
  - NoSQL injection sanitization middleware stripping dangerous MongoDB operator prefixes (`$` and `.`).
  - Request ID tracing middleware attaching unique `X-Request-Id` headers across requests and responses.
  - HTTP parameter pollution prevention and request body size caps.
  - Secure HttpOnly, SameSite, and SSL cookie options utility.
  - Account lockout mechanism after repeated failed password attempts.
  - Password complexity validator requiring minimum length, uppercase, lowercase, numbers, and symbols.
- **Clean Architecture & Service Layer**:
  - Extracted domain business logic into dedicated services: `auth.service.js`, `product.service.js`, `cart.service.js`, `order.service.js`, `payment.service.js`, `review.service.js`, `community.service.js`, `finance.service.js`, `email.service.js`, and `rag.service.js`.
- **Validation & Error Handling**:
  - Structured operational error hierarchy (`AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `ValidationError`).
  - Standardized JSON API response and pagination envelope utility.
  - Generic schema validation middleware with request body/query/params rules.
  - Validation schemas for authentication, products, cart items, orders, reviews, and community posts.
- **Backend Testing Suite**:
  - Automated unit and integration test suite using Node's native test runner (`node --test`).
  - Unit tests covering password validation, currency parsing, discount calculations, JWT tokens, RBAC authorization, error handling, payment status normalization, request validation, and server health.
- **Frontend Quality, Accessibility & UX**:
  - Global React error boundary component preventing application crashes.
  - 404 Not Found page for unmatched client routes.
  - Accessible loading skeletons for product cards, details, and catalog views.
  - Dynamic document title and metadata hook (`useDocumentTitle`).
  - Accessible keyboard skip-to-content navigation.
  - Accessible modal dialogs with focus trapping and Escape key dismiss.
  - Progressive Web App service worker with runtime caching and offline connectivity banner.
  - Currency formatting utility with Ethiopian Birr (ETB) localization.
- **Frontend Testing Suite**:
  - Headless test environment setup with storage and browser mocks.
  - Unit tests for currency formatting, client auth validation, star rating calculation, brand configuration, pagination windowing, cart actions, auth persistence, theme toggling, and order fees/taxes.
- **DevOps, Containers & CI/CD**:
  - GitHub Actions workflows for backend CI, frontend CI, and automated security audit/secret scanning.
  - Multi-stage production Dockerfiles for backend and frontend.
  - Hardened Nginx configuration for Vite SPA delivery with gzip compression and caching headers.
  - Full-stack `docker-compose.yml` and live-mount `docker-compose.dev.yml`.
  - Root monorepo npm workspaces configuration.
- **Database Indexing & Observability**:
  - Realistic Ethiopian marketplace catalog seed script (`backend/scripts/seed_products.js`).
  - Database compound and full-text index migration script (`backend/scripts/create_indexes.js`).
  - Enhanced `/api/health` monitoring endpoint reporting MongoDB connectivity and memory metrics.
  - Postman and Thunder Client API collection export (`docs/mesob_market_postman_collection.json`).
  - OpenAPI 3.0 / Swagger documentation updates.
- **Architecture Documentation & Standards**:
  - Architecture Decision Records (ADRs 001–004).
  - Contributing guidelines (`CONTRIBUTING.md`) and Code of Conduct (`CODE_OF_CONDUCT.md`).
  - Repository security policy and vulnerability reporting guide (`SECURITY.md`).

## [1.0.0] - 2026-10-25

### Initial Release
- Core e-commerce platform with customer shopping cart, catalog, and order lifecycle.
- Chapa payment integration in Ethiopian Birr (ETB).
- RAG AI shopping assistant powered by Google Gemini and Fuse.js.
- Community discussion feed with post reactions and comments.
- Administrative dashboard with product management, financial charts, and user controls.
- Secure initial Git history and tag baseline.
