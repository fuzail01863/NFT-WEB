// scripts/transferOwnership.js
// Standalone script to transfer FuzailNFT ownership to TokenToNFT
// Use if you need to re-run ownership transfer separately.
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);

  const NFT_ADDRESS = process.env.FUZAIL_NFT_ADDRESS;
  const EXCHANGE_ADDRESS = process.env.TOKEN_TO_NFT_ADDRESS;

  if (!NFT_ADDRESS || !EXCHANGE_ADDRESS) {
    throw new Error("Set FUZAIL_NFT_ADDRESS and TOKEN_TO_NFT_ADDRESS in .env");
  }

  const FuzailNFT = await ethers.getContractFactory("FuzailNFT");
  const fuzailNFT = FuzailNFT.attach(NFT_ADDRESS);

  console.log("Current NFT owner:", await fuzailNFT.owner());
  console.log("Transferring ownership to:", EXCHANGE_ADDRESS);

  const tx = await fuzailNFT.transferOwnership(EXCHANGE_ADDRESS);
  await tx.wait();

  const newOwner = await fuzailNFT.owner();
  console.log("✅ New NFT owner:", newOwner);

  if (newOwner.toLowerCase() !== EXCHANGE_ADDRESS.toLowerCase()) {
    throw new Error("❌ Transfer failed — owner mismatch");
  }
}

main().catch(console.error);
