import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, ArrowUpRight, History } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/transactions/${account}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.warn('Transaction history fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [account]);

  return (
    <div className="cyber-card-glow p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aqua-400/15 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 flex-shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified on-chain minting deposits and smart contract interactions.
            </p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="btn-cyber-secondary px-3.5 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cyber-card p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-slate-500 space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-dark-900 border border-aqua-400/15 flex items-center justify-center mx-auto text-aqua-300/40">
            <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-300">No Transactions Yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto px-4">
            Once you deposit tokens and mint your first NFT, the transaction hash and block confirmation will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx._id || tx.txHash}
              className="cyber-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-aqua-400/40 transition-all"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aqua-400/15 border border-aqua-400/30 flex items-center justify-center text-aqua-300 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                      Deposited 5 FZT ➔ Minted NFT #{tx.nftTokenId || '1'}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-aqua-400/20 text-aqua-200 text-[10px] font-black uppercase">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              {tx.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-800 border border-aqua-400/25 text-xs font-mono text-aqua-200 hover:text-white transition-all self-start sm:self-auto flex-shrink-0"
                >
                  <span>{tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
