import React from "react"
import styles from "./FeatureGrid.module.css"

const features = [
	{
		title: "Zero-Knowledge Proofs",
		description:
			"Verify creditworthiness and claims without revealing sensitive financial underlying data.",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				<path d="M9 12l2 2 4-4" />
			</svg>
		),
	},
	{
		title: "Stellar Soroban Power",
		description:
			"Built on Protocol 25 native ZK host functions for high-speed, low-cost verification.",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		),
	},
	{
		title: "Privacy Preserved",
		description:
			"Protect your trade secrets. No one can see your exact credit limits or portfolio size on-chain.",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0110 0v4" />
			</svg>
		),
	},
]

export const FeatureGrid: React.FC = () => {
	return (
		<section id="features" className={styles.container}>
			<h2 className={styles.sectionTitle}>Institutional Grade Privacy.</h2>
			<div className={styles.grid}>
				{features.map((feature, i) => (
					<div key={i} className={styles.card}>
						<div className={styles.iconWrapper}>{feature.icon}</div>
						<h3 className={styles.cardTitle}>{feature.title}</h3>
						<p className={styles.cardDescription}>{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	)
}
