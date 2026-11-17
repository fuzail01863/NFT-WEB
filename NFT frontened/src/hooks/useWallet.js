import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const REQUIRED_CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    ? parseInt(import.meta.env.VITE_CHAIN_ID)
    : 11155111;

  // Initialize wallet connection
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask extension to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 1. First check if accounts are already accessible to avoid -32002 duplicate request
      const existingAccounts = await window.ethereum.request({ method: 'eth_accounts' });
      let targetAccount;

      if (existingAccounts && existingAccounts.length > 0) {
        targetAccount = existingAccounts[0];
      } else {
        // Request accounts only when not already authorized
        const requested = await window.ethereum.request({ method: 'eth_requestAccounts' });
        targetAccount = requested[0];
      }

      if (!targetAccount) {
        throw new Error('No Ethereum account selected.');
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(targetAccount);
      setChainId(Number(network.chainId));
      setError(null);
    } catch (err) {
      console.warn('Wallet connection warning/error:', err);
      // Gracefully handle the -32002 "Request already pending" error
      if (err.code === -32002 || (err.message && err.message.includes('-32002'))) {
        setError('A MetaMask request is already open in your browser extension. Please click the MetaMask fox icon to approve or unlock.');
      } else if (err.code === 4001) {
        setError('Connection request cancelled. Please connect your MetaMask to use the DApp.');
      } else {
        setError(err.reason || err.message || 'Unable to connect to MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setError(null);
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${REQUIRED_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${REQUIRED_CHAIN_ID.toString(16)}`,
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
    }
  }, [REQUIRED_CHAIN_ID]);

  // Silent account check on mount (do NOT trigger eth_requestAccounts automatically)
  useEffect(() => {
    if (!window.ethereum) return;

    let mounted = true;

    window.ethereum.request({ method: 'eth_accounts' })
      .then(async (accounts) => {
        if (mounted && accounts && accounts.length > 0) {
          try {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const network = await web3Provider.getNetwork();
            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));
          } catch (e) {
            console.debug('Silent account restore skipped:', e);
          }
        }
      })
      .catch((e) => console.debug('eth_accounts check error:', e));

    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(web3Signer);
        } catch {}
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(parseInt(newChainId, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      mounted = false;
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnectWallet]);

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    shortAddress,
    isCorrectNetwork,
    REQUIRED_CHAIN_ID,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    clearError: () => setError(null),
  };
};
