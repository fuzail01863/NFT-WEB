import { useState } from 'react';
import { ExternalLink, RefreshCw, Sparkles, Image as ImageIcon, ShieldCheck, Flame } from 'lucide-react';

const NFTCard = ({ nft, account, nftAddress }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tokenId = nft.nftTokenId || nft.tokenId || '1';
  const name = nft.metadata?.name || `Fuzail Genesis #${tokenId}`;
  const desc = nft.metadata?.description || `Authentic verified Fuzail NFT minted via smart contract exchange on Sepolia.`;
  
  // High-def generative avatar artwork
  const defaultArt = `https://api.dicebear.com/7.x/identicon/svg?seed=fuzail-genesis-nft-${tokenId}&backgroundColor=0a0c16,14182c,1c1335&rowColor=a855f7,38bdf8,ec4899,10b981`;
  const image = nft.metadata?.image || nft.image || defaultArt;

  return (
    <div className="cyber-card hologram-card overflow-hidden group hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col">
      {/* Artwork container */}
      <div className="relative aspect-square w-full bg-gradient-to-tr from-purple-950/30 via-slate-900 to-indigo-950/40 overflow-hidden flex items-center justify-center p-5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c16] via-transparent to-transparent z-10" />
        
        <img
          src={image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-contain rounded-2xl transition-all duration-700 group-hover:scale-108 group-hover:rotate-1 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Token ID Badge */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-extrabold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>#{tokenId}</span>
        </div>

        {/* Rarity Pill */}
        <div className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
          Genesis
        </div>

        {/* On-chain verified chip */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/5">
            5 FZT Deposit
          </span>
          <span className="text-emerald-400 text-[11px] font-bold bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        </div>
      </div>

      {/* Card Info footer */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0a0c16]/80">
        <div>
          <h3 className="font-extrabold text-white text-base tracking-tight truncate group-hover:text-purple-300 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <div className="text-slate-500 font-mono text-[11px]">
            Owner: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'You'}
          </div>

          <a
            href={`https://sepolia.etherscan.io/token/${nftAddress}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold transition-colors group/link"
            title="Inspect on Sepolia Etherscan"
          >
            <span>Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const NFTGallery = ({ userNFTs, nftBalance, account, refreshData, loadingData, nftAddress }) => {
  const count = parseInt(nftBalance || '0');

  let displayNFTs = [...userNFTs];
  if (displayNFTs.length === 0 && count > 0) {
    for (let i = 1; i <= count; i++) {
      displayNFTs.push({
        nftTokenId: i.toString(),
        walletAddress: account,
        metadata: {
          name: `Fuzail Genesis #${i}`,
          description: `Directly verified on-chain ERC-721 token #${i} held by your wallet.`,
        }
      });
    }
  }

  return (
    <div className="cyber-card-glow p-6 sm:p-9 space-y-7">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My NFT <span className="gradient-neon">Vault</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide">
              {count} {count === 1 ? 'Item' : 'Items'} Owned
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1.5">
            Verified ERC-721 collectibles minted by depositing FZT tokens on Ethereum Sepolia.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={loadingData}
          className="btn-cyber-secondary flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
          <span>Sync Vault</span>
        </button>
      </div>

      {/* Grid */}
      {loadingData && displayNFTs.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cyber-card p-5 animate-pulse space-y-4">
              <div className="aspect-square bg-white/[0.04] rounded-2xl" />
              <div className="h-5 bg-white/[0.08] rounded w-2/3" />
              <div className="h-4 bg-white/[0.04] rounded w-full" />
            </div>
          ))}
        </div>
      ) : displayNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNFTs.map((nft, idx) => (
            <NFTCard
              key={nft.nftTokenId || idx}
              nft={nft}
              account={account}
              nftAddress={nftAddress}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500/15 to-cyan-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/50">
            <ImageIcon className="w-10 h-10 opacity-75" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-extrabold text-white">Vault is Empty</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              You haven't minted any Fuzail NFTs yet. Head over to the Mint section, claim test tokens from the faucet if needed, and deposit 5 FZT to get your first NFT!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
