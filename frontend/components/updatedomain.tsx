import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/updatedomain.module.css";
import { Domain, UpdateDomainState } from "../types/types";
import { appContext } from "../utils/context";
import {
	getDomainLeaseRenewCost,
	renewDomainLease,
	updateDomainData,
} from "../utils/functions";

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
	const [domainRenewCost, setDomainRenewCost] = useState("");

	const context = useContext(appContext);

	const refreshData = async (newDomainData?: string) => {
		await updateOwnedDomains();
		await updateRenewCost();
		if (newDomainData) {
			setDomainData(newDomainData);
		}
	};

	const modifyDomainData = async () => {
		const success = await updateDomainData(
			context?.data.contract!,
			domain.name,
			newDomainData,
			context?.activatePopup
		);
		if (success) {
			await refreshData(newDomainData);
		}
	};

	const renewLease = async () => {
		const success = await renewDomainLease(
			context?.data.contract!,
			domain.name,
			context?.activatePopup
		);
		if (success) {
			await refreshData();
		}
	};

	const updateRenewCost = async () => {
		const renewCost: BigNumber = await getDomainLeaseRenewCost(
			context?.data.contract!,
			domain.name
		);
		setDomainRenewCost((+ethers.utils.formatEther(renewCost)).toFixed(10));
	};

	useEffect(() => {
		updateRenewCost();
	}, []);

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
				<div className={styles.domainleasetext}>
					Lease End Time{" "}
					<span className={styles.leaseendtime}>
						{domain.leaseEndTime.toLocaleString("fi-FI")}
					</span>
				</div>
				<div className={styles.domainleaseremaintext}>
					Lease Renew Cost{" "}
					<span className={styles.leaserenewcost}>
						{domainRenewCost}
					</span>
				</div>
			</div>

			<div className={styles.separator}></div>

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

			<button className={styles.renewleasebutton} onClick={renewLease}>
				Renew Lease
			</button>
		</div>
	);
};

export default UpdateDomain;
