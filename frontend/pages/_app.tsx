import { NextPage } from "next";
import "../styles/global.css";

const App: NextPage<any> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default App;
