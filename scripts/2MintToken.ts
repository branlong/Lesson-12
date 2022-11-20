import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files .\scripts\2MintToken.ts <tokenContractAddress> <mintedReceivingAddress> <amountToGive>

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
    const [tokenContractAddress, mintedReceivingAddress, amountToGive] = args.slice(2);

    console.log(`Minting ${amountToGive} tokens to be given to ${mintedReceivingAddress}.`);
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.attach(tokenContractAddress);
    const mintTx = await tokenContract.mint(mintedReceivingAddress, ethers.utils.parseEther(amountToGive));
    await mintTx.wait();

    const newTokenBalance = ethers.utils.formatUnits(await tokenContract.balanceOf(mintedReceivingAddress));
    console.log(`The address ${mintedReceivingAddress} now has a token balance of ${newTokenBalance}.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});