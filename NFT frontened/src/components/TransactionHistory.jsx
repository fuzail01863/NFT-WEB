import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, XCircle, ArrowUpRight, History } from 'lucide-react';

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
    <div className="cyber-card-glow p-6 sm:p-9 space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
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
          className="btn-cyber-secondary px-3.5 py-2 rounded-xl text-xs font-bold"
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
          <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto text-slate-600">
            <Clock className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-slate-300">No Transactions Yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you deposit tokens and mint your first NFT, the transaction hash and block confirmation will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx._id || tx.txHash}
              className="cyber-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-purple-500/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold text-white">
                      Deposited 5 FZT ➔ Minted NFT #{tx.nftTokenId || '1'}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              {tx.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-purple-300 hover:text-white transition-all self-start sm:self-auto"
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
