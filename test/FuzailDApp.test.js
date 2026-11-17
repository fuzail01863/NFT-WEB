const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Fuzail DApp & ProjectFactory — Full Test Suite", function () {
  async function deployAllFixture() {
    const [owner, creator, user1, user2] = await ethers.getSigners();

    // Deploy Factory
    const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
    const factory = await ProjectFactory.deploy();

    const REQUIRED_TOKENS = ethers.parseEther("5");
    const INITIAL_SUPPLY = ethers.parseEther("1000000");

    // Create default project via Factory
    const params = {
      tokenName: "Fuzail Token",
      tokenSymbol: "FZT",
      tokenDecimals: 18,
      tokenInitialSupply: INITIAL_SUPPLY,
      nftName: "Fuzail NFT",
      nftSymbol: "FZNFT",
      nftMaxSupply: 1000,
      tokensPerNFT: REQUIRED_TOKENS,
      baseMetadataURI: "https://api.fuzailnft.com/metadata/",
    };

    const tx = await factory.connect(creator).createProject(params);
    await tx.wait();

    const proj = await factory.getProject(0);

    const fuzailToken = await ethers.getContractAt("FuzailToken", proj.tokenAddress);
    const fuzailNFT = await ethers.getContractAt("FuzailNFT", proj.nftAddress);
    const tokenToNFT = await ethers.getContractAt("TokenToNFT", proj.exchangeAddress);

    return {
      factory,
      fuzailToken,
      fuzailNFT,
      tokenToNFT,
      owner,
      creator,
      user1,
      user2,
      REQUIRED_TOKENS,
      INITIAL_SUPPLY,
    };
  }

  describe("ProjectFactory", function () {
    it("Should deploy ProjectFactory successfully", async function () {
      const { factory } = await loadFixture(deployAllFixture);
      expect(await factory.totalProjects()).to.equal(1);
    });

    it("Should record project details accurately", async function () {
      const { factory, creator } = await loadFixture(deployAllFixture);
      const proj = await factory.getProject(0);
      expect(proj.creator).to.equal(creator.address);
      expect(proj.tokenName).to.equal("Fuzail Token");
      expect(proj.tokenSymbol).to.equal("FZT");
      expect(proj.nftName).to.equal("Fuzail NFT");
      expect(proj.tokensPerNFT).to.equal(ethers.parseEther("5"));
    });

    it("Exchange contract must own the deployed NFT contract", async function () {
      const { fuzailNFT, tokenToNFT } = await loadFixture(deployAllFixture);
      expect(await fuzailNFT.owner()).to.equal(await tokenToNFT.getAddress());
    });

    it("Initial token supply must be minted to the creator", async function () {
      const { fuzailToken, creator, INITIAL_SUPPLY } = await loadFixture(deployAllFixture);
      expect(await fuzailToken.balanceOf(creator.address)).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("End-to-End Dynamic Minting Flow", function () {
    it("User approves tokens and mints 1 NFT via Exchange", async function () {
      const { fuzailToken, fuzailNFT, tokenToNFT, creator, user1 } = await loadFixture(deployAllFixture);

      // Creator sends 20 FZT to user1
      await fuzailToken.connect(creator).transfer(user1.address, ethers.parseEther("20"));

      // User1 approves 5 FZT to Exchange
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      // User1 deposits 5 FZT and gets 1 NFT
      const tx = await tokenToNFT.connect(user1).depositTokensForNFT();
      await tx.wait();

      expect(await fuzailNFT.balanceOf(user1.address)).to.equal(1);
      expect(await fuzailNFT.ownerOf(1)).to.equal(user1.address);
      expect(await fuzailToken.balanceOf(user1.address)).to.equal(ethers.parseEther("15"));
    });

    it("Reverts if user has insufficient allowance", async function () {
      const { fuzailToken, tokenToNFT, creator, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.connect(creator).transfer(user1.address, ethers.parseEther("10"));

      await expect(
        tokenToNFT.connect(user1).depositTokensForNFT()
      ).to.be.revertedWith("TokenToNFT: insufficient allowance");
    });

    it("Allows any user to create another dynamic project with 10 tokens rate", async function () {
      const { factory, user1 } = await loadFixture(deployAllFixture);

      const params = {
        tokenName: "Cyber Token",
        tokenSymbol: "CYBER",
        tokenDecimals: 18,
        tokenInitialSupply: ethers.parseEther("50000"),
        nftName: "Cyberpunk Avatars",
        nftSymbol: "CYBERNFT",
        nftMaxSupply: 50,
        tokensPerNFT: ethers.parseEther("10"), // 10 tokens per NFT
        baseMetadataURI: "https://api.cyber.io/meta/",
      };

      await factory.connect(user1).createProject(params);
      expect(await factory.totalProjects()).to.equal(2);

      const proj2 = await factory.getProject(1);
      expect(proj2.tokenName).to.equal("Cyber Token");
      expect(proj2.tokensPerNFT).to.equal(ethers.parseEther("10"));
    });
  });
});
