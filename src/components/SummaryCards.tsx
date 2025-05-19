
import { FileText, Clock, Ticket, CheckCircle, Clock3, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  textColor?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard = ({ title, value, textColor = "text-gray-900", icon, bgColor = "bg-white" }: StatCardProps) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-sm flex items-start gap-4`}>
    {icon && <div className="p-2 rounded-full bg-opacity-20">{icon}</div>}
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{value}</p>
    </div>
  </div>
);

export const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard 
        title="Total Tickets" 
        value="52" 
        icon={<Ticket className="h-6 w-6 text-blue-500" />}
        bgColor="bg-blue-50"
      />
      <StatCard 
        title="Open Tickets" 
        value="8" 
        textColor="text-yellow-500" 
        icon={<FileText className="h-6 w-6 text-yellow-500" />}
        bgColor="bg-yellow-50"
      />
      <StatCard 
        title="Closed Tickets" 
        value="25" 
        textColor="text-green-500" 
        icon={<CheckCircle className="h-6 w-6 text-green-500" />}
        bgColor="bg-green-50"
      />
      <StatCard 
        title="In Progress Tickets" 
        value="19" 
        textColor="text-blue-500" 
        icon={<Clock3 className="h-6 w-6 text-blue-500" />}
        bgColor="bg-blue-50"
      />
      <StatCard 
        title="Time Spent" 
        value="767.48 Hrs" 
        icon={<Clock className="h-6 w-6 text-purple-500" />}
        bgColor="bg-purple-50"
      />
    </div>
  );
};
