import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';
  const isWarning = notification.type === 'warning';

  return (
    <div className="fixed top-4 right-3 left-3 sm:left-auto sm:right-5 z-50 sm:max-w-md animate-fadeIn">
      <div className={`cyber-card p-4 flex items-start gap-3 shadow-2xl backdrop-blur-2xl border ${
        isSuccess
          ? 'bg-dark-900/95 border-aqua-400/50 text-aqua-200 shadow-aqua-500/10'
          : isError
          ? 'bg-rose-950/95 border-rose-500/50 text-rose-200 shadow-rose-500/10'
          : isWarning
          ? 'bg-amber-950/95 border-amber-500/50 text-amber-200 shadow-amber-500/10'
          : 'bg-dark-900/95 border-aqua-400/50 text-aqua-200 shadow-aqua-500/10'
      }`}>
        <div className="mt-0.5 flex-shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-aqua-300" />}
          {isError && <XCircle className="w-5 h-5 text-rose-400" />}
          {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-aqua-300" />}
        </div>

        <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
          {notification.message}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
