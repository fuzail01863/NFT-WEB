# Fuzail NFT Marketplace 🚀

A full-stack Web3 DApp where users deposit **5 FZT (Fuzail Tokens)** and receive **1 Fuzail NFT (FZNFT)** automatically — all on-chain via Solidity smart contracts deployed on **Sepolia Testnet**.

---

## 📐 Architecture

```
/contracts         ← Solidity smart contracts (Hardhat)
  FuzailToken.sol  ← ERC-20 token (FZT)
  FuzailNFT.sol    ← ERC-721 NFT (FZNFT)
  TokenToNFT.sol   ← Exchange contract

/scripts           ← Hardhat deployment scripts
/test              ← Automated Hardhat tests

/NFT frontened     ← React + Vite + Tailwind + Ethers.js v6 frontend
/NFT backened      ← Node.js + Express + MongoDB backend
```

---

## 🔄 How It Works

1. User connects MetaMask (Sepolia network)
2. User clicks **Approve 5 FZT** → MetaMask prompts ERC-20 approval
3. User clicks **Mint NFT** → `TokenToNFT.depositTokensForNFT()` called
4. Contract pulls 5 FZT via `transferFrom`
5. Contract calls `FuzailNFT.mintNFT()` → 1 FZNFT sent to user's wallet
6. Frontend + Backend update with the new NFT

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- MongoDB Atlas account (or local MongoDB)
- Alchemy or Infura account (for Sepolia RPC)
- Etherscan API key (for contract verification)

---

### 1. Root (Hardhat)

```bash
cd "NFT Web"
npm install
cp .env.example .env
# Fill in PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

### 4. Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

This will:
- Deploy FuzailToken → FuzailNFT → TokenToNFT
- Transfer NFT ownership to TokenToNFT
- Auto-export ABIs and addresses to frontend & backend

---

### 5. Backend Setup

```bash
cd "NFT backened"
npm install
# .env already exists — verify MONGODB_URI is correct
npm start
# → Running on http://localhost:8000
```

### 6. Frontend Setup

```bash
cd "NFT frontened"
npm install

# Create/edit .env:
VITE_FUZAIL_TOKEN_ADDRESS=<deployed FuzailToken address>
VITE_FUZAIL_NFT_ADDRESS=<deployed FuzailNFT address>
VITE_TOKEN_TO_NFT_ADDRESS=<deployed TokenToNFT address>
VITE_BACKEND_URL=http://localhost:8000
VITE_CHAIN_ID=11155111

npm run dev
# → Running on http://localhost:5173
```

---

## 🔐 Security

| Feature | Implementation |
|---------|---------------|
| Re-entrancy protection | `ReentrancyGuard` on `depositTokensForNFT` |
| Safe token transfers | `SafeERC20.safeTransferFrom` |
| NFT mint restriction | `Ownable` — only exchange contract can mint |
| Checks-Effects-Interactions | Applied in `depositTokensForNFT` |
| No private keys in frontend | All signing done by MetaMask |
| Input validation | Backend middleware + Solidity `require` |
| Duplicate NFT prevention | Single atomic tx: transfer → mint |

---

## 📄 Contract Addresses (Sepolia)

> Fill in after deployment

| Contract | Address |
|---------|---------|
| FuzailToken (FZT) | `TBD` |
| FuzailNFT (FZNFT) | `TBD` |
| TokenToNFT (Exchange) | `TBD` |

---

## 🧪 Test Coverage

| Test | Description |
|------|-------------|
| ✅ ERC-20 initial supply | 1,000,000 FZT minted to deployer |
| ✅ ERC-20 transfers | Standard transfer works |
| ✅ NFT unique minting | Sequential token IDs from 1 |
| ✅ Only owner mints NFTs | Reverts for non-owner |
| ✅ Exchange owns NFT contract | Post-deployment ownership check |
| ✅ Approval required | Reverts without approval |
| ✅ Exactly 5 tokens | Reverts with less/more |
| ✅ Successful mint | 1 NFT per 5 FZT deposit |
| ✅ No duplicate NFTs | One deposit = exactly one NFT |
| ✅ Insufficient balance | Reverts with clear error |
| ✅ No approval = revert | Insufficient allowance error |
| ✅ Failed tx = no NFT | Atomic rollback on failure |
| ✅ Multiple deposits | Correct NFT count for all users |

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/transactions` | Save confirmed transaction |
| GET | `/api/transactions/:wallet` | Get wallet's transaction history |
| GET | `/api/transactions` | All transactions (paginated) |
| GET | `/api/nft/user/:wallet` | NFTs owned by wallet |
| GET | `/api/nft/total` | Total NFTs minted |
| GET | `/api/nft/:tokenId` | Specific NFT info |
| GET | `/api/metadata/:tokenId` | ERC-721 metadata JSON |
| GET | `/api/contracts` | All contract addresses + ABIs |
| GET | `/api/contracts/:name` | Specific contract ABI |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity 0.8.24, OpenZeppelin 5 |
| Development | Hardhat, ethers.js |
| Frontend | React 19, Vite 8, Tailwind CSS 3, Ethers.js v6, Lucide React |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB (Mongoose) |
| Blockchain | Ethereum Sepolia Testnet |

---

## 📝 Verify Contracts on Etherscan

```bash
# After deployment, run:
npx hardhat verify --network sepolia <FUZAIL_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <FUZAIL_NFT_ADDRESS> "https://api.fuzailnft.com/metadata/"
npx hardhat verify --network sepolia <TOKEN_TO_NFT_ADDRESS> <FUZAIL_TOKEN_ADDRESS> <FUZAIL_NFT_ADDRESS> "https://api.fuzailnft.com/metadata/"
```

---

## ⚠️ Important Notes

- **Never commit your `.env` file** with real private keys
- Always test on **local Hardhat network** before deploying to Sepolia
- Get **Sepolia ETH** from: https://sepoliafaucet.com
- Get **FZT tokens** from the deployer wallet (initial supply: 1,000,000 FZT)

---

*Built with ❤️ — Fuzail NFT Marketplace*
