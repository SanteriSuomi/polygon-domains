import hre from "hardhat"

async function main() {
    const [deployer, address2] = await hre.ethers.getSigners();
    const ownerAddress = await deployer.getAddress();

    const factory = await hre.ethers.getContractFactory('Domains');
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("Contract deployed to: ", contract.address);
    console.log("Contract deployed by: ", ownerAddress)

    const domain = "ttttt"
    let txn = await contract.register(domain, ownerAddress, { value: hre.ethers.utils.parseEther("0.6") });
    await txn.wait();

    async function printDomainInfo(domain: string) {
        const domainInfo = await contract.getDomainInfo(domain);
        console.log(domainInfo)
    }

    await printDomainInfo(domain)

    txn = await contract.modifyData(domain, `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
    await txn.wait();
    await printDomainInfo(domain)

    const balance = await hre.ethers.provider.getBalance(contract.address)
    console.log(hre.ethers.utils.formatEther(balance))

    const tokenUri = await contract.tokenURI(0)
    console.log(tokenUri)
    // await contract.connect(address2).modifyData('test', 'test')
}

async function run() {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

run();