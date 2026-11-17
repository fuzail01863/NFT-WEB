import { Plus, ChevronDown, Check, Sparkles } from 'lucide-react';

export const ProjectSelector = ({ projects, selectedProjectId, onSelectProject, onOpenCreateModal }) => {
  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-purple-500/20">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">
            Active Project / Pool
          </span>
          <div className="flex items-center gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(Number(e.target.value))}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId} className="bg-gray-900 text-white">
                  #{p.projectId} • {p.tokenSymbol} ⇄ {p.nftSymbol} ({p.formattedRate} {p.tokenSymbol} = 1 NFT)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Project</span>
      </button>
    </div>
  );
};
