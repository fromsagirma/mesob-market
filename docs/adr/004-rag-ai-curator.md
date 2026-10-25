# ADR 004: Retrieval-Augmented Generation (RAG) AI Shopping Curator

## Status
Accepted

## Context
Customers navigating the marketplace often have conversational queries (e.g., "Find an authentic wedding outfit for a traditional ceremony under 5,000 Birr") that conventional keyword search fails to satisfy.

## Decision
We implemented a **hybrid RAG shopping assistant** combining:
1. **Fuse.js Local Semantic & Fuzzy Indexing**: Rapid in-memory matching of catalog products based on names, categories, tags, and materials.
2. **Google Gemini LLM Integration**: Generative contextual recommendations that synthesize customer requests with retrieved active catalog products.
3. **Graceful Fallback**: If LLM API quotas or network limits occur, the service degrades cleanly to ranked fuzzy search results without throwing user-facing 500 errors.

## Consequences
- Requires valid `GEMINI_API_KEY` in environment for generative capabilities.
- Catalog items must be kept up-to-date in retrieval indices.
