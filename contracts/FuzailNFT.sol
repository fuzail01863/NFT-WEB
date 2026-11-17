// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FuzailNFT
 * @dev ERC-721 NFT: Fuzail NFT (FZNFT)
 * Only the contract owner (TokenToNFT exchange) can mint NFTs.
 * Each NFT has a unique token ID and supports tokenURI metadata.
 */
contract FuzailNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);

    constructor(string memory baseURI) ERC721("Fuzail NFT", "FZNFT") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        _nextTokenId = 1;
    }

    /**
     * @dev Mint one NFT to the recipient. Only callable by the owner (exchange contract).
     * @param recipient The wallet that will receive the NFT.
     * @param tokenURI_ Metadata URI for the NFT.
     * @return tokenId The newly minted token ID.
     */
    function mintNFT(address recipient, string memory tokenURI_)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit NFTMinted(recipient, tokenId, tokenURI_);
        return tokenId;
    }

    /**
     * @dev Returns the total number of NFTs minted so far.
     */
    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @dev Returns the next token ID that will be assigned.
     */
    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Update the base URI (owner only).
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
}
