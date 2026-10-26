# ADR 001: React 19 + Vite Frontend Architecture

## Status
Accepted

## Context
Mesob Market requires a highly responsive, modern single-page application (SPA) capable of smooth product catalog exploration, real-time cart manipulation, accessible interactive components, and rapid feedback in both light and dark themes.

## Decision
We adopted **React 19** paired with **Vite 8** as the primary frontend foundation:
1. **Build Performance**: Instant server start and sub-millisecond Hot Module Replacement (HMR) powered by native ES modules.
2. **State Management**: Lightweight Zustand stores (`authStore`, `cartStore`, `themeStore`) instead of heavy boilerplate-laden state containers.
3. **Styling**: Tailwind CSS v4 for utility-first responsive layout design with zero runtime overhead.
4. **Client Routing**: React Router DOM v7 for declarative nested routing, route guards, and history synchronization.

## Consequences
- Requires modern browser support with ES2022+ features.
- Build output is static HTML/JS/CSS served via high-performance Nginx in containerized environments.
