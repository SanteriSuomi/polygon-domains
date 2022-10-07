import { useEffect, useRef, useState } from "react";
import styles from "../styles/popup.module.css";

interface PopupProps {
	popupActivateRef: any;
}

const BASE_POPUP_PERCENTAGE = 0.975;
const POPUP_TOTAL_DURATION = 5000;

const Popup: React.FC<PopupProps> = ({ popupActivateRef }) => {
	const [popupText, setPopupText] = useState("Error: no text");

	const popupRef = useRef<HTMLDivElement>(null);

	function activatePopup(text: string) {
		if (!popupRef.current) {
			console.warn("activatePopup: popupRef is undefined");
			return;
		}
		setPopupText(text);
		const popupHeight = popupRef.current.clientHeight;
		const basePopupPos = window.innerHeight * BASE_POPUP_PERCENTAGE;
		const popupPos = (basePopupPos - popupHeight).toFixed(0);
		console.log(popupPos);
		popupRef.current.animate(
			[
				{ top: "105%" },
				{ top: `${popupPos}px`, offset: 0.1 },
				{ top: `${popupPos}px`, offset: 0.9 },
				{ top: "105%" },
			],
			{
				duration: POPUP_TOTAL_DURATION,
				easing: "linear",
				iterations: 1,
			}
		);
	}

	useEffect(() => {
		popupActivateRef.current = activatePopup;
	}, []);

	return (
		<div ref={popupRef} className={styles.popup}>
			{popupText}
		</div>
	);
};

export default Popup;
