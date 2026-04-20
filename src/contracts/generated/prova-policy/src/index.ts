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
		contractId: "CDGMBYHO7A65PBCYTGAWL6EBFL5H2DTGCCPSTP5ABA4UFNEPNUWSF34S",
	},
} as const

export type PolicyStatus =
	| { tag: "Active"; values: void }
	| { tag: "Closed"; values: void }

export interface Policy {
	debtor_id: string
	limit_commitment: Buffer
	status: PolicyStatus
}

export type DataKey =
	| { tag: "Admin"; values: void }
	| { tag: "PremiumCurve"; values: void }
	| { tag: "Policy"; values: readonly [Buffer] }
	| { tag: "AllPolicies"; values: void }

export interface Client {
	/**
	 * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	initialize: (
		{ admin, curve }: { admin: string; curve: Array<u32> },
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
	 * Construct and simulate a create_policy transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	create_policy: (
		{
			id,
			debtor,
			commitment,
		}: { id: Buffer; debtor: string; commitment: Buffer },
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
	 * Construct and simulate a get_policy transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	get_policy: (
		{ id }: { id: Buffer },
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
	) => Promise<AssembledTransaction<Option<Policy>>>

	/**
	 * Construct and simulate a get_all_policies transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	get_all_policies: (options?: {
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
	}) => Promise<AssembledTransaction<Array<Buffer>>>

	/**
	 * Construct and simulate a evaluate_risk transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	evaluate_risk: (
		{
			id,
			proof,
			score_commitment,
		}: { id: Buffer; proof: Buffer; score_commitment: Buffer },
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
	) => Promise<AssembledTransaction<u64>>

	/**
	 * Construct and simulate a judge_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	judge_claim: (
		{ id, proof, amount }: { id: Buffer; proof: Buffer; amount: u64 },
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
	) => Promise<AssembledTransaction<boolean>>
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
				"AAAAAgAAAAAAAAAAAAAADFBvbGljeVN0YXR1cwAAAAIAAAAAAAAAAAAAAAZBY3RpdmUAAAAAAAAAAAAAAAAABkNsb3NlZAAA",
				"AAAAAQAAAAAAAAAAAAAABlBvbGljeQAAAAAAAwAAAAAAAAAJZGVidG9yX2lkAAAAAAAAEQAAAAAAAAAQbGltaXRfY29tbWl0bWVudAAAA+4AAAAgAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAMUG9saWN5U3RhdHVz",
				"AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMUHJlbWl1bUN1cnZlAAAAAQAAAAAAAAAGUG9saWN5AAAAAAABAAAD7gAAACAAAAAAAAAAAAAAAAtBbGxQb2xpY2llcwA=",
				"AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVjdXJ2ZQAAAAAAA+oAAAAEAAAAAA==",
				"AAAAAAAAAAAAAAANY3JlYXRlX3BvbGljeQAAAAAAAAMAAAAAAAAAAmlkAAAAAAPuAAAAIAAAAAAAAAAGZGVidG9yAAAAAAARAAAAAAAAAApjb21taXRtZW50AAAAAAPuAAAAIAAAAAA=",
				"AAAAAAAAAAAAAAAKZ2V0X3BvbGljeQAAAAAAAQAAAAAAAAACaWQAAAAAA+4AAAAgAAAAAQAAA+gAAAfQAAAABlBvbGljeQAA",
				"AAAAAAAAAAAAAAAQZ2V0X2FsbF9wb2xpY2llcwAAAAAAAAABAAAD6gAAA+4AAAAg",
				"AAAAAAAAAAAAAAANZXZhbHVhdGVfcmlzawAAAAAAAAMAAAAAAAAAAmlkAAAAAAPuAAAAIAAAAAAAAAAFcHJvb2YAAAAAAAAOAAAAAAAAABBzY29yZV9jb21taXRtZW50AAAD7gAAACAAAAABAAAABg==",
				"AAAAAAAAAAAAAAALanVkZ2VfY2xhaW0AAAAAAwAAAAAAAAACaWQAAAAAA+4AAAAgAAAAAAAAAAVwcm9vZgAAAAAAAA4AAAAAAAAABmFtb3VudAAAAAAABgAAAAEAAAAB",
			]),
			options,
		)
	}
	public readonly fromJSON = {
		initialize: this.txFromJSON<null>,
		create_policy: this.txFromJSON<null>,
		get_policy: this.txFromJSON<Option<Policy>>,
		get_all_policies: this.txFromJSON<Array<Buffer>>,
		evaluate_risk: this.txFromJSON<u64>,
		judge_claim: this.txFromJSON<boolean>,
	}
}
