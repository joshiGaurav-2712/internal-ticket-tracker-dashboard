
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SOSAlertProps {
  count: number;
}

export const SOSAlert: React.FC<SOSAlertProps> = ({ count }) => {
  const handleViewSOSTasks = (): void => {
    console.log('View SOS tasks clicked');
    // In a real app, this would navigate to SOS tasks or show a modal
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 flex items-center justify-between component-card gradient-shadow hover-lift animate-scale-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-md">
          <AlertTriangle className="text-red-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-red-700 font-bold text-lg">SOS Tasks Requiring Immediate Attention</h3>
          <p className="text-red-600 text-sm font-medium">{count} critical task{count !== 1 ? 's' : ''} need{count === 1 ? 's' : ''} your immediate response</p>
        </div>
      </div>
      <Button 
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleViewSOSTasks}
      >
        View SOS Tasks
      </Button>
    </div>
  );
};
