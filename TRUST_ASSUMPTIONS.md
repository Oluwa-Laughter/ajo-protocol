# Trust Assumptions & Security Disclosures (TRUST_ASSUMPTIONS.md) 🛡️

This document details the trust assumptions, counterparty risks, and security boundary guarantees of **Ajo Protocol**.

---

## 1. Social Trust & Counterparty Default Assumptions

Ajo Protocol digitizes Rotating Savings and Credit Associations (ROSCAs). Traditional ROSCAs rely on social trust among participants.

> [!WARNING]
> **Ajo Protocol smart contracts DO NOT eliminate counterparty default risk in v1.**  
> If Member A takes home the total pot in Round 1 and refuses to contribute in Round 2, the smart contract cannot force tokens out of their un-delegated external wallet.

### Current v1 Risk Mitigations
- **Round Deadlines**: If a round deadline expires and a member defaults, non-defaulting members can call `refund_missed_round` to retrieve their escrowed tokens and mark the circle as `Cancelled`.
- **Roster Locking**: Membership is immutable once `start()` is invoked by the circle creator.

### v2 Future Work
- Collateral deposits / bond locking
- On-chain credit scoring & social vouching
- Automated penalty slashing for missed deadlines

---

## 2. Admin Privileges & Limitations

The circle creator (`admin`) holds specific administrative privileges:
- **`start(circle_id)`**: Admin locks membership and activates the payout order.
- **NO Arbitrary Fund Withdrawal**: Admin CANNOT transfer out pooled escrow funds to arbitrary addresses. Funds can ONLY be disbursed to the assigned turn recipient when `total_collected == target_pot`.

---

## 3. Token & Protocol Infrastructure Dependencies

1. **Stellar Asset Contract (USDC)**: Ajo uses USDC on Stellar. Members trust Circle (the USDC issuer) not to freeze or claw back asset balances.
2. **Stellar Soroban Environment**: Members trust the consensus rules and WebAssembly runtime of the Stellar Soroban network.
3. **Storage TTL**: Soroban state entries expire unless extended. Ajo automatically bumps persistent TTL entries on every read/write call.
