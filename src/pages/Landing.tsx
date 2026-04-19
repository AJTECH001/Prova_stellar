import React from "react"
import { FAQ } from "../components/landing/FAQ"
import { FeatureGrid } from "../components/landing/FeatureGrid"
import { HeroSection } from "../components/landing/HeroSection"
import { PrivacyShowcase } from "../components/landing/PrivacyShowcase"
import { RoleSelector } from "../components/landing/RoleSelector"
import { WalletButton } from "../components/WalletButton"
import styles from "./Landing.module.css"

const Landing: React.FC = () => {
	return (
		<div className={styles.page}>
			<nav className={styles.nav}>
				<div className={styles.navContent}>
					<div className={styles.logo}>
						<div className={styles.logoSquare} />
						<span>PROVA</span>
					</div>
					<div className={styles.navLinks}>
						<a href="#features" className={styles.navLink}>
							Features
						</a>
						<a href="#privacy" className={styles.navLink}>
							Privacy
						</a>
						<a href="#roles" className={styles.navLink}>
							Roles
						</a>
						<a href="#faq" className={styles.navLink}>
							FAQ
						</a>
						<WalletButton />
					</div>
				</div>
			</nav>

			<main>
				<HeroSection />
				<FeatureGrid />
				<PrivacyShowcase />
				<RoleSelector />
				<FAQ />
			</main>

			<footer className={styles.footer}>
				<div className={styles.footerContent}>
					<div className={styles.footerBrand}>
						<div className={styles.logo}>
							<div className={styles.logoSquare} />
							<span>PROVA</span>
						</div>
						<p className={styles.footerTagline}>
							The next generation of trade credit insurance on Stellar.
						</p>
					</div>
					<div className={styles.footerLinks}>
						<div className={styles.linkGroup}>
							<h4>Protocol</h4>
							<a href="#">Whitepaper</a>
							<a href="#">Security Audit</a>
							<a href="#">Docs</a>
						</div>
						<div className={styles.linkGroup}>
							<h4>Ecosystem</h4>
							<a href="https://stellar.org" target="_blank" rel="noreferrer">
								Stellar
							</a>
							<a
								href="https://soroban.stellar.org"
								target="_blank"
								rel="noreferrer"
							>
								Soroban
							</a>
						</div>
						<div className={styles.linkGroup}>
							<h4>Community</h4>
							<a href="#">Discord</a>
							<a href="#">Twitter</a>
						</div>
					</div>
				</div>
				<div className={styles.footerBottom}>
					© 2026 Prova Protocol. Built on Stellar for Global Trade.
				</div>
			</footer>
		</div>
	)
}

export default Landing
