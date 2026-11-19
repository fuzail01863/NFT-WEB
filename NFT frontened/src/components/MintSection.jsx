import { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  Coins, 
  Sparkles, 
  ShieldCheck,
  Gift,
  Flame,
  ArrowDown
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
  const userTokens = parseFloat(tokenBalance || '0');
  const requiredTokens = 5.0;
  const progressPercent = Math.min((userTokens / requiredTokens) * 100, 100);

  return (
    <div className="cyber-card-glow p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-aqua-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-aqua-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aqua-400/20 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              Mint <span className="gradient-neon">Fuzail NFT</span>
            </h2>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-aqua-400/20 border border-aqua-400/40 text-aqua-200 text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-aqua-300" />
              <span>Instant Mint</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Deposit exactly 5 FZT to automatically execute the on-chain mint transaction.
          </p>
        </div>

        {/* Faucet & Sync Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto flex-wrap">
          {claimFaucetTokens && (
            <button
              onClick={claimFaucetTokens}
              disabled={isClaimingFaucet}
              className="btn-cyber-secondary flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-aqua-200 border-aqua-400/40 hover:bg-aqua-400/25 transition-all shadow-md shadow-aqua-500/15"
              title="Claim 100 Test FZT Tokens to test minting immediately"
            >
              <Gift className="w-4 h-4 text-aqua-300" />
              <span>{isClaimingFaucet ? 'Claiming 100 FZT...' : '⚡ Get 100 Test FZT'}</span>
            </button>
          )}

          <button
            onClick={refreshData}
            disabled={loadingData}
            className="btn-cyber-secondary flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white"
            title="Refresh on-chain state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Swap Card */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Left Side: You Pay (5 FZT) */}
        <div className="md:col-span-5 cyber-card p-4 sm:p-6 border-aqua-400/30 group hover:border-aqua-400/60 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="uppercase tracking-wider font-bold text-[10px] sm:text-xs text-aqua-200/80">You Deposit</span>
            <span className="font-mono text-aqua-300 font-bold text-[11px] sm:text-xs truncate ml-2">
              Balance: {userTokens.toLocaleString('en-US', { maximumFractionDigits: 2 })} FZT
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
              5.0
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-[#0a2638] border border-aqua-400/50 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-aqua-400 flex items-center justify-center text-[#051724] font-black shadow-sm flex-shrink-0">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-white text-sm sm:text-base tracking-wide">FZT</span>
            </div>
          </div>

          {/* Balance check meter */}
          <div className="mt-4 sm:mt-5 space-y-1.5">
            <div className="flex justify-between text-[10px] sm:text-[11px]">
              <span className="text-slate-300 font-medium">Deposit Requirement</span>
              <span className={hasEnoughTokens ? 'text-aqua-300 font-bold' : 'text-amber-300 font-bold'}>
                {hasEnoughTokens ? '✓ 5 FZT Ready' : 'Need 5 FZT (Use Faucet)'}
              </span>
            </div>
            <div className="h-2 w-full bg-[#051724] rounded-full overflow-hidden p-0.5 border border-aqua-400/25">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  hasEnoughTokens 
                    ? 'bg-gradient-to-r from-aqua-600 via-aqua-400 to-aqua-200 shadow-[0_0_10px_rgba(46,199,192,0.6)]' 
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Exchange Arrow */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-1 sm:py-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center text-white shadow-xl shadow-aqua-500/35">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <ArrowDown className="w-5 h-5 md:hidden" />
          </div>
          <span className="text-[10px] font-mono text-aqua-300 mt-2 font-bold uppercase tracking-wider">
            1:1 Mint
          </span>
        </div>

        {/* Right Side: You Receive (1 FZNFT) */}
        <div className="md:col-span-5 cyber-card p-4 sm:p-6 border-aqua-400/30 group hover:border-aqua-400/60 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="uppercase tracking-wider font-bold text-[10px] sm:text-xs text-aqua-200/80">You Receive</span>
            <span className="text-aqua-300 font-bold flex items-center gap-1 font-mono text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-aqua-400" /> ERC-721
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
              1.0
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-[#0a2638] border border-aqua-400/50 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-aqua-400 flex items-center justify-center text-[#051724] font-black shadow-sm flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-white text-sm sm:text-base tracking-wide">FZNFT</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 font-mono">
            <span>Direct to your wallet</span>
            <span className="text-aqua-200 font-bold">Verifiable Ownership</span>
          </div>
        </div>
      </div>

      {/* Step by Step Flow Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Step 1: Allowance */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-aqua-500/[0.12] border-aqua-400/40' 
            : 'bg-[#061826]/70 border-aqua-400/25'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-md flex-shrink-0 ${
                hasEnoughAllowance ? 'bg-aqua-400 text-[#051724]' : 'bg-aqua-600 text-white'
              }`}>
                {hasEnoughAllowance ? '✓' : '1'}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Step 1: Approve 5 FZT</span>
            </div>
            <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full font-bold uppercase tracking-wider ${
              hasEnoughAllowance 
                ? 'bg-aqua-400/25 text-aqua-200 border border-aqua-400/40' 
                : 'bg-dark-900/80 text-slate-400 border border-white/10'
            }`}>
              {hasEnoughAllowance ? 'Approved' : 'Required'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-2 leading-relaxed">
            Permits the smart contract to pull exactly 5 FZT when you click deposit.
          </p>
        </div>

        {/* Step 2: Mint */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-aqua-400/[0.12] border-aqua-400/40' 
            : 'bg-[#061826]/40 border-white/[0.08] opacity-60'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-md flex-shrink-0 ${
                hasEnoughAllowance ? 'bg-aqua-300 text-[#051724]' : 'bg-slate-800 text-slate-400'
              }`}>
                2
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">Step 2: Deposit & Mint</span>
            </div>
            <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full font-bold uppercase tracking-wider ${
              hasEnoughAllowance 
                ? 'bg-aqua-400/25 text-aqua-200 border border-aqua-400/40' 
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}>
              {hasEnoughAllowance ? 'Ready to Mint' : 'Locked'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-2 leading-relaxed">
            Transfers 5 tokens and automatically mints 1 NFT to your wallet in 1 atomic transaction.
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {!hasEnoughAllowance ? (
          <button
            onClick={approveTokens}
            disabled={isApproving || !hasEnoughTokens}
            className="btn-cyber-primary flex-1 py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-2.5 sm:gap-3"
          >
            {isApproving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span className="text-white">Waiting for MetaMask Approval...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-white">Approve 5 FZT Tokens</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={mintNFT}
            disabled={isMinting || !hasEnoughTokens}
            className="btn-cyber-primary flex-1 py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-2.5 sm:gap-3"
          >
            {isMinting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span className="text-white">Minting NFT on Blockchain...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white text-white" />
                <span className="text-white">Deposit 5 FZT & Mint 1 FZNFT</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Transaction Success Drawer */}
      {txHash && (
        <div className="cyber-card p-4 border-aqua-400/40 bg-aqua-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-400"></span>
            </span>
            <span className="text-slate-200 font-medium">Broadcasted:</span>
            <span className="font-mono text-aqua-200 font-bold truncate">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-aqua-300 hover:text-white font-bold underline flex-shrink-0"
          >
            <span>View on Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Contract Verification Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-aqua-400/20 text-[10px] sm:text-[11px] text-slate-400 font-mono">
        <div className="truncate">
          <span>Contract: </span>
          <a
            href={`https://sepolia.etherscan.io/address/${EXCHANGE_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-aqua-300 hover:text-white transition-colors underline truncate"
          >
            {EXCHANGE_ADDRESS}
          </a>
        </div>
        <div className="flex items-center gap-3 text-slate-300 flex-shrink-0">
          <span>ERC-20 ⇄ ERC-721</span>
          <span>•</span>
          <span>ReentrancyGuard Protected</span>
        </div>
      </div>
    </div>
  );
};
