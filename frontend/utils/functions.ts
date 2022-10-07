import { BigNumber, Contract, ContractTransaction } from "ethers";
import { Domain } from "../types/types";

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

    function decodeUris(domains: Domain[]) {
        const decodedDomains: Domain[] = [];
        domains.forEach((domain: Domain) => {
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
                data: domain.data,
                name: domain.name,
                owner: domain.owner,
                uri: domain.uri,
                image: image,
            });
        });
        return decodedDomains;
    }

    return decodeUris(await contract.getOwnedDomains(address));
};

export { mintDomain, getDomainPrice, getOwnedDomains }