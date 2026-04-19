#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Bytes, BytesN, Env, String, Symbol, Vec};

#[test]
fn test_prova_policy_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ProvaPolicy);
    let client = ProvaPolicyClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let mut curve = Vec::new(&env);
    for _ in 0..12 {
        curve.push_back(100);
    }
    
    // 1. Initialize
    client.initialize(&admin, &curve);

    let policy_id = BytesN::from_array(&env, &[1u8; 32]);
    let debtor = Symbol::new(&env, "debtor_01");
    let limit_commitment = BytesN::from_array(&env, &[2u8; 32]);

    // 2. Create Policy
    client.create_policy(&policy_id, &debtor, &limit_commitment);

    // 3. Evaluate Risk
    let proof = Bytes::from_array(&env, &[0xff; 64]);
    let score_commitment = BytesN::from_array(&env, &[3u8; 32]);
    let premium = client.evaluate_risk(&policy_id, &proof, &score_commitment);
    assert_eq!(premium, 500);

    // 4. Judge Claim
    let claim_proof = Bytes::from_array(&env, &[0xee; 64]);
    let success = client.judge_claim(&policy_id, &claim_proof, &2000u64);
    assert!(success);
}
