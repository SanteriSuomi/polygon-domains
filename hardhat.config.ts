import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import env from "dotenv";

env.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    mumbai: {
      url: process.env.RPC_URL,
      accounts: [process.env.DEV_ACC_PRIVATE_KEY as string]
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY as string
    }
  },
};

task("env", "Print environment object", async () => {
  console.log(process.env);
});

task("accounts", "Prints the list of accounts", async () => {
  //@ts-ignore ethers is injected

  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
