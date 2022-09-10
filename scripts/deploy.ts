import hre from "hardhat"

async function main() {
    const factory = await hre.ethers.getContractFactory('Domains');
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("Contract deployed to: ", "https://mumbai.polygonscan.com/address/" + contract.address);
}

async function deploy() {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

deploy();