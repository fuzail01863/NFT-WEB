import { Coins, Sparkles, Layers, ArrowLeftRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export const StatsPanel = ({ tokenBalance, nftBalance, totalMinted, loadingData }) => {
  const formattedToken = parseFloat(tokenBalance || '0').toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Token Balance */}
      <div className="cyber-card p-4 sm:p-5 group hover:border-aqua-400/50 transition-all">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] font-bold text-aqua-200/80 uppercase tracking-wider truncate">
            Token Balance
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 group-hover:scale-110 group-hover:bg-aqua-400/25 transition-all flex-shrink-0">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono">
            {loadingData ? '...' : formattedToken}
          </span>
          <span className="text-[10px] sm:text-xs text-aqua-300 font-extrabold uppercase tracking-wider">FZT</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-300 truncate">
          <CheckCircle2 className="w-3 h-3 text-aqua-400 flex-shrink-0" />
          <span className="truncate">Available to deposit</span>
        </div>
      </div>

      {/* 2. My NFTs */}
      <div className="cyber-card p-4 sm:p-5 group hover:border-aqua-400/50 transition-all">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] font-bold text-aqua-200/80 uppercase tracking-wider truncate">
            NFTs in Vault
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 group-hover:scale-110 group-hover:bg-aqua-400/25 transition-all flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono">
            {loadingData ? '...' : nftBalance}
          </span>
          <span className="text-[10px] sm:text-xs text-aqua-300 font-extrabold uppercase tracking-wider">Items</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-300 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-aqua-400 flex-shrink-0" />
          <span className="truncate">Verified ERC-721</span>
        </div>
      </div>

      {/* 3. Global Minted */}
      <div className="cyber-card p-4 sm:p-5 group hover:border-aqua-400/50 transition-all">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] font-bold text-aqua-200/80 uppercase tracking-wider truncate">
            Total Minted
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 group-hover:scale-110 group-hover:bg-aqua-400/25 transition-all flex-shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono">
            {loadingData ? '...' : totalMinted}
          </span>
          <span className="text-[10px] sm:text-xs text-aqua-300 font-extrabold uppercase tracking-wider">Minted</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-300 truncate">
          <TrendingUp className="w-3 h-3 text-aqua-400 flex-shrink-0" />
          <span className="truncate">On-chain circulation</span>
        </div>
      </div>

      {/* 4. Exchange Ratio */}
      <div className="cyber-card p-4 sm:p-5 group hover:border-aqua-400/50 transition-all">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] font-bold text-aqua-200/80 uppercase tracking-wider truncate">
            Exchange Ratio
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 group-hover:scale-110 group-hover:bg-aqua-400/25 transition-all flex-shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono">
            5 FZT
          </span>
          <span className="text-[10px] sm:text-xs text-aqua-300 font-extrabold">= 1 NFT</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-300 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-aqua-400 flex-shrink-0" />
          <span className="truncate">Smart Contract Rate</span>
        </div>
      </div>
    </div>
  );
};
