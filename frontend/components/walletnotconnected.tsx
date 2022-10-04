import Image from "next/image";

import animation from "../public/images/polygon_rotating.gif";
import styles from "../styles/walletnotconnected.module.css";
import loading from "../public/images/loading.gif";
import { useContext } from "react";
import { appContext } from "../utils/context";

interface WalletNotConnectedProps {
	connectWallet: () => void;
	connecting: boolean;
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({
	connectWallet,
	connecting,
}) => {
	const context = useContext(appContext);

	return (
		<div className={styles.connectelements}>
			<Image
				src={animation}
				width={275}
				height={275}
				alt="Rotating Polygon"
			></Image>
			<div className={styles.connectbutton} onClick={connectWallet}>
				{connecting ? (
					<Image
						src={loading}
						width={37.5}
						height={37.5}
						alt="Loading"
					></Image>
				) : (
					<div className={styles.connectbuttontext}>
						{context?.data.connectButton?.connectText}
					</div>
				)}
			</div>
		</div>
	);
};

export default WalletNotConnected;
