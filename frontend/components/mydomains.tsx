import { useContext, useEffect, useState } from "react";
import { Domain } from "../types/types";
import styles from "../styles/mydomains.module.css";
import { appContext } from "../utils/context";
import { getOwnedDomains } from "../utils/functions";

interface MyDomainsProps {}

const MyDomains: React.FC<MyDomainsProps> = () => {
	const [ownedDomains, setOwnedDomains] = useState<Domain[]>();

	const context = useContext(appContext);

	const parseImageString = (image: string): SVGElement => {
		const el = new DOMParser().parseFromString(image, "image/svg+xml");
		const svg = el.firstElementChild as SVGElement;
		svg.setAttribute("viewBox", "0 0 250 250");
		svg.removeAttribute("width");
		svg.removeAttribute("height");
		return svg;
	};

	useEffect(() => {
		async function updateOwnedDomains() {
			setOwnedDomains(
				await getOwnedDomains(
					context?.data.contract!,
					context?.data.address
				)
			);
		}
		updateOwnedDomains();
	}, []);

	return (
		<div className={styles.gallery}>
			{ownedDomains?.map((domain: Domain, index: number) => {
				return (
					<div
						className={styles.galleryItem}
						key={index}
						dangerouslySetInnerHTML={{
							__html: parseImageString(domain.image!).outerHTML,
						}}
					></div>
				);
			})}
		</div>
	);
};

export default MyDomains;
