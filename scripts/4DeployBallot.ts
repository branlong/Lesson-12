import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\4DeployBallot.ts <tokenContractAddress> <proposal1> <proposal2> <proposal3>..

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

    const args = process.argv;
    const tokenContractAddress = args[2];
    const proposals = args.slice(3);

    if (proposals.length <= 1) throw new Error("Not enough arguments");

    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => console.log(`Proposal #${index + 1}: ${element}`));

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = await ballotContractFactory.deploy(
    proposals.map(proposal => ethers.utils.formatBytes32String(proposal)), 
    tokenContractAddress, 
    await provider.getBlockNumber());
    await ballotContract.deployed();
    console.log(`Ballot contract deployed at ${ballotContract.address}\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});