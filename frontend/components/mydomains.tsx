import { useContext, useEffect, useState } from "react";
import { Domain, UpdateDomainState } from "../types/types";
import { appContext } from "../utils/context";
import { dateHasPassed, getOwnedDomains } from "../utils/functions";
import styles from "../styles/mydomains.module.css";
import UpdateDomain from "./updatedomain";

interface MyDomainsProps {}

const MyDomains: React.FC<MyDomainsProps> = () => {
	const [updateDomain, setUpdateDomain] = useState<UpdateDomainState>({
		enabled: false,
	});
	const [ownedDomains, setOwnedDomains] = useState<Domain[]>();

	const context = useContext(appContext);

	async function updateOwnedDomains() {
		setOwnedDomains(
			await getOwnedDomains(
				context?.data.contract!,
				context?.data.address
			)
		);
	}

	useEffect(() => {
		updateOwnedDomains();
	}, []);

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
			return (
				<UpdateDomain
					domain={updateDomain.domain!}
					setUpdateDomainState={(state: UpdateDomainState) => {
						setUpdateDomain({ ...updateDomain, ...state });
					}}
					updateOwnedDomains={updateOwnedDomains}
				></UpdateDomain>
			);
		}
		return (
			<div className={styles.content}>
				<div className={styles.gallery}>
					{ownedDomains?.length === 0
						? "No domains owned"
						: ownedDomains?.map((domain: Domain, index: number) => {
								if (dateHasPassed(domain.leaseEndTime)) {
									return <div key={index}></div>;
								}
								return (
									<div
										className={styles.galleryitem}
										key={index}
										dangerouslySetInnerHTML={{
											__html: parseImageString(
												domain.image!
											).outerHTML,
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
				</div>
				<div>
					Click a domain to modify stored data and see other details
				</div>
			</div>
		);
	};

	return getContent();
};

export default MyDomains;
