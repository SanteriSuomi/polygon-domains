import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai"
import { ethers } from "hardhat"
import { Domains } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber"
import isSvg from "is-svg"

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

describe("Domains contract", () => {
    let owner: SignerWithAddress;
    let otherAccounts: SignerWithAddress[];
    let contract: Domains;
    let totalDomainMintPrice: BigNumber = BigNumber.from(0);

    before(async () => {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        otherAccounts = accounts.splice(1, accounts.length)
        const factory = await ethers.getContractFactory("Domains")
        contract = await factory.deploy();
    })

    async function testRegister(domainName: string, owner: SignerWithAddress) {
        const domainPrice = await contract.getPrice(domainName)
        totalDomainMintPrice = totalDomainMintPrice?.add(domainPrice)
        await contract.connect(owner).register(domainName, domainName, { value: domainPrice })
        expect(await contract.balanceOf(await owner.getAddress())).to.equal(1).and.to.emit(contract, "Registered")
    }

    async function testRegisterExistingDomain(domainName: string, owner: SignerWithAddress) {
        const domainPrice = await contract.getPrice(domainName);
        const connected = contract.connect(owner);
        await expect(connected.register(domainName, domainName, { value: domainPrice })).to.be.revertedWithCustomError(contract, "AlreadyRegistered")
    }

    async function testRegisterWithPrice(domainName: string, owner: SignerWithAddress, domainPrice: BigNumber) {
        const connected = contract.connect(owner);
        await expect(connected.register(domainName, domainName, { value: domainPrice })).to.be.revertedWithCustomError(contract, "NotEnoughEtherPaid")
    }

    function getRandomString(length: number) {
        let result = ' ';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    it("Can register", async () => {
        await testRegister("test", owner)
        await testRegister("test1", otherAccounts[1])
    })

    it("Can't register a domain that has already been registered", async () => {
        await testRegisterExistingDomain("test", owner)
    })

    it("Can't register a domain with incorrect price", async () => {
        await testRegisterWithPrice("test2", owner, BigNumber.from(0))
    })

    it("Can't register too long domain name", async () => {
        const maxDomainLength = Number.parseInt((await contract.maxDomainLength()).toString());
        const maxDomainPrice = await contract.getPrice(getRandomString(maxDomainLength - 1))
        const randomOverlengthStr = getRandomString(maxDomainLength + 1)
        expect(contract.register(randomOverlengthStr, randomOverlengthStr, { value: maxDomainPrice })).to.be.revertedWith("Domain name is too long")
    })

    it("Domain data is correct", async () => {
        const domainData = await contract.getDomainData("test")
        expect(domainData.data).to.equal("test")
    })

    it("Can transfer a domain to another address", async () => {
        const ownerAddress = await owner.getAddress();
        const otherAddress = await otherAccounts[1].getAddress();
        await contract.transferFrom(ownerAddress, otherAddress, 0)
        const ownerTokenAmount = (await contract.balanceOf(ownerAddress)).toString();
        const otherTokenAmount = (await contract.balanceOf(otherAddress)).toString();
        expect(ownerTokenAmount).to.equal("0")
        expect(otherTokenAmount).to.equal("2")
    })

    it("Token uri is valid", async () => {
        const rawUri = await contract.tokenURI(0)
        const base64 = rawUri.split(",")[1] // Remove the encoding mark
        const uriObject = JSON.parse(Buffer.from(base64, 'base64').toString()); // Decode from base64 to string and transform into an object
        const imageBase64 = uriObject.image.split(",")[1]; // Remove encoding mark
        const imageSvg = Buffer.from(imageBase64, "base64").toString();
        expect(isSvg(imageSvg)).to.be.true;
    })

    it("Can withdraw", async () => {
        const balanceBefore = await owner.getBalance();
        await contract.withdraw();
        const balanceDiff = (await owner.getBalance()).sub(balanceBefore);
        const parsedNumber = Number.parseFloat(ethers.utils.formatEther(balanceDiff)).toFixed(1);
        const totalMintPriceParsed = Number.parseFloat(ethers.utils.formatEther(totalDomainMintPrice)).toFixed(1)
        expect(parsedNumber).to.equal(totalMintPriceParsed)
    })

    it("Can get all domains", async () => {
        const domains = await contract.getAllDomains();
        expect((() => domains.length === 2 && domains[0] === "test" && domains[1] === "test1")()).to.be.true
    })

    it("Can get owned domains", async () => {
        const address = await otherAccounts[1].getAddress()
        const domains = await contract.getOwnedDomains(address);
        expect((() => domains.length === 2 && domains[0].owner === address && domains[1].owner === address)()).to.be.true
    })
})