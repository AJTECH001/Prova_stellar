import { useMemo } from "react"
import * as ExposureRegistry from "../contracts/generated/exposure-registry"
import * as ProvaPolicy from "../contracts/generated/prova-policy"
import * as ProvaPool from "../contracts/generated/prova-pool"
import * as ProvaResolver from "../contracts/generated/prova-resolver"
import { rpcUrl, networkPassphrase } from "../contracts/util"
import { useWallet } from "./useWallet"

export const useContracts = () => {
	const { address } = useWallet()

	const policyClient = useMemo(() => {
		return new ProvaPolicy.Client({
			networkPassphrase,
			contractId: "CDGMBYHO7A65PBCYTGAWL6EBFL5H2DTGCCPSTP5ABA4UFNEPNUWSF34S",
			rpcUrl: rpcUrl,
			allowHttp: true,
			publicKey: address,
		})
	}, [address])

	const resolverClient = useMemo(() => {
		return new ProvaResolver.Client({
			networkPassphrase,
			contractId: "CBDH2QTTL7ELT6FY5AATQ7DBNPTEE6PSUMRUO4PDYZ6ZH5AX7TGIL3AC",
			rpcUrl: rpcUrl,
			allowHttp: true,
			publicKey: address,
		})
	}, [address])

	const registryClient = useMemo(() => {
		return new ExposureRegistry.Client({
			networkPassphrase,
			contractId: "CCH65QVYJZHJ6RI6KCDVLLVN56CSWREOUP3PTVQB7LDZOWXSXIE36SQS",
			rpcUrl: rpcUrl,
			allowHttp: true,
			publicKey: address,
		})
	}, [address])

	const poolClient = useMemo(() => {
		return new ProvaPool.Client({
			networkPassphrase,
			contractId: "CADOPOLTIJGPTRCJ4HPVLG6ZKQTT4U4OHZX7ZKQKHWLVVXH3B7RFZMXT",
			rpcUrl: rpcUrl,
			allowHttp: true,
			publicKey: address,
		})
	}, [address])

	return {
		policyClient,
		resolverClient,
		registryClient,
		poolClient,
	}
}
