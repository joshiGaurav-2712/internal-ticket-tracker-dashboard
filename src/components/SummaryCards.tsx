
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
  <div className={`${bgColor} rounded-xl p-4 md:p-6 component-card gradient-shadow flex items-start gap-3 md:gap-4 hover-lift animate-float-up`}>
    {icon && <div className="p-2 md:p-3 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-md flex-shrink-0">{icon}</div>}
    <div className="min-w-0 flex-1">
      <p className="text-gray-500 text-xs md:text-sm font-medium truncate">{title}</p>
      <p className={`text-xl md:text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
    </div>
  </div>
);

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const statsData: StatCardData[] = [
    { 
      title: "Total Tickets", 
      value: stats.total.toString(), 
      icon: <Ticket className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-25"
    },
    { 
      title: "Open Tickets", 
      value: stats.open.toString(), 
      textColor: "text-yellow-600", 
      icon: <FileText className="h-6 w-6 text-yellow-500" />,
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-25"
    },
    { 
      title: "Closed Tickets", 
      value: stats.completed.toString(), 
      textColor: "text-green-600", 
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-25"
    },
    { 
      title: "In Progress Tickets", 
      value: stats.inProgress.toString(), 
      textColor: "text-blue-600", 
      icon: <Clock3 className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-25"
    },
    { 
      title: "Time Spent", 
      value: stats.timeSpent, 
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-25"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          className="animate-stagger-1" 
          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};
