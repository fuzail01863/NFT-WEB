import { LayoutDashboard, Sparkles, ArrowRightLeft, Clock, Zap, ShieldCheck, Flame } from 'lucide-react';

const NavItem = ({ icon, label, badge, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 group ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
        active ? 'bg-white/20 text-white' : 'bg-purple-500/15 text-purple-300'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mint', label: 'Mint NFT', icon: <Zap className="w-4 h-4" />, badge: '5 FZT' },
    { id: 'gallery', label: 'NFT Vault', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'history', label: 'Transactions', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-3">
      {/* Navigation Card */}
      <div className="cyber-card p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
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
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            Network Status
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ethereum Sepolia</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Chain ID: 11155111</p>
        </div>

        <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
          <span>Smart Contracts:</span>
          <span className="text-purple-300 font-bold">Audited v2</span>
        </div>
      </div>
    </aside>
  );
};
