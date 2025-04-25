
interface StatusBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const StatusBar = ({ label, value, maxValue, color }: StatusBarProps) => {
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

export const StatusOverview = () => {
  const total = 19;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">TAT Status Overview</h2>
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm">On Track</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span className="text-sm">At Risk</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-sm">Delayed</span>
        </span>
      </div>
      <StatusBar label="On Track Tasks" value={12} maxValue={total} color="bg-green-500" />
      <StatusBar label="At Risk Tasks" value={5} maxValue={total} color="bg-yellow-500" />
      <StatusBar label="Delayed Tasks" value={2} maxValue={total} color="bg-red-500" />
    </div>
  );
};
