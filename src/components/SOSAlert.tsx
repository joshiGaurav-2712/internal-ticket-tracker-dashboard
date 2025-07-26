
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface SOSAlertProps {
  count: number;
}

export const SOSAlert: React.FC<SOSAlertProps> = ({ count }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (): void => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center justify-between mb-4 animate-scale-in">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-red-700 font-semibold text-sm sm:text-base leading-tight">
            SOS Tasks Requiring Immediate Attention
          </h3>
          <p className="text-red-600 text-xs sm:text-sm mt-1">
            {count} critical task{count !== 1 ? 's' : ''} need{count === 1 ? 's' : ''} your immediate response
          </p>
        </div>
      </div>
      <button 
        onClick={handleClose}
        className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors ml-2 sm:ml-4"
        aria-label="Close SOS alert"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
