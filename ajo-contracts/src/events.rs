use soroban_sdk::{symbol_short, Address, Env};

pub fn emit_circle_created(
    env: &Env,
    circle_id: u64,
    admin: &Address,
    token: &Address,
    amount: i128,
    max_members: u32,
) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("created"), circle_id),
        (admin.clone(), token.clone(), amount, max_members),
    );
}

pub fn emit_member_joined(env: &Env, circle_id: u64, member: &Address, member_count: u32) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("joined"), circle_id),
        (member.clone(), member_count),
    );
}

pub fn emit_circle_started(env: &Env, circle_id: u64, start_time: u64) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("started"), circle_id),
        start_time,
    );
}

pub fn emit_contribution(
    env: &Env,
    circle_id: u64,
    round_id: u32,
    member: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("contrib"), circle_id),
        (round_id, member.clone(), amount),
    );
}

pub fn emit_payout(
    env: &Env,
    circle_id: u64,
    round_id: u32,
    recipient: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("payout"), circle_id),
        (round_id, recipient.clone(), amount),
    );
}

pub fn emit_refund(
    env: &Env,
    circle_id: u64,
    round_id: u32,
    member: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("ajo"), symbol_short!("refund"), circle_id),
        (round_id, member.clone(), amount),
    );
}
