// scripts/deploy.js
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

  // ── 1. Deploy ProjectFactory ─────────────────────────────────────────────
  console.log("\n[1/2] Deploying ProjectFactory...");
  const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
  const factory = await ProjectFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ ProjectFactory deployed to:", factoryAddress);

  // ── 2. Create Initial Default Project (Fuzail Token & NFT) ────────────────
  console.log("\n[2/2] Creating initial default Genesis project via Factory...");
  const baseMetadataURI = process.env.BASE_METADATA_URI || "http://localhost:8000/api/metadata/";
  const initialSupply = ethers.parseEther("1000000"); // 1 Million FZT
  const tokensPerNFT = ethers.parseEther("5"); // 5 FZT per NFT

  const createTx = await factory.createProject({
    tokenName: "Fuzail Token",
    tokenSymbol: "FZT",
    tokenDecimals: 18,
    tokenInitialSupply: initialSupply,
    nftName: "Fuzail NFT",
    nftSymbol: "FZNFT",
    nftMaxSupply: 1000,
    tokensPerNFT: tokensPerNFT,
    baseMetadataURI: baseMetadataURI,
  });
  await createTx.wait();

  const proj0 = await factory.getProject(0);
  console.log("✅ Initial Genesis Project Created:");
  console.log("   Project ID   :", proj0.projectId.toString());
  console.log("   FuzailToken  :", proj0.tokenAddress);
  console.log("   FuzailNFT    :", proj0.nftAddress);
  console.log("   TokenToNFT   :", proj0.exchangeAddress);
  console.log("   Rate         : 5 FZT = 1 NFT");

  // ── 3. Export ABIs and Config ─────────────────────────────────────────────
  exportToFrontendAndBackend(factoryAddress, proj0);

  console.log("\n🚀 All contracts deployed and configured successfully!");
}

function exportToFrontendAndBackend(factoryAddress, initialProj) {
  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");

  const contractFiles = [
    { name: "ProjectFactory", file: "ProjectFactory.sol/ProjectFactory.json", address: factoryAddress },
    { name: "FuzailToken", file: "FuzailToken.sol/FuzailToken.json", address: initialProj.tokenAddress },
    { name: "FuzailNFT", file: "FuzailNFT.sol/FuzailNFT.json", address: initialProj.nftAddress },
    { name: "TokenToNFT", file: "TokenToNFT.sol/TokenToNFT.json", address: initialProj.exchangeAddress },
  ];

  const config = {
    factoryAddress,
    initialProject: {
      projectId: initialProj.projectId.toString(),
      tokenAddress: initialProj.tokenAddress,
      nftAddress: initialProj.nftAddress,
      exchangeAddress: initialProj.exchangeAddress,
      tokenName: initialProj.tokenName,
      tokenSymbol: initialProj.tokenSymbol,
      tokenDecimals: Number(initialProj.tokenDecimals),
      nftName: initialProj.nftName,
      nftSymbol: initialProj.nftSymbol,
      tokensPerNFT: initialProj.tokensPerNFT.toString(),
    },
    contracts: {},
  };

  for (const c of contractFiles) {
    const artifactPath = path.join(artifactsDir, c.file);
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      config.contracts[c.name] = {
        address: c.address,
        abi: artifact.abi,
      };
    }
  }

  // Frontend export
  const frontendDir = path.join(__dirname, "..", "NFT frontened", "src", "contracts");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
  fs.writeFileSync(path.join(frontendDir, "contractConfig.json"), JSON.stringify(config, null, 2));
  console.log("📦 Saved frontend config: NFT frontened/src/contracts/contractConfig.json");

  // Backend export
  const backendDir = path.join(__dirname, "..", "NFT backened", "config");
  if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });
  fs.writeFileSync(path.join(backendDir, "contractConfig.json"), JSON.stringify(config, null, 2));
  console.log("📦 Saved backend config: NFT backened/config/contractConfig.json");

  // Root export
  fs.writeFileSync(path.join(__dirname, "..", "deployment.json"), JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
