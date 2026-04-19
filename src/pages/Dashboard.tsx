import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { WalletButton } from "../components/WalletButton"
import { networkPassphrase } from "../contracts/util"
import { useContracts } from "../hooks/useContracts"
import { useWallet } from "../hooks/useWallet"
import { wallet } from "../util/wallet"
import styles from "./Dashboard.module.css"

type View = "policies" | "liquidity" | "claims"

const POOL_CONTRACT = "CADOPOLTIJGPTRCJ4HPVLG6ZKQTT4U4OHZX7ZKQKHWLVVXH3B7RFZMXT"

const Dashboard: React.FC = () => {
	const { poolClient, policyClient } = useContracts()
	const { address } = useWallet()
	const queryClient = useQueryClient()

	const [activeView, setActiveView] = useState<View>("liquidity")
	const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
	const [depositAmount, setDepositAmount] = useState("")
	const [withdrawAmount, setWithdrawAmount] = useState("")
	const [txStatus, setTxStatus] = useState<
		"idle" | "signing" | "submitting" | "success" | "error"
	>("idle")
	const [txError, setTxError] = useState("")

	// --- Live Data Queries ---
	const { data: totalLiquidity, isLoading: isLoadingTotal } = useQuery({
		queryKey: ["totalLiquidity"],
		queryFn: async () => {
			try {
				const tx = await poolClient.get_total_liquidity()
				return tx.result
			} catch (e) {
				console.warn("Failed to fetch total liquidity:", e)
				return BigInt(0)
			}
		},
		enabled: !!address,
		refetchInterval: 10000,
	})

	const { data: myBalance, isLoading: isLoadingBalance } = useQuery({
		queryKey: ["myBalance", address],
		queryFn: async () => {
			if (!address) return BigInt(0)
			try {
				const tx = await poolClient.get_balance({ lp: address })
				return tx.result
			} catch (e) {
				console.warn("Failed to fetch balance:", e)
				return BigInt(0)
			}
		},
		enabled: !!address,
		refetchInterval: 10000,
	})

	const { data: policyIds } = useQuery({
		queryKey: ["policyIds"],
		queryFn: async () => {
			try {
				const tx = await policyClient.get_all_policies()
				return tx.result
			} catch (e) {
				console.warn("Failed to fetch policy IDs:", e)
				return []
			}
		},
		enabled: !!address,
	})

	// --- Format helpers ---
	const formatStroops = (value: bigint | undefined | null): string => {
		if (!value) return "0.00"
		return (Number(value) / 10_000_000).toFixed(2)
	}

	// --- Deposit Mutation ---
	const depositMutation = useMutation({
		mutationFn: async () => {
			if (!address) throw new Error("Wallet not connected")
			const amountStroops = BigInt(
				Math.round(parseFloat(depositAmount) * 10_000_000),
			)
			if (amountStroops <= 0n) throw new Error("Amount must be positive")

			setTxStatus("signing")

			// Build and simulate the transaction
			let tx
			try {
				tx = await poolClient.deposit({
					lp: address,
					amount: amountStroops,
				})
			} catch (err: any) {
				throw new Error(`Simulation failed: ${err.message || "Unknown error"}`)
			}

			// If the simulation object has an error property, we shouldn't attempt to sign/send
			if (tx.simulation && "error" in tx.simulation && tx.simulation.error) {
				throw new Error(`Transaction simulation failed: ${tx.simulation.error}`)
			}

			// Submit the signed transaction utilizing the client's built-in signAndSend
			await tx.signAndSend({
				signTransaction: async (xdr) => {
					setTxStatus("signing")
					const result = await wallet.signTransaction(xdr, {
						networkPassphrase,
						address,
					})
					setTxStatus("submitting")
					return result.signedTxXdr
				},
			})

			setTxStatus("success")
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["totalLiquidity"] })
			void queryClient.invalidateQueries({ queryKey: ["myBalance"] })
			setDepositAmount("")
			setTimeout(() => {
				setIsDepositModalOpen(false)
				setTxStatus("idle")
			}, 2000)
		},
		onError: (err: Error) => {
			setTxStatus("error")
			setTxError(err.message)
		},
	})

	// --- Withdraw Mutation ---
	const withdrawMutation = useMutation({
		mutationFn: async () => {
			if (!address) throw new Error("Wallet not connected")
			const amountStroops = BigInt(
				Math.round(parseFloat(withdrawAmount) * 10_000_000),
			)
			if (amountStroops <= 0n) throw new Error("Amount must be positive")

			setTxStatus("signing")

			let tx
			try {
				tx = await poolClient.withdraw({
					lp: address,
					amount: amountStroops,
				})
			} catch (err: any) {
				throw new Error(`Simulation failed: ${err.message || "Unknown error"}`)
			}

			if (tx.simulation && "error" in tx.simulation && tx.simulation.error) {
				throw new Error(`Transaction simulation failed: ${tx.simulation.error}`)
			}

			await tx.signAndSend({
				signTransaction: async (xdr) => {
					setTxStatus("signing")
					const result = await wallet.signTransaction(xdr, {
						networkPassphrase,
						address,
					})
					setTxStatus("submitting")
					return result.signedTxXdr
				},
			})

			setTxStatus("success")
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["totalLiquidity"] })
			void queryClient.invalidateQueries({ queryKey: ["myBalance"] })
			setWithdrawAmount("")
			setTimeout(() => {
				setIsWithdrawModalOpen(false)
				setTxStatus("idle")
			}, 2000)
		},
		onError: (err: Error) => {
			setTxStatus("error")
			setTxError(err.message)
		},
	})

	const marketShare =
		totalLiquidity && myBalance && totalLiquidity > 0n
			? ((Number(myBalance) / Number(totalLiquidity)) * 100).toFixed(1)
			: "0"

	return (
		<div className={styles.container}>
			{/* Sidebar */}
			<nav className={styles.sidebar}>
				<div className={styles.logo}>
					<div className={styles.logoSquare} />
					<span>PROVA</span>
				</div>
				<div className={styles.menu}>
					<div
						className={`${styles.menuItem} ${activeView === "liquidity" ? styles.active : ""}`}
						onClick={() => setActiveView("liquidity")}
					>
						Liquidity Pool
					</div>
					<div
						className={`${styles.menuItem} ${activeView === "policies" ? styles.active : ""}`}
						onClick={() => setActiveView("policies")}
					>
						Policies
					</div>
					<div
						className={`${styles.menuItem} ${activeView === "claims" ? styles.active : ""}`}
						onClick={() => setActiveView("claims")}
					>
						Claims
					</div>
				</div>
				<div className={styles.sidebarBottom}>
					<WalletButton />
				</div>
			</nav>

			{/* Main Panel */}
			<main className={styles.main}>
				{/* ── LIQUIDITY VIEW ── */}
				{activeView === "liquidity" && (
					<>
						<header className={styles.header}>
							<div>
								<h1>Liquidity Pool</h1>
								<p className={styles.subheading}>
									Deposit assets to back trade credit policies and earn
									premiums.
								</p>
							</div>
							<div className={styles.headerActions}>
								<button
									className={styles.secondaryBtn}
									onClick={() => {
										setTxStatus("idle")
										setTxError("")
										setIsWithdrawModalOpen(true)
									}}
								>
									Withdraw
								</button>
								<button
									className={styles.createBtn}
									onClick={() => {
										setTxStatus("idle")
										setTxError("")
										setIsDepositModalOpen(true)
									}}
								>
									+ Add Liquidity
								</button>
							</div>
						</header>

						{/* Pool Stats */}
						<section className={styles.stats}>
							<div className={styles.statCard}>
								<span className={styles.statLabel}>Total Value Locked</span>
								<span className={styles.statValue}>
									{isLoadingTotal
										? "..."
										: `${formatStroops(totalLiquidity)} XLM`}
								</span>
							</div>
							<div className={styles.statCard}>
								<span className={styles.statLabel}>My Stake</span>
								<span className={styles.statValue}>
									{isLoadingBalance ? "..." : `${formatStroops(myBalance)} XLM`}
								</span>
							</div>
							<div className={styles.statCard}>
								<span className={styles.statLabel}>My Pool Share</span>
								<span className={styles.statValue}>{marketShare}%</span>
							</div>
						</section>

						{/* Pool Info Card */}
						<section className={styles.poolCard}>
							<div className={styles.poolCardHeader}>
								<div>
									<p className={styles.poolCardBadge}>
										LIVE ON-CHAIN · TESTNET
									</p>
									<h2 className={styles.poolCardTitle}>Prova Insurance Pool</h2>
									<p className={styles.poolCardSub}>
										Backs active trade credit policies on the Stellar Network
									</p>
								</div>
								<div className={styles.poolMeta}>
									<div className={styles.poolMetaItem}>
										<span className={styles.poolMetaLabel}>Contract</span>
										<a
											href={`https://stellar.expert/explorer/testnet/contract/${POOL_CONTRACT}`}
											target="_blank"
											rel="noreferrer"
											className={styles.poolMetaAddress}
										>
											{POOL_CONTRACT.slice(0, 8)}...{POOL_CONTRACT.slice(-8)}
										</a>
									</div>
									<div className={styles.poolMetaItem}>
										<span className={styles.poolMetaLabel}>
											Active Policies
										</span>
										<span className={styles.poolMetaValue}>
											{policyIds?.length ?? 0}
										</span>
									</div>
								</div>
							</div>

							<div className={styles.poolFeatures}>
								{[
									"Automated claim payouts on verified defaults",
									"Non-custodial — your keys, your capital",
									"Real-time TVL backed by on-chain deposits",
								].map((f) => (
									<div key={f} className={styles.poolFeatureItem}>
										<div className={styles.poolFeatureDot} />
										<span>{f}</span>
									</div>
								))}
							</div>
						</section>
					</>
				)}

				{/* ── POLICIES VIEW ── */}
				{activeView === "policies" && (
					<>
						<header className={styles.header}>
							<h1>Trade Policies</h1>
						</header>
						<section className={styles.tableSection}>
							<table className={styles.table}>
								<thead>
									<tr>
										<th>Policy ID</th>
										<th>Debtor</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{!policyIds || policyIds.length === 0 ? (
										<tr>
											<td
												colSpan={4}
												style={{
													textAlign: "center",
													padding: "32px",
													color: "hsl(var(--text-muted))",
												}}
											>
												No policies found on-chain.
											</td>
										</tr>
									) : (
										policyIds.map((id: any, i: number) => (
											<tr key={i}>
												<td>
													{Array.from(id as Uint8Array)
														.slice(0, 4)
														.map((b: number) => b.toString(16).padStart(2, "0"))
														.join("")}
													...
												</td>
												<td>—</td>
												<td>
													<span
														className={`${styles.statusBadge} ${styles.active}`}
													>
														Active
													</span>
												</td>
												<td>
													<button className={styles.actionBtn}>Manage</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</section>
					</>
				)}

				{/* ── CLAIMS VIEW ── */}
				{activeView === "claims" && (
					<>
						<header className={styles.header}>
							<h1>Claims</h1>
						</header>
						<div className={styles.emptyState}>
							<p>
								No active claims. Claims are triggered automatically when a
								policy defaults.
							</p>
						</div>
					</>
				)}
			</main>

			{/* ── DEPOSIT MODAL ── */}
			{isDepositModalOpen && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<h2>Add Liquidity</h2>
						<p>
							Deposit XLM into the Prova Insurance Pool to earn premiums from
							active trade policies.
						</p>

						<label className={styles.modalLabel}>Amount (XLM)</label>
						<input
							type="number"
							min="1"
							value={depositAmount}
							onChange={(e) => setDepositAmount(e.target.value)}
							placeholder="e.g. 1000"
							className={styles.modalInput}
							disabled={txStatus !== "idle"}
						/>

						{txStatus === "error" && (
							<p className={styles.errorMsg}>{txError}</p>
						)}
						{txStatus === "success" && (
							<p className={styles.successMsg}>
								✅ Deposit confirmed on-chain!
							</p>
						)}

						<div className={styles.modalActions}>
							<button
								onClick={() => {
									setIsDepositModalOpen(false)
									setTxStatus("idle")
								}}
								className={styles.cancelBtn}
								disabled={txStatus === "signing" || txStatus === "submitting"}
							>
								Cancel
							</button>
							<button
								onClick={() => depositMutation.mutate()}
								disabled={!depositAmount || txStatus !== "idle"}
								className={styles.modalBtn}
							>
								{txStatus === "signing" && "🔐 Sign in Wallet..."}
								{txStatus === "submitting" && "📡 Submitting to Testnet..."}
								{txStatus === "idle" && "Confirm Deposit"}
								{txStatus === "success" && "✅ Done"}
								{txStatus === "error" && "Confirm Deposit"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── WITHDRAW MODAL ── */}
			{isWithdrawModalOpen && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<h2>Withdraw Liquidity</h2>
						<p>
							Your current stake:{" "}
							<strong>{formatStroops(myBalance)} XLM</strong>
						</p>

						<label className={styles.modalLabel}>
							Amount to Withdraw (XLM)
						</label>
						<input
							type="number"
							min="1"
							value={withdrawAmount}
							onChange={(e) => setWithdrawAmount(e.target.value)}
							placeholder="e.g. 500"
							className={styles.modalInput}
							disabled={txStatus !== "idle"}
						/>

						{txStatus === "error" && (
							<p className={styles.errorMsg}>{txError}</p>
						)}
						{txStatus === "success" && (
							<p className={styles.successMsg}>
								✅ Withdrawal confirmed on-chain!
							</p>
						)}

						<div className={styles.modalActions}>
							<button
								onClick={() => {
									setIsWithdrawModalOpen(false)
									setTxStatus("idle")
								}}
								className={styles.cancelBtn}
								disabled={txStatus === "signing" || txStatus === "submitting"}
							>
								Cancel
							</button>
							<button
								onClick={() => withdrawMutation.mutate()}
								disabled={!withdrawAmount || txStatus !== "idle"}
								className={styles.modalBtn}
							>
								{txStatus === "signing" && "🔐 Sign in Wallet..."}
								{txStatus === "submitting" && "📡 Submitting to Testnet..."}
								{txStatus === "idle" && "Confirm Withdrawal"}
								{txStatus === "success" && "✅ Done"}
								{txStatus === "error" && "Confirm Withdrawal"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Dashboard
