// scripts/distributeTokens.js
// Helper script to distribute FZT tokens to test wallets for local development.
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.FUZAIL_TOKEN_ADDRESS;
  if (!TOKEN_ADDRESS) throw new Error("Set FUZAIL_TOKEN_ADDRESS in .env");

  const FuzailToken = await ethers.getContractFactory("FuzailToken");
  const token = FuzailToken.attach(TOKEN_ADDRESS);

  const signers = await ethers.getSigners();
  const amount = ethers.parseEther("100"); // 100 FZT per test wallet

  console.log(`Distributing ${ethers.formatEther(amount)} FZT to ${signers.length - 1} test wallets...`);

  for (let i = 1; i < Math.min(signers.length, 10); i++) {
    const wallet = signers[i];
    const tx = await token.transfer(wallet.address, amount);
    await tx.wait();
    const balance = await token.balanceOf(wallet.address);
    console.log(`✅ ${wallet.address}: ${ethers.formatEther(balance)} FZT`);
  }

  console.log("Done!");
}

main().catch(console.error);
