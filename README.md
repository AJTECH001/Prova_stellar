# Prova Protocol

A decentralized trade credit insurance protocol built on
[Stellar](https://stellar.org) using [Soroban](https://soroban.stellar.org)
smart contracts.

Prova enables privacy-preserving credit policies, on-chain liquidity pools for
liquidity providers, and trustless invoice condition resolution — bringing the
next generation of trade finance to Stellar.

## Architecture

### Smart Contracts (Soroban / Rust)

| Contract            | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `prova-policy`      | Manages credit policies — creation, status tracking, and debtor commitment hashing |
| `prova-pool`        | Liquidity pool where LPs deposit/withdraw tokens (e.g. USDC) and earn premiums     |
| `prova-resolver`    | Resolves invoice payment conditions based on due dates and waiting periods         |
| `exposure-registry` | Tracks cumulative credit exposure per debtor across all active policies            |

### Frontend (React + TypeScript + Vite)

- **Landing page** — protocol overview with features, privacy showcase, and role
  selector
- **Dashboard** — live pool stats, deposit/withdraw flows, policy management,
  and claims

## Requirements

- [Rust](https://www.rust-lang.org/tools/install) with `wasm32-unknown-unknown`
  target
- [Node.js](https://nodejs.org) v22+
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli)
- [Scaffold Stellar CLI Plugin](https://github.com/AhaLabs/scaffold-stellar)

## Quick Start

```bash
# Install frontend dependencies
npm install

# Start the development server (builds contract clients + Vite dev server)
npm run dev
```

Open the server URL in your browser. The `npm run dev` command runs
`stellar scaffold watch --build-clients` alongside Vite, so contract client
packages in `packages/` are regenerated automatically on contract changes.

## Project Structure

```
my-project/
├── contracts/
│   ├── exposure-registry/   # Debtor exposure tracking contract
│   ├── prova-policy/        # Credit policy contract
│   ├── prova-pool/          # Liquidity pool contract
│   └── prova-resolver/      # Invoice condition resolver contract
├── packages/                # Auto-generated TypeScript clients (from scaffold)
├── src/
│   ├── components/          # React components (landing sections, wallet button, modals)
│   ├── contracts/           # Contract addresses and client utilities
│   ├── hooks/               # useWallet, useContracts hooks
│   ├── pages/               # Landing.tsx, Dashboard.tsx
│   ├── providers/           # React context providers
│   ├── util/                # Wallet adapter and helpers
│   ├── App.tsx
│   └── main.tsx
├── environments.toml        # Network environment configs (local/testnet/mainnet)
├── Cargo.toml               # Rust workspace
└── package.json
```

## Environment Configuration

Copy and edit `.env` for local overrides. Use `environments.toml` for
per-network settings (network passphrase, RPC URL, contract addresses).

## Deployment

```bash
# Build contracts and frontend
npm run build

# Publish contract to Stellar registry
stellar registry publish

# Deploy a contract instance
stellar registry deploy \
  --deployed-name prova-pool \
  --published-name prova-pool \
  -- \
  --admin <ADMIN_ADDRESS> \
  --token <TOKEN_ADDRESS>

# Create a local alias for the deployed contract
stellar registry create-alias prova-pool
```

## Tech Stack

- **Soroban SDK** — Stellar smart contract runtime
- **React 19 + TypeScript + Vite**
- **@creit-tech/stellar-wallets-kit** — multi-wallet connection
- **@stellar/stellar-sdk** — Stellar network interaction
- **@tanstack/react-query** — async state management
- **react-router-dom v7** — client-side routing
- **zod** — runtime schema validation

## License

See [LICENSE](LICENSE).
