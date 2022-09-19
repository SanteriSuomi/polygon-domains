import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";
import { BigNumber } from "ethers/lib/ethers";

import styles from "../styles/index.module.css";
import logo from "../public/images/polygon_logo.svg";
import animation from "../public/images/polygon_rotating.gif";
import loading from "../public/images/loading.gif";

import contractJson from "../public/abi/Domains.json";

interface HomeState {
	account?: any;
	connectText: string;
	contract?: ethers.Contract;
}

const CONTRACT_ADDRESS = "0xDD07A3dDA0664804A81Ce8b2D38E6157c477Ed5a";

const Home: NextPage = () => {
	const [data, setData] = useState<HomeState>({
		connectText: "No wallet found",
	});
	const [connecting, setConnecting] = useState(false);
	const [domainName, setDomainName] = useState("");
	const [domainPrice, setDomainPrice] = useState("");
	const [domainData, setDomainData] = useState("");

	const mintDomain = async () => {
		if (!domainName || domainName.length < 1) {
			alert("No domain name selected");
			return;
		}
		const { ethereum } = window as any;
		if (ethereum) {
			const txn: ethers.ContractTransaction =
				await data.contract?.register(domainName, domainData, {
					value: domainPrice,
				});
			const receipt = await txn.wait();
			if (receipt.status === 1) {
				alert(
					"Domain minted! Transaction: https://mumbai.polygonscan.com/tx/" +
						txn.hash
				);
			} else {
				alert("Something went wrong with the transaction");
			}
		}
	};

	const getDomainPrice = async (domainName: string): Promise<BigNumber> => {
		return data.contract?.getPrice(domainName);
	};

	const createContractObject = (ethereum: any) => {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		return new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer);
	};

	const connectWallet = async () => {
		const { ethereum } = window as any;
		try {
			setConnecting(true);
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			setConnecting(false);
			setData({
				...data,
				account: accounts[0],
				contract: createContractObject(ethereum),
			});
		} catch (error: any) {
			setConnecting(false);
			alert(error.message);
		}
	};

	const checkWalletConnection = async () => {
		const { ethereum } = window as any;
		if (ethereum) {
			console.log("MetaMask found");
		} else {
			console.warn("No MetaMask found");
			return;
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });
		if (accounts.length !== 0) {
			console.log("Authorized account found");
			setData({
				...data,
				account: accounts[0],
				contract: createContractObject(ethereum),
			});
		} else {
			console.log("No authorized accounts found");
			setData({
				...data,
				connectText: "Connect",
			});
		}
	};

	useEffect(() => {
		checkWalletConnection();
	}, []);

	const renderContent = () => {
		if (data.account) {
			return (
				<div className={styles.walletconnectedcontent}>
					<p className={styles.minttitle}>Mint a Domain</p>
					<div className={styles.mintform}>
						<div className={styles.mintdomaininputwrapper}>
							<input
								className={styles.mintdomaininput}
								placeholder="domain name"
								onChange={async (event) => {
									const value = event.currentTarget.value;
									if (!value) {
										setDomainPrice("");
										return;
									}
									setDomainPrice(
										(await getDomainPrice(value)).toString()
									);
									setDomainName(value);
								}}
							></input>
							<div className={styles.mintdomaintld}>.matic</div>
							<div className={styles.mintdomainprice}>
								{domainPrice.length > 0
									? `${ethers.utils.formatEther(
											domainPrice
									  )} matic`
									: ""}
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
							onClick={mintDomain}
						>
							Mint
						</button>
					</div>
				</div>
			);
		}
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

	return (
		<>
			<Head>
				<title>Polygon Domains</title>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				></link>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				></link>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				></link>
				<link rel="manifest" href="/site.webmanifest"></link>
				<meta name="msapplication-TileColor" content="#da532c"></meta>
				<meta name="theme-color" content="#ffffff"></meta>
			</Head>

			<div className={styles.container}>
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
				</div>

				<div className={styles.content}>{renderContent()}</div>
			</div>
		</>
	);
};

export default Home;
