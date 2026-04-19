import React, { useState } from "react"
import styles from "./RoleSelector.module.css"

const ROLES = [
	{
		id: "merchants",
		category: "Exporters",
		title: "Trade Credit Coverage",
		summary: "Insure your invoices against buyer default instantly on-chain.",
		details:
			"Create a ZK-protected trade invoice policy. Your buyer deposits USDC into escrow — if conditions are met, funds release automatically or your coverage triggers a verified payout.",
		points: [
			"ZK-protected credit evaluation",
			"USDC Direct Settlement",
			"Automated claim payouts",
		],
	},
	{
		id: "underwriters",
		category: "Underwriters",
		title: "Risk Policy Management",
		summary:
			"Deploy custom risk books and earn premiums from verified trade assets.",
		details:
			"Deploy an underwriting policy with custom risk parameters. The ZK computation evaluates encrypted exporter credit metrics and returns risk scores without ever exposing plaintext data.",
		points: [
			"Programmable on-chain risk books",
			"Encrypted lead generation",
			"Premium spread income",
		],
	},
	{
		id: "lps",
		category: "Liquidity Providers",
		title: "Insurance Pool Staking",
		summary:
			"Deposit USDC to back real-world trade and earn institutional yield.",
		details:
			"Back active trade credit policies with USDC. Your capital earns yield from the global premium flow, diversified across verified trade finance assets on the Stellar network.",
		points: [
			"Institutional trade finance yield",
			"Native USDC settlement",
			"Audited reserve architecture",
		],
	},
]

export const RoleSelector: React.FC = () => {
	const [activeId, setActiveId] = useState("merchants")
	const activeRole = ROLES.find((r) => r.id === activeId)!

	return (
		<section id="roles" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.sidebar}>
					<p className={styles.badge}>Participation</p>
					<h2 className={styles.title}>
						Pick your role.
						<br />
						Control the risk.
					</h2>
					<div className={styles.btnList}>
						{ROLES.map((role) => (
							<button
								key={role.id}
								onClick={() => setActiveId(role.id)}
								className={`${styles.roleBtn} ${activeId === role.id ? styles.activeBtn : ""}`}
							>
								<span className={styles.btnCategory}>{role.category}</span>
								<span className={styles.btnTitle}>{role.title}</span>
							</button>
						))}
					</div>
				</div>

				<div className={styles.display}>
					<div className={styles.content}>
						<p className={styles.contentCategory}>{activeRole.category}</p>
						<h3 className={styles.contentTitle}>{activeRole.title}</h3>
						<p className={styles.contentSummary}>{activeRole.summary}</p>
						<p className={styles.contentDetails}>{activeRole.details}</p>

						<ul className={styles.pointList}>
							{activeRole.points.map((pt) => (
								<li key={pt} className={styles.point}>
									<div className={styles.square} />
									<span>{pt}</span>
								</li>
							))}
						</ul>

						<button className={styles.ctaBtn}>
							Start as {activeRole.category}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
