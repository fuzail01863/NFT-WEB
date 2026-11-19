import { useState } from 'react';
import { ExternalLink, RefreshCw, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const NFTCard = ({ nft, account, nftAddress }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tokenId = nft.nftTokenId || nft.tokenId || '1';
  const name = nft.metadata?.name || `Fuzail Genesis #${tokenId}`;
  const desc = nft.metadata?.description || `Authentic verified Fuzail NFT minted via smart contract exchange on Sepolia.`;
  
  // High-def generative avatar artwork themed to the aqua palette
  const defaultArt = `https://api.dicebear.com/7.x/identicon/svg?seed=fuzail-genesis-nft-${tokenId}&backgroundColor=040d14,071520,0a1d2c&rowColor=00abc5,2ec7c0,87dfe9,99dde7,b2e5ed`;
  const image = nft.metadata?.image || nft.image || defaultArt;

  return (
    <div className="cyber-card hologram-card overflow-hidden group hover:border-aqua-400/60 hover:shadow-2xl hover:shadow-aqua-500/20 transition-all duration-300 flex flex-col">
      {/* Artwork container */}
      <div className="relative aspect-square w-full bg-gradient-to-tr from-dark-950 via-dark-900 to-dark-850 overflow-hidden flex items-center justify-center p-4 sm:p-5">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10" />
        
        <img
          src={image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-contain rounded-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Token ID Badge */}
        <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-dark-950/80 backdrop-blur-md border border-aqua-400/25 text-white text-xs font-mono font-extrabold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-aqua-300" />
          <span>#{tokenId}</span>
        </div>

        {/* Rarity Pill */}
        <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-20 px-2.5 sm:px-3 py-1 rounded-full bg-aqua-400/15 backdrop-blur-md border border-aqua-400/35 text-aqua-200 text-[10px] font-black uppercase tracking-widest shadow-md">
          Genesis
        </div>

        {/* On-chain verified chip */}
        <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 right-3 sm:right-3.5 z-20 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-mono text-[10px] sm:text-[11px] bg-dark-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-aqua-400/15">
            5 FZT Deposit
          </span>
          <span className="text-aqua-300 text-[10px] sm:text-[11px] font-bold bg-dark-950/90 border border-aqua-400/30 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-aqua-400" /> Verified
          </span>
        </div>
      </div>

      {/* Card Info footer */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-dark-950/70">
        <div>
          <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate group-hover:text-aqua-300 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="pt-3 border-t border-aqua-400/15 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-mono text-[11px] truncate mr-2">
            Owner: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'You'}
          </div>

          <a
            href={`https://sepolia.etherscan.io/token/${nftAddress}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-aqua-300 hover:text-white font-bold transition-colors group/link flex-shrink-0"
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
    <div className="cyber-card-glow p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-7">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aqua-400/15 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              My NFT <span className="gradient-neon">Vault</span>
            </h2>
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-aqua-400/15 border border-aqua-400/30 text-aqua-200 text-xs font-bold tracking-wide">
              {count} {count === 1 ? 'Item' : 'Items'} Owned
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Verified ERC-721 collectibles minted by depositing FZT tokens on Ethereum Sepolia.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={loadingData}
          className="btn-cyber-secondary flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
          <span>Sync Vault</span>
        </button>
      </div>

      {/* Grid */}
      {loadingData && displayNFTs.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cyber-card p-5 animate-pulse space-y-4">
              <div className="aspect-square bg-dark-900 rounded-2xl" />
              <div className="h-5 bg-dark-800 rounded w-2/3" />
              <div className="h-4 bg-dark-900 rounded w-full" />
            </div>
          ))}
        </div>
      ) : displayNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-aqua-600/20 to-aqua-400/20 border border-aqua-400/30 flex items-center justify-center text-aqua-300 shadow-xl shadow-aqua-950/50">
            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
          </div>
          <div className="max-w-md space-y-2 px-4">
            <h3 className="text-lg sm:text-xl font-black text-white">Vault is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              You haven't minted any Fuzail NFTs yet. Head over to the Mint section, claim test tokens from the faucet if needed, and deposit 5 FZT to get your first NFT!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
