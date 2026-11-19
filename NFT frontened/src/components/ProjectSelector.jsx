import { Plus, Sparkles } from 'lucide-react';

export const ProjectSelector = ({ projects, selectedProjectId, onSelectProject, onOpenCreateModal }) => {
  return (
    <div className="cyber-card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-aqua-400/30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-aqua-600 via-aqua-500 to-aqua-400 flex items-center justify-center text-white font-bold shadow-md shadow-aqua-500/30 flex-shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] text-aqua-300 uppercase tracking-wider block font-bold">
            Active Project / Pool
          </span>
          <div className="mt-0.5">
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(Number(e.target.value))}
              className="w-full sm:w-auto bg-[#061826] border border-aqua-400/40 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-aqua-400 focus:ring-1 focus:ring-aqua-400/50 cursor-pointer max-w-full truncate"
            >
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId} className="bg-[#051724] text-white">
                  #{p.projectId} • {p.tokenSymbol} ⇄ {p.nftSymbol} ({p.formattedRate} {p.tokenSymbol} = 1 NFT)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="btn-gradient px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 self-stretch sm:self-auto flex-shrink-0 text-white"
      >
        <Plus className="w-4 h-4 text-white" />
        <span className="text-white">Create New Project</span>
      </button>
    </div>
  );
};
