import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useWallet } from "../hooks/useWallet"
import { wallet } from "../util/wallet"
import styles from "./WalletButton.module.css"

export const WalletButton: React.FC = () => {
	const { address, setAddress } = useWallet()
	const [isConnecting, setIsConnecting] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	// Redirect to dashboard if connected and on landing page
	useEffect(() => {
		if (address && location.pathname === "/") {
			void navigate("/dashboard")
		}
	}, [address, location.pathname, navigate])

	const connect = async () => {
		try {
			setIsConnecting(true)
			const { address } = await wallet.authModal()
			setAddress(address)
			// Explicitly navigate after successful connection
			void navigate("/dashboard")
		} catch (error) {
			console.error("Connection failed", error)
		} finally {
			setIsConnecting(false)
		}
	}

	const disconnect = () => {
		setAddress(undefined)
		void navigate("/")
	}

	if (address) {
		return (
			<div className={styles.connectedContainer}>
				<div className={styles.addressDisplay}>
					{address.slice(0, 4)}...{address.slice(-4)}
				</div>
				<button onClick={disconnect} className={styles.disconnectBtn}>
					Disconnect
				</button>
			</div>
		)
	}

	return (
		<button
			onClick={connect}
			className={styles.connectBtn}
			disabled={isConnecting}
		>
			{isConnecting ? "Connecting..." : "Connect Wallet"}
		</button>
	)
}
