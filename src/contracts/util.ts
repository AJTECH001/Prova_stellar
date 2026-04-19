import { type Network, type NetworkType } from "@theahaco/contract-explorer"

export enum WalletNetwork {
	PUBLIC = "Public Global Stellar Network ; September 2015",
	TESTNET = "Test SDF Network ; September 2015",
	FUTURENET = "Test SDF Future Network ; October 2022",
	STANDALONE = "Standalone Network ; February 2017",
}

export const stellarNetwork = "TESTNET"
export const networkPassphrase = WalletNetwork.TESTNET
export const rpcUrl = "https://soroban-testnet.stellar.org"
export const horizonUrl = "https://horizon-testnet.stellar.org"

const stellarEncode = (str: string) => {
	return str.replace(/\//g, "//").replace(/;/g, "/;")
}

export const labPrefix = () => {
	switch (stellarNetwork) {
		case "LOCAL":
			return `http://localhost:8000/lab/transaction-dashboard?$=network$id=custom&label=Custom&horizonUrl=${stellarEncode(horizonUrl)}&rpcUrl=${stellarEncode(rpcUrl)}&passphrase=${stellarEncode(networkPassphrase)};`
		case "PUBLIC":
			return `https://lab.stellar.org/transaction-dashboard?$=network$id=mainnet&label=Mainnet&horizonUrl=${stellarEncode(horizonUrl)}&rpcUrl=${stellarEncode(rpcUrl)}&passphrase=${stellarEncode(networkPassphrase)};`
		case "TESTNET":
			return `https://lab.stellar.org/transaction-dashboard?$=network$id=testnet&label=Testnet&horizonUrl=${stellarEncode(horizonUrl)}&rpcUrl=${stellarEncode(rpcUrl)}&passphrase=${stellarEncode(networkPassphrase)};`
		case "FUTURENET":
			return `https://lab.stellar.org/transaction-dashboard?$=network$id=futurenet&label=Futurenet&horizonUrl=${stellarEncode(horizonUrl)}&rpcUrl=${stellarEncode(rpcUrl)}&passphrase=${stellarEncode(networkPassphrase)};`
		default:
			return `https://lab.stellar.org/transaction-dashboard?$=network$id=testnet&label=Testnet&horizonUrl=${stellarEncode(horizonUrl)}&rpcUrl=${stellarEncode(rpcUrl)}&passphrase=${stellarEncode(networkPassphrase)};`
	}
}

// NOTE: needs to be exported for contract files in this directory

const networkToId = (network: string): NetworkType => {
	switch (network) {
		case "PUBLIC":
			return "mainnet"
		case "TESTNET":
			return "testnet"
		case "FUTURENET":
			return "futurenet"
		default:
			return "local"
	}
}

export const network: Network = {
	id: networkToId(stellarNetwork),
	label: stellarNetwork.toLowerCase(),
	passphrase: networkPassphrase,
	rpcUrl: rpcUrl,
	horizonUrl: horizonUrl,
}
