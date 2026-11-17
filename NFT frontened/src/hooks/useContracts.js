import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { FUZAIL_TOKEN_ABI, FUZAIL_NFT_ABI, TOKEN_TO_NFT_ABI } from '../contracts/abis';

const TOKEN_ADDRESS = import.meta.env.VITE_FUZAIL_TOKEN_ADDRESS;
const NFT_ADDRESS = import.meta.env.VITE_FUZAIL_NFT_ADDRESS;
const EXCHANGE_ADDRESS = import.meta.env.VITE_TOKEN_TO_NFT_ADDRESS;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const REQUIRED_TOKENS = ethers.parseEther('5');

export const useContracts = (signer, provider, account) => {
  const [tokenContract, setTokenContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [exchangeContract, setExchangeContract] = useState(null);

  const [tokenBalance, setTokenBalance] = useState('0');
  const [nftBalance, setNFTBalance] = useState('0');
  const [totalMinted, setTotalMinted] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [userNFTs, setUserNFTs] = useState([]);

  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message, id: Date.now() });
    setTimeout(() => setNotification(null), 6000);
  };

  // Initialize contracts
  useEffect(() => {
    if (!signer || !provider) return;
    try {
      const tokenC = new ethers.Contract(TOKEN_ADDRESS, FUZAIL_TOKEN_ABI, signer);
      const nftC = new ethers.Contract(NFT_ADDRESS, FUZAIL_NFT_ABI, provider);
      const exchangeC = new ethers.Contract(EXCHANGE_ADDRESS, TOKEN_TO_NFT_ABI, signer);
      setTokenContract(tokenC);
      setNFTContract(nftC);
      setExchangeContract(exchangeC);
    } catch (err) {
      console.error('Contract init error:', err);
    }
  }, [signer, provider]);

  // Load blockchain data
  const refreshData = useCallback(async () => {
    if (!tokenContract || !nftContract || !account) return;
    setLoadingData(true);
    try {
      const [tokenBal, nftBal, minted, allow] = await Promise.all([
        tokenContract.balanceOf(account),
        nftContract.balanceOf(account),
        nftContract.totalMinted(),
        tokenContract.allowance(account, EXCHANGE_ADDRESS),
      ]);
      setTokenBalance(ethers.formatEther(tokenBal));
      setNFTBalance(nftBal.toString());
      setTotalMinted(minted.toString());
      setAllowance(allow.toString());

      // Load user's NFT token IDs from backend
      await loadUserNFTs(account, Number(nftBal));
    } catch (err) {
      console.error('Data refresh error:', err);
    } finally {
      setLoadingData(false);
    }
  }, [tokenContract, nftContract, account]);

  const loadUserNFTs = async (walletAddress, nftCount) => {
    if (nftCount === 0) {
      setUserNFTs([]);
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/nft/user/${walletAddress}`
      );
      if (res.ok) {
        const data = await res.json();
        setUserNFTs(data.nfts || []);
      }
    } catch (err) {
      console.error('Failed to load user NFTs:', err);
    }
  };

  useEffect(() => {
    if (tokenContract && nftContract && account) {
      refreshData();
    }
  }, [tokenContract, nftContract, account, refreshData]);

  // Approve 5 FZT tokens
  const approveTokens = useCallback(async () => {
    if (!tokenContract) return;
    setIsApproving(true);
    try {
      showNotification('info', '📝 Requesting approval for 5 FZT tokens...');
      const tx = await tokenContract.approve(EXCHANGE_ADDRESS, REQUIRED_TOKENS);
      showNotification('info', `⏳ Approval transaction submitted. Waiting for confirmation...`);
      setTxHash(tx.hash);
      await tx.wait();
      showNotification('success', '✅ Approval confirmed! You can now mint your NFT.');
      await refreshData();
    } catch (err) {
      const msg = err.reason || err.message || 'Approval failed';
      showNotification('error', `❌ ${msg}`);
    } finally {
      setIsApproving(false);
    }
  }, [tokenContract, refreshData]);

  // Mint NFT (deposit 5 FZT)
  const mintNFT = useCallback(async () => {
    if (!exchangeContract) return;
    setIsMinting(true);
    try {
      showNotification('info', '🚀 Submitting NFT mint transaction...');
      const tx = await exchangeContract.depositTokensForNFT();
      setTxHash(tx.hash);
      showNotification('info', `⏳ Transaction submitted! Waiting for blockchain confirmation...`);
      const receipt = await tx.wait();

      // Extract minted NFT token ID from event logs
      let mintedTokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = exchangeContract.interface.parseLog(log);
          if (parsed && parsed.name === 'TokensDeposited') {
            mintedTokenId = parsed.args.nftTokenId.toString();
          }
        } catch {}
      }

      // Record to backend
      try {
        await fetch(`${BACKEND_URL}/api/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: account,
            txHash: receipt.hash,
            tokenAmount: '5',
            nftTokenId: mintedTokenId,
            status: 'confirmed',
          }),
        });
      } catch (backendErr) {
        console.warn('Backend recording failed (non-critical):', backendErr);
      }

      showNotification(
        'success',
        `🎉 NFT #${mintedTokenId || '?'} minted successfully to your wallet!`
      );
      await refreshData();
    } catch (err) {
      const msg = err.reason || err.message || 'Minting failed';
      showNotification('error', `❌ ${msg}`);
    } finally {
      setIsMinting(false);
    }
  }, [exchangeContract, account, refreshData]);

  const hasEnoughAllowance = BigInt(allowance) >= REQUIRED_TOKENS;
  const hasEnoughTokens = parseFloat(tokenBalance) >= 5;

  return {
    tokenBalance,
    nftBalance,
    totalMinted,
    allowance,
    userNFTs,
    isApproving,
    isMinting,
    txHash,
    notification,
    loadingData,
    hasEnoughAllowance,
    hasEnoughTokens,
    TOKEN_ADDRESS,
    NFT_ADDRESS,
    EXCHANGE_ADDRESS,
    approveTokens,
    mintNFT,
    refreshData,
  };
};
