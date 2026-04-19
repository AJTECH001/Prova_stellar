import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react"
import { wallet, fetchBalances, type MappedBalances } from "../util/wallet"

export interface WalletContextType {
	address?: string
	balances: MappedBalances
	isPending: boolean
	signTransaction: (
		xdr: string,
		opts?: any,
	) => Promise<{ signedTxXdr: string; signerAddress?: string }>
	updateBalances: () => Promise<void>
	setAddress: (address: string | undefined) => void
}

export const WalletContext = createContext<WalletContextType | undefined>(
	undefined,
)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	const [balances, setBalances] = useState<MappedBalances>({})
	const [address, setAddress] = useState<string | undefined>()
	const [isPending] = useState(false)

	const updateBalances = useCallback(async () => {
		if (!address) {
			setBalances({})
			return
		}

		const newBalances = await fetchBalances(address)
		setBalances(newBalances)
	}, [address])

	useEffect(() => {
		if (address) {
			void updateBalances()
		}
	}, [address, updateBalances])

	const signTransaction = useCallback(async (xdr: string, opts?: any) => {
		return wallet.signTransaction(xdr, opts)
	}, [])

	const contextValue = useMemo(
		() => ({
			address,
			balances,
			updateBalances,
			isPending,
			signTransaction,
			setAddress,
		}),
		[address, balances, updateBalances, isPending, signTransaction],
	)

	return <WalletContext value={contextValue}>{children}</WalletContext>
}
