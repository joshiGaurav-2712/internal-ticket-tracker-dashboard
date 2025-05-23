
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBarData } from "@/types";

interface StatusBarProps extends StatusBarData {}

const StatusBar: React.FC<StatusBarProps> = ({ label, value, maxValue, color }) => {
  const width = (value / maxValue) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div 
          className={`h-full rounded-full ${color}`} 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const StatusOverview: React.FC = () => {
  const total = 19;
  
  const statusData: StatusBarData[] = [
    { label: "On Track Tasks", value: 12, maxValue: total, color: "bg-green-500" },
    { label: "At Risk Tasks", value: 5, maxValue: total, color: "bg-yellow-500" },
    { label: "Delayed Tasks", value: 2, maxValue: total, color: "bg-red-500" }
  ];

  const legendItems = [
    { color: "bg-green-500", label: "On Track" },
    { color: "bg-yellow-500", label: "At Risk" },
    { color: "bg-red-500", label: "Delayed" }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">TAT Status Overview</CardTitle>
          <div className="flex items-center gap-4">
            {legendItems.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                <span className="text-sm">{item.label}</span>
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
