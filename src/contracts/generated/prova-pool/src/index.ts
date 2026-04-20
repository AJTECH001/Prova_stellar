import { Buffer } from "buffer"
import { Address } from "@stellar/stellar-sdk"
import {
	AssembledTransaction,
	Client as ContractClient,
	ClientOptions as ContractClientOptions,
	MethodOptions,
	Result,
	Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract"
import type {
	u32,
	i32,
	u64,
	i64,
	u128,
	i128,
	u256,
	i256,
	Option,
	Typepoint,
	Duration,
} from "@stellar/stellar-sdk/contract"
export * from "@stellar/stellar-sdk"
export * as contract from "@stellar/stellar-sdk/contract"
export * as rpc from "@stellar/stellar-sdk/rpc"

if (typeof window !== "undefined") {
	//@ts-ignore Buffer exists
	window.Buffer = window.Buffer || Buffer
}

export const networks = {
	testnet: {
		networkPassphrase: "Test SDF Network ; September 2015",
		contractId: "CADOPOLTIJGPTRCJ4HPVLG6ZKQTT4U4OHZX7ZKQKHWLVVXH3B7RFZMXT",
	},
} as const

export type DataKey =
	| { tag: "Admin"; values: void }
	| { tag: "Token"; values: void }
	| { tag: "Balance"; values: readonly [string] }
	| { tag: "TotalLiquidity"; values: void }

export interface Client {
	/**
	 * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 * Initialize the pool with an admin and the token asset (e.g. USDC)
	 */
	initialize: (
		{ admin, token }: { admin: string; token: string },
		options?: {
			/**
			 * The fee to pay for the transaction. Default: BASE_FEE
			 */
			fee?: number

			/**
			 * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
			 */
			timeoutInSeconds?: number

			/**
			 * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
			 */
			simulate?: boolean
		},
	) => Promise<AssembledTransaction<null>>

	/**
	 * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 * Deposit tokens into the pool to earn premiums.
	 * In a real scenario, this would involve transferring tokens from the LP.
	 */
	deposit: (
		{ lp, amount }: { lp: string; amount: i128 },
		options?: {
			/**
			 * The fee to pay for the transaction. Default: BASE_FEE
			 */
			fee?: number

			/**
			 * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
			 */
			timeoutInSeconds?: number

			/**
			 * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
			 */
			simulate?: boolean
		},
	) => Promise<AssembledTransaction<null>>

	/**
	 * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 * Withdraw tokens from the pool.
	 */
	withdraw: (
		{ lp, amount }: { lp: string; amount: i128 },
		options?: {
			/**
			 * The fee to pay for the transaction. Default: BASE_FEE
			 */
			fee?: number

			/**
			 * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
			 */
			timeoutInSeconds?: number

			/**
			 * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
			 */
			simulate?: boolean
		},
	) => Promise<AssembledTransaction<null>>

	/**
	 * Construct and simulate a get_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	get_balance: (
		{ lp }: { lp: string },
		options?: {
			/**
			 * The fee to pay for the transaction. Default: BASE_FEE
			 */
			fee?: number

			/**
			 * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
			 */
			timeoutInSeconds?: number

			/**
			 * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
			 */
			simulate?: boolean
		},
	) => Promise<AssembledTransaction<i128>>

	/**
	 * Construct and simulate a get_total_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	get_total_liquidity: (options?: {
		/**
		 * The fee to pay for the transaction. Default: BASE_FEE
		 */
		fee?: number

		/**
		 * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
		 */
		timeoutInSeconds?: number

		/**
		 * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
		 */
		simulate?: boolean
	}) => Promise<AssembledTransaction<i128>>
}
export class Client extends ContractClient {
	static async deploy<T = Client>(
		/** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
		options: MethodOptions &
			Omit<ContractClientOptions, "contractId"> & {
				/** The hash of the Wasm blob, which must already be installed on-chain. */
				wasmHash: Buffer | string
				/** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
				salt?: Buffer | Uint8Array
				/** The format used to decode `wasmHash`, if it's provided as a string. */
				format?: "hex" | "base64"
			},
	): Promise<AssembledTransaction<T>> {
		return ContractClient.deploy(null, options)
	}
	constructor(public readonly options: ContractClientOptions) {
		super(
			new ContractSpec([
				"AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFVG9rZW4AAAAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAAAAAAAAAAAOVG90YWxMaXF1aWRpdHkAAA==",
				"AAAAAAAAAEFJbml0aWFsaXplIHRoZSBwb29sIHdpdGggYW4gYWRtaW4gYW5kIHRoZSB0b2tlbiBhc3NldCAoZS5nLiBVU0RDKQAAAAAAAAppbml0aWFsaXplAAAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAA=",
				"AAAAAAAAAHZEZXBvc2l0IHRva2VucyBpbnRvIHRoZSBwb29sIHRvIGVhcm4gcHJlbWl1bXMuCkluIGEgcmVhbCBzY2VuYXJpbywgdGhpcyB3b3VsZCBpbnZvbHZlIHRyYW5zZmVycmluZyB0b2tlbnMgZnJvbSB0aGUgTFAuAAAAAAAHZGVwb3NpdAAAAAACAAAAAAAAAAJscAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
				"AAAAAAAAAB5XaXRoZHJhdyB0b2tlbnMgZnJvbSB0aGUgcG9vbC4AAAAAAAh3aXRoZHJhdwAAAAIAAAAAAAAAAmxwAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
				"AAAAAAAAAAAAAAALZ2V0X2JhbGFuY2UAAAAAAQAAAAAAAAACbHAAAAAAABMAAAABAAAACw==",
				"AAAAAAAAAAAAAAATZ2V0X3RvdGFsX2xpcXVpZGl0eQAAAAAAAAAAAQAAAAs=",
			]),
			options,
		)
	}
	public readonly fromJSON = {
		initialize: this.txFromJSON<null>,
		deposit: this.txFromJSON<null>,
		withdraw: this.txFromJSON<null>,
		get_balance: this.txFromJSON<i128>,
		get_total_liquidity: this.txFromJSON<i128>,
	}
}
