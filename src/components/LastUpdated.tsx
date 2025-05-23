
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const LastUpdated: React.FC = () => {
  const [lastUpdated] = useState<string>("April 8, 2025 - 10:45 AM");

  const handleRefresh = (): void => {
    console.log('Refresh clicked');
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="flex items-center text-sm text-gray-500">
      <span>Last updated: {lastUpdated}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-1 h-6 w-6"
        onClick={handleRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
