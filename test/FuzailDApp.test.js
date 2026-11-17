// test/FuzailDApp.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Fuzail DApp — Full Test Suite", function () {
  // ── Fixture ──────────────────────────────────────────────────────────────
  async function deployAllFixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    // 1. Deploy FuzailToken
    const FuzailToken = await ethers.getContractFactory("FuzailToken");
    const fuzailToken = await FuzailToken.deploy();

    // 2. Deploy FuzailNFT
    const FuzailNFT = await ethers.getContractFactory("FuzailNFT");
    const fuzailNFT = await FuzailNFT.deploy("https://api.fuzailnft.com/metadata/");

    // 3. Deploy TokenToNFT
    const TokenToNFT = await ethers.getContractFactory("TokenToNFT");
    const tokenToNFT = await TokenToNFT.deploy(
      await fuzailToken.getAddress(),
      await fuzailNFT.getAddress(),
      "https://api.fuzailnft.com/metadata/"
    );

    // 4. Transfer NFT ownership to exchange
    await fuzailNFT.transferOwnership(await tokenToNFT.getAddress());

    const REQUIRED_TOKENS = ethers.parseEther("5");
    const INITIAL_SUPPLY = ethers.parseEther("1000000");

    return { fuzailToken, fuzailNFT, tokenToNFT, owner, user1, user2, user3, REQUIRED_TOKENS, INITIAL_SUPPLY };
  }

  // ── ERC-20 Tests ──────────────────────────────────────────────────────────
  describe("FuzailToken (ERC-20)", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { fuzailToken } = await loadFixture(deployAllFixture);
      expect(await fuzailToken.name()).to.equal("Fuzail Token");
      expect(await fuzailToken.symbol()).to.equal("FZT");
    });

    it("Should mint initial supply of 1,000,000 FZT to deployer", async function () {
      const { fuzailToken, owner, INITIAL_SUPPLY } = await loadFixture(deployAllFixture);
      expect(await fuzailToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should have 18 decimals", async function () {
      const { fuzailToken } = await loadFixture(deployAllFixture);
      expect(await fuzailToken.decimals()).to.equal(18);
    });

    it("Should allow owner to transfer tokens", async function () {
      const { fuzailToken, owner, user1 } = await loadFixture(deployAllFixture);
      const amount = ethers.parseEther("100");
      await fuzailToken.transfer(user1.address, amount);
      expect(await fuzailToken.balanceOf(user1.address)).to.equal(amount);
    });

    it("Should not allow transfer exceeding balance", async function () {
      const { fuzailToken, user1 } = await loadFixture(deployAllFixture);
      const amount = ethers.parseEther("1");
      await expect(
        fuzailToken.connect(user1).transfer(user1.address, amount)
      ).to.be.revertedWithCustomError(fuzailToken, "ERC20InsufficientBalance");
    });

    it("Should allow owner to mint additional tokens", async function () {
      const { fuzailToken, owner, user1 } = await loadFixture(deployAllFixture);
      const mintAmount = ethers.parseEther("500");
      await fuzailToken.mint(user1.address, mintAmount);
      expect(await fuzailToken.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should reject minting from non-owner", async function () {
      const { fuzailToken, user1 } = await loadFixture(deployAllFixture);
      await expect(
        fuzailToken.connect(user1).mint(user1.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(fuzailToken, "OwnableUnauthorizedAccount");
    });
  });

  // ── ERC-721 Tests ─────────────────────────────────────────────────────────
  describe("FuzailNFT (ERC-721)", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { fuzailNFT } = await loadFixture(deployAllFixture);
      expect(await fuzailNFT.name()).to.equal("Fuzail NFT");
      expect(await fuzailNFT.symbol()).to.equal("FZNFT");
    });

    it("Exchange contract should own the NFT contract", async function () {
      const { fuzailNFT, tokenToNFT } = await loadFixture(deployAllFixture);
      expect(await fuzailNFT.owner()).to.equal(await tokenToNFT.getAddress());
    });

    it("Only owner (exchange) can mint NFTs", async function () {
      const { fuzailNFT, user1 } = await loadFixture(deployAllFixture);
      await expect(
        fuzailNFT.connect(user1).mintNFT(user1.address, "ipfs://test")
      ).to.be.revertedWithCustomError(fuzailNFT, "OwnableUnauthorizedAccount");
    });

    it("Should start with 0 minted NFTs", async function () {
      const { fuzailNFT } = await loadFixture(deployAllFixture);
      expect(await fuzailNFT.totalMinted()).to.equal(0);
    });

    it("Should have sequential unique token IDs starting from 1", async function () {
      const { fuzailNFT, tokenToNFT, fuzailToken, owner, user1 } = await loadFixture(deployAllFixture);
      const amount = ethers.parseEther("20");
      await fuzailToken.transfer(user1.address, amount);
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), amount);

      await tokenToNFT.connect(user1).depositTokensForNFT();
      await tokenToNFT.connect(user1).depositTokensForNFT();

      expect(await fuzailNFT.ownerOf(1)).to.equal(user1.address);
      expect(await fuzailNFT.ownerOf(2)).to.equal(user1.address);
      expect(await fuzailNFT.totalMinted()).to.equal(2);
    });
  });

  // ── Exchange Contract Tests ────────────────────────────────────────────────
  describe("TokenToNFT Exchange", function () {
    it("Should store correct token and NFT addresses", async function () {
      const { tokenToNFT, fuzailToken, fuzailNFT } = await loadFixture(deployAllFixture);
      expect(await tokenToNFT.fuzailToken()).to.equal(await fuzailToken.getAddress());
      expect(await tokenToNFT.fuzailNFT()).to.equal(await fuzailNFT.getAddress());
    });

    it("Should require exactly 5 FZT tokens", async function () {
      const { tokenToNFT, REQUIRED_TOKENS } = await loadFixture(deployAllFixture);
      expect(await tokenToNFT.REQUIRED_TOKENS()).to.equal(REQUIRED_TOKENS);
    });

    it("Should revert if user has insufficient FZT balance", async function () {
      const { tokenToNFT, fuzailToken, user1 } = await loadFixture(deployAllFixture);
      // Transfer less than required
      await fuzailToken.transfer(user1.address, ethers.parseEther("3"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      await expect(
        tokenToNFT.connect(user1).depositTokensForNFT()
      ).to.be.revertedWith("TokenToNFT: insufficient FZT balance");
    });

    it("Should revert if user has not approved tokens", async function () {
      const { tokenToNFT, fuzailToken, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      // No approval

      await expect(
        tokenToNFT.connect(user1).depositTokensForNFT()
      ).to.be.revertedWith("TokenToNFT: insufficient allowance");
    });

    it("Should revert if approval is less than 5 FZT", async function () {
      const { tokenToNFT, fuzailToken, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("4"));

      await expect(
        tokenToNFT.connect(user1).depositTokensForNFT()
      ).to.be.revertedWith("TokenToNFT: insufficient allowance");
    });

    it("Should successfully mint 1 NFT for deposit of exactly 5 FZT", async function () {
      const { tokenToNFT, fuzailToken, fuzailNFT, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      const beforeBalance = await fuzailNFT.balanceOf(user1.address);
      const beforeTokenBal = await fuzailToken.balanceOf(user1.address);

      const tx = await tokenToNFT.connect(user1).depositTokensForNFT();
      const receipt = await tx.wait();

      // NFT balance increased by exactly 1
      expect(await fuzailNFT.balanceOf(user1.address)).to.equal(beforeBalance + 1n);
      // Token balance decreased by exactly 5
      expect(await fuzailToken.balanceOf(user1.address)).to.equal(
        beforeTokenBal - ethers.parseEther("5")
      );
      // NFT owner
      expect(await fuzailNFT.ownerOf(1)).to.equal(user1.address);
    });

    it("One deposit must generate exactly 1 NFT — not more", async function () {
      const { tokenToNFT, fuzailToken, fuzailNFT, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      await tokenToNFT.connect(user1).depositTokensForNFT();

      expect(await fuzailNFT.balanceOf(user1.address)).to.equal(1);
      expect(await fuzailNFT.totalMinted()).to.equal(1);
    });

    it("Should emit TokensDeposited event on success", async function () {
      const { tokenToNFT, fuzailToken, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      await expect(tokenToNFT.connect(user1).depositTokensForNFT())
        .to.emit(tokenToNFT, "TokensDeposited")
        .withArgs(user1.address, ethers.parseEther("5"), 1, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
    });

    it("Multiple deposits generate correct number of NFTs", async function () {
      const { tokenToNFT, fuzailToken, fuzailNFT, user1, user2 } = await loadFixture(deployAllFixture);

      await fuzailToken.transfer(user1.address, ethers.parseEther("20"));
      await fuzailToken.transfer(user2.address, ethers.parseEther("20"));

      // user1 deposits twice
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("20"));
      await tokenToNFT.connect(user1).depositTokensForNFT();
      await tokenToNFT.connect(user1).depositTokensForNFT();

      // user2 deposits once
      await fuzailToken.connect(user2).approve(await tokenToNFT.getAddress(), ethers.parseEther("20"));
      await tokenToNFT.connect(user2).depositTokensForNFT();

      expect(await fuzailNFT.balanceOf(user1.address)).to.equal(2);
      expect(await fuzailNFT.balanceOf(user2.address)).to.equal(1);
      expect(await fuzailNFT.totalMinted()).to.equal(3);
    });

    it("Failed transaction should not generate NFTs", async function () {
      const { tokenToNFT, fuzailToken, fuzailNFT, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("3")); // insufficient
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));

      await expect(
        tokenToNFT.connect(user1).depositTokensForNFT()
      ).to.be.reverted;

      expect(await fuzailNFT.balanceOf(user1.address)).to.equal(0);
      expect(await fuzailNFT.totalMinted()).to.equal(0);
    });

    it("Contract should accumulate FZT tokens after deposits", async function () {
      const { tokenToNFT, fuzailToken, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));
      await tokenToNFT.connect(user1).depositTokensForNFT();

      expect(await tokenToNFT.contractTokenBalance()).to.equal(ethers.parseEther("5"));
    });

    it("Owner can withdraw accumulated tokens", async function () {
      const { tokenToNFT, fuzailToken, owner, user1 } = await loadFixture(deployAllFixture);
      await fuzailToken.transfer(user1.address, ethers.parseEther("10"));
      await fuzailToken.connect(user1).approve(await tokenToNFT.getAddress(), ethers.parseEther("5"));
      await tokenToNFT.connect(user1).depositTokensForNFT();

      const ownerBalBefore = await fuzailToken.balanceOf(owner.address);
      await tokenToNFT.withdrawTokens(owner.address, ethers.parseEther("5"));
      expect(await fuzailToken.balanceOf(owner.address)).to.equal(
        ownerBalBefore + ethers.parseEther("5")
      );
    });
  });
});
