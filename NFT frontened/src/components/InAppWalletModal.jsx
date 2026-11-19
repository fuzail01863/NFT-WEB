import { useState } from 'react';
import { 
  X, 
  Wallet, 
  Sparkles, 
  Key, 
  Check, 
  Copy, 
  ExternalLink, 
  LogOut, 
  RefreshCw, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';

export const InAppWalletModal = ({ wallet, isOpen, onClose }) => {
  const [importKey, setImportKey] = useState('');
  const [showImportInput, setShowImportInput] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const copyAddress = () => {
    if (wallet.account) {
      navigator.clipboard.writeText(wallet.account);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  const copyKey = () => {
    if (wallet.privateKey) {
      navigator.clipboard.writeText(wallet.privateKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importKey.trim()) return;
    wallet.importInAppWallet(importKey.trim());
    setImportKey('');
    setShowImportInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-lg p-5 sm:p-7 space-y-6 my-auto border-aqua-400/40 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center text-white shadow-lg shadow-aqua-500/30 flex-shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Web3 Wallet Manager
            </h2>
            <p className="text-xs text-slate-400">
              {wallet.account ? 'Manage your connected wallet & keys' : 'Connect MetaMask or launch an In-App Wallet'}
            </p>
          </div>
        </div>

        {/* Wallet Error Alert */}
        {wallet.error && (
          <div className="flex items-start gap-2.5 bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs p-3.5 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-relaxed font-medium">{wallet.error}</p>
            </div>
            <button onClick={wallet.clearError} className="text-rose-400 hover:text-white font-bold ml-1">
              ✕
            </button>
          </div>
        )}

        {/* ── STATE 1: WALLET CONNECTED ────────────────────────────────────────── */}
        {wallet.account ? (
          <div className="space-y-5">
            {/* Active Account Card */}
            <div className="cyber-card p-4 sm:p-5 border-aqua-400/35 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aqua-400/20 border border-aqua-400/40 text-aqua-200 font-bold text-[11px]">
                  {wallet.walletType === 'in-app' ? (
                    <>
                      <Zap className="w-3.5 h-3.5 text-aqua-300" />
                      <span>In-App Web3 Wallet</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5 text-aqua-300" />
                      <span>MetaMask Extension</span>
                    </>
                  )}
                </span>

                <span className="font-mono text-xs text-slate-300 font-bold">
                  {wallet.ethBalance} ETH
                </span>
              </div>

              {/* Address display */}
              <div className="bg-[#051724] border border-aqua-400/30 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="font-mono text-xs sm:text-sm font-bold text-white truncate">
                  {wallet.account}
                </div>
                <button
                  onClick={copyAddress}
                  className="px-2.5 py-1 rounded-lg bg-aqua-400/20 hover:bg-aqua-400/30 text-aqua-200 text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                  title="Copy address"
                >
                  {copiedAddr ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-aqua-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Network pill & switch */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-400"></span>
                  </span>
                  <span className="text-slate-300 font-medium">
                    {wallet.chainId === 31337 ? 'Hardhat Localhost (31337)' : 'Ethereum Sepolia (11155111)'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={wallet.chainId === 31337 ? wallet.switchToSepolia : wallet.switchToLocalhost}
                    className="text-[11px] font-bold text-aqua-300 hover:text-white underline transition-colors"
                  >
                    Switch to {wallet.chainId === 31337 ? 'Sepolia' : 'Localhost'}
                  </button>
                </div>
              </div>
            </div>

            {/* In-App Private Key Exporter (Only for in-app wallet) */}
            {wallet.walletType === 'in-app' && wallet.privateKey && (
              <div className="cyber-card p-4 border-aqua-400/25 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aqua-300 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>In-App Private Key (Backup)</span>
                  </span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {showPrivateKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPrivateKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>

                <div className="bg-[#051724] border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-300 truncate">
                    {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </span>
                  <button
                    onClick={copyKey}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-aqua-300 transition-colors flex-shrink-0"
                    title="Copy Private Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-aqua-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Tip: You can copy this private key and import it into MetaMask extension anytime!
                </p>
              </div>
            )}

            {/* Disconnect & Switch actions */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={`https://sepolia.etherscan.io/address/${wallet.account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-aqua-300 hover:text-white flex items-center gap-1 font-bold underline"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  wallet.disconnectWallet();
                }}
                className="btn-cyber-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 border-rose-500/40 hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── STATE 2: NOT CONNECTED (CHOICE MODAL) ────────────────────────── */
          <div className="space-y-4">
            {/* Option A: In-App Instant Wallet */}
            <div className="cyber-card p-4 sm:p-5 border-aqua-400/40 bg-aqua-950/20 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-aqua-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Recommended for Instant Testing
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-aqua-400/20 text-aqua-200 font-extrabold border border-aqua-400/30">
                  No Extension Needed
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base">
                  ⚡ In-App Web3 Wallet
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Sign transactions, approve tokens, and mint NFTs directly inside the browser UI with zero popups or extensions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={wallet.createInAppWallet}
                  disabled={wallet.isConnecting}
                  className="btn-cyber-primary py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Instant Wallet</span>
                </button>

                <button
                  onClick={wallet.useHardhatAccount}
                  disabled={wallet.isConnecting}
                  className="btn-cyber-secondary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  title="Use default test account with 10,000 ETH"
                >
                  <Key className="w-4 h-4 text-aqua-300" />
                  <span>Use Test Account #0</span>
                </button>
              </div>

              {/* Import Key Accordion */}
              <div className="pt-2 border-t border-aqua-400/15">
                {!showImportInput ? (
                  <button
                    onClick={() => setShowImportInput(true)}
                    className="text-xs text-aqua-300 hover:text-white font-bold transition-colors"
                  >
                    + Import Custom Private Key
                  </button>
                ) : (
                  <form onSubmit={handleImportSubmit} className="space-y-2.5 pt-1">
                    <input
                      type="password"
                      placeholder="Enter 64-character Private Key (0x...)"
                      value={importKey}
                      onChange={(e) => setImportKey(e.target.value)}
                      className="input-field py-2 text-xs font-mono"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowImportInput(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-gradient px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                      >
                        Import & Connect
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Option B: MetaMask Extension */}
            <div className="cyber-card p-4 sm:p-5 border-white/10 hover:border-aqua-400/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" /> Browser Extension
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base">
                  Connect MetaMask
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Connect your existing MetaMask extension wallet to interact with Sepolia or custom RPC.
                </p>
              </div>

              <button
                onClick={wallet.connectMetaMask}
                disabled={wallet.isConnecting}
                className="btn-cyber-secondary w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:border-aqua-400 text-white"
              >
                <Wallet className="w-4 h-4 text-aqua-300" />
                <span>{wallet.isConnecting ? 'Connecting MetaMask...' : 'Connect MetaMask'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
