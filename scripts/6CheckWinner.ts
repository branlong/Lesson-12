import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\6CheckWinner.ts <ballotContractAddress>

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
    if (args.length != 3) throw new Error("Incorrect number of arguments");
    const ballotContractAddress = args[2];

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = await ballotContractFactory.attach(ballotContractAddress);

    const winnerName = await ballotContract.winnerName();
    console.log(`The winning proposal is ${ ethers.utils.parseBytes32String(winnerName) }`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});