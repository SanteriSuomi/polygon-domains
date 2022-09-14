import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import logo from "../public/images/polygon_logo.svg";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
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
	);
};

export default Home;
