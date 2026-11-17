import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';
  const isWarning = notification.type === 'warning';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full px-4 animate-fadeIn">
      <div className={`cyber-card p-4 flex items-start gap-3 shadow-2xl backdrop-blur-2xl border ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : isWarning
          ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
          : 'bg-purple-950/90 border-purple-500/40 text-purple-200'
      }`}>
        <div className="mt-0.5 flex-shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <XCircle className="w-5 h-5 text-rose-400" />}
          {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-purple-400" />}
        </div>

        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {notification.message}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
