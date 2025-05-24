
import { FileText, Clock, Ticket, CheckCircle, Clock3 } from "lucide-react";
import { StatCardData } from "@/types";

interface StatCardProps extends StatCardData {}

interface SummaryCardsProps {
  stats: {
    total: number;
    open: number;
    completed: number;
    inProgress: number;
    timeSpent: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  textColor = "text-gray-900", 
  icon, 
  bgColor = "bg-white" 
}) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-sm flex items-start gap-4`}>
    {icon && <div className="p-2 rounded-full bg-opacity-20">{icon}</div>}
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{value}</p>
    </div>
  </div>
);

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const statsData: StatCardData[] = [
    { 
      title: "Total Tickets", 
      value: stats.total.toString(), 
      icon: <Ticket className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-blue-50"
    },
    { 
      title: "Open Tickets", 
      value: stats.open.toString(), 
      textColor: "text-yellow-500", 
      icon: <FileText className="h-6 w-6 text-yellow-500" />,
      bgColor: "bg-yellow-50"
    },
    { 
      title: "Closed Tickets", 
      value: stats.completed.toString(), 
      textColor: "text-green-500", 
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      bgColor: "bg-green-50"
    },
    { 
      title: "In Progress Tickets", 
      value: stats.inProgress.toString(), 
      textColor: "text-blue-500", 
      icon: <Clock3 className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-blue-50"
    },
    { 
      title: "Time Spent", 
      value: stats.timeSpent, 
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
