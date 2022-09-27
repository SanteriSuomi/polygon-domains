import Image from "next/image";

import styles from "../styles/header.module.css";
import logo from "../public/images/polygon_logo.svg";
import { Data } from "../pages";
import { Fragment } from "react";

interface HeaderProps {
	data: Data;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
	const accountLength = data.address?.length ?? 5;
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
			{data.signer ? (
				<div
					className={styles.headerdisconnect}
				>{`${data.address?.slice(0, 5)}...${data.address?.slice(
					accountLength - 5,
					accountLength
				)}`}</div>
			) : (
				<Fragment></Fragment>
			)}
		</div>
	);
};

export default Header;
