import { useEffect, useRef, useState } from "react";
import styles from "../styles/popup.module.css";

interface PopupProps {
	popupActivateRef: any;
}

const Popup: React.FC<PopupProps> = ({ popupActivateRef }) => {
	const [popupText, setPopupText] = useState("Error: no text");

	const popupRef = useRef<HTMLDivElement>(null);

	function activatePopup(text: string) {
		setPopupText(text);
		popupRef.current!.animate(
			[
				{ top: "105%" },
				{ top: "95%", offset: 0.1 },
				{ top: "95%", offset: 0.9 },
				{ top: "105%" },
			],
			{
				duration: 4000,
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
