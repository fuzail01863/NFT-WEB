import { Coins, Sparkles, Layers, ArrowLeftRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export const StatsPanel = ({ tokenBalance, nftBalance, totalMinted, loadingData }) => {
  const formattedToken = parseFloat(tokenBalance || '0').toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Token Balance */}
      <div className="cyber-card p-5 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Token Balance
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {loadingData ? '...' : formattedToken}
          </span>
          <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">FZT</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Available to deposit</span>
        </div>
      </div>

      {/* 2. My NFTs */}
      <div className="cyber-card p-5 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            NFTs in Vault
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {loadingData ? '...' : nftBalance}
          </span>
          <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Items</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Verified ERC-721</span>
        </div>
      </div>

      {/* 3. Global Minted */}
      <div className="cyber-card p-5 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Minted
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {loadingData ? '...' : totalMinted}
          </span>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Minted</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>On-chain circulation</span>
        </div>
      </div>

      {/* 4. Exchange Ratio */}
      <div className="cyber-card p-5 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Exchange Ratio
          </span>
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            5 FZT
          </span>
          <span className="text-xs text-pink-400 font-bold">= 1 NFT</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <span>Smart Contract Rate</span>
        </div>
      </div>
    </div>
  );
};
