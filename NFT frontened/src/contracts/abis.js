// Contract ABIs - Updated after deployment
// Run `npx hardhat run scripts/deploy.js` to auto-populate contractConfig.json

export const FUZAIL_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const FUZAIL_NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalMinted() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function owner() view returns (address)",
  "event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI)"
];

export const TOKEN_TO_NFT_ABI = [
  "function depositTokensForNFT() nonpayable",
  "function REQUIRED_TOKENS() view returns (uint256)",
  "function fuzailToken() view returns (address)",
  "function fuzailNFT() view returns (address)",
  "function contractTokenBalance() view returns (uint256)",
  "function baseMetadataURI() view returns (string)",
  "event TokensDeposited(address indexed user, uint256 tokenAmount, uint256 indexed nftTokenId, uint256 timestamp)"
];
