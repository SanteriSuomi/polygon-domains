import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { ethers, BigNumber, Contract } from "ethers";

import styles from "../styles/index.module.css";
import contractJson from "../public/abi/Domains.json";
import Header from "../components/header";
import WalletNotConnected from "../components/walletnotconnected";
import WalletConnected from "../components/walletconnected";
import { CONTRACT_ADDRESS, CHAIN_ID } from "../utils/constants";
import { Data, Domain } from "../types/types";
import Popup from "../components/popup";

const Home: NextPage = () => {
	const [data, setData] = useState<Data>({
		connectButton: { enabled: true, connectText: "No wallet found" },
	});
	const [connecting, setConnecting] = useState(false);
	const [domainName, setDomainName] = useState("");
	const [domainPrice, setDomainPrice] = useState("");
	const [domainData, setDomainData] = useState("");

	const [popup, setPopup] = useState({
		enabled: false,
		registrant: "",
		domainName: "",
	});

	const mintDomain = async () => {
		if (!domainName || domainName.length < 1) {
			alert("No domain name selected");
			return;
		}
		try {
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
		} catch (error: any) {
			alert(error.reason);
		}
	};

	const getDomainPrice = async (domainName: string): Promise<BigNumber> => {
		return data.contract?.getPrice(domainName);
	};

	const createObjects = (ethereum: any) => {
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
			alert(error.message);
		}
	};

	const checkWalletConnection = async (
		ethereum: any,
		objects: {
			contract: Contract;
			signer: ethers.providers.JsonRpcSigner;
			provider: ethers.providers.Web3Provider;
		}
	) => {
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

	const getOwnedDomains = async (address?: string): Promise<Domain[]> => {
		if (!address) {
			console.warn("getOwnedDomains: address is undefined");
			return [];
		}

		function decodeUris(domains: Domain[]) {
			const decodedDomains: Domain[] = [];
			domains.forEach((domain: Domain) => {
				const base64 = domain.uri?.split(",")[1];
				if (!base64) {
					console.warn(
						`Could not decode uri ${domain.uri} for domain ${domain.name} `
					);
					return [];
				}
				const decoded = Buffer.from(base64, "base64").toString();
				const uriObject = JSON.parse(decoded);
				const imageBase64 = uriObject.image.split(",")[1];
				const image = Buffer.from(imageBase64, "base64").toString();
				decodedDomains.push({
					data: domain.data,
					name: domain.name,
					owner: domain.owner,
					uri: domain.uri,
					image: image,
				});
			});
			return decodedDomains;
		}

		return decodeUris(await data.contract?.getOwnedDomains(address));
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

	const onNewDomainRegistered = (registrant: string, domainName: string) => {
		if (registrant !== data.address) {
			setPopup({
				enabled: true,
				registrant: registrant,
				domainName: domainName,
			});
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
		checkWalletConnection(ethereum, objects);
		objects.provider.on("network", onChainChanged);
		objects.contract.on("Registered", onNewDomainRegistered);
		ethereum.on("accountsChanged", onAccountsChanged);
		return () => {
			objects.provider.off("network", onChainChanged);
		};
	}, []);

	return (
		<>
			<button
				onClick={() => {
					setPopup({
						enabled: true,
						registrant: "test",
						domainName: "test",
					});
				}}
			>
				Popup
			</button>
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
				{data.signer ? (
					<WalletConnected
						setDomainPrice={setDomainPrice}
						getDomainPrice={getDomainPrice}
						setDomainName={setDomainName}
						setDomainData={setDomainData}
						mintDomain={mintDomain}
						getOwnedDomains={getOwnedDomains}
						domainPrice={domainPrice}
						data={data}
					></WalletConnected>
				) : (
					<WalletNotConnected
						connectWallet={connectWallet}
						connecting={connecting}
						data={data}
					></WalletNotConnected>
				)}
				{popup.enabled ? (
					<Popup
						registrant={popup.registrant}
						domainName={popup.domainName}
					></Popup>
				) : (
					""
				)}
			</div>
		</>
	);
};

export default Home;
