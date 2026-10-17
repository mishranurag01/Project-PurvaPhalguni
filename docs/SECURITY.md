# PURVAPHALGUNI — Security & Secrets Management Policy

## Overview

This document specifies the cryptographic and operational security standards enforced across the PURVAPHALGUNI codebase to safeguard user privacy, API keys, financial credentials, wallets, and authentication secrets.

---

## 1. Secrets & Credentials Isolation

### `.gitignore` Enforcement
All files containing sensitive tokens, private keys, crypto wallets, or environment-specific configurations are strictly excluded from version control in `/.gitignore`:

- **Environment Configs**: `.env`, `.env.*`, `.env*.local`, `*.local`, `config.local.*`.
- **Crypto & Web3 Wallets**: `wallets/`, `*wallet*.json`, `*.seed`, `*.mnemonic`, `seed*.txt`, `mnemonic*.txt`, `deployer-key*`, `private_key*`, `*.keystore`.
- **API Keys & Cloud Credentials**: `*api_key*`, `credentials.json`, `service-account*.json`, `google-credentials*.json`, `firebase-adminsdk*.json`.
- **Payment & Financial Providers**: `stripe*.key`, `stripe*.json`, `paypal*.json`, `wise*.json`, `payment*.json`.
- **Certificates & SSH**: `id_rsa*`, `id_ed25519*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.cert`.
- **Authentication Tokens**: `.npmrc`, `.yarnrc`, `.netrc`, `*.jwt`, `*.token`.

### Safe Public Template (`.env.example`)
Only variable definitions with sanitized placeholders (e.g., `MY_GEMINI_API_KEY`, `your_secure_admin_password_here`) are committed to version control. Actual keys and secrets must never be committed to `.env.example`.

---

## 2. API Key & Client Secret Handling

1. **Client-Side vs. Server-Side Execution**:
   - Client bundles (`src/`) must never embed private payment keys (e.g. Stripe Secret Keys `sk_live_...`), crypto wallet seed phrases, or private cloud credentials.
   - Any sensitive third-party services requiring secret keys must be mediated via secure server-side routes or injected by the platform runtime environment.

2. **Environment Variable Injection**:
   - Public frontend configurations use the `VITE_` prefix (`src/config/env.ts`).
   - Non-prefixed variables (e.g., `GEMINI_API_KEY`) are kept on the server/build level and injected via platform secrets management.

---

## 3. Cryptographic Password Hashing & Authentication Security

- **In-Memory Volatility**: Client birth charts, private astrological notes, and consultation dossiers are never persisted in insecure, unencrypted browser storage (`localStorage`).
- **Salted SHA-256 Hashing (Fail-Closed)**: Account credentials enforce 128-bit random salts (`crypto.getRandomValues`) and SHA-256 digests (`crypto.subtle.digest`) via `src/utils/cryptoAuth.ts`. If Web Crypto primitives are unavailable, operations fail closed rather than falling back to weak hashes or pseudo-random values.
- **No Hardcoded Passwords**: Fallback plaintext passwords ('admin', 'admin123', 'password') and credential pre-fills have been removed. Verification requires matching cryptographic digests.
- **Production Demo Isolation**: Demo features (auto-fill, sandbox quick login, simulated roles) are strictly disabled in production builds (`PROD=true` or `NODE_ENV=production`). Setting `VITE_DEMO_MODE=true` in production is ignored by design.
- **Role Selection Separation**: Selecting a role tab or dropdown item does not grant identity or bypass credential verification.
- **Identity Provider Notice**: The current authentication layer is a client-side prototype. Production authentication is NOT complete until a real identity provider (e.g., Firebase Auth, OAuth 2.0 / OIDC, or secure backend auth service) is integrated.

---

## 4. Wallet & Financial Protection Checklist for Contributors

Before committing or pushing code:
- [x] Run `git status` to verify untracked files do not include `.env`, `.pem`, `wallet.json`, or credentials.
- [x] Verify that no test scripts or hardcoded seed phrases were left in code files.
- [x] Check that any local payment or payout testing uses simulated identifiers, never live financial credentials.
- [x] Ensure all API key variables are declared in `.env.example` with non-functional placeholders.
