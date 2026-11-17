import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgColors = {
  success: 'bg-green-500/10 border-green-500/30',
  error: 'bg-red-500/10 border-red-500/30',
  warning: 'bg-yellow-500/10 border-yellow-500/30',
  info: 'bg-blue-500/10 border-blue-500/30',
};

export const Notification = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-pulse-slow">
      <div className={`glass-card border ${bgColors[notification.type] || bgColors.info} p-4 flex items-start gap-3`}>
        {icons[notification.type] || icons.info}
        <p className="text-sm text-gray-200 flex-1">{notification.message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-2 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
