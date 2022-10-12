import Image from "next/image";

import styles from "../styles/loading.module.css";
import loading from "../public/images/loading.gif";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
	return (
		<div className={styles.loadingwrapper}>
			<Image src={loading} width={75} height={75} alt="Loading"></Image>
		</div>
	);
};

export default Loading;
