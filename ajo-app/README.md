# Ajo Web Application (`ajo-app`) 💻📱

> **Next.js & TypeScript Frontend for Ajo Protocol**

`ajo-app` is the web frontend for interacting with Ajo Soroban smart contracts on the Stellar blockchain. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Stellar Wallets Kit**, it delivers a seamless, mobile-first experience for managing rotating savings circles.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18, App Router, TypeScript)
- **Styling**: Tailwind CSS + Lucide React Icons
- **Blockchain Integration**:
  - `@stellar/stellar-sdk`
  - `@stellar/freighter-api`
  - `@brianmcdonald/stellar-wallets-kit` (or equivalent wallet adapter)
- **State Management**: React Context / Zustand
- **Formatters & Feeds**: Live NGN/USD rate conversions for local currency visualization

---

## 📁 Repository Layout

```
ajo-app/
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── layout.tsx         # Root layout with Wallet Provider
│   │   ├── page.tsx           # Landing page & circle discovery
│   │   ├── create/            # Create circle wizard form
│   │   └── circle/[id]/       # Circle dashboard & round state
│   ├── components/            # Reusable UI components
│   │   ├── WalletConnect.tsx  # Wallet modal & status badge
│   │   ├── CircleCard.tsx     # Summary card for active circles
│   │   ├── ContributeModal.tsx# Modals for token approval & contribution
│   │   └── RiskBanner.tsx     # Mandatory testnet risk disclosure banner
│   ├── contracts/             # Generated TypeScript Soroban contract bindings
│   ├── hooks/                 # Custom React hooks (useWallet, useCircle)
│   └── lib/                   # Stellar client & utility functions
├── public/                    # Static assets
│   └── logo.jpg               # Project logo
├── DESIGN.md                  # Frontend architecture & UX flow
├── AGENDA.md                  # Client tasks & UI issue backlog
└── README.md                  # App README (This file)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in `ajo-app/`:
```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=C...YOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_USDC_ISSUER=GBBD47IF6LWK2P7MDEVSCWR7DPUWV3NY3DTQEVFL4TW45A6BO5BAGGGH
```

### 3. Generate Contract Bindings
```bash
soroban contract bindings typescript \
  --wasm ../ajo-contracts/target/wasm32-unknown-unknown/release/ajo_contracts.wasm \
  --output-dir ./src/contracts/ajo
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
