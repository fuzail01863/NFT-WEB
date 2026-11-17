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
    <div className="cyber-card-glow p-6 sm:p-9 space-y-8 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mint <span className="gradient-neon">Fuzail NFT</span>
            </h2>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>Instant Mint</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
            Deposit exactly 5 FZT to automatically execute the on-chain mint transaction.
          </p>
        </div>

        {/* Faucet & Sync Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {claimFaucetTokens && (
            <button
              onClick={claimFaucetTokens}
              disabled={isClaimingFaucet}
              className="btn-cyber-secondary flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 border-purple-500/30 hover:bg-purple-500/20 transition-all shadow-lg shadow-purple-900/20"
              title="Claim 100 Test FZT Tokens to test minting immediately"
            >
              <Gift className="w-4 h-4 text-pink-400" />
              <span>{isClaimingFaucet ? 'Claiming 100 FZT...' : '⚡ Get 100 Test FZT'}</span>
            </button>
          )}

          <button
            onClick={refreshData}
            disabled={loadingData}
            className="btn-cyber-secondary flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-300"
            title="Refresh on-chain state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Swap Card */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Left Side: You Pay (5 FZT) */}
        <div className="md:col-span-5 cyber-card p-6 border-purple-500/20 group hover:border-purple-500/50">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="uppercase tracking-wider">You Deposit</span>
            <span className="font-mono text-purple-300">
              Balance: {userTokens.toLocaleString('en-US', { maximumFractionDigits: 2 })} FZT
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              5.0
            </span>
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 px-4 py-2.5 rounded-2xl shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center text-white shadow-sm">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wide">FZT</span>
            </div>
          </div>

          {/* Balance check meter */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Deposit Requirement</span>
              <span className={hasEnoughTokens ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {hasEnoughTokens ? '✓ 5 FZT Ready' : 'Need 5 FZT (Use Faucet)'}
              </span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  hasEnoughTokens 
                    ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400' 
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Exchange Arrow */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <ArrowDown className="w-5 h-5 md:hidden" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">
            1:1 Mint
          </span>
        </div>

        {/* Right Side: You Receive (1 FZNFT) */}
        <div className="md:col-span-5 cyber-card p-6 border-cyan-500/20 group hover:border-cyan-500/50">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="uppercase tracking-wider">You Receive</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> ERC-721
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              1.0
            </span>
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/40 px-4 py-2.5 rounded-2xl shadow-inner">
              <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wide">FZNFT</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Direct to your wallet</span>
            <span className="text-cyan-300 font-bold">Verifiable Ownership</span>
          </div>
        </div>
      </div>

      {/* Step by Step Flow Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Allowance */}
        <div className={`p-5 rounded-2xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-emerald-500/[0.06] border-emerald-500/30' 
            : 'bg-purple-500/[0.06] border-purple-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-md ${
                hasEnoughAllowance ? 'bg-emerald-500 text-black' : 'bg-purple-600 text-white'
              }`}>
                {hasEnoughAllowance ? '✓' : '1'}
              </div>
              <span className="text-sm font-bold text-white">Step 1: Approve 5 FZT</span>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              hasEnoughAllowance 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            }`}>
              {hasEnoughAllowance ? 'Approved' : 'Required'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Permits the smart contract to pull exactly 5 FZT when you click deposit.
          </p>
        </div>

        {/* Step 2: Mint */}
        <div className={`p-5 rounded-2xl border transition-all ${
          hasEnoughAllowance 
            ? 'bg-cyan-500/[0.06] border-cyan-500/30' 
            : 'bg-white/[0.02] border-white/[0.08] opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-md ${
                hasEnoughAllowance ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-slate-400'
              }`}>
                2
              </div>
              <span className="text-sm font-bold text-white">Step 2: Deposit & Mint</span>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              hasEnoughAllowance 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'bg-white/5 text-slate-500 border border-white/10'
            }`}>
              {hasEnoughAllowance ? 'Ready to Mint' : 'Locked'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
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
            className="btn-cyber-primary flex-1 py-4 px-8 rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 shadow-purple-600/50"
          >
            {isApproving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Waiting for MetaMask Approval...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Approve 5 FZT Tokens</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={mintNFT}
            disabled={isMinting || !hasEnoughTokens}
            className="btn-cyber-primary flex-1 py-4 px-8 rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 shadow-cyan-600/50"
          >
            {isMinting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Minting NFT on Blockchain...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white" />
                <span>Deposit 5 FZT & Mint 1 FZNFT</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Transaction Success Drawer */}
      {txHash && (
        <div className="cyber-card p-4 border-purple-500/40 bg-purple-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Broadcasted:</span>
            <span className="font-mono text-purple-300 font-bold">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-purple-300 hover:text-white font-bold underline"
          >
            <span>View on Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Contract Verification Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] text-slate-500 font-mono">
        <div>
          <span>Contract: </span>
          <a
            href={`https://sepolia.etherscan.io/address/${EXCHANGE_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-purple-300 transition-colors underline"
          >
            {EXCHANGE_ADDRESS}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>ERC-20 ⇄ ERC-721</span>
          <span>ReentrancyGuard Protected</span>
        </div>
      </div>
    </div>
  );
};
