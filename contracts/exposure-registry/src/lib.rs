#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol};

#[contracttype]
pub enum DataKey {
    Exposure(Symbol),
}

#[contract]
pub struct ExposureRegistry;

#[contractimpl]
impl ExposureRegistry {
    pub fn add_exposure(env: Env, debtor: Symbol, amount: u128) {
        // Note: In a production environment, authorization checks should be added
        // to ensure only valid policy contracts can call this.
        let key = DataKey::Exposure(debtor.clone());
        let current_exposure: u128 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_exposure = current_exposure.checked_add(amount).expect("Exposure overflow");
        env.storage().persistent().set(&key, &new_exposure);
    }

    pub fn get_exposure(env: Env, debtor: Symbol) -> u128 {
        let key = DataKey::Exposure(debtor);
        env.storage().persistent().get(&key).unwrap_or(0)
    }
}
