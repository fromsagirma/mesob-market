# Security Policy

## Supported Versions
We release security patches and updates for active releases:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability
We take the security of **Mesob Market** seriously. If you discover a security vulnerability or potential exploit, please do **NOT** open a public issue.

Instead, please report it privately:
- **Email**: firomsagirma@astu.edu.et
- **Subject**: `[SECURITY VULNERABILITY] Mesob Market - <Brief Description>`

Please include:
1. Description of the vulnerability and attack vector.
2. Step-by-step reproduction instructions or proof-of-concept.
3. Potential impact on customer data or payment integrity.

We will acknowledge receipt within 48 hours and work with you on timely disclosure and mitigation.

## Security Architecture & Defenses
The Mesob Market platform incorporates defense-in-depth measures:
- **Authentication**: JWT access tokens (short-lived) paired with cryptographically hashed refresh tokens stored in secure, HttpOnly, SameSite cookies.
- **Payment Verification**: Chapa payment webhook events verified using HMAC-SHA256 signatures with constant-time equality checks.
- **Injection Defenses**: NoSQL operator sanitization on all incoming request queries, parameters, and payloads.
- **Traffic Throttling**: API rate limiting protecting login, registration, and payment initialization endpoints against brute-force attacks.
- **Transport Security**: Enforced TLS certificate verification on all cloud database connections.
