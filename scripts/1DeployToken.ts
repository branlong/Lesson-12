import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\1DeployToken.ts

async function main() {
    const provider = ethers.getDefaultProvider("goerli", {
      infura: process.env.INFURA_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
      alchemy: process.env.ALCHEMY_API_KEY,
    });

    // const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    var balanceBN = await signer.getBalance();
    console.log(`Connected to the account of address ${signer.address}\nThis account has a balance of ${ethers.utils.formatEther(balanceBN)} Eth`);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    console.log(`Token contract deployed at ${tokenContract.address}\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});