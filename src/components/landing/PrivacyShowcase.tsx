import React from "react"
import styles from "./PrivacyShowcase.module.css"

const FEATURES = [
	{
		title: "ZK-Encrypted Credit Evaluation",
		description:
			"Borrower credit is scored using Zero-Knowledge proofs. Underwriters evaluate proofs of solvency without ever seeing sensitive financial data.",
	},
	{
		title: "Stellar Native Privacy",
		description:
			"Built on Stellar Protocol 25. Every policy issuance and claim trigger is recorded with verifiable privacy on-chain.",
	},
	{
		title: "Institutional Grade AA",
		description:
			"Non-custodial smart accounts with multi-sig and recovery. Enter trade finance with professional security and ease.",
	},
	{
		title: "Cross-Border Settlement",
		description:
			"Direct settlement in USDC across global corridors. Jurisdiction-aware policy filters built into the protocol layer.",
	},
]

export const PrivacyShowcase: React.FC = () => {
	return (
		<section id="privacy" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.header}>
					<p className={styles.badge}>Security & Infrastructure</p>
					<h2 className={styles.title}>
						Institutional Power.
						<br />
						Zero Friction.
					</h2>
					<p className={styles.description}>
						ZK-encrypted credit evaluation and auditable on-chain settlement —
						bringing institutional-grade protection to global SME exporters.
					</p>
				</div>

				<div className={styles.grid}>
					{FEATURES.map((f) => (
						<div key={f.title} className={styles.card}>
							<div className={styles.cardHeader}>
								<div className={styles.dot} />
								<h3 className={styles.cardTitle}>{f.title}</h3>
							</div>
							<p className={styles.cardBody}>{f.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
