import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\3DelegateVotes.ts <tokenContractAddress> <delegatedAddress>

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
    if (args.length != 4) throw new Error("Incorrect number of arguments");
    const [tokenContractAddress, delegatedAddress] = args.slice(2);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.attach(tokenContractAddress);

    const votesPrior = await tokenContract.getVotes(delegatedAddress);
    console.log(`Prior to delegating, the address ${delegatedAddress} has ${votesPrior} votes.`);

    const delegateTx = await tokenContract.delegate(delegatedAddress);
    await delegateTx.wait();

    const votesAfter = await tokenContract.getVotes(delegatedAddress);
    console.log(`After delegating, the address ${delegatedAddress} has ${votesAfter} votes.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});