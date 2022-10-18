import { BigNumber, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

import styles from "../styles/mint.module.css";
import { getDomainPrice, mintDomain } from "../utils/functions";
import { appContext } from "../utils/context";

interface MintProps {}

const Mint: React.FC<MintProps> = () => {
	const [domainPrice, setDomainPrice] = useState("");
	const [domainData, setDomainData] = useState("");
	const [domainName, setDomainName] = useState("");
	const [maxDomainLength, setMaxDomainLength] = useState(0);

	const context = useContext(appContext);

	const onDomainInputChanged = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.currentTarget.value;
		if (value.length > maxDomainLength) {
			return context?.activatePopup(
				"Max domain length is " + maxDomainLength
			);
		}
		if (!value) {
			setDomainPrice("");
			return;
		}
		setDomainPrice(
			(await getDomainPrice(context?.data.contract!, value)).toString()
		);
		setDomainName(value);
	};

	useEffect(() => {
		const updateMaxDomainLength = async () => {
			const maxLength: BigNumber =
				await context?.data.contract?.maxDomainLength();
			if (maxLength) {
				setMaxDomainLength(maxLength.toNumber());
			}
		};
		updateMaxDomainLength();
	}, []);

	return (
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
						<></>
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
			<button
				className={styles.mintsubmit}
				onClick={async () => {
					await mintDomain(
						context?.data.contract!,
						domainName,
						domainData,
						domainPrice,
						context?.activatePopup
					);
				}}
			>
				Mint
			</button>
		</div>
	);
};

export default Mint;
