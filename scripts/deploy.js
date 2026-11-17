// scripts/deploy.js
// Deployment order:
//  1. Deploy FuzailToken
//  2. Deploy FuzailNFT
//  3. Deploy TokenToNFT (with token + NFT addresses)
//  4. Transfer FuzailNFT ownership → TokenToNFT
//  5. Verify ownership
//  6. Write contract addresses + ABIs to frontend & backend config

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  // ── 1. Deploy FuzailToken ─────────────────────────────────────────────────
  console.log("\n[1/4] Deploying FuzailToken...");
  const FuzailToken = await ethers.getContractFactory("FuzailToken");
  const fuzailToken = await FuzailToken.deploy();
  await fuzailToken.waitForDeployment();
  const tokenAddress = await fuzailToken.getAddress();
  console.log("✅ FuzailToken deployed to:", tokenAddress);

  // ── 2. Deploy FuzailNFT ───────────────────────────────────────────────────
  console.log("\n[2/4] Deploying FuzailNFT...");
  const baseMetadataURI = process.env.BASE_METADATA_URI || "https://api.fuzailnft.com/metadata/";
  const FuzailNFT = await ethers.getContractFactory("FuzailNFT");
  const fuzailNFT = await FuzailNFT.deploy(baseMetadataURI);
  await fuzailNFT.waitForDeployment();
  const nftAddress = await fuzailNFT.getAddress();
  console.log("✅ FuzailNFT deployed to:", nftAddress);

  // ── 3. Deploy TokenToNFT ──────────────────────────────────────────────────
  console.log("\n[3/4] Deploying TokenToNFT...");
  const TokenToNFT = await ethers.getContractFactory("TokenToNFT");
  const tokenToNFT = await TokenToNFT.deploy(tokenAddress, nftAddress, baseMetadataURI);
  await tokenToNFT.waitForDeployment();
  const exchangeAddress = await tokenToNFT.getAddress();
  console.log("✅ TokenToNFT deployed to:", exchangeAddress);

  // ── 4. Transfer FuzailNFT ownership → TokenToNFT ─────────────────────────
  console.log("\n[4/4] Transferring FuzailNFT ownership to TokenToNFT...");
  const transferTx = await fuzailNFT.transferOwnership(exchangeAddress);
  await transferTx.wait();
  console.log("✅ FuzailNFT owner is now:", await fuzailNFT.owner());

  // ── 5. Verify ownership ───────────────────────────────────────────────────
  const nftOwner = await fuzailNFT.owner();
  if (nftOwner.toLowerCase() !== exchangeAddress.toLowerCase()) {
    throw new Error("❌ Ownership transfer failed!");
  }
  console.log("✅ Ownership verified — TokenToNFT owns FuzailNFT");

  // ── 6. Export addresses + ABIs ────────────────────────────────────────────
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      FuzailToken: tokenAddress,
      FuzailNFT: nftAddress,
      TokenToNFT: exchangeAddress,
    },
  };

  // Write to root config
  const rootConfigPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(rootConfigPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to deployment.json");

  // Export ABIs for frontend
  exportABIsToFrontend(tokenAddress, nftAddress, exchangeAddress);

  // Export config for backend
  exportConfigToBackend(tokenAddress, nftAddress, exchangeAddress);

  console.log("\n🚀 All contracts deployed and configured successfully!");
  console.log("─────────────────────────────────────────────────────");
  console.log("FuzailToken  :", tokenAddress);
  console.log("FuzailNFT    :", nftAddress);
  console.log("TokenToNFT   :", exchangeAddress);
  console.log("─────────────────────────────────────────────────────");
  console.log("\nNext steps:");
  console.log("1. Add contract addresses to frontend/.env");
  console.log("2. Add contract addresses to backend/.env");
  console.log(
    "3. Verify on Etherscan: npx hardhat verify --network sepolia",
    tokenAddress
  );
}

function exportABIsToFrontend(tokenAddress, nftAddress, exchangeAddress) {
  const frontendSrcDir = path.join(__dirname, "..", "NFT frontened", "src", "contracts");
  if (!fs.existsSync(frontendSrcDir)) fs.mkdirSync(frontendSrcDir, { recursive: true });

  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");

  const contracts = [
    { name: "FuzailToken", address: tokenAddress, file: "FuzailToken.sol/FuzailToken.json" },
    { name: "FuzailNFT", address: nftAddress, file: "FuzailNFT.sol/FuzailNFT.json" },
    { name: "TokenToNFT", address: exchangeAddress, file: "TokenToNFT.sol/TokenToNFT.json" },
  ];

  const config = { contracts: {} };

  for (const c of contracts) {
    const artifactPath = path.join(artifactsDir, c.file);
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      config.contracts[c.name] = {
        address: c.address,
        abi: artifact.abi,
      };
    }
  }

  fs.writeFileSync(
    path.join(frontendSrcDir, "contractConfig.json"),
    JSON.stringify(config, null, 2)
  );
  console.log("📦 ABIs exported to frontend/src/contracts/contractConfig.json");
}

function exportConfigToBackend(tokenAddress, nftAddress, exchangeAddress) {
  const backendConfigDir = path.join(__dirname, "..", "NFT backened", "config");
  if (!fs.existsSync(backendConfigDir)) fs.mkdirSync(backendConfigDir, { recursive: true });

  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");

  const contracts = [
    { name: "FuzailToken", address: tokenAddress, file: "FuzailToken.sol/FuzailToken.json" },
    { name: "FuzailNFT", address: nftAddress, file: "FuzailNFT.sol/FuzailNFT.json" },
    { name: "TokenToNFT", address: exchangeAddress, file: "TokenToNFT.sol/TokenToNFT.json" },
  ];

  const config = { contracts: {} };

  for (const c of contracts) {
    const artifactPath = path.join(artifactsDir, c.file);
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      config.contracts[c.name] = {
        address: c.address,
        abi: artifact.abi,
      };
    }
  }

  fs.writeFileSync(
    path.join(backendConfigDir, "contractConfig.json"),
    JSON.stringify(config, null, 2)
  );
  console.log("📦 ABIs exported to backend/config/contractConfig.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
