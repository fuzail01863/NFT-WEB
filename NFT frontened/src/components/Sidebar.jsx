import { LayoutDashboard, Sparkles, Clock, Zap, ShieldCheck } from 'lucide-react';

const NavItem = ({ icon, label, badge, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 group ${
      active
        ? 'bg-gradient-to-r from-aqua-500/20 via-aqua-400/10 to-transparent border-l-4 border-l-aqua-400 border-y border-r border-aqua-400/30 text-white font-extrabold shadow-[0_0_20px_rgba(46,199,192,0.15)]'
        : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-aqua-300 drop-shadow-[0_0_8px_rgba(46,199,192,0.7)]' : 'text-slate-400 group-hover:text-aqua-300'}`}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
        active 
          ? 'bg-aqua-400/25 text-aqua-200 border border-aqua-400/40 shadow-sm' 
          : 'bg-dark-900/80 text-slate-400 border border-white/10'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab, chainId }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mint', label: 'Mint NFT', icon: <Zap className="w-4 h-4" />, badge: '5 FZT' },
    { id: 'gallery', label: 'NFT Vault', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'history', label: 'Transactions', icon: <Clock className="w-4 h-4" /> },
  ];

  const networkName = chainId === 31337 
    ? 'Hardhat Localhost' 
    : chainId === 11155111 
    ? 'Ethereum Sepolia' 
    : 'Ethereum Sepolia';

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-3">
      {/* Navigation Card */}
      <div className="cyber-card p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-aqua-300/80">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>

      {/* Network & Live Sync Card */}
      <div className="cyber-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-aqua-300/80">
            Network Status
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-400"></span>
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-aqua-400" />
            <span>{networkName}</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Chain ID: {chainId || 11155111}
          </p>
        </div>

        <div className="pt-2 border-t border-aqua-400/15 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Smart Contracts:</span>
          <span className="text-aqua-300 font-bold">Audited v2</span>
        </div>
      </div>
    </aside>
  );
};
