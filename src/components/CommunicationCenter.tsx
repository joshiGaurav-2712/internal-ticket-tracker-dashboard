
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { Update } from "@/types";

interface UpdateProps extends Update {}

const UpdateItem: React.FC<UpdateProps> = ({ title, timestamp, timeAgo }) => {
  return (
    <div className="mb-4 last:mb-0 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{timestamp}</span>
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
      className="flex flex-col items-center h-auto py-4 px-6 gap-2 component-card hover-lift transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 shadow-md">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
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

  const handleContactSupport = (): void => {
    console.log('Contact support clicked');
  };

  const handleScheduleMeeting = (): void => {
    const meetingUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+Title&details=Meeting+Description&location=Online&dates=20250610T083000Z/20250610T093000Z';
    window.open(meetingUrl, '_blank');
  };

  return (
    <Card className="component-card gradient-shadow hover-lift animate-slide-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Communication Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-gray-700">Latest Updates</h3>
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
          <h3 className="text-sm font-bold mb-4 text-gray-700">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton 
              icon={<MessageSquare className="w-4 h-4" />}
              label="Contact Support"
              onClick={handleContactSupport}
            />
            <div className="md:col-span-2">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift flex items-center justify-center gap-2"
                onClick={handleScheduleMeeting}
              >
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
