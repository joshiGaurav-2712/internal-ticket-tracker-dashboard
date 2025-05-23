
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { Update } from "@/types";

interface UpdateProps extends Update {}

const UpdateItem: React.FC<UpdateProps> = ({ title, timestamp, timeAgo }) => {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-sm font-medium text-gray-800">{title}</h4>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-blue-600">{timestamp}</span>
        <span className="text-xs text-gray-500">Posted {timeAgo}</span>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center h-auto py-4 px-6 gap-2"
      onClick={onClick}
    >
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </Button>
  );
};

export const CommunicationCenter: React.FC = () => {
  const updates: Update[] = [
    {
      title: "Weekly progress meeting scheduled for April 10, 2025 at 2:00 PM",
      timestamp: "April 8, 2025",
      timeAgo: "2 hours ago"
    },
    {
      title: "New requirements document added to the project files",
      timestamp: "April 7, 2025",
      timeAgo: "yesterday"
    }
  ];

  const handleScheduleMeeting = (): void => {
    console.log('Schedule meeting clicked');
  };

  const handleContactSupport = (): void => {
    console.log('Contact support clicked');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Communication Center</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700">Latest Updates</h3>
          {updates.map((update, index) => (
            <UpdateItem
              key={index}
              title={update.title}
              timestamp={update.timestamp}
              timeAgo={update.timeAgo}
            />
          ))}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-700">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton 
              icon={<Calendar className="w-4 h-4" />}
              label="Schedule Meeting"
              onClick={handleScheduleMeeting}
            />
            <ActionButton 
              icon={<MessageSquare className="w-4 h-4" />}
              label="Contact Support"
              onClick={handleContactSupport}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
