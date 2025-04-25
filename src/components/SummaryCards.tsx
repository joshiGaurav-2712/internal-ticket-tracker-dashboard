
interface StatCardProps {
  title: string;
  value: string | number;
  textColor?: string;
}

const StatCard = ({ title, value, textColor = "text-gray-900" }: StatCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{value}</p>
  </div>
);

export const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard title="Total Tickets" value="52" />
      <StatCard title="Open Tickets" value="8" textColor="text-yellow-500" />
      <StatCard title="Closed Tickets" value="25" textColor="text-green-500" />
      <StatCard title="In Progress Tickets" value="19" textColor="text-blue-500" />
      <StatCard title="Time Spent" value="767.48 Hrs" />
    </div>
  );
};
