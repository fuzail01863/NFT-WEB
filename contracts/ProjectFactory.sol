// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./FuzailToken.sol";
import "./FuzailNFT.sol";
import "./TokenToNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectFactory
 * @dev Factory contract allowing anyone to deploy their own dynamic Token, NFT collection,
 * and TokenToNFT Exchange contract in one single transaction!
 */
contract ProjectFactory is Ownable {
    struct ProjectParams {
        string tokenName;
        string tokenSymbol;
        uint8 tokenDecimals;
        uint256 tokenInitialSupply;
        string nftName;
        string nftSymbol;
        uint256 nftMaxSupply;
        uint256 tokensPerNFT;
        string baseMetadataURI;
    }

    struct Project {
        uint256 projectId;
        address creator;
        address tokenAddress;
        address nftAddress;
        address exchangeAddress;
        string tokenName;
        string tokenSymbol;
        uint8 tokenDecimals;
        string nftName;
        string nftSymbol;
        uint256 nftMaxSupply;
        uint256 tokensPerNFT;
        string baseMetadataURI;
        uint256 createdAt;
    }

    Project[] public projects;
    mapping(address => uint256[]) private creatorProjects;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        address tokenAddress,
        address nftAddress,
        address exchangeAddress,
        uint256 tokensPerNFT,
        uint256 createdAt
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Deploy dynamic Token, NFT and Exchange in 1 single atomic transaction
     */
    function createProject(ProjectParams calldata params) external returns (uint256) {
        require(bytes(params.tokenName).length > 0, "Factory: empty token name");
        require(bytes(params.tokenSymbol).length > 0, "Factory: empty token symbol");
        require(bytes(params.nftName).length > 0, "Factory: empty NFT name");
        require(bytes(params.nftSymbol).length > 0, "Factory: empty NFT symbol");
        require(params.tokensPerNFT > 0, "Factory: tokens per NFT must be > 0");

        // 1. Deploy Custom ERC-20 Token
        FuzailToken token = new FuzailToken(
            params.tokenName,
            params.tokenSymbol,
            params.tokenDecimals,
            params.tokenInitialSupply,
            msg.sender
        );

        // 2. Deploy Custom ERC-721 NFT
        FuzailNFT nft = new FuzailNFT(
            params.nftName,
            params.nftSymbol,
            params.nftMaxSupply,
            params.baseMetadataURI,
            address(this)
        );

        // 3. Deploy TokenToNFT Exchange
        TokenToNFT exchange = new TokenToNFT(
            address(token),
            address(nft),
            params.tokensPerNFT,
            params.baseMetadataURI,
            msg.sender
        );

        // 4. Transfer NFT ownership to Exchange
        nft.transferOwnership(address(exchange));

        // 5. Store project directly in storage array
        uint256 projectId = projects.length;
        projects.push();
        Project storage newProj = projects[projectId];
        newProj.projectId = projectId;
        newProj.creator = msg.sender;
        newProj.tokenAddress = address(token);
        newProj.nftAddress = address(nft);
        newProj.exchangeAddress = address(exchange);
        newProj.tokenName = params.tokenName;
        newProj.tokenSymbol = params.tokenSymbol;
        newProj.tokenDecimals = params.tokenDecimals;
        newProj.nftName = params.nftName;
        newProj.nftSymbol = params.nftSymbol;
        newProj.nftMaxSupply = params.nftMaxSupply;
        newProj.tokensPerNFT = params.tokensPerNFT;
        newProj.baseMetadataURI = params.baseMetadataURI;
        newProj.createdAt = block.timestamp;

        creatorProjects[msg.sender].push(projectId);

        emit ProjectCreated(
            projectId,
            msg.sender,
            address(token),
            address(nft),
            address(exchange),
            params.tokensPerNFT,
            block.timestamp
        );

        return projectId;
    }

    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }

    function totalProjects() external view returns (uint256) {
        return projects.length;
    }

    function getProject(uint256 projectId) external view returns (Project memory) {
        require(projectId < projects.length, "Factory: invalid project ID");
        return projects[projectId];
    }

    function getCreatorProjects(address creator) external view returns (uint256[] memory) {
        return creatorProjects[creator];
    }
}
