# ADR 003: Chapa Payment Gateway and Webhook Verification

## Status
Accepted

## Context
Mesob Market caters primarily to the Ethiopian domestic market and diaspora customers. Seamless digital payments via local financial rails (Telebirr, CBE Birr, Awash, Dashen, international cards) are mission-critical.

## Decision
We integrated **Chapa** as the primary Ethiopian payment gateway:
1. **Local Payment Rail Support**: Native integration with Telebirr, commercial bank APIs, and card payments in ETB.
2. **Cryptographic Webhook Verification**: All webhook notifications from Chapa are validated against `CHAPA_SECRET_KEY` using HMAC-SHA256 signature verification in constant time to prevent replay and forgery attacks.
3. **Status Normalization**: Unified payment status mapping (`paid`, `failed`, `pending`) abstracting payment provider nuances.

## Consequences
- Requires persistent storage of `tx_ref` references on orders.
- Development requires test-mode secret keys and webhook endpoints or ngrok forwarding.
