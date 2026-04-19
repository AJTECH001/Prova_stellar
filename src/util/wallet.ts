import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils"
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk"
import { Horizon } from "@stellar/stellar-sdk"
import { stellarNetwork } from "../contracts/util"
import storage from "./storage"

// Compatibility types for the new kit structure
export type ISupportedWallet = { id: string; name: string; logo: string }
export type WalletNetwork = string

// Initialize the kit statically as per new API
StellarWalletsKit.init({
	modules: defaultModules(),
})

const kit = StellarWalletsKit

export const connectWallet = async () => {
	try {
		const { address } = await kit.getAddress()
		if (address) {
			storage.setItem("walletAddress", address)
			// Note: The new kit doesn't use the same modal structure as before
			// It handles its own selection internally when getAddress is called if not set
		}
	} catch (error) {
		console.error("Connection failed", error)
	}
}

export const disconnectWallet = async () => {
	// New kit doesn't have a direct disconnect() easily mapped in static kit
	// but we can clear local storage
	storage.removeItem("walletId")
	storage.removeItem("walletAddress")
	storage.removeItem("walletNetwork")
	storage.removeItem("networkPassphrase")
}

function getHorizonHost(mode: string) {
	switch (mode) {
		case "LOCAL":
			return "http://localhost:8000"
		case "FUTURENET":
			return "https://horizon-futurenet.stellar.org"
		case "TESTNET":
			return "https://horizon-testnet.stellar.org"
		case "PUBLIC":
			return "https://horizon.stellar.org"
		default:
			throw new Error(`Unknown Stellar network: ${mode}`)
	}
}

const horizon = new Horizon.Server(getHorizonHost(stellarNetwork), {
	allowHttp: stellarNetwork === "LOCAL",
})

const formatter = new Intl.NumberFormat()

export type MappedBalances = Record<string, Horizon.HorizonApi.BalanceLine>

export const fetchBalances = async (address: string) => {
	try {
		const { balances } = await horizon.accounts().accountId(address).call()
		const mapped = balances.reduce((acc, b) => {
			b.balance = formatter.format(Number(b.balance))
			const key =
				b.asset_type === "native"
					? "xlm"
					: b.asset_type === "liquidity_pool_shares"
						? b.liquidity_pool_id
						: `${b.asset_code}:${b.asset_issuer}`
			acc[key] = b
			return acc
		}, {} as MappedBalances)
		return mapped
	} catch (err) {
		if (!(err instanceof Error && err.message.match(/not found/i))) {
			console.error(err)
		}
		return {}
	}
}

export const wallet = kit
