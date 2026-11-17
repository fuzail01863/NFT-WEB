// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FuzailNFT
 * @dev Dynamic ERC-721 NFT collection supporting custom name, symbol, max supply, and base URI.
 * Only the contract owner (Exchange contract) can mint NFTs.
 */
contract FuzailNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    uint256 public immutable maxSupply; // 0 = unlimited

    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        string memory baseURI_,
        address initialOwner_
    ) ERC721(name_, symbol_) Ownable(initialOwner_) {
        maxSupply = maxSupply_;
        _baseTokenURI = baseURI_;
        _nextTokenId = 1;
    }

    /**
     * @dev Mint one NFT to the recipient. Only callable by the owner (Exchange contract).
     */
    function mintNFT(address recipient, string memory tokenURI_)
        external
        onlyOwner
        returns (uint256)
    {
        if (maxSupply > 0) {
            require(_nextTokenId <= maxSupply, "FuzailNFT: max supply reached");
        }

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit NFTMinted(recipient, tokenId, tokenURI_);
        return tokenId;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
}
