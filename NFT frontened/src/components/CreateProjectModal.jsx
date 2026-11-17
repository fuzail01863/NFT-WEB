import { useState } from 'react';
import { PlusCircle, X, Sparkles, Coins, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CreateProjectModal = ({ isOpen, onClose, onCreateProject, isCreating }) => {
  const [form, setForm] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: 18,
    tokenInitialSupply: '1000000',
    nftName: '',
    nftSymbol: '',
    nftMaxSupply: '500',
    tokensPerNFT: '5',
    baseMetadataURI: 'http://localhost:8000/api/metadata/',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tokenName || !form.tokenSymbol || !form.nftName || !form.nftSymbol || !form.tokensPerNFT) {
      alert('Please fill in all required fields');
      return;
    }
    onCreateProject(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow w-full max-w-2xl p-6 sm:p-8 space-y-6 my-8 border-purple-500/40 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Launch New Token-to-NFT Project
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Deploy dynamic ERC-20, ERC-721 NFT, and Exchange contracts via the Factory in 1 single transaction.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Token Setup */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
              <Coins className="w-4 h-4" />
              <span>1. Custom ERC-20 Token Configuration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Token Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Gold"
                  value={form.tokenName}
                  onChange={(e) => setForm({ ...form, tokenName: e.target.value })}
                  className="input-field py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Token Symbol *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MGOLD"
                  value={form.tokenSymbol}
                  onChange={(e) => setForm({ ...form, tokenSymbol: e.target.value.toUpperCase() })}
                  className="input-field py-2 text-xs uppercase"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Decimals</label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={form.tokenDecimals}
                  onChange={(e) => setForm({ ...form, tokenDecimals: parseInt(e.target.value) || 18 })}
                  className="input-field py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Initial Supply (Tokens to Creator)</label>
                <input
                  type="number"
                  min="0"
                  value={form.tokenInitialSupply}
                  onChange={(e) => setForm({ ...form, tokenInitialSupply: e.target.value })}
                  className="input-field py-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. NFT Collection Setup */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Sparkles className="w-4 h-4" />
              <span>2. Custom ERC-721 NFT Collection Configuration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">NFT Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Warriors"
                  value={form.nftName}
                  onChange={(e) => setForm({ ...form, nftName: e.target.value })}
                  className="input-field py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">NFT Symbol *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MWAR"
                  value={form.nftSymbol}
                  onChange={(e) => setForm({ ...form, nftSymbol: e.target.value.toUpperCase() })}
                  className="input-field py-2 text-xs uppercase"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Max Supply (0 = Unlimited)</label>
                <input
                  type="number"
                  min="0"
                  value={form.nftMaxSupply}
                  onChange={(e) => setForm({ ...form, nftMaxSupply: e.target.value })}
                  className="input-field py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Base Metadata URI</label>
                <input
                  type="text"
                  value={form.baseMetadataURI}
                  onChange={(e) => setForm({ ...form, baseMetadataURI: e.target.value })}
                  className="input-field py-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Dynamic Mint Rate */}
          <div className="space-y-3 p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
            <div className="flex items-center gap-2 text-sm font-semibold text-pink-300">
              <Layers className="w-4 h-4" />
              <span>3. Dynamic Exchange Rate (Tokens per NFT)</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex-1">
                <label className="text-gray-300 block mb-1">
                  How many tokens must a user deposit to mint 1 NFT? *
                </label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  required
                  value={form.tokensPerNFT}
                  onChange={(e) => setForm({ ...form, tokensPerNFT: e.target.value })}
                  className="input-field py-2.5 text-sm font-bold text-pink-300"
                />
              </div>
              <div className="text-gray-400 font-mono text-xs pt-4">
                Deposit <span className="text-white font-bold">{form.tokensPerNFT || 0}</span> Tokens = <span className="text-white font-bold">1</span> NFT
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="btn-glass px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-purple-600/30"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deploying via Factory...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Deploy Project on Blockchain</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
