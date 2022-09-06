import hre from "hardhat"

async function main() {
    const [deployer, address2] = await hre.ethers.getSigners();
    const ownerAddress = await deployer.getAddress();

    const factory = await hre.ethers.getContractFactory('Domains');
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("Contract deployed to: ", contract.address);
    console.log("Contract deployed by: ", ownerAddress)

    let txn = await contract.register('test', ownerAddress);
    await txn.wait();

    async function printDomainInfo(domain: string) {
        const domainInfo = await contract.getDomainInfo(domain);
        console.log(domainInfo)
    }

    await printDomainInfo('test')

    txn = await contract.modifyData('test', `This is some random domain data!`)
    await txn.wait();
    await printDomainInfo('test')

    await contract.connect(address2).modifyData('test', 'test')
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