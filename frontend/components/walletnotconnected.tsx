import Image from "next/image";

import animation from "../public/images/polygon_rotating.gif";
import styles from "../styles/walletnotconnected.module.css";
import loading from "../public/images/loading.gif";
import { Data } from "../pages";

interface WalletNotConnectedProps {
	connectWallet: () => void;
	connecting: boolean;
	data: Data;
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({
	connectWallet,
	connecting,
	data,
}) => {
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
						{data.connectText}
					</div>
				)}
			</div>
		</div>
	);
};

export default WalletNotConnected;
