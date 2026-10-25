# ADR 002: Express.js and MongoDB Document Database

## Status
Accepted

## Context
E-commerce marketplaces require handling heterogeneous product attributes (variants, sizes, dimensions, craftsmanship origin), complex order line items, and dynamic customer community interactions with high read throughput.

## Decision
We selected **Node.js with Express.js** and **MongoDB (via Mongoose ODM)**:
1. **Schema Flexibility**: MongoDB's polymorphic document model naturally represents varying catalog categories (traditional clothing, pottery, coffee beans, leather crafts) without cumbersome relational joins.
2. **Indexing & Search**: Compound indexing and native text indexing enable multi-attribute filtering and keyword search across titles and tags.
3. **Layered Architecture**: Clean separation between routes, validation middlewares, service layer, and persistence models.

## Consequences
- Requires strict Mongoose schema validation and application-level constraints to prevent data inconsistency.
- Distributed transactions across multiple documents require MongoDB replica sets.
