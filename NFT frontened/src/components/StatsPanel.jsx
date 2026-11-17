import { Coins, Sparkles, Layers, ArrowLeftRight } from 'lucide-react';

export const StatsPanel = ({ tokenBalance, nftBalance, totalMinted, loadingData }) => {
  const formattedToken = parseFloat(tokenBalance || '0').toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. FZT Balance */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">FZT Balance</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            {loadingData ? '...' : formattedToken}
          </span>
          <span className="text-xs text-purple-400 font-semibold">FZT</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Available in wallet</p>
      </div>

      {/* 2. My NFTs */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">My Collection</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            {loadingData ? '...' : nftBalance}
          </span>
          <span className="text-xs text-blue-400 font-semibold">FZNFT</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Owned by this wallet</p>
      </div>

      {/* 3. Total Minted */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Minted</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            {loadingData ? '...' : totalMinted}
          </span>
          <span className="text-xs text-emerald-400 font-semibold">NFTs</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Global circulation</p>
      </div>

      {/* 4. Exchange Rate */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl group-hover:bg-pink-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Exchange Rate</span>
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">5 FZT</span>
          <span className="text-xs text-pink-400 font-semibold">= 1 NFT</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Fixed smart contract rate</p>
      </div>
    </div>
  );
};
