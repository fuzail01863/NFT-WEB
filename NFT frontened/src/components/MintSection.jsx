import { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Coins, 
  Sparkles, 
  ShieldCheck,
  Gift,
  HelpCircle
} from 'lucide-react';

export const MintSection = ({
  tokenBalance,
  hasEnoughTokens,
  hasEnoughAllowance,
  isApproving,
  isMinting,
  txHash,
  approveTokens,
  mintNFT,
  refreshData,
  loadingData,
  EXCHANGE_ADDRESS,
  claimFaucetTokens,
  isClaimingFaucet
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const userTokens = parseFloat(tokenBalance || '0');
  const requiredTokens = 5.0;
  const progressPercent = Math.min((userTokens / requiredTokens) * 100, 100);

  return (
    <div className="glass-panel-glow p-6 sm:p-8 space-y-7 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Deposit & Mint NFT
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              Instant On-Chain
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Deposit exactly 5 FZT to automatically mint 1 exclusive Fuzail NFT directly to your wallet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {claimFaucetTokens && (
            <button
              onClick={claimFaucetTokens}
              disabled={isClaimingFaucet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all"
              title="Claim 100 FZT test tokens if you are the contract deployer or owner"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{isClaimingFaucet ? 'Minting...' : 'Get Test FZT'}</span>
            </button>
          )}

          <button
            onClick={refreshData}
            disabled={loadingData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs transition-all"
            title="Refresh blockchain data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Exchange Box */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Left: 5 FZT Input */}
        <div className="md:col-span-2 glass-panel p-5 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>YOU DEPOSIT</span>
            <span className="font-mono text-purple-300">
              Bal: {userTokens.toFixed(2)} FZT
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">5.0</span>
            <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl">
              <Coins className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white text-sm">FZT</span>
            </div>
          </div>
          {/* Balance progress */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Token Balance Check</span>
              <span className={hasEnoughTokens ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {hasEnoughTokens ? 'Sufficient Balance' : 'Insufficient (Need 5 FZT)'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${hasEnoughTokens ? 'bg-gradient-to-r from-purple-500 to-emerald-400' : 'bg-amber-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Interactive Arrow & Rate */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white animate-pulse-subtle">
            <ArrowRight className="w-5 h-5 md:rotate-0 rotate-90" />
          </div>
          <span className="text-[11px] text-gray-400 mt-2 font-mono">1 : 1 Mint</span>
        </div>

        {/* Right: 1 FZNFT Output */}
        <div className="md:col-span-2 glass-panel p-5 border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>YOU RECEIVE</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ERC-721
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">1.0</span>
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white text-sm">FZNFT</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400">
            <span>Metadata: Unique Token ID</span>
            <span className="text-blue-300 font-mono">Verified Contract</span>
          </div>
        </div>
      </div>

      {/* Step by Step Flow Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1 Box */}
        <div className={`p-4 rounded-xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-300' 
            : 'bg-purple-500/5 border-purple-500/30 text-purple-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                hasEnoughAllowance ? 'bg-emerald-500 text-black' : 'bg-purple-500 text-white'
              }`}>
                {hasEnoughAllowance ? '✓' : '1'}
              </div>
              <span className="text-sm font-semibold">Step 1: Approve 5 FZT</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              hasEnoughAllowance 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {hasEnoughAllowance ? 'Approved' : 'Required'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Permits the exchange contract to transfer exactly 5 FZT on deposit.
          </p>
        </div>

        {/* Step 2 Box */}
        <div className={`p-4 rounded-xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' 
            : 'bg-white/5 border-white/10 text-gray-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                hasEnoughAllowance ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-sm font-semibold">Step 2: Deposit & Mint</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              hasEnoughAllowance 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'bg-white/5 text-gray-500 border border-white/10'
            }`}>
              {hasEnoughAllowance ? 'Ready' : 'Locked'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Transfers 5 tokens and directly mints 1 NFT to your wallet in one atomic transaction.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!hasEnoughAllowance ? (
          <button
            onClick={approveTokens}
            disabled={isApproving || !hasEnoughTokens}
            className="btn-gradient flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            {isApproving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Waiting for MetaMask Approval...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve 5 FZT Tokens</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={mintNFT}
            disabled={isMinting || !hasEnoughTokens}
            className="btn-gradient flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-purple-600/40"
          >
            {isMinting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Minting NFT on Blockchain...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Deposit 5 FZT & Mint 1 FZNFT</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Transaction status alert */}
      {txHash && (
        <div className="glass-panel p-4 border-purple-500/30 bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-gray-300">Transaction Broadcasted:</span>
            <span className="font-mono text-purple-300">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium"
          >
            <span>View on Sepolia Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Contract Verification Info Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] text-gray-500 font-mono">
        <div>
          <span>Exchange Contract: </span>
          <a
            href={`https://sepolia.etherscan.io/address/${EXCHANGE_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-300 transition-colors"
          >
            {EXCHANGE_ADDRESS}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>Standard: ERC-20 ⇄ ERC-721</span>
          <span>Security: ReentrancyGuard</span>
        </div>
      </div>
    </div>
  );
};
