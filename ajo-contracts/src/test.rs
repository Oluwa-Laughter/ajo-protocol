#![cfg(test)]

use crate::{errors::ContractError, types::CircleStatus, AjoContract, AjoContractClient};
use soroban_sdk::{
    testutils::Address as _,
    token, Address, Env,
};

fn create_token_contract<'a>(
    env: &Env,
    admin: &Address,
) -> (Address, token::Client<'a>, token::StellarAssetClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone()).address();
    let client = token::Client::new(env, &sac);
    let admin_client = token::StellarAssetClient::new(env, &sac);
    (sac, client, admin_client)
}

#[test]
fn test_create_circle_and_join() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, _, _) = create_token_contract(&env, &token_admin);

    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let amount = 100_000_000; // 10 USDC
    let period_secs = 86400; // 1 day
    let max_members = 2;

    let circle_id = client.create_circle(&admin, &token_address, &amount, &period_secs, &max_members);
    assert_eq!(circle_id, 1);

    let circle = client.get_circle(&circle_id);
    assert_eq!(circle.admin, admin);
    assert_eq!(circle.members.len(), 1);
    assert_eq!(circle.status, CircleStatus::Created);

    // Member 1 joins
    client.join(&circle_id, &member1);

    let circle_after_join = client.get_circle(&circle_id);
    assert_eq!(circle_after_join.members.len(), 2);
}

#[test]
fn test_cannot_join_after_start() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let outsider = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, _, _) = create_token_contract(&env, &token_admin);
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let circle_id = client.create_circle(&admin, &token_address, &50_000_000, &86400, &3);
    client.join(&circle_id, &member1);
    client.start(&circle_id);

    // Attempting to join after circle is Active must fail
    let res = client.try_join(&circle_id, &outsider);
    assert_eq!(res, Err(Ok(ContractError::AlreadyStarted)));
}

#[test]
fn test_non_member_cannot_contribute() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let outsider = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, _, token_admin_client) = create_token_contract(&env, &token_admin);
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let circle_id = client.create_circle(&admin, &token_address, &50_000_000, &86400, &2);
    client.start(&circle_id);

    token_admin_client.mint(&outsider, &100_000_000);

    // Non-member contribution must fail
    let res = client.try_contribute(&circle_id, &outsider);
    assert_eq!(res, Err(Ok(ContractError::NotMember)));
}

#[test]
fn test_cannot_double_contribute() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, _, token_admin_client) = create_token_contract(&env, &token_admin);
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let circle_id = client.create_circle(&admin, &token_address, &50_000_000, &86400, &2);
    client.join(&circle_id, &member1);
    client.start(&circle_id);

    token_admin_client.mint(&admin, &100_000_000);

    // First contribution succeeds
    client.contribute(&circle_id, &admin);

    // Second contribution in same round must fail
    let res = client.try_contribute(&circle_id, &admin);
    assert_eq!(res, Err(Ok(ContractError::AlreadyPaid)));
}

#[test]
fn test_invalid_creation_params() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, _, _) = create_token_contract(&env, &token_admin);
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    // Amount <= 0 must fail
    let res1 = client.try_create_circle(&admin, &token_address, &0, &86400, &2);
    assert_eq!(res1, Err(Ok(ContractError::InvalidAmount)));

    // Max members < 2 must fail
    let res2 = client.try_create_circle(&admin, &token_address, &50_000_000, &86400, &1);
    assert_eq!(res2, Err(Ok(ContractError::InvalidMaxMembers)));
}

#[test]
fn test_admin_cannot_move_funds_arbitrarily() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, token_client, token_admin_client) = create_token_contract(&env, &token_admin);
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let circle_id = client.create_circle(&admin, &token_address, &50_000_000, &86400, &2);
    client.join(&circle_id, &member1);
    client.start(&circle_id);

    token_admin_client.mint(&admin, &50_000_000);
    client.contribute(&circle_id, &admin);

    // Only 1 of 2 members contributed. Admin calling payout must fail!
    let res = client.try_payout(&circle_id);
    assert_eq!(res, Err(Ok(ContractError::RoundNotComplete)));

    // Admin balance should not have increased
    let admin_bal = token_client.balance(&admin);
    assert_eq!(admin_bal, 0); // 50M minted - 50M contributed = 0
}

#[test]
fn test_full_circle_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token_address, token_client, token_admin_client) = create_token_contract(&env, &token_admin);

    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);

    let amount = 50_000_000; // 5 USDC
    let period_secs = 3600;
    let max_members = 2;

    // Create & Join
    let circle_id = client.create_circle(&admin, &token_address, &amount, &period_secs, &max_members);
    client.join(&circle_id, &member1);

    // Mint tokens to admin and member1
    token_admin_client.mint(&admin, &100_000_000);
    token_admin_client.mint(&member1, &100_000_000);

    // Start circle
    client.start(&circle_id);
    let circle = client.get_circle(&circle_id);
    assert_eq!(circle.status, CircleStatus::Active);

    // Round 0 Contributions: Admin and Member1 contribute
    client.contribute(&circle_id, &admin);
    client.contribute(&circle_id, &member1);

    let round0 = client.get_round(&circle_id, &0);
    assert_eq!(round0.total_collected, 100_000_000); // 5 + 5 = 10 USDC

    // Payout Round 0 -> Recipient is admin (index 0)
    let admin_bal_before = token_client.balance(&admin);
    client.payout(&circle_id);
    let admin_bal_after = token_client.balance(&admin);

    assert_eq!(admin_bal_after - admin_bal_before, 100_000_000);

    // Verify advanced to Round 1
    let circle_round1 = client.get_circle(&circle_id);
    assert_eq!(circle_round1.current_round, 1);
    assert_eq!(circle_round1.status, CircleStatus::Active);

    // Round 1 Contributions
    client.contribute(&circle_id, &admin);
    client.contribute(&circle_id, &member1);

    // Payout Round 1 -> Recipient is member1 (index 1)
    let m1_bal_before = token_client.balance(&member1);
    client.payout(&circle_id);
    let m1_bal_after = token_client.balance(&member1);

    assert_eq!(m1_bal_after - m1_bal_before, 100_000_000);

    // Circle should now be Completed
    let final_circle = client.get_circle(&circle_id);
    assert_eq!(final_circle.status, CircleStatus::Completed);
}
