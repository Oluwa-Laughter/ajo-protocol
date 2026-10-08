# Contributing to Ajo Protocol 🤝

Thank you for your interest in contributing to **Ajo Protocol**! We welcome open-source developers, maintainers, and security researchers to help build decentralized ROSCA infrastructure on Stellar.

---

## 🛠 Local Setup & Workflow

### 1. Prerequisites
- Rust `1.75+` & `wasm32-unknown-unknown` target
- Node.js `v18+` & `npm` / `pnpm`
- Soroban CLI (`cargo install --locked soroban-cli`)

### 2. Smart Contracts (`ajo-contracts`)
```bash
cd ajo-contracts
# Run test suite
cargo test

# Build WASM release
cargo build --target wasm32-unknown-unknown --release
```

### 3. Web App (`ajo-app`)
```bash
cd ajo-app
npm install
npm run dev
```

---

## 📜 Pull Request Guidelines

1. **Create an Issue**: Before submitting major PRs, open an issue outlining your proposed changes.
2. **Write Unit Tests**: Smart contract changes in `ajo-contracts` MUST include unit tests covering both happy path and failure cases.
3. **Run CI Checks Locally**: Ensure `cargo test` and `npm run build` execute without errors.
4. **Clean Commits**: Keep PR commits organized and concise.

---

## 📜 Code of Conduct
Respect all community members. Discriminatory or offensive behavior will not be tolerated.
