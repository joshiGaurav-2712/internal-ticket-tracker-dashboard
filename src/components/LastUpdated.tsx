
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LastUpdated = () => {
  return (
    <div className="flex items-center justify-end text-sm text-gray-500 mb-6">
      <span>Last updated: May 19, 2025 - 10:45 AM</span>
      <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
