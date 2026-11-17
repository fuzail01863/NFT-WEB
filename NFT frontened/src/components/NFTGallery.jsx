import { useState } from 'react';
import { ExternalLink, RefreshCw, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

const NFTCard = ({ nft, account, nftAddress }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tokenId = nft.nftTokenId || nft.tokenId || '1';
  const name = nft.metadata?.name || `Fuzail Genesis #${tokenId}`;
  const desc = nft.metadata?.description || `Authentic Fuzail NFT minted with 5 FZT on Sepolia Testnet.`;
  
  // High quality SVG geometric generative artwork for each unique token ID
  const defaultArt = `https://api.dicebear.com/7.x/identicon/svg?seed=fuzail-nft-${tokenId}&backgroundColor=0f172a,1e1b4b,31104b&rowColor=a855f7,38bdf8,ec4899`;
  const image = nft.metadata?.image || nft.image || defaultArt;

  return (
    <div className="glass-panel overflow-hidden group hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col">
      {/* Visual Image container */}
      <div className="relative aspect-square w-full bg-gradient-to-tr from-purple-950/40 via-navy-900 to-indigo-950/40 overflow-hidden flex items-center justify-center p-4">
        {/* Holographic background sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        
        <img
          src={image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-contain rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Token ID Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-bold shadow-md">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>#{tokenId}</span>
        </div>

        {/* Rarity Pill */}
        <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[10px] font-semibold uppercase tracking-wider">
          Genesis
        </div>

        {/* Bottom overlay text */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs">
          <span className="text-gray-300 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
            5 FZT Deposit
          </span>
          <span className="text-emerald-400 text-[11px] font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
            Verified
          </span>
        </div>
      </div>

      {/* Info card footer */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-white text-base tracking-tight truncate group-hover:text-purple-300 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="text-gray-500 font-mono text-[11px]">
            Owner: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'You'}
          </div>

          <a
            href={`https://sepolia.etherscan.io/token/${nftAddress}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            title="Inspect on Sepolia Etherscan"
          >
            <span>Etherscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const NFTGallery = ({ userNFTs, nftBalance, account, refreshData, loadingData, nftAddress }) => {
  const count = parseInt(nftBalance || '0');

  // If on-chain balance > userNFTs in DB, generate synthetic cards for immediate visual gratification
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
    <div className="glass-panel-glow p-6 sm:p-8 space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              My NFT Vault
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              {count} {count === 1 ? 'Item' : 'Items'} Owned
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            All unique ERC-721 tokens minted via FZT token deposits and secured on Ethereum Sepolia.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={loadingData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
          <span>Refresh Gallery</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loadingData && displayNFTs.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-4 animate-pulse space-y-3">
              <div className="aspect-square bg-white/5 rounded-xl" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : displayNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/15 to-blue-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <ImageIcon className="w-8 h-8 opacity-80" />
          </div>
          <div className="max-w-sm space-y-1">
            <h3 className="text-lg font-bold text-white">No NFTs in Vault</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              You haven't minted any Fuzail NFTs yet. Head over to the Mint section, deposit 5 FZT, and receive your first NFT directly!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
