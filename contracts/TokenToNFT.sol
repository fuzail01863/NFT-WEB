// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FuzailToken.sol";
import "./FuzailNFT.sol";

/**
 * @title TokenToNFT
 * @dev Exchange contract: Users deposit specified ERC-20 tokens to mint 1 NFT.
 * Dynamic token requirements, decimals, and custom NFT metadata.
 */
contract TokenToNFT is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable fuzailToken;
    FuzailNFT public immutable fuzailNFT;
    uint256 public requiredTokens;
    string public baseMetadataURI;

    event TokensDeposited(
        address indexed user,
        uint256 tokenAmount,
        uint256 indexed nftTokenId,
        uint256 timestamp
    );
    event BaseURIUpdated(string newURI);
    event RequiredTokensUpdated(uint256 newAmount);
    event TokensWithdrawn(address indexed to, uint256 amount);

    constructor(
        address _fuzailToken,
        address _fuzailNFT,
        uint256 _requiredTokens,
        string memory _baseMetadataURI,
        address _owner
    ) Ownable(_owner) {
        require(_fuzailToken != address(0), "TokenToNFT: zero token address");
        require(_fuzailNFT != address(0), "TokenToNFT: zero NFT address");
        require(_requiredTokens > 0, "TokenToNFT: required tokens must be > 0");

        fuzailToken = IERC20(_fuzailToken);
        fuzailNFT = FuzailNFT(_fuzailNFT);
        requiredTokens = _requiredTokens;
        baseMetadataURI = _baseMetadataURI;
    }

    /**
     * @notice Deposit required tokens and mint 1 NFT directly to user's wallet.
     */
    function depositTokensForNFT() external nonReentrant {
        address user = msg.sender;

        // ── Checks ──────────────────────────────────────────────────────────
        uint256 userBalance = fuzailToken.balanceOf(user);
        require(userBalance >= requiredTokens, "TokenToNFT: insufficient token balance");

        uint256 allowance = fuzailToken.allowance(user, address(this));
        require(allowance >= requiredTokens, "TokenToNFT: insufficient allowance");

        // ── Interactions ────────────────────────────────────────────────────
        fuzailToken.safeTransferFrom(user, address(this), requiredTokens);

        uint256 nextId = fuzailNFT.nextTokenId();
        string memory tokenURI = string(
            abi.encodePacked(baseMetadataURI, _uint2str(nextId), ".json")
        );

        uint256 mintedId = fuzailNFT.mintNFT(user, tokenURI);
        require(mintedId == nextId, "TokenToNFT: unexpected token ID");

        emit TokensDeposited(user, requiredTokens, mintedId, block.timestamp);
    }

    function setRequiredTokens(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "TokenToNFT: must be > 0");
        requiredTokens = newAmount;
        emit RequiredTokensUpdated(newAmount);
    }

    function setBaseMetadataURI(string memory _uri) external onlyOwner {
        baseMetadataURI = _uri;
        emit BaseURIUpdated(_uri);
    }

    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "TokenToNFT: zero address");
        fuzailToken.safeTransfer(to, amount);
        emit TokensWithdrawn(to, amount);
    }

    function contractTokenBalance() external view returns (uint256) {
        return fuzailToken.balanceOf(address(this));
    }

    function _uint2str(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
