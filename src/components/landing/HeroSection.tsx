import React from "react"
import styles from "./HeroSection.module.css"

export const HeroSection: React.FC = () => {
	return (
		<section className={styles.hero}>
			<div className={styles.glow} />

			<div className={styles.content}>
				<div className={styles.badge}>
					<div className={styles.badgeDot} />
					<span>Trade. Protected.</span>
				</div>

				<h1 className={styles.title}>
					<span className={styles.block}>Protect your invoices.</span>
					<span className={styles.gradient}>Skip the fine print.</span>
				</h1>

				<p className={styles.description}>
					On-chain trade credit insurance for SME. No minimum portfolio. No data
					exposure. Instant underwriting via Soroban ZK primitives.
				</p>

				<div className={styles.ctaGroup}>
					<button className={styles.primaryCta}>Get started</button>
					<button className={styles.secondaryCta}>
						How it works
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			<div className={styles.scrollIndicator}>
				<span>Scroll</span>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M12 5v14M5 12l7 7 7-7" />
				</svg>
			</div>
		</section>
	)
}
