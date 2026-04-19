#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, BytesN};

#[contracttype]
pub struct InvoiceTerms {
    pub due_date: u64,
    pub waiting_period: u64,
    pub terms_commitment: BytesN<32>,
}

#[contracttype]
pub enum DataKey {
    Invoice(BytesN<32>), // Using BytesN<32> as id equivalent to u256
}

#[contract]
pub struct ProvaResolver;

#[contractimpl]
impl ProvaResolver {
    pub fn on_condition_set(
        env: Env,
        id: BytesN<32>,
        due_date: u64,
        wait: u64,
        commitment: BytesN<32>,
    ) {
        let terms = InvoiceTerms {
            due_date,
            waiting_period: wait,
            terms_commitment: commitment,
        };
        env.storage().persistent().set(&DataKey::Invoice(id), &terms);
    }

    pub fn is_condition_met(env: Env, id: BytesN<32>) -> bool {
        let key = DataKey::Invoice(id);
        if let Some(terms) = env.storage().persistent().get::<_, InvoiceTerms>(&key) {
            let current_time = env.ledger().timestamp();
            let threshold = terms.due_date.saturating_add(terms.waiting_period);
            current_time > threshold
        } else {
            false
        }
    }
}
