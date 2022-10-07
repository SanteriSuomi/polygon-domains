import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";

import styles from "../styles/index.module.css";
import Header from "../components/header";
import WalletNotConnected from "../components/walletnotconnected";
import WalletConnected from "../components/walletconnected";
import { Data, ActivatePopupFunc, Objects } from "../types/types";
import Popup from "../components/popup";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID } from "../utils/constants";
import contractJson from "../public/abi/Domains.json";
import { appContext } from "../utils/context";

const Home: NextPage = () => {
	const [data, setData] = useState<Data>({
		connectButton: { enabled: true, connectText: "No wallet found" },
	});
	const [connecting, setConnecting] = useState(false);

	const activatePopup = (text?: string) => {
		popupActivateRef.current?.(text);
	};

	const popupActivateRef = useRef<ActivatePopupFunc>(null);

	const createObjects = (ethereum: any): Objects => {
		const provider = new ethers.providers.Web3Provider(ethereum, "any");
		const signer = provider.getSigner();
		return {
			contract: new ethers.Contract(
				CONTRACT_ADDRESS,
				contractJson.abi,
				signer
			),
			signer: signer,
			provider: provider,
		};
	};

	const connectWallet = async () => {
		if (data.connectButton?.enabled === false) {
			return;
		}
		const { ethereum } = window as any;
		try {
			setConnecting(true);
			await ethereum.request({
				method: "eth_requestAccounts",
			});
			setConnecting(false);
			const objects = createObjects(ethereum);
			setData({
				...data,
				contract: objects.contract,
				signer: objects.signer,
				address: await objects.signer.getAddress(),
			});
		} catch (error: any) {
			setConnecting(false);
			activatePopup(error.message);
		}
	};

	const checkWalletConnection = async (ethereum: any, objects: Objects) => {
		const accounts = await ethereum.request({ method: "eth_accounts" });
		const { chainId } = await objects.provider.getNetwork();
		if (chainId === CHAIN_ID) {
			if (accounts.length !== 0) {
				console.log("Authorized account found");
				setData({
					...data,
					contract: objects.contract,
					signer: objects.signer,
					address: await objects.signer.getAddress(),
				});
			} else {
				console.log("No authorized accounts found");
				setData({
					...data,
					connectButton: {
						enabled: true,
						connectText: "Connect",
					},
				});
			}
		} else {
			setData({
				...data,
				connectButton: {
					enabled: false,
					connectText: "Wrong network",
				},
			});
		}
	};

	const onChainChanged = (_: any, oldNetwork: any) => {
		if (oldNetwork) {
			window.location.reload();
		}
	};

	const onAccountsChanged = (accounts: string[]) => {
		if (accounts.length === 0) {
			window.location.reload();
		}
	};

	const onNewDomainRegistered = async (
		registrant: string,
		domain: string
	) => {
		console.log("Data address: ", data.address);
		const address = await data.signer?.getAddress();
		if (registrant !== address) {
			activatePopup(`New domain ${domain} registered!`);
		}
	};

	useEffect(() => {
		const { ethereum } = window as any;
		if (ethereum) {
			console.log("MetaMask found");
		} else {
			console.warn("No MetaMask found");
			return;
		}
		const objects = createObjects(ethereum);
		objects.provider.on("network", onChainChanged);
		objects.contract.on("Registered", onNewDomainRegistered);
		ethereum.on("accountsChanged", onAccountsChanged);
		checkWalletConnection(ethereum, objects);
		return () => {
			objects.provider.off("network", onChainChanged);
			objects.contract.off("Registered", onNewDomainRegistered);
		};
	}, []);

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

			<appContext.Provider
				value={{ activatePopup: activatePopup, data: data }}
			>
				<div className={styles.container}>
					<Header></Header>
					{data.signer ? (
						<WalletConnected></WalletConnected>
					) : (
						<WalletNotConnected
							connectWallet={connectWallet}
							connecting={connecting}
						></WalletNotConnected>
					)}

					<Popup popupActivateRef={popupActivateRef}></Popup>
				</div>
			</appContext.Provider>
		</>
	);
};

export default Home;
