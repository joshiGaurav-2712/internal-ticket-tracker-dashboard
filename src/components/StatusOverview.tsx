
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBarData } from "@/types";

interface StatusBarProps extends StatusBarData {}

interface StatusOverviewProps {
  tatStats: {
    total: number;
    onTrack: number;
    atRisk: number;
    delayed: number;
  };
}

const StatusBar: React.FC<StatusBarProps> = ({ label, value, maxValue, color }) => {
  const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-800">{value}</span>
      </div>
      <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full shadow-inner">
        <div 
          className={`h-full rounded-full ${color} shadow-sm transition-all duration-700 ease-out`} 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const StatusOverview: React.FC<StatusOverviewProps> = ({ tatStats }) => {
  const { total, onTrack, atRisk, delayed } = tatStats;
  
  const statusData: StatusBarData[] = [
    { label: "On Track Tasks", value: onTrack, maxValue: total, color: "bg-gradient-to-r from-green-400 to-green-500" },
    { label: "At Risk Tasks", value: atRisk, maxValue: total, color: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
    { label: "Delayed Tasks", value: delayed, maxValue: total, color: "bg-gradient-to-r from-red-400 to-red-500" }
  ];

  const legendItems = [
    { color: "bg-gradient-to-r from-green-400 to-green-500", label: "On Track" },
    { color: "bg-gradient-to-r from-yellow-400 to-yellow-500", label: "At Risk" },
    { color: "bg-gradient-to-r from-red-400 to-red-500", label: "Delayed" }
  ];
  
  return (
    <Card className="component-card gradient-shadow hover-lift animate-slide-in-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            TAT Status Overview
          </CardTitle>
          <div className="flex items-center gap-4">
            {legendItems.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {statusData.map((status, index) => (
          <StatusBar key={index} {...status} />
        ))}
      </CardContent>
    </Card>
  );
};
