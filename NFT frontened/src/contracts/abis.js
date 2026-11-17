// src/contracts/abis.js
import config from './contractConfig.json';

export const FACTORY_ADDRESS = config.factoryAddress;
export const INITIAL_PROJECT = config.initialProject;

export const PROJECT_FACTORY_ABI = config.contracts?.ProjectFactory?.abi || [
  "function createProject((string tokenName, string tokenSymbol, uint8 tokenDecimals, uint256 tokenInitialSupply, string nftName, string nftSymbol, uint256 nftMaxSupply, uint256 tokensPerNFT, string baseMetadataURI)) returns (uint256)",
  "function getAllProjects() view returns (tuple(uint256 projectId, address creator, address tokenAddress, address nftAddress, address exchangeAddress, string tokenName, string tokenSymbol, uint8 tokenDecimals, string nftName, string nftSymbol, uint256 nftMaxSupply, uint256 tokensPerNFT, string baseMetadataURI, uint256 createdAt)[])",
  "function totalProjects() view returns (uint256)",
  "function getProject(uint256) view returns (tuple(uint256 projectId, address creator, address tokenAddress, address nftAddress, address exchangeAddress, string tokenName, string tokenSymbol, uint8 tokenDecimals, string nftName, string nftSymbol, uint256 nftMaxSupply, uint256 tokensPerNFT, string baseMetadataURI, uint256 createdAt))",
  "event ProjectCreated(uint256 indexed projectId, address indexed creator, address tokenAddress, address nftAddress, address exchangeAddress, uint256 tokensPerNFT, uint256 createdAt)"
];

export const FUZAIL_TOKEN_ABI = config.contracts?.FuzailToken?.abi || [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)"
];

export const FUZAIL_NFT_ABI = config.contracts?.FuzailNFT?.abi || [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalMinted() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function owner() view returns (address)",
  "event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI)"
];

export const TOKEN_TO_NFT_ABI = config.contracts?.TokenToNFT?.abi || [
  "function depositTokensForNFT() nonpayable",
  "function requiredTokens() view returns (uint256)",
  "function fuzailToken() view returns (address)",
  "function fuzailNFT() view returns (address)",
  "function contractTokenBalance() view returns (uint256)",
  "function baseMetadataURI() view returns (string)",
  "event TokensDeposited(address indexed user, uint256 tokenAmount, uint256 indexed nftTokenId, uint256 timestamp)"
];
