# Ajo Smart Contracts (`ajo-contracts`) ⚙️🦀

> **Soroban Smart Contracts in Rust for Ajo Protocol**

This repository contains the smart contract code, data structures, unit tests, and deployment scripts for **Ajo Protocol** built on the **Stellar Soroban** smart contract platform.

---

## 🛠 Tech Stack & Prerequisites

- **Language**: Rust (`nightly` or `stable 1.75+`)
- **Target**: `wasm32-unknown-unknown`
- **SDK**: `soroban-sdk` (`v20.0+` / `v21.0+`)
- **CLI**: `soroban-cli`

### Installation

```bash
# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli
```

---

## 📁 Repository Layout

```
ajo-contracts/
├── src/
│   ├── lib.rs                 # Contract entrypoint & public functions
│   ├── types.rs               # Data structures, enums, & storage keys
│   ├── storage.rs             # Persistent storage helpers & TTL extensions
│   ├── events.rs              # Structured event definitions
│   ├── errors.rs              # Error enums & guard assertions
│   └── test.rs                # Soroban test environment unit tests
├── Cargo.toml                 # Cargo dependencies & WASM profile settings
├── DESIGN.md                  # Contract architecture & storage specs
├── AGENDA.md                  # Contract issues & task backlog
└── README.md                  # Contract README (This file)
```

---

## 🧪 Building & Testing

### 1. Run Unit Tests
```bash
cargo test
```

### 2. Build Release WASM
```bash
cargo build --target wasm32-unknown-unknown --release
```
The compiled WASM file will be located at:
`target/wasm32-unknown-unknown/release/ajo_contracts.wasm`

### 3. Deploy to Stellar Testnet
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/ajo_contracts.wasm \
  --source admin \
  --network testnet
```

---

## 📖 Specifications & Design
For detailed function signatures, error codes, and storage TTL strategies, see [DESIGN.md](file:///Users/user/ajo/ajo-contracts/DESIGN.md).

For starter issues and open contract tasks, see [AGENDA.md](file:///Users/user/ajo/ajo-contracts/AGENDA.md).
