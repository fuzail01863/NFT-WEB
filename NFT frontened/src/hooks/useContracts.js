import { useState, useEffect, useCallback, useRef } from 'react';
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

  const isRefreshingRef = useRef(false);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message, id: Date.now() });
    setTimeout(() => setNotification(null), 6000);
  }, []);

  // Safe check if contract bytecode exists
  const checkContractExists = useCallback(async (address) => {
    if (!address || address === ethers.ZeroAddress || !provider) return false;
    try {
      const code = await provider.getCode(address);
      return code && code !== '0x' && code !== '0x0';
    } catch {
      return false;
    }
  }, [provider]);

  // 1. Initialize Factory Contract silently
  useEffect(() => {
    if (!provider || !FACTORY_ADDRESS || FACTORY_ADDRESS === ethers.ZeroAddress) {
      if (INITIAL_PROJECT) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
      return;
    }

    let isMounted = true;
    const initFactory = async () => {
      const exists = await checkContractExists(FACTORY_ADDRESS);
      if (!isMounted) return;

      if (!exists) {
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
      } catch {}
    };

    initFactory();
    return () => { isMounted = false; };
  }, [signer, provider, checkContractExists]);

  // 2. Fetch projects from Factory
  const refreshProjects = useCallback(async () => {
    if (!factoryContract) {
      if (INITIAL_PROJECT && projects.length === 0) {
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
      }
    } catch {
      if (INITIAL_PROJECT && projects.length === 0) {
        setProjects([{
          ...INITIAL_PROJECT,
          formattedRate: ethers.formatEther(INITIAL_PROJECT.tokensPerNFT || ethers.parseEther('5')),
        }]);
      }
    }
  }, [factoryContract, projects.length]);

  useEffect(() => {
    if (factoryContract) {
      refreshProjects();
    }
  }, [factoryContract, refreshProjects]);

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
    } catch {}
  }, [currentProject?.projectId, currentProject?.tokenAddress, currentProject?.nftAddress, currentProject?.exchangeAddress, signer, provider]);

  // 4. Refresh balances and data cleanly
  const refreshData = useCallback(async () => {
    if (!tokenContract || !nftContract || !exchangeContract || !account || !provider) return;
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setLoadingData(true);

    try {
      const exists = await checkContractExists(currentProject.exchangeAddress);
      if (!exists) {
        // Safe default state when contracts aren't deployed on this specific chain
        setTokenBalance('0');
        setNFTBalance('0');
        setTotalMinted('0');
        setAllowance('0');
        return;
      }

      const decimals = currentProject?.tokenDecimals || 18;
      const [tokenBal, nftBal, minted, allow, reqTokens] = await Promise.all([
        tokenContract.balanceOf(account).catch(() => 0n),
        nftContract.balanceOf(account).catch(() => 0n),
        nftContract.totalMinted().catch(() => 0n),
        tokenContract.allowance(account, currentProject.exchangeAddress).catch(() => 0n),
        exchangeContract.requiredTokens().catch(() => ethers.parseEther('5')),
      ]);

      setTokenBalance(ethers.formatUnits(tokenBal, decimals));
      setNFTBalance(nftBal.toString());
      setTotalMinted(minted.toString());
      setAllowance(allow.toString());
      setRequiredTokensRaw(reqTokens);

      loadUserNFTs(account);
    } catch {} finally {
      setLoadingData(false);
      isRefreshingRef.current = false;
    }
  }, [tokenContract, nftContract, exchangeContract, account, provider, currentProject, checkContractExists]);

  useEffect(() => {
    if (account && tokenContract && currentProject) {
      refreshData();
    }
  }, [account, currentProject?.tokenAddress, currentProject?.exchangeAddress, tokenContract]);

  const loadUserNFTs = async (walletAddress) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/nft/user/${walletAddress}`);
      if (res.ok) {
        const data = await res.json();
        setUserNFTs(data.nfts || []);
      }
    } catch {}
  };

  // 5. Create new project via Factory
  const createProject = useCallback(async (params) => {
    if (!factoryContract) {
      showNotification('error', 'Please connect MetaMask to deploy contracts.');
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
      showNotification('error', `❌ Deployment failed: ${err.reason || err.message}`);
    } finally {
      setIsCreatingProject(false);
    }
  }, [factoryContract, refreshProjects, showNotification]);

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
  }, [tokenContract, currentProject, requiredTokensRaw, refreshData, showNotification]);

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
  }, [exchangeContract, account, currentProject, totalMinted, refreshData, showNotification]);

  // 8. Faucet: Mint 100 test tokens
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
  }, [tokenContract, account, currentProject, refreshData, showNotification]);

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
