import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { useContracts } from './hooks/useContracts';
import { WalletConnect } from './components/WalletConnect';
import { StatsPanel } from './components/StatsPanel';
import { MintSection } from './components/MintSection';
import { NFTGallery } from './components/NFTGallery';
import { TransactionHistory } from './components/TransactionHistory';
import { Sidebar } from './components/Sidebar';
import { Notification } from './components/Notification';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const wallet = useWallet();
  const contracts = useContracts(wallet.signer, wallet.provider, wallet.account);

  return (
    <div className="min-h-screen text-white">
      {/* Notification */}
      <Notification
        notification={contracts.notification}
        onClose={() => {}}
      />

      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="w-9 h-9 rounded-xl" />
            <div>
              <h1 className="text-lg font-bold gradient-text">Fuzail NFT Marketplace</h1>
              <p className="text-xs text-gray-500 hidden sm:block">ERC-20 → NFT Exchange</p>
            </div>
          </div>
          <WalletConnect {...wallet} />
        </div>
      </nav>

      {/* Landing / Connect State */}
      {!wallet.account ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center mb-6 animate-pulse">
            <Layers className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Fuzail NFT</span>
          </h2>
          <p className="text-gray-400 max-w-md mb-8 text-lg">
            Deposit 5 FZT tokens and receive 1 exclusive Fuzail NFT directly to your wallet.
            Connect your MetaMask to get started.
          </p>
          <WalletConnect {...wallet} />
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg text-center">
            {[
              { num: '1', label: 'Connect Wallet' },
              { num: '2', label: 'Approve 5 FZT' },
              { num: '3', label: 'Mint Your NFT' },
            ].map((step) => (
              <div key={step.num} className="glass-card p-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mx-auto mb-2 text-purple-400 font-bold text-sm">
                  {step.num}
                </div>
                <p className="text-xs text-gray-400">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Main Dashboard */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 space-y-6 min-w-0">
              {/* Mobile tab bar */}
              <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
                {['dashboard', 'mint', 'gallery', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Dashboard */}
              {(activeTab === 'dashboard' || activeTab === 'mint') && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Welcome back,{' '}
                      <span className="gradient-text">{wallet.shortAddress}</span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {wallet.isCorrectNetwork
                        ? '🟢 Connected to Sepolia Testnet'
                        : '🔴 Wrong network — please switch to Sepolia'}
                    </p>
                  </div>

                  {/* Stats */}
                  <StatsPanel
                    tokenBalance={contracts.tokenBalance}
                    nftBalance={contracts.nftBalance}
                    totalMinted={contracts.totalMinted}
                    loadingData={contracts.loadingData}
                  />

                  {/* Mint Section */}
                  <MintSection
                    tokenBalance={contracts.tokenBalance}
                    hasEnoughTokens={contracts.hasEnoughTokens}
                    hasEnoughAllowance={contracts.hasEnoughAllowance}
                    isApproving={contracts.isApproving}
                    isMinting={contracts.isMinting}
                    txHash={contracts.txHash}
                    approveTokens={contracts.approveTokens}
                    mintNFT={contracts.mintNFT}
                    refreshData={contracts.refreshData}
                    loadingData={contracts.loadingData}
                    EXCHANGE_ADDRESS={contracts.EXCHANGE_ADDRESS}
                  />
                </>
              )}

              {/* NFT Gallery */}
              {activeTab === 'gallery' && (
                <NFTGallery
                  userNFTs={contracts.userNFTs}
                  nftBalance={contracts.nftBalance}
                  account={wallet.account}
                  refreshData={contracts.refreshData}
                  loadingData={contracts.loadingData}
                />
              )}

              {/* Transaction History */}
              {activeTab === 'history' && (
                <TransactionHistory account={wallet.account} />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
