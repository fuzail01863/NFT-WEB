import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

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
      console.error('Failed to load transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [account]);

  const statusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      default: return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">Transaction History</h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx._id || tx.txHash} className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {statusIcon(tx.status)}
                <div>
                  <p className="text-sm font-semibold text-white">
                    5 FZT → NFT #{tx.nftTokenId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'confirmed'
                    ? 'bg-green-500/20 text-green-400'
                    : tx.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tx.status}
                </span>
                {tx.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
