import { useState } from "react";

import styles from "../styles/walletconnected.module.css";
import Mint from "./mint";
import MyDomains from "./mydomains";

interface WalletConnectedProps {}

enum ContentState {
	Mint,
	MyDomains,
}

const WalletConnected: React.FC<WalletConnectedProps> = () => {
	const [contentState, setContentState] = useState({
		state: ContentState.Mint,
		mintButton: { backgroundColor: "#290666" },
		myDomainsButton: { backgroundColor: "#8247e5" },
	});

	const getContent = () => {
		if (contentState.state === ContentState.Mint) {
			return (
				<>
					<p className={styles.contenttitle}>Mint a Domain</p>
					<Mint></Mint>
				</>
			);
		} else {
			return (
				<>
					<p className={styles.contenttitle}>My Domains</p>
					<MyDomains></MyDomains>
				</>
			);
		}
	};

	const switchState = (state: ContentState) => {
		if (state === ContentState.Mint) {
			setContentState({
				state: state,
				mintButton: { backgroundColor: "#290666" },
				myDomainsButton: { backgroundColor: "#8247e5" },
			});
		} else {
			setContentState({
				state: state,
				mintButton: { backgroundColor: "#8247e5" },
				myDomainsButton: { backgroundColor: "#290666" },
			});
		}
	};

	return (
		<>
			<div className={styles.statebuttonswrapper}>
				<button
					className={styles.statebuttons}
					style={contentState.mintButton}
					onClick={() => {
						switchState(ContentState.Mint);
					}}
				>
					Mint
				</button>
				<button
					className={styles.statebuttons}
					style={contentState.myDomainsButton}
					onClick={() => {
						switchState(ContentState.MyDomains);
					}}
				>
					My Domains
				</button>
			</div>
			<div className={styles.walletconnectedcontent}>{getContent()}</div>
		</>
	);
};

export default WalletConnected;
