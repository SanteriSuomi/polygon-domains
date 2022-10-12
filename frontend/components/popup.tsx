import { useEffect, useRef, useState } from "react";
import styles from "../styles/popup.module.css";
import {
	BASE_POPUP_PERCENTAGE,
	POPUP_TOTAL_DURATION,
} from "../utils/constants";

interface PopupProps {
	popupActivateRef: any;
}

const Popup: React.FC<PopupProps> = ({ popupActivateRef }) => {
	const [popupText, setPopupText] = useState("");

	const popupRef = useRef<HTMLDivElement>(null);

	function activatePopup(text: string) {
		if (!popupRef.current) {
			console.warn("activatePopup: popupRef is undefined");
			return;
		}
		setPopupText(text);
	}

	useEffect(() => {
		popupActivateRef.current = activatePopup;
	}, []);

	useEffect(() => {
		if (popupText.length === 0 || !popupRef.current) return;
		const popupHeight = popupRef.current.clientHeight;
		const basePopupPos = window.innerHeight * BASE_POPUP_PERCENTAGE;
		const popupPos = (basePopupPos - popupHeight).toFixed(0);
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
	}, [popupText]);

	return (
		<div ref={popupRef} className={styles.popup}>
			{popupText}
		</div>
	);
};

export default Popup;
