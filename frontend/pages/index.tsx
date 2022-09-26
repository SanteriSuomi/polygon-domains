import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { ethers, BigNumber, Contract } from "ethers";

import styles from "../styles/index.module.css";
import contractJson from "../public/abi/Domains.json";
import Header from "../components/header";
import WalletNotConnected from "../components/walletnotconnected";
import Mint from "../components/mint";

interface Data {
	account?: string;
	connectText: string;
	contract?: Contract;
	signer?: ethers.providers.JsonRpcSigner;
}

const CONTRACT_ADDRESS = "0xDD07A3dDA0664804A81Ce8b2D38E6157c477Ed5a";

const Home: NextPage = () => {
	const [data, setData] = useState<Data>({
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

	const createObjects = (ethereum: any) => {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		return {
			contract: new ethers.Contract(
				CONTRACT_ADDRESS,
				contractJson.abi,
				signer
			),
			signer: signer,
		};
	};

	const connectWallet = async () => {
		const { ethereum } = window as any;
		try {
			setConnecting(true);
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			setConnecting(false);
			const objects = createObjects(ethereum);
			setData({
				...data,
				account: accounts[0],
				contract: objects.contract,
				signer: objects.signer,
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
			const objects = createObjects(ethereum);
			setData({
				...data,
				account: accounts[0],
				contract: objects.contract,
				signer: objects.signer,
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
				<Header data={data}></Header>
				<div className={styles.content}>
					{data.account ? (
						<Mint
							setDomainPrice={setDomainPrice}
							getDomainPrice={getDomainPrice}
							setDomainName={setDomainName}
							setDomainData={setDomainData}
							mintDomain={mintDomain}
							domainPrice={domainPrice}
						></Mint>
					) : (
						<WalletNotConnected
							connectWallet={connectWallet}
							connecting={connecting}
							data={data}
						></WalletNotConnected>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
export type { Data };
