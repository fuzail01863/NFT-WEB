// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FuzailToken.sol";
import "./FuzailNFT.sol";

/**
 * @title TokenToNFT
 * @dev Exchange contract: Users deposit exactly 5 FZT tokens and receive 1 FZNFT.
 *
 * Security:
 * - Uses SafeERC20 for safe ERC-20 transfers.
 * - Uses ReentrancyGuard to prevent re-entrancy attacks.
 * - Checks-Effects-Interactions pattern applied.
 * - Exactly 5 tokens (with 18 decimals) required per mint.
 * - One deposit always produces exactly one NFT — no more, no less.
 */
contract TokenToNFT is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─────────────────────────── State variables ───────────────────────────

    IERC20 public immutable fuzailToken;
    FuzailNFT public immutable fuzailNFT;

    /// @dev Exactly 5 FZT tokens required (18 decimals).
    uint256 public constant REQUIRED_TOKENS = 5 * 10 ** 18;

    /// @dev Base metadata URI used for minted NFTs.
    string public baseMetadataURI;

    // ──────────────────────────────── Events ───────────────────────────────

    event TokensDeposited(
        address indexed user,
        uint256 tokenAmount,
        uint256 indexed nftTokenId,
        uint256 timestamp
    );
    event BaseURIUpdated(string newURI);
    event TokensWithdrawn(address indexed to, uint256 amount);

    // ──────────────────────────── Constructor ──────────────────────────────

    /**
     * @param _fuzailToken Address of the deployed FuzailToken contract.
     * @param _fuzailNFT   Address of the deployed FuzailNFT contract.
     * @param _baseMetadataURI Base URI for NFT metadata (e.g. "https://api.example.com/metadata/").
     */
    constructor(
        address _fuzailToken,
        address _fuzailNFT,
        string memory _baseMetadataURI
    ) Ownable(msg.sender) {
        require(_fuzailToken != address(0), "TokenToNFT: zero token address");
        require(_fuzailNFT != address(0), "TokenToNFT: zero NFT address");

        fuzailToken = IERC20(_fuzailToken);
        fuzailNFT = FuzailNFT(_fuzailNFT);
        baseMetadataURI = _baseMetadataURI;
    }

    // ───────────────────────────── Core logic ──────────────────────────────

    /**
     * @notice Deposit exactly 5 FZT tokens and receive 1 FZNFT.
     *
     * Flow:
     * 1. User approves this contract to spend 5 FZT (done from the frontend).
     * 2. User calls depositTokensForNFT().
     * 3. Contract pulls 5 FZT from user (transferFrom).
     * 4. Contract mints exactly 1 NFT directly to the user's wallet.
     *
     * @dev ReentrancyGuard prevents recursive calls.
     *      Checks → Effects → Interactions pattern applied.
     */
    function depositTokensForNFT() external nonReentrant {
        address user = msg.sender;

        // ── Checks ──────────────────────────────────────────────────────────
        uint256 userBalance = fuzailToken.balanceOf(user);
        require(userBalance >= REQUIRED_TOKENS, "TokenToNFT: insufficient FZT balance");

        uint256 allowance = fuzailToken.allowance(user, address(this));
        require(allowance >= REQUIRED_TOKENS, "TokenToNFT: insufficient allowance");

        // ── Effects: nothing on-chain to mutate before the external calls ──
        // (The NFT contract tracks token IDs internally.)

        // ── Interactions ────────────────────────────────────────────────────
        // Pull exactly 5 FZT from user. SafeERC20 reverts on failure.
        fuzailToken.safeTransferFrom(user, address(this), REQUIRED_TOKENS);

        // Build a deterministic token URI from the next token ID.
        uint256 nextId = fuzailNFT.nextTokenId();
        string memory tokenURI = string(
            abi.encodePacked(baseMetadataURI, _uint2str(nextId), ".json")
        );

        // Mint exactly 1 NFT to the user. The NFT contract increments its own counter.
        uint256 mintedId = fuzailNFT.mintNFT(user, tokenURI);

        // Sanity check: ensure we minted exactly the expected token.
        require(mintedId == nextId, "TokenToNFT: unexpected token ID");

        emit TokensDeposited(user, REQUIRED_TOKENS, mintedId, block.timestamp);
    }

    // ───────────────────────────── Admin ───────────────────────────────────

    /**
     * @dev Update the base metadata URI (owner only).
     */
    function setBaseMetadataURI(string memory _uri) external onlyOwner {
        baseMetadataURI = _uri;
        emit BaseURIUpdated(_uri);
    }

    /**
     * @dev Withdraw accumulated FZT tokens to a specified address (owner only).
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "TokenToNFT: zero address");
        fuzailToken.safeTransfer(to, amount);
        emit TokensWithdrawn(to, amount);
    }

    /**
     * @dev Returns the FZT token balance held by this contract.
     */
    function contractTokenBalance() external view returns (uint256) {
        return fuzailToken.balanceOf(address(this));
    }

    // ───────────────────────── Internal helpers ────────────────────────────

    /**
     * @dev Converts a uint256 to its ASCII string representation.
     */
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
