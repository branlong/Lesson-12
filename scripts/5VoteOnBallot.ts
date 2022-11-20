import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\5VoteOnBallot.ts <ballotContractAddress> <proposalToVoteOn> <numVotesToUse>

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
    if (args.length != 5) throw new Error("Incorrect number of arguments");
    const [ballotContractAddress, proposalToVoteOn, numVotesToUse] = args.slice(2);

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = await ballotContractFactory.attach(ballotContractAddress);

    const voteTx = await ballotContract.vote(proposalToVoteOn, ethers.utils.parseEther(numVotesToUse));
    await voteTx.wait();

    console.log(`Vote has been recorded for proposal #${proposalToVoteOn}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});