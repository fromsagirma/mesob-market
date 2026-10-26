# Contributing to Mesob Market

Thank you for your interest in contributing to **Mesob Market**! We welcome contributions to our Ethiopian e-commerce platform.

## 👥 Project Authorship & Contribution Credits

### Primary Author & Maintainer
- **Developer:** **Firomsa Girma Worku**
- **Student ID:** `CTC-2559-26`
- **Institution:** Adama Science and Technology University (ASTU)
- **Email:** [firomsagirma@astu.edu.et](mailto:firomsagirma@astu.edu.et)
- **GitHub:** [@fromsagirma](https://github.com/fromsagirma)

### Verified Contribution & Authorship Statement
- **Independent Full-Stack Implementation:** Mesob Market was independently designed, architected, and implemented by **Firomsa Girma Worku**. This includes complete full-stack development across the React 19 frontend SPA, Express 5 REST API, MongoDB data modeling, Chapa payment gateway integration, and Google Gemini RAG assistant.
- **Architectural Refactoring & Quality Expansion:** The clean architecture service layers, comprehensive validation hierarchy, database index migrations, and 122 automated unit and integration tests were developed and structured by Firomsa.
- **Tooling & AI Assistance Acknowledgements:** Modern AI developer tooling (Google Antigravity / Gemini) was utilized during development for test suite expansion, code auditing, and documentation synthesis.

## Code of Conduct
Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## Branching Strategy
We follow a GitFlow-inspired workflow:
- **`main`**: Production-ready code, strictly tagged for release (e.g. `v1.0.0`).
- **`develop`**: Primary integration branch for active features.
- **`feature/<name>`**: Feature development branches created off `develop`.
- **`bugfix/<name>`**: Bug resolution branches.

## Development Setup

### Prerequisites
- Node.js 20.x or 22.x
- MongoDB 7.x
- npm 10.x+

### Local Installation
```bash
# Clone the repository
git clone <repository-url>
cd E-commerce-main

# Install dependencies across workspaces
npm install

# Start development servers
npm run dev:backend
npm run dev:frontend
```

## Testing & Quality Assurance
Before submitting a pull request, verify all test suites pass:
```bash
npm test
```

## Commit Message Conventions
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(...)`: A new user-facing feature
- `fix(...)`: A bug fix
- `refactor(...)`: Code change that neither fixes a bug nor adds a feature
- `test(...)`: Adding or correcting tests
- `docs(...)`: Documentation updates
- `ci(...)`: CI/CD workflows and configuration
- `build(...)`: Docker, build tools, or package dependencies

## Security & Secrets
**Zero Secrets Policy**: Never commit credentials, API keys (Chapa, Gemini, Cloudinary, MongoDB URIs), or `.env` files. Ensure `.gitignore` protections are maintained.
