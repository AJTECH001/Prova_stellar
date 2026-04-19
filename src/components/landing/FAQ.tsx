import React, { useState } from "react"
import styles from "./FAQ.module.css"

const FAQS = [
	{
		question: "What is Prova and who is it for?",
		answer:
			"Prova is an on-chain trade credit insurance protocol built on Stellar. It serves SME exporters who need protection against buyer default, underwriters who want programmable risk books, and liquidity providers seeking real trade yield.",
	},
	{
		question: "How does ZK-encrypted underwriting work?",
		answer:
			"We use Zero-Knowledge proofs to verify solvency and creditworthiness. Your sensitive data is never exposed on the ledger. The protocol only receives a cryptographic proof that you meet the risk criteria, which then determines your premium.",
	},
	{
		question: "What happens when a buyer defaults?",
		answer:
			"When an invoice passes its due date unpaid, a specific waiting period begins. After that, the escrow conditions trigger a claim payout from the Insurance Pool directly to your wallet — fully automated and auditable.",
	},
	{
		question: "Is Prova truly non-custodial?",
		answer:
			"Yes. Funds are held in audited smart contracts. Neither Prova nor any intermediary takes custody of your assets. You maintain full control via your Stellar-compatible wallet.",
	},
]

export const FAQ: React.FC = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	return (
		<section id="faq" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.header}>
					<p className={styles.badge}>Questions</p>
					<h2 className={styles.title}>Frequently Asked.</h2>
				</div>

				<div className={styles.list}>
					{FAQS.map((faq, i) => (
						<div key={i} className={styles.item}>
							<button
								onClick={() => setOpenIndex(openIndex === i ? null : i)}
								className={styles.questionBtn}
							>
								<span className={styles.question}>{faq.question}</span>
								<div
									className={`${styles.icon} ${openIndex === i ? styles.iconOpen : ""}`}
								>
									{openIndex === i ? "−" : "+"}
								</div>
							</button>
							<div
								className={`${styles.answerWrap} ${openIndex === i ? styles.open : ""}`}
							>
								<p className={styles.answer}>{faq.answer}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
