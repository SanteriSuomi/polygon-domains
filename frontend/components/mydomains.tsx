import { useContext, useEffect, useState } from "react";
import { Domain, UpdateDomainState } from "../types/types";
import { appContext } from "../utils/context";
import { getOwnedDomains } from "../utils/functions";
import styles from "../styles/mydomains.module.css";

interface MyDomainsProps {}

const MyDomains: React.FC<MyDomainsProps> = () => {
	const [updateDomain, setUpdateDomain] = useState<UpdateDomainState>({
		enabled: false,
	});
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

	const getContent = () => {
		if (updateDomain?.enabled) {
			return <div></div>;
		}
		return (
			<>
				{ownedDomains?.map((domain: Domain, index: number) => {
					return (
						<div
							className={styles.galleryItem}
							key={index}
							dangerouslySetInnerHTML={{
								__html: parseImageString(domain.image!)
									.outerHTML,
							}}
							onClick={() => {
								setUpdateDomain({
									enabled: !updateDomain?.enabled,
									domain: domain,
								});
							}}
						></div>
					);
				})}
				<div>Click to modify domain data</div>
			</>
		);
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

	return <div className={styles.gallery}>{getContent()}</div>;
};

export default MyDomains;
