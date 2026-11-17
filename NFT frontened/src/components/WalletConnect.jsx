import { useState } from 'react';
import { Wallet, AlertTriangle, ExternalLink, LogOut, Check, Copy, ChevronDown, Activity, Sparkles } from 'lucide-react';

export const WalletConnect = ({
  account,
  shortAddress,
  isConnecting,
  error,
  isCorrectNetwork,
  chainId,
  REQUIRED_CHAIN_ID,
  connectWallet,
  disconnectWallet,
  switchToSepolia,
  clearError
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-end gap-2">
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs px-4 py-3 rounded-2xl max-w-sm shadow-2xl backdrop-blur-xl animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-300 text-[11px] uppercase tracking-wider mb-0.5">Wallet Alert</p>
              <p className="leading-relaxed opacity-95">{error}</p>
            </div>
            {clearError && (
              <button onClick={clearError} className="text-rose-400 hover:text-white text-xs ml-1 font-bold">
                ✕
              </button>
            )}
          </div>
        )}
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn-cyber-primary flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide group"
        >
          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {/* Network Indicator */}
      {!isCorrectNetwork ? (
        <button
          onClick={switchToSepolia}
          className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs px-3.5 py-2 rounded-xl hover:bg-amber-500/25 transition-all font-semibold animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Switch Network</span>
        </button>
      ) : (
        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-mono font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Sepolia</span>
        </div>
      )}

      {/* Account Info Pill */}
      <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 hover:border-purple-500/40 rounded-xl p-1 pr-2 transition-all shadow-inner">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all font-mono text-xs text-slate-200 group"
          title="Click to copy address"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm">
            {account.slice(2, 4).toUpperCase()}
          </div>
          <span className="font-semibold">{shortAddress}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-slate-400 group-hover:text-purple-300" />
          )}
        </button>

        <a
          href={`https://sepolia.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-purple-300 p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="View on Sepolia Etherscan"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={disconnectWallet}
          className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-white/10 transition-colors ml-0.5"
          title="Disconnect wallet"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
