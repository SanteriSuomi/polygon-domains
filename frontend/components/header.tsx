import Image from "next/image";

import styles from "../styles/header.module.css";
import logo from "../public/images/polygon_logo.svg";
import { useContext } from "react";
import { appContext } from "../utils/context";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
	const context = useContext(appContext);

	const accountLength = context?.data.address?.length ?? 5;
	const address = context?.data.address;
	return (
		<div className={styles.header}>
			<div className={styles.headertext}>
				<Image
					src={logo}
					width={100}
					height={100}
					alt="Polygon Logo"
				></Image>
				<p>Polygon Domains</p>
			</div>
			{context?.data.signer ? (
				<div className={styles.headerdisconnect}>{`${address?.slice(
					0,
					5
				)}...${address?.slice(accountLength - 5, accountLength)}`}</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Header;
