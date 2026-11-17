import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  FACTORY_ADDRESS, 
  INITIAL_PROJECT, 
  PROJECT_FACTORY_ABI, 
  FUZAIL_TOKEN_ABI, 
  FUZAIL_NFT_ABI, 
  TOKEN_TO_NFT_ABI 
} from '../contracts/abis';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const useContracts = (signer, provider, account) => {
  const [factoryContract, setFactoryContract] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(0);

  // Active project contracts
  const [tokenContract, setTokenContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [exchangeContract, setExchangeContract] = useState(null);

  // Active project state
  const [tokenBalance, setTokenBalance] = useState('0');
  const [nftBalance, setNFTBalance] = useState('0');
  const [totalMinted, setTotalMinted] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [requiredTokensRaw, setRequiredTokensRaw] = useState(ethers.parseEther('5'));
  const [userNFTs, setUserNFTs] = useState([]);

  // Loading & status
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message, id: Date.now() });
    setTimeout(() => setNotification(null), 7000);
  };

  // 1. Initialize Factory
  useEffect(() => {
    if (!provider || !FACTORY_ADDRESS || FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      // Fallback to default initial project if factory address not set
      if (INITIAL_PROJECT) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
      return;
    }

    try {
      const runner = signer || provider;
      const factory = new ethers.Contract(FACTORY_ADDRESS, PROJECT_FACTORY_ABI, runner);
      setFactoryContract(factory);
    } catch (err) {
      console.warn('Factory init error:', err);
    }
  }, [signer, provider]);

  // 2. Fetch all projects from Factory
  const refreshProjects = useCallback(async () => {
    if (!factoryContract) {
      if (INITIAL_PROJECT) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
      return;
    }

    try {
      const rawProjects = await factoryContract.getAllProjects();
      if (rawProjects && rawProjects.length > 0) {
        const formatted = rawProjects.map((p) => ({
          projectId: Number(p.projectId),
          creator: p.creator,
          tokenAddress: p.tokenAddress,
          nftAddress: p.nftAddress,
          exchangeAddress: p.exchangeAddress,
          tokenName: p.tokenName,
          tokenSymbol: p.tokenSymbol,
          tokenDecimals: Number(p.tokenDecimals),
          nftName: p.nftName,
          nftSymbol: p.nftSymbol,
          nftMaxSupply: Number(p.nftMaxSupply),
          tokensPerNFT: p.tokensPerNFT.toString(),
          formattedRate: ethers.formatUnits(p.tokensPerNFT, Number(p.tokenDecimals)),
          baseMetadataURI: p.baseMetadataURI,
        }));
        setProjects(formatted);
      } else if (INITIAL_PROJECT) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
    } catch (err) {
      console.warn('Fetch projects error, falling back to initial project:', err);
      if (INITIAL_PROJECT) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
    }
  }, [factoryContract]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // 3. Bind contracts for selected project
  const currentProject = projects.find((p) => p.projectId === selectedProjectId) || projects[0] || INITIAL_PROJECT;

  useEffect(() => {
    if (!currentProject || !provider) return;

    try {
      const runner = signer || provider;
      const token = new ethers.Contract(currentProject.tokenAddress, FUZAIL_TOKEN_ABI, runner);
      const nft = new ethers.Contract(currentProject.nftAddress, FUZAIL_NFT_ABI, provider);
      const exchange = new ethers.Contract(currentProject.exchangeAddress, TOKEN_TO_NFT_ABI, runner);

      setTokenContract(token);
      setNFTContract(nft);
      setExchangeContract(exchange);
      setRequiredTokensRaw(BigInt(currentProject.tokensPerNFT || ethers.parseEther('5')));
    } catch (err) {
      console.warn('Selected project contracts init error:', err);
    }
  }, [currentProject, signer, provider]);

  // 4. Refresh balances and data
  const refreshData = useCallback(async () => {
    if (!tokenContract || !nftContract || !exchangeContract || !account) return;

    setLoadingData(true);
    try {
      const decimals = currentProject?.tokenDecimals || 18;
      const [tokenBal, nftBal, minted, allow, reqTokens] = await Promise.all([
        tokenContract.balanceOf(account),
        nftContract.balanceOf(account),
        nftContract.totalMinted(),
        tokenContract.allowance(account, currentProject.exchangeAddress),
        exchangeContract.requiredTokens().catch(() => requiredTokensRaw),
      ]);

      setTokenBalance(ethers.formatUnits(tokenBal, decimals));
      setNFTBalance(nftBal.toString());
      setTotalMinted(minted.toString());
      setAllowance(allow.toString());
      setRequiredTokensRaw(reqTokens);

      // Fetch user NFTs from backend or synthesize
      loadUserNFTs(account, Number(nftBal));
    } catch (err) {
      console.warn('Refresh data error:', err);
    } finally {
      setLoadingData(false);
    }
  }, [tokenContract, nftContract, exchangeContract, account, currentProject, requiredTokensRaw]);

  const loadUserNFTs = async (walletAddress, count) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nft/user/${walletAddress}`);
      if (res.ok) {
        const data = await res.json();
        setUserNFTs(data.nfts || []);
      }
    } catch {}
  };

  useEffect(() => {
    if (tokenContract && account) {
      refreshData();
    }
  }, [tokenContract, account, refreshData]);

  // 5. Create new project via Factory
  const createProject = useCallback(async (params) => {
    if (!factoryContract) {
      showNotification('error', 'Factory contract not loaded. Please connect MetaMask.');
      return;
    }

    setIsCreatingProject(true);
    try {
      showNotification('info', `Deploying "${params.tokenName}" & "${params.nftName}" via Factory...`);

      const decimals = Number(params.tokenDecimals || 18);
      const supplyRaw = ethers.parseUnits(params.tokenInitialSupply || '1000000', decimals);
      const rateRaw = ethers.parseUnits(params.tokensPerNFT || '5', decimals);

      const tx = await factoryContract.createProject({
        tokenName: params.tokenName,
        tokenSymbol: params.tokenSymbol,
        tokenDecimals: decimals,
        tokenInitialSupply: supplyRaw,
        nftName: params.nftName,
        nftSymbol: params.nftSymbol,
        nftMaxSupply: Number(params.nftMaxSupply || 0),
        tokensPerNFT: rateRaw,
        baseMetadataURI: params.baseMetadataURI || 'http://localhost:8000/api/metadata/',
      });

      setTxHash(tx.hash);
      showNotification('info', 'Transaction submitted! Waiting for block confirmation...');
      await tx.wait();

      showNotification('success', '🎉 New Project Deployed Successfully on-chain!');
      await refreshProjects();
    } catch (err) {
      console.error('Create project failed:', err);
      showNotification('error', `❌ Deployment failed: ${err.reason || err.message}`);
    } finally {
      setIsCreatingProject(false);
    }
  }, [factoryContract, refreshProjects]);

  // 6. Approve tokens
  const approveTokens = useCallback(async () => {
    if (!tokenContract || !currentProject) return;
    setIsApproving(true);
    try {
      showNotification('info', `Requesting approval to deposit ${currentProject.formattedRate} ${currentProject.tokenSymbol}...`);
      const tx = await tokenContract.approve(currentProject.exchangeAddress, requiredTokensRaw);
      setTxHash(tx.hash);
      showNotification('info', 'Approval submitted. Please wait for confirmation...');
      await tx.wait();
      showNotification('success', '✅ Tokens approved! You can now deposit and mint.');
      await refreshData();
    } catch (err) {
      showNotification('error', `❌ ${err.reason || err.message || 'Approval rejected'}`);
    } finally {
      setIsApproving(false);
    }
  }, [tokenContract, currentProject, requiredTokensRaw, refreshData]);

  // 7. Deposit tokens & Mint NFT
  const mintNFT = useCallback(async () => {
    if (!exchangeContract || !account) return;
    setIsMinting(true);
    try {
      showNotification('info', `Depositing ${currentProject.formattedRate} ${currentProject.tokenSymbol} to mint 1 NFT...`);
      const tx = await exchangeContract.depositTokensForNFT();
      setTxHash(tx.hash);
      showNotification('info', 'Mint transaction submitted! Waiting for confirmation...');
      const receipt = await tx.wait();

      // Extract minted token ID
      let mintedId = totalMinted ? (Number(totalMinted) + 1).toString() : '1';
      for (const log of receipt.logs) {
        try {
          const parsed = exchangeContract.interface.parseLog(log);
          if (parsed && parsed.name === 'TokensDeposited') {
            mintedId = parsed.args.nftTokenId.toString();
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
            tokenAmount: currentProject.formattedRate,
            nftTokenId: mintedId,
            status: 'confirmed',
          }),
        });
      } catch {}

      showNotification('success', `🎉 NFT #${mintedId} successfully minted directly to your wallet!`);
      await refreshData();
    } catch (err) {
      showNotification('error', `❌ ${err.reason || err.message || 'Mint failed'}`);
    } finally {
      setIsMinting(false);
    }
  }, [exchangeContract, account, currentProject, totalMinted, refreshData]);

  // 8. Faucet: Mint 100 test tokens to caller (owner only, or for testing)
  const claimFaucetTokens = useCallback(async () => {
    if (!tokenContract || !account) return;
    setIsClaimingFaucet(true);
    try {
      const decimals = currentProject?.tokenDecimals || 18;
      const amount = ethers.parseUnits('100', decimals);
      showNotification('info', `Minting 100 test ${currentProject.tokenSymbol} to your wallet...`);
      const tx = await tokenContract.mint(account, amount);
      setTxHash(tx.hash);
      await tx.wait();
      showNotification('success', `✅ 100 ${currentProject.tokenSymbol} received!`);
      await refreshData();
    } catch (err) {
      showNotification('warning', `Faucet notice: ${err.reason || 'Only token owner/creator can mint test supply directly.'}`);
    } finally {
      setIsClaimingFaucet(false);
    }
  }, [tokenContract, account, currentProject, refreshData]);

  const hasEnoughAllowance = BigInt(allowance || '0') >= requiredTokensRaw;
  const hasEnoughTokens = parseFloat(tokenBalance || '0') >= parseFloat(currentProject?.formattedRate || '5');

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    currentProject,
    tokenBalance,
    nftBalance,
    totalMinted,
    allowance,
    userNFTs,
    isApproving,
    isMinting,
    isCreatingProject,
    isClaimingFaucet,
    txHash,
    notification,
    loadingData,
    hasEnoughAllowance,
    hasEnoughTokens,
    createProject,
    approveTokens,
    mintNFT,
    claimFaucetTokens,
    refreshData,
    refreshProjects,
  };
};
