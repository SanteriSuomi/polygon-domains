import { Contract, ethers, BigNumber } from "ethers";

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
    tokenId: number;
    leaseEndTime: Date;
    image?: string;
}

interface DomainRaw extends Omit<Domain, "leaseEndTime" | "tokenId"> {
    leaseEndTime: BigNumber;
    tokenId: BigNumber;
}

interface Objects {
    contract: Contract;
    signer: ethers.providers.JsonRpcSigner;
    provider: ethers.providers.Web3Provider;
}

interface UpdateDomainState {
    enabled: boolean;
    domain?: Domain;
}

type Context = { activatePopup: ActivatePopupFunc, data: Data } | undefined

type ActivatePopupFunc = (text?: string) => void;

export type { Data, Domain, DomainRaw, Objects, UpdateDomainState, Context, ActivatePopupFunc };
