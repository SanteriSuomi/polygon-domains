import { Contract, ethers } from "ethers";

interface Data {
    connectButton?: { enabled: boolean; connectText: string };
    contract?: Contract;
    signer?: ethers.providers.JsonRpcSigner;
    address?: string;
}

interface Domain {
    name: string;
    owner: string;
    data: string;
    uri?: string;
    image?: string;
}

export type { Data, Domain };
