import { ethers, BigNumber } from "ethers";
import React, { Fragment } from "react";

import styles from "../styles/mint.module.css";

interface MintProps {
	setDomainPrice: (price: string) => void;
	getDomainPrice: (domain: string) => Promise<BigNumber>;
	setDomainName: (name: string) => void;
	setDomainData: (data: string) => void;
	mintDomain: () => void;
	domainPrice: string;
}

const Mint: React.FC<MintProps> = ({
	setDomainPrice,
	getDomainPrice,
	setDomainName,
	setDomainData,
	mintDomain,
	domainPrice,
}) => {
	const onDomainInputChanged = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.currentTarget.value;
		if (!value) {
			setDomainPrice("");
			return;
		}
		setDomainPrice((await getDomainPrice(value)).toString());
		setDomainName(value);
	};

	return (
		<div className={styles.walletconnectedcontent}>
			<p className={styles.minttitle}>Mint a Domain</p>
			<div className={styles.mintform}>
				<div className={styles.mintdomaininputwrapper}>
					<input
						className={styles.mintdomaininput}
						placeholder="domain name"
						onChange={onDomainInputChanged}
					></input>
					<div className={styles.mintdomaintld}>.matic</div>
					<div className={styles.mintdomainprice}>
						{domainPrice.length > 0 ? (
							`${ethers.utils.formatEther(domainPrice)} matic`
						) : (
							<Fragment></Fragment>
						)}
					</div>
				</div>
				<input
					className={styles.mintdatainput}
					placeholder="domain data (optional)"
					onChange={(event) => {
						setDomainData(event.currentTarget.value);
					}}
				></input>
				<button className={styles.mintsubmit} onClick={mintDomain}>
					Mint
				</button>
			</div>
		</div>
	);
};

export default Mint;
