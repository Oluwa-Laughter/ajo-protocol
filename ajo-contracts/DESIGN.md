# Smart Contract Design Specification (ajo-contracts/DESIGN.md) 📜

## 1. Overview

The `ajo-contracts` repository contains the core state machine for Ajo ROSCA circles. It handles user authentication (`require_auth`), stablecoin escrow transfers via the Stellar Asset Contract (SAC), payout scheduling, and state persistence with Soroban TTL management.

---

## 2. Public Smart Contract Interface

```rust
pub trait AjoTrait {
    /// Initializes a new savings circle.
    fn create_circle(
        env: Env, 
        admin: Address, 
        token: Address, 
        amount: i128, 
        period_secs: u64, 
        max_members: u32
    ) -> u64;

    /// Allows a user to join an existing circle before it starts.
    fn join(env: Env, circle_id: u64, member: Address);

    /// Locks membership and activates the circle.
    fn start(env: Env, circle_id: u64);

    /// Transfers the round contribution from member to contract escrow.
    fn contribute(env: Env, circle_id: u64, member: Address);

    /// Disburses the round pot to the assigned recipient once funded.
    fn payout(env: Env, circle_id: u64);

    /// Triggers a emergency refund if a round deadline is breached.
    fn refund_missed_round(env: Env, circle_id: u64);

    /// Read function: Returns Circle metadata.
    fn get_circle(env: Env, circle_id: u64) -> Circle;

    /// Read function: Returns current round contribution status.
    fn get_round(env: Env, circle_id: u64, round_id: u32) -> RoundState;
}
```

---

## 3. Storage Schema & Keys

Soroban persistent storage entries are indexed using typed `Symbol` or `Enum` keys:

| Key Type | Key Format | Value Struct | Storage Type |
| :--- | :--- | :--- | :--- |
| `DataKey::Circle(id)` | `(Symbol("Circle"), u64)` | `Circle` | `Persistent` |
| `DataKey::Round(id, r)` | `(Symbol("Round"), u64, u32)` | `RoundState` | `Persistent` |
| `DataKey::MemberPaid(id, r, m)` | `(Symbol("Paid"), u64, u32, Address)` | `bool` | `Persistent` |
| `DataKey::CircleCount` | `Symbol("Count")` | `u64` | `Instance` |

### Storage TTL Strategy
```rust
const INSTANCE_BUMP_AMOUNT: u32 = 500_000;
const PERSISTENT_BUMP_AMOUNT: u32 = 500_000;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 100_000;

pub fn bump_circle_ttl(env: &Env, circle_id: u64) {
    let key = DataKey::Circle(circle_id);
    env.storage().persistent().extend_ttl(
        &key, 
        PERSISTENT_LIFETIME_THRESHOLD, 
        PERSISTENT_BUMP_AMOUNT
    );
}
```

---

## 4. Custom Error Codes

```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    CircleNotFound = 1,
    CircleFull = 2,
    AlreadyJoined = 3,
    NotStarted = 4,
    AlreadyStarted = 5,
    NotMember = 6,
    AlreadyPaid = 7,
    RoundNotComplete = 8,
    RoundAlreadySettled = 9,
    DeadlineNotPassed = 10,
    UnauthorizedAdmin = 11,
}
```

---

## 5. Event Specifications

```rust
// Topics: [Symbol("ajo"), Symbol("circle_created"), circle_id]
// Data: (admin, token, amount, max_members)

// Topics: [Symbol("ajo"), Symbol("member_joined"), circle_id]
// Data: (member, current_member_count)

// Topics: [Symbol("ajo"), Symbol("contribute"), circle_id, round_id]
// Data: (member, amount)

// Topics: [Symbol("ajo"), Symbol("payout"), circle_id, round_id]
// Data: (recipient, total_pot)
```
