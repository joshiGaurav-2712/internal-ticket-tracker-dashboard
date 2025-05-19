
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface MilestoneProps {
  title: string;
  status: "Completed" | "In Progress" | "Upcoming";
  description: string;
  date: string;
}

const Milestone = ({ title, status, description, date }: MilestoneProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Upcoming":
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Upcoming":
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
      <div className="absolute left-[-10px] bg-white">{getStatusIcon()}</div>
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-base font-medium">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${getStatusClass()}`}>{status}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{description}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
};

export const TimelineMilestones = () => {
  const milestones = [
    {
      title: "Website Prototype Approval",
      status: "Completed" as const,
      description: "All mockups and prototypes have been approved by the client",
      date: "April 5, 2025"
    },
    {
      title: "Frontend Development Completion",
      status: "In Progress" as const,
      description: "Development of all frontend components based on approved designs",
      date: "April 15, 2025"
    },
    {
      title: "Backend Integration",
      status: "Upcoming" as const,
      description: "Connect frontend components with backend APIs",
      date: "April 25, 2025"
    },
    {
      title: "QA Testing Phase",
      status: "Upcoming" as const,
      description: "Comprehensive testing of all features and functionality",
      date: "May 5, 2025"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Timeline & Milestones</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs">30 Days</Button>
          <Button size="sm" variant="outline" className="text-xs">60 Days</Button>
          <Button size="sm" variant="outline" className="text-xs">90 Days</Button>
        </div>
      </CardHeader>
      <CardContent>
        {milestones.map((milestone, index) => (
          <Milestone
            key={index}
            title={milestone.title}
            status={milestone.status}
            description={milestone.description}
            date={milestone.date}
          />
        ))}
      </CardContent>
    </Card>
  );
};
