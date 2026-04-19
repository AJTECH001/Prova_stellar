#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Token,
    Balance(Address),
    TotalLiquidity,
}

#[contract]
pub struct ProvaPool;

#[contractimpl]
impl ProvaPool {
    /// Initialize the pool with an admin and the token asset (e.g. USDC)
    pub fn initialize(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::TotalLiquidity, &0i128);
    }

    /// Deposit tokens into the pool to earn premiums.
    /// In a real scenario, this would involve transferring tokens from the LP.
    pub fn deposit(env: Env, lp: Address, amount: i128) {
        lp.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("Not initialized");
        let token = token::Client::new(&env, &token_addr);

        // Transfer tokens from LP to this contract
        token.transfer(&lp, &env.current_contract_address(), &amount);

        // Update LP's share balance
        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(lp.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(lp.clone()), &balance);

        // Update total liquidity
        let mut total: i128 = env.storage().instance().get(&DataKey::TotalLiquidity).unwrap_or(0);
        total += amount;
        env.storage().instance().set(&DataKey::TotalLiquidity, &total);
    }

    /// Withdraw tokens from the pool.
    pub fn withdraw(env: Env, lp: Address, amount: i128) {
        lp.require_auth();

        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(lp.clone())).unwrap_or(0);
        if balance < amount {
            panic!("Insufficient balance");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("Not initialized");
        let token = token::Client::new(&env, &token_addr);

        // Transfer tokens back to LP
        token.transfer(&env.current_contract_address(), &lp, &amount);

        // Update balances
        balance -= amount;
        env.storage().persistent().set(&DataKey::Balance(lp.clone()), &balance);

        let mut total: i128 = env.storage().instance().get(&DataKey::TotalLiquidity).unwrap_or(0);
        total -= amount;
        env.storage().instance().set(&DataKey::TotalLiquidity, &total);
    }

    pub fn get_balance(env: Env, lp: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(lp)).unwrap_or(0)
    }

    pub fn get_total_liquidity(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalLiquidity).unwrap_or(0)
    }
}
