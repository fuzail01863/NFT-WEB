import { useState } from 'react';
import { Wallet, AlertTriangle, ExternalLink, LogOut, Check, Copy, ChevronRight, ShieldCheck } from 'lucide-react';

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
          <div className="flex items-start gap-2.5 bg-red-950/80 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-xl max-w-md shadow-xl backdrop-blur-md animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300 mb-0.5">Wallet Connection Notice</p>
              <p className="leading-relaxed opacity-90">{error}</p>
            </div>
            {clearError && (
              <button onClick={clearError} className="text-red-400 hover:text-white text-xs ml-1">
                ✕
              </button>
            )}
          </div>
        )}
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn-gradient flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Network badge */}
      {!isCorrectNetwork ? (
        <button
          onClick={switchToSepolia}
          className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-xl hover:bg-amber-500/30 transition-all font-medium animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Switch to Sepolia
        </button>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Sepolia</span>
        </div>
      )}

      {/* Connected address pill */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-purple-500/30 rounded-xl p-1.5 pr-2.5 transition-all">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all font-mono text-xs text-gray-200"
          title="Click to copy full address"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
            {account.slice(2, 4).toUpperCase()}
          </div>
          <span>{shortAddress}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
          )}
        </button>

        <a
          href={`https://sepolia.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-300 p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="View on Sepolia Etherscan"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={disconnectWallet}
          className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/10 transition-colors ml-0.5"
          title="Disconnect wallet"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
