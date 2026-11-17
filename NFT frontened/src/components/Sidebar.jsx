import { LayoutDashboard, Image, ArrowRightLeft, Zap } from 'lucide-react';

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mint', label: 'Mint NFT', icon: <Zap className="w-4 h-4" /> },
    { id: 'gallery', label: 'NFT Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'history', label: 'Transactions', icon: <ArrowRightLeft className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 flex-shrink-0 hidden md:flex flex-col gap-2">
      <div className="glass-card p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
      {/* Network badge */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Network</span>
        </div>
        <span className="text-sm font-semibold text-white">Sepolia Testnet</span>
        <p className="text-xs text-gray-500 mt-1">Chain ID: 11155111</p>
      </div>
    </aside>
  );
};
