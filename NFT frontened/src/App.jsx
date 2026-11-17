import { useState } from 'react';
import { Zap, Layers, Plus, Compass } from 'lucide-react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wallet = useWallet();
  const contracts = useContracts(wallet.signer, wallet.provider, wallet.account);

  return (
    <div className="min-h-screen text-white bg-grid">
      {/* Toast Notification */}
      <Notification
        notification={contracts.notification}
        onClose={() => {}}
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
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight gradient-brand">
                  Fuzail NFT Marketplace
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-300">
                  Factory v2
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Dynamic ERC-20 ⇄ ERC-721 Minting Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {wallet.account && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gradient hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}

            <WalletConnect {...wallet} />
          </div>
        </div>
      </header>

      {/* Landing / Not Connected State */}
      {!wallet.account ? (
        <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 text-center relative overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-purple-600/40 animate-pulse-subtle">
            <Layers className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl">
            Deposit ERC-20 Tokens,{' '}
            <span className="gradient-brand">Mint Exclusive NFTs</span>
          </h2>

          <p className="text-gray-400 max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
            Connect your MetaMask wallet to deposit project tokens and automatically receive verifiable ERC-721 NFTs. Or deploy your own custom token-to-NFT exchange via the Project Factory.
          </p>

          <WalletConnect {...wallet} />

          {/* 3 Step preview cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left">
            {[
              {
                step: '01',
                title: 'Connect MetaMask',
                desc: 'Authorize your wallet on Sepolia or local testnet with one click.',
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
              <div key={s.step} className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <span className="text-3xl font-extrabold font-mono text-white/10 group-hover:text-purple-500/30 transition-colors">
                  {s.step}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{s.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Connected Dashboard */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 space-y-6 min-w-0">
              {/* Mobile Navigation Tabs */}
              <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'mint', label: 'Mint NFT' },
                  { id: 'gallery', label: 'My Vault' },
                  { id: 'history', label: 'History' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === t.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'glass-panel text-gray-300'
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
