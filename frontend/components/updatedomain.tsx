import { useContext, useState } from "react";
import styles from "../styles/updatedomain.module.css";
import { Domain, UpdateDomainState } from "../types/types";
import { appContext } from "../utils/context";
import { updateDomainData } from "../utils/functions";

interface UpdateDomainProp {
	domain: Domain;
	setUpdateDomainState: (state: UpdateDomainState) => void;
	updateOwnedDomains: () => Promise<void>;
}

const UpdateDomain: React.FC<UpdateDomainProp> = ({
	domain,
	setUpdateDomainState,
	updateOwnedDomains,
}) => {
	const [domainData, setDomainData] = useState(domain.data);
	const [newDomainData, setNewDomainData] = useState("");

	const context = useContext(appContext);

	const modifyDomainData = async () => {
		await updateDomainData(
			context?.data.contract!,
			domain.name,
			newDomainData,
			context?.activatePopup
		);
		await updateOwnedDomains();
		setDomainData(newDomainData);
	};

	return (
		<div className={styles.modifycontent}>
			<div className={styles.details}>
				<div className={styles.modifytext}>
					<div>
						Modify Domain{" "}
						<span className={styles.modifydomainname}>
							{domain.name}
						</span>
					</div>
					<div
						className={styles.modifyexit}
						onClick={() => {
							setUpdateDomainState({
								enabled: false,
							});
						}}
					>
						X
					</div>
				</div>
				<div className={styles.domaindatatext}>
					Current Data{" "}
					<span className={styles.modifydomainname}>
						{domainData}
					</span>
				</div>
			</div>
			<input
				className={styles.newdomaindata}
				placeholder="new domain data"
				onChange={(event) => {
					setNewDomainData(event.currentTarget.value);
				}}
			></input>
			<button className={styles.submitdata} onClick={modifyDomainData}>
				Submit
			</button>
		</div>
	);
};

export default UpdateDomain;
