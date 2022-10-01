import styles from "../styles/popup.module.css";

interface PopupProps {
	registrant: string;
	domainName: string;
}

const Popup: React.FC<PopupProps> = ({ registrant, domainName }) => {
	return <div className={styles.popup}>Test</div>;
};

export default Popup;
