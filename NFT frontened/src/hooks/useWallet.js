import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';

// Standard Hardhat Local test account #0 (pre-funded with 10,000 ETH)
export const HARDHAT_DEFAULT_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Public RPC endpoints
const SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';
const LOCALHOST_RPC = 'http://127.0.0.1:8545';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(11155111);
  const [walletType, setWalletType] = useState(null); // 'in-app' | 'metamask' | null
  const [privateKey, setPrivateKey] = useState(null);
  const [ethBalance, setEthBalance] = useState('0.00');

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const REQUIRED_CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    ? parseInt(import.meta.env.VITE_CHAIN_ID)
    : 11155111;

  // Helper to get fallback RPC provider for in-app wallet
  const getRpcProvider = useCallback(async (targetChainId) => {
    const isLocal = targetChainId === 31337;
    const rpcUrl = isLocal ? LOCALHOST_RPC : SEPOLIA_RPC;
    try {
      const rpc = new ethers.JsonRpcProvider(rpcUrl);
      return rpc;
    } catch {
      return new ethers.JsonRpcProvider(SEPOLIA_RPC);
    }
  }, []);

  // Refresh native ETH balance
  const refreshEthBalance = useCallback(async (userAccount, userProvider) => {
    if (!userAccount || !userProvider) return;
    try {
      const bal = await userProvider.getBalance(userAccount);
      setEthBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    } catch {
      setEthBalance('0.00');
    }
  }, []);

  // ── 1. In-App Wallet Creation & Loading ──────────────────────────────────
  const setupInAppWallet = useCallback(async (pk, targetChainId = 11155111) => {
    setIsConnecting(true);
    setError(null);
    try {
      const rpc = await getRpcProvider(targetChainId);
      const inAppSigner = new ethers.Wallet(pk, rpc);
      const addr = inAppSigner.address;

      localStorage.setItem('fuzail_inapp_pk', pk);
      localStorage.setItem('fuzail_wallet_type', 'in-app');

      setAccount(addr);
      setPrivateKey(pk);
      setSigner(inAppSigner);
      setProvider(rpc);
      setChainId(targetChainId);
      setWalletType('in-app');

      refreshEthBalance(addr, rpc);
      setIsWalletModalOpen(false);
    } catch (err) {
      setError(err.reason || err.message || 'Failed to initialize in-app wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [getRpcProvider, refreshEthBalance]);

  // Create brand new random in-app wallet
  const createInAppWallet = useCallback(async () => {
    const randomWallet = ethers.Wallet.createRandom();
    await setupInAppWallet(randomWallet.privateKey, chainId || 11155111);
  }, [setupInAppWallet, chainId]);

  // Import private key into in-app wallet
  const importInAppWallet = useCallback(async (keyInput) => {
    let cleanKey = keyInput.trim();
    if (!cleanKey.startsWith('0x') && cleanKey.length === 64) {
      cleanKey = '0x' + cleanKey;
    }
    try {
      new ethers.Wallet(cleanKey); // Validate key
      await setupInAppWallet(cleanKey, chainId || 11155111);
    } catch (err) {
      setError('Invalid Private Key. Please provide a valid 64-character hex key.');
    }
  }, [setupInAppWallet, chainId]);

  // Use pre-funded Hardhat Account #0
  const useHardhatAccount = useCallback(async () => {
    await setupInAppWallet(HARDHAT_DEFAULT_KEY, 31337);
  }, [setupInAppWallet]);

  // ── 2. MetaMask Wallet Connection ───────────────────────────────────────
  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask extension is not installed. You can use the built-in In-App Wallet instead!');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No account authorized.');
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      localStorage.setItem('fuzail_wallet_type', 'metamask');
      localStorage.removeItem('fuzail_inapp_pk');

      setAccount(accounts[0]);
      setSigner(web3Signer);
      setProvider(web3Provider);
      setChainId(Number(network.chainId));
      setWalletType('metamask');
      setPrivateKey(null);

      refreshEthBalance(accounts[0], web3Provider);
      setIsWalletModalOpen(false);
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection request cancelled.');
      } else {
        setError(err.reason || err.message || 'Failed to connect MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [refreshEthBalance]);

  // ── 3. Disconnect ────────────────────────────────────────────────────────
  const disconnectWallet = useCallback(() => {
    localStorage.removeItem('fuzail_wallet_type');
    localStorage.removeItem('fuzail_inapp_pk');
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setWalletType(null);
    setPrivateKey(null);
    setEthBalance('0.00');
    setError(null);
  }, []);

  // ── 4. Network Switching ────────────────────────────────────────────────
  const switchToSepolia = useCallback(async () => {
    if (walletType === 'in-app' && privateKey) {
      await setupInAppWallet(privateKey, 11155111);
      return;
    }
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: [SEPOLIA_RPC],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        }
      }
    }
  }, [walletType, privateKey, setupInAppWallet]);

  const switchToLocalhost = useCallback(async () => {
    if (walletType === 'in-app' && privateKey) {
      await setupInAppWallet(privateKey, 31337);
      return;
    }
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x7a69',
              chainName: 'Hardhat Localhost',
              nativeCurrency: { name: 'Local ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: [LOCALHOST_RPC],
            }],
          });
        }
      }
    }
  }, [walletType, privateKey, setupInAppWallet]);

  // ── 5. Auto Restore on Mount ────────────────────────────────────────────
  useEffect(() => {
    const savedType = localStorage.getItem('fuzail_wallet_type');
    const savedPk = localStorage.getItem('fuzail_inapp_pk');

    if (savedType === 'in-app' && savedPk) {
      setupInAppWallet(savedPk, 11155111);
      return;
    }

    if (savedType === 'metamask' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            try {
              const web3Provider = new ethers.BrowserProvider(window.ethereum);
              const web3Signer = await web3Provider.getSigner();
              const network = await web3Provider.getNetwork();
              setAccount(accounts[0]);
              setSigner(web3Signer);
              setProvider(web3Provider);
              setChainId(Number(network.chainId));
              setWalletType('metamask');
              refreshEthBalance(accounts[0], web3Provider);
            } catch {}
          }
        })
        .catch(() => {});
    }
  }, [setupInAppWallet, refreshEthBalance]);

  // MetaMask event listeners
  useEffect(() => {
    if (!window.ethereum || walletType !== 'metamask') return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(parseInt(newChainId, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletType, disconnectWallet]);

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  const isCorrectNetwork = chainId === 11155111 || chainId === 31337;

  return {
    account,
    provider,
    signer,
    chainId,
    walletType,
    privateKey,
    ethBalance,
    isConnecting,
    error,
    shortAddress,
    isCorrectNetwork,
    REQUIRED_CHAIN_ID,
    isWalletModalOpen,
    openWalletModal: () => setIsWalletModalOpen(true),
    closeWalletModal: () => setIsWalletModalOpen(false),
    connectWallet: () => setIsWalletModalOpen(true), // Opens in-app wallet selection modal
    connectMetaMask,
    createInAppWallet,
    importInAppWallet,
    useHardhatAccount,
    disconnectWallet,
    switchToSepolia,
    switchToLocalhost,
    refreshEthBalance: () => refreshEthBalance(account, provider),
    clearError: () => setError(null),
  };
};
