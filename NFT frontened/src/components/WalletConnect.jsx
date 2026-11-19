import { useState } from 'react';
import { Wallet, AlertTriangle, ExternalLink, LogOut, Check, Copy, Sparkles, Zap, ChevronDown } from 'lucide-react';

export const WalletConnect = (props) => {
  const {
    account,
    shortAddress,
    isConnecting,
    error,
    isCorrectNetwork,
    chainId,
    walletType,
    ethBalance,
    openWalletModal,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    switchToLocalhost,
    clearError
  } = props;

  const [copied, setCopied] = useState(false);

  const copyAddress = (e) => {
    e.stopPropagation();
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center gap-2">
        {error && (
          <div className="hidden lg:flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs px-3 py-1.5 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate max-w-[200px]">{error}</span>
            <button onClick={clearError} className="ml-1 text-rose-400 hover:text-white">✕</button>
          </div>
        )}
        <button
          onClick={openWalletModal || connectWallet}
          disabled={isConnecting}
          className="btn-cyber-primary flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide group"
        >
          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          <Sparkles className="w-3.5 h-3.5 text-aqua-100 hidden sm:inline" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      {/* Network Indicator / Switcher */}
      <button
        onClick={chainId === 31337 ? switchToSepolia : switchToLocalhost}
        className="hidden sm:flex items-center gap-1.5 bg-[#061826]/90 border border-aqua-400/30 hover:border-aqua-400/60 text-aqua-200 text-xs px-3 py-1.5 rounded-xl font-mono font-bold transition-all"
        title="Click to toggle network (Sepolia / Localhost)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-400"></span>
        </span>
        <span>{chainId === 31337 ? 'Localhost:8545' : 'Sepolia'}</span>
      </button>

      {/* Account Info Pill (Click to open In-App Wallet Manager) */}
      <div 
        onClick={openWalletModal}
        className="flex items-center gap-1.5 bg-[#061826]/90 border border-aqua-400/35 hover:border-aqua-400/70 rounded-xl p-1 pr-2 transition-all shadow-inner cursor-pointer group"
        title="Click to open In-App Wallet Manager"
      >
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.08] transition-all font-mono text-xs text-white">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center text-[10px] text-white font-black shadow-sm flex-shrink-0">
            {walletType === 'in-app' ? (
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            ) : (
              account.slice(2, 4).toUpperCase()
            )}
          </div>
          <span className="font-bold text-xs text-white truncate max-w-[85px] sm:max-w-none">
            {shortAddress}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-aqua-300 transition-colors" />
        </div>

        <button
          onClick={copyAddress}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-aqua-300 transition-colors"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-aqua-300" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnectWallet();
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors ml-0.5"
          title="Disconnect wallet"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
