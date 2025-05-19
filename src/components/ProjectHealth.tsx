
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectProps {
  name: string;
  progress: number;
  dueDate: string;
  status: "On Track" | "At Risk" | "Delayed";
}

const Project = ({ name, progress, dueDate, status }: ProjectProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "On Track": return "text-green-500";
      case "At Risk": return "text-yellow-500";
      case "Delayed": return "text-red-500";
    }
  };

  const getProgressColor = () => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-sm">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full mb-2">
        <div 
          className={`h-full rounded-full ${getProgressColor()}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className={`flex items-center gap-1 ${getStatusColor()}`}>
          <span className={`w-2 h-2 rounded-full ${getProgressColor()}`}></span>
          {status}
        </span>
        <span className="text-gray-500">Due: {dueDate}</span>
      </div>
    </div>
  );
};

export const ProjectHealth = () => {
  const projects = [
    {
      name: "Website Redesign",
      progress: 75,
      dueDate: "Apr 25, 2025",
      status: "On Track" as const
    },
    {
      name: "Mobile App Development",
      progress: 45,
      dueDate: "May 15, 2025",
      status: "At Risk" as const
    },
    {
      name: "API Integration",
      progress: 20,
      dueDate: "Apr 30, 2025",
      status: "Delayed" as const
    }
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Project Health</CardTitle>
        <Button variant="link" size="sm" className="text-blue-500 p-0 h-auto">View All</Button>
      </CardHeader>
      <CardContent>
        {projects.map((project, index) => (
          <Project 
            key={index} 
            name={project.name} 
            progress={project.progress}
            dueDate={project.dueDate}
            status={project.status}
          />
        ))}
      </CardContent>
    </Card>
  );
};
