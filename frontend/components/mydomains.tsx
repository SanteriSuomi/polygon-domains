import { useEffect } from "react";
import { Data } from "../types/types";

interface MyDomainsProps {
	getOwnedDomains: (address?: string) => void;
	data: Data;
}

const MyDomains: React.FC<MyDomainsProps> = ({ getOwnedDomains, data }) => {
	useEffect(() => {
		getOwnedDomains(data.address);
	}, []);
	return <></>;
};

export default MyDomains;
