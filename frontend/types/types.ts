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

export type { Data, Domain, Objects, UpdateDomainState, Context, ActivatePopupFunc };
