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

## 3. Cryptographic Password Hashing & Client Data Isolation

- **In-Memory Volatility**: Client birth charts, private astrological notes, and consultation dossiers are never persisted in insecure, unencrypted browser storage (`localStorage`).
- **Salted SHA-256 Hashing**: Administrative credentials utilize unique per-account salts (`crypto.getRandomValues`) and SHA-256 digests (`crypto.subtle.digest`) before comparison (`src/utils/cryptoAuth.ts`). Plaintext passwords are never logged or stored.
- **Role Isolation**: Strict role segregation between Client Sanctuary (`client`), Practitioner Enclave (`affiliate`), and Director Suite (`admin`).

---

## 4. Wallet & Financial Protection Checklist for Contributors

Before committing or pushing code:
- [x] Run `git status` to verify untracked files do not include `.env`, `.pem`, `wallet.json`, or credentials.
- [x] Verify that no test scripts or hardcoded seed phrases were left in code files.
- [x] Check that any local payment or payout testing uses simulated identifiers, never live financial credentials.
- [x] Ensure all API key variables are declared in `.env.example` with non-functional placeholders.
