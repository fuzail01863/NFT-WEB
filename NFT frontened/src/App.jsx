import { useState } from 'react';
import { Zap, Layers, Plus } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { useContracts } from './hooks/useContracts';
import { WalletConnect } from './components/WalletConnect';
import { StatsPanel } from './components/StatsPanel';
import { MintSection } from './components/MintSection';
import { NFTGallery } from './components/NFTGallery';
import { TransactionHistory } from './components/TransactionHistory';
import { Sidebar } from './components/Sidebar';
import { Notification } from './components/Notification';
import { ProjectSelector } from './components/ProjectSelector';
import { CreateProjectModal } from './components/CreateProjectModal';
import { InAppWalletModal } from './components/InAppWalletModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wallet = useWallet();
  const contracts = useContracts(wallet.signer, wallet.provider, wallet.account);

  return (
    <div className="min-h-screen text-slate-100 bg-grid selection:bg-aqua-400 selection:text-dark-950">
      {/* Toast Notification */}
      <Notification
        notification={contracts.notification}
        onClose={() => {}}
      />

      {/* In-App Web3 Wallet Manager Modal */}
      <InAppWalletModal
        wallet={wallet}
        isOpen={wallet.isWalletModalOpen}
        onClose={wallet.closeWalletModal}
      />

      {/* Create Project Modal (Factory Launcher) */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={async (params) => {
          await contracts.createProject(params);
          setIsModalOpen(false);
        }}
        isCreating={contracts.isCreatingProject}
      />

      {/* Top Header */}
      <header className="border-b border-aqua-400/20 bg-[#050e17]/85 backdrop-blur-xl sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center shadow-lg shadow-aqua-500/30 flex-shrink-0">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight gradient-brand truncate">
                  Fuzail NFT Marketplace
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-aqua-400/15 border border-aqua-400/35 text-[10px] font-bold text-aqua-200">
                  Factory v2
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block truncate">
                Dynamic ERC-20 ⇄ ERC-721 Minting Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {wallet.account && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gradient hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-aqua-500/20"
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white">New Project</span>
              </button>
            )}

            <WalletConnect {...wallet} />
          </div>
        </div>
      </header>

      {/* Landing / Not Connected State */}
      {!wallet.account ? (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 text-center relative overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-aqua-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-aqua-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center mb-6 shadow-2xl shadow-aqua-400/40 animate-pulse-subtle">
            <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 max-w-2xl leading-tight text-white">
            Deposit ERC-20 Tokens,{' '}
            <span className="gradient-neon">Mint Exclusive NFTs</span>
          </h2>

          <p className="text-slate-300 max-w-lg mb-8 text-xs sm:text-base leading-relaxed">
            Connect your MetaMask wallet or launch a zero-extension In-App Web3 Wallet directly inside the browser. Deposit project tokens and automatically receive verifiable ERC-721 NFTs.
          </p>

          <button
            onClick={wallet.openWalletModal}
            className="btn-cyber-primary py-3.5 px-8 rounded-2xl text-sm sm:text-base font-black flex items-center gap-2.5 shadow-xl shadow-aqua-500/30"
          >
            <Zap className="w-5 h-5 fill-white text-white" />
            <span>Launch Wallet & Start Minting</span>
          </button>

          {/* 3 Step preview cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left">
            {[
              {
                step: '01',
                title: 'Open In-App Wallet',
                desc: 'Generate a browser-based wallet in 1 click, or connect your MetaMask.',
              },
              {
                step: '02',
                title: 'Approve Tokens',
                desc: 'Grant one-time approval for the smart contract to transfer your deposit.',
              },
              {
                step: '03',
                title: 'Automatic NFT Mint',
                desc: 'Tokens are deposited and 1 unique NFT is minted directly to your address.',
              },
            ].map((s) => (
              <div 
                key={s.step} 
                className="cyber-card p-5 relative overflow-hidden group hover:border-aqua-400/50 transition-all duration-300"
              >
                <span className="text-3xl font-black font-mono text-aqua-400/20 group-hover:text-aqua-400/50 transition-colors">
                  {s.step}
                </span>
                <h3 className="font-extrabold text-white text-sm mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-aqua-400" />
                  {s.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Connected Dashboard */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex flex-col md:flex-row gap-5 lg:gap-6">
            {/* Sidebar (Desktop) */}
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              chainId={wallet.chainId}
            />

            {/* Main Content Area */}
            <main className="flex-1 space-y-5 sm:space-y-6 min-w-0">
              {/* Mobile Navigation Tabs */}
              <div className="flex md:hidden gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'mint', label: 'Mint NFT' },
                  { id: 'gallery', label: 'NFT Vault' },
                  { id: 'history', label: 'History' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      activeTab === t.id
                        ? 'bg-gradient-to-r from-aqua-600 via-aqua-500 to-aqua-400 text-white font-extrabold shadow-md shadow-aqua-500/30 border border-aqua-300/40'
                        : 'bg-dark-900/80 border border-aqua-400/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Project Selector Pool */}
              <ProjectSelector
                projects={contracts.projects}
                selectedProjectId={contracts.selectedProjectId}
                onSelectProject={contracts.setSelectedProjectId}
                onOpenCreateModal={() => setIsModalOpen(true)}
              />

              {/* Main Dashboard & Minting Tabs */}
              {(activeTab === 'dashboard' || activeTab === 'mint') && (
                <>
                  {/* Dynamic Stats for Current Project */}
                  <StatsPanel
                    tokenBalance={contracts.tokenBalance}
                    nftBalance={contracts.nftBalance}
                    totalMinted={contracts.totalMinted}
                    loadingData={contracts.loadingData}
                  />

                  {/* Dynamic Mint Card */}
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
                    EXCHANGE_ADDRESS={contracts.currentProject?.exchangeAddress}
                    claimFaucetTokens={contracts.claimFaucetTokens}
                    isClaimingFaucet={contracts.isClaimingFaucet}
                  />
                </>
              )}

              {/* NFT Vault Gallery */}
              {activeTab === 'gallery' && (
                <NFTGallery
                  userNFTs={contracts.userNFTs}
                  nftBalance={contracts.nftBalance}
                  account={wallet.account}
                  refreshData={contracts.refreshData}
                  loadingData={contracts.loadingData}
                  nftAddress={contracts.currentProject?.nftAddress}
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
