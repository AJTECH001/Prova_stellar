#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Bytes, BytesN, Env, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyStatus {
    Active,
    Closed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Policy {
    pub debtor_id: Symbol,
    pub limit_commitment: BytesN<32>,
    pub status: PolicyStatus,
}

#[contracttype]
pub enum DataKey {
    Admin,
    PremiumCurve,
    Policy(BytesN<32>),
    AllPolicies,
}

#[contract]
pub struct ProvaPolicy;

#[contractimpl]
impl ProvaPolicy {
    pub fn initialize(env: Env, admin: Address, curve: Vec<u32>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::PremiumCurve, &curve);
    }

    pub fn create_policy(env: Env, id: BytesN<32>, debtor: Symbol, commitment: BytesN<32>) {
        if env.storage().persistent().has(&DataKey::Policy(id.clone())) {
            panic!("Policy already exists");
        }
        let policy = Policy {
            debtor_id: debtor,
            limit_commitment: commitment,
            status: PolicyStatus::Active,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Policy(id.clone()), &policy);

        // Track the policy ID
        let mut all_policies: Vec<BytesN<32>> = env
            .storage()
            .persistent()
            .get(&DataKey::AllPolicies)
            .unwrap_or(Vec::new(&env));
        all_policies.push_back(id);
        env.storage()
            .persistent()
            .set(&DataKey::AllPolicies, &all_policies);
    }

    pub fn get_policy(env: Env, id: BytesN<32>) -> Option<Policy> {
        env.storage().persistent().get(&DataKey::Policy(id))
    }

    pub fn get_all_policies(env: Env) -> Vec<BytesN<32>> {
        env.storage()
            .persistent()
            .get(&DataKey::AllPolicies)
            .unwrap_or(Vec::new(&env))
    }

    pub fn evaluate_risk(
        env: Env,
        id: BytesN<32>,
        proof: Bytes,
        score_commitment: BytesN<32>,
    ) -> u64 {
        let key = DataKey::Policy(id.clone());
        let _policy: Policy = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Policy not found");

        // Prepare public inputs for proof verification
        let mut public_inputs = Vec::new(&env);
        // We push the score commitment and the policy's limit commitment
        public_inputs.push_back(score_commitment.clone());
        // public_inputs.push_back(policy.limit_commitment.clone());

        // Verify the ZK proof
        if !Self::verify_groth16(&env, proof, public_inputs) {
            panic!("Invalid ZK proof");
        }

        // Return a mock premium amount (e.g. 500 bps)
        // In reality, this would be computed inside the circuit which outputs the premium,
        // or the circuit verifies the risk evaluation logic using the curve.
        500
    }

    pub fn judge_claim(env: Env, id: BytesN<32>, proof: Bytes, amount: u64) -> bool {
        let key = DataKey::Policy(id.clone());
        let mut policy: Policy = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Policy not found");

        if policy.status != PolicyStatus::Active {
            panic!("Policy not active");
        }

        // Mock verification
        let mut public_inputs = Vec::new(&env);
        // Add amount to inputs (mocked translation to BytesN<32>)
        // public_inputs.push_back(amount_bytes);

        if !Self::verify_groth16(&env, proof, public_inputs) {
            return false;
        }

        // Close policy upon successful claim
        policy.status = PolicyStatus::Closed;
        env.storage().persistent().set(&key, &policy);

        true
    }

    /// Internal helper to verify Groth16 proofs.
    /// In an MVP/mock environment, this always returns true as long as proof is provided.
    /// With Protocol 25, this will call `env.crypto().bn254_pairing_check(...)`
    fn verify_groth16(_env: &Env, proof: Bytes, _public_inputs: Vec<BytesN<32>>) -> bool {
        // Mock verification: require the proof to not be empty
        proof.len() > 0
    }
}
mod test;
