
import { Button } from "@/components/ui/button";

export const SOSAlert = () => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-500 text-xl">⚠️</span>
        </div>
        <div>
          <h3 className="text-red-700 font-medium">SOS Tasks Requiring Immediate Attention</h3>
          <p className="text-red-600 text-sm">2 critical tasks need your immediate response</p>
        </div>
      </div>
      <Button className="bg-red-500 hover:bg-red-600">View SOS Tasks</Button>
    </div>
  );
};
