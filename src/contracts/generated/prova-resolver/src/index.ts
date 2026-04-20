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
		contractId: "CBDH2QTTL7ELT6FY5AATQ7DBNPTEE6PSUMRUO4PDYZ6ZH5AX7TGIL3AC",
	},
} as const

export interface InvoiceTerms {
	due_date: u64
	terms_commitment: Buffer
	waiting_period: u64
}

export type DataKey = { tag: "Invoice"; values: readonly [Buffer] }

export interface Client {
	/**
	 * Construct and simulate a on_condition_set transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	on_condition_set: (
		{
			id,
			due_date,
			wait,
			commitment,
		}: { id: Buffer; due_date: u64; wait: u64; commitment: Buffer },
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
	 * Construct and simulate a is_condition_met transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
	 */
	is_condition_met: (
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
				"AAAAAQAAAAAAAAAAAAAADEludm9pY2VUZXJtcwAAAAMAAAAAAAAACGR1ZV9kYXRlAAAABgAAAAAAAAAQdGVybXNfY29tbWl0bWVudAAAA+4AAAAgAAAAAAAAAA53YWl0aW5nX3BlcmlvZAAAAAAABg==",
				"AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAAB0ludm9pY2UAAAAAAQAAA+4AAAAg",
				"AAAAAAAAAAAAAAAQb25fY29uZGl0aW9uX3NldAAAAAQAAAAAAAAAAmlkAAAAAAPuAAAAIAAAAAAAAAAIZHVlX2RhdGUAAAAGAAAAAAAAAAR3YWl0AAAABgAAAAAAAAAKY29tbWl0bWVudAAAAAAD7gAAACAAAAAA",
				"AAAAAAAAAAAAAAAQaXNfY29uZGl0aW9uX21ldAAAAAEAAAAAAAAAAmlkAAAAAAPuAAAAIAAAAAEAAAAB",
			]),
			options,
		)
	}
	public readonly fromJSON = {
		on_condition_set: this.txFromJSON<null>,
		is_condition_met: this.txFromJSON<boolean>,
	}
}
