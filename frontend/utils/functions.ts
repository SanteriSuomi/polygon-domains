import { BigNumber, Contract, ContractTransaction } from "ethers";
import { Domain, DomainRaw } from "../types/types";

const mintDomain = async (contract: Contract, domainName: string, domainData: string, domainPrice: string, activatePopup?: (text: string) => void) => {
    if (!domainName || domainName.length < 1) {
        activatePopup?.("No domain name selected")
        return;
    }

    try {
        const txn: ContractTransaction =
            await contract.register(domainName, domainData, {
                value: domainPrice,
            });
        const receipt = await txn.wait();
        if (receipt.status === 1) {
            activatePopup?.("Domain minted! Transaction: https://mumbai.polygonscan.com/tx/" +
                txn.hash)
        } else {
            activatePopup?.("Something went wrong with the transaction")
        }
    } catch (error: any) {
        activatePopup?.(error.message)
    }
};

const getDomainPrice = async (contract: Contract, domainName: string): Promise<BigNumber> => {
    return contract.getPrice(domainName);
};

const getOwnedDomains = async (contract: Contract, address?: string): Promise<Domain[]> => {
    if (!address) {
        console.warn("getOwnedDomains: address is undefined");
        return [];
    }

    function decodeUris(domains: DomainRaw[]) {
        const decodedDomains: Domain[] = [];
        domains.forEach((domain: DomainRaw) => {
            const base64 = domain.uri?.split(",")[1];
            if (!base64) {
                console.warn(
                    `Could not decode uri ${domain.uri} for domain ${domain.name} `
                );
                return [];
            }
            const decoded = Buffer.from(base64, "base64").toString();
            const uriObject = JSON.parse(decoded);
            const imageBase64 = uriObject.image.split(",")[1];
            const image = Buffer.from(imageBase64, "base64").toString();
            decodedDomains.push({
                name: domain.name,
                owner: domain.owner,
                data: domain.data,
                uri: domain.uri,
                tokenId: domain.tokenId.toNumber(),
                leaseEndTime: new Date(domain.leaseEndTime.toNumber() * 1000),
                image: image,
            });
        });
        return decodedDomains;
    }

    return decodeUris(await contract.getOwnedDomains(address));
};

const updateDomainData = async (contract: Contract, domainName: string, data: string, activatePopup?: (text: string) => void): Promise<boolean> => {
    let receipt;
    try {
        const txn: ContractTransaction =
            await contract.modifyData(domainName, data);
        receipt = await txn.wait();
        if (receipt.status === 1) {
            activatePopup?.("Domain data updated!");
        } else {
            activatePopup?.("Something went wrong with the transaction")
        }
    } catch (error: any) {
        activatePopup?.(error.message)
    }
    return receipt?.status === 1;
}

const getDomainLeaseRenewCost = async (contract: Contract, domainName: string): Promise<BigNumber> => {
    return contract.getLeaseRenewCost(domainName);
}

const renewDomainLease = async (contract: Contract, domainName: string, activatePopup?: (text: string) => void): Promise<boolean> => {
    let receipt;
    try {
        const cost = await getDomainLeaseRenewCost(contract, domainName)
        const txn: ContractTransaction =
            await contract.renewLease(domainName, { value: cost });
        receipt = await txn.wait();
        if (receipt.status === 1) {
            activatePopup?.("Lease renewed!");
        } else {
            activatePopup?.("Something went wrong with the transaction")
        }
    } catch (error: any) {
        activatePopup?.(error.message)
    }
    return receipt?.status === 1;
}

const dateHasPassed = (date: Date) => {
    return date.getTime() < Date.now();
}

export { mintDomain, getDomainPrice, getOwnedDomains, updateDomainData, getDomainLeaseRenewCost, renewDomainLease, dateHasPassed }