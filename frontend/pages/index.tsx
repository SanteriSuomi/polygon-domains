import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/index.module.css";
import logo from "../public/images/polygon_logo.svg";
import animation from "../public/images/polygon_rotating.gif";
import loading from "../public/images/loading.gif";

interface HomeState {
	account: any;
	connectText: string;
}

const Home: NextPage = () => {
	const [data, setData] = useState<HomeState>({
		account: undefined,
		connectText: "No wallet found",
	});
	const [connecting, setConnecting] = useState(false);

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
			console.log("No MetaMask found");
			return;
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });

		if (accounts.length !== 0) {
			console.log("Authorized account found");
			setData({
				...data,
				account: accounts[0],
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
				<div className={styles.walletconnected}>
					Wallet connected! Hooray!
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
