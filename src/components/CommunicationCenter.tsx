
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { Update } from "@/types";

interface UpdateProps extends Update {}

const UpdateItem: React.FC<UpdateProps> = ({ title, timestamp, timeAgo }) => {
  return (
    <div className="mb-4 last:mb-0 p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300 hover-lift">
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full">{timestamp}</span>
        <span className="text-xs text-gray-500">Posted {timeAgo}</span>
      </div>
    </div>
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
    <Card className="component-card gradient-shadow hover-lift animate-slide-in-up overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          Communication Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-bold mb-4 text-gray-700">Latest Updates</h3>
          <div className="space-y-3">
            {updates.map((update, index) => (
              <UpdateItem
                key={index}
                title={update.title}
                timestamp={update.timestamp}
                timeAgo={update.timeAgo}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold mb-4 text-gray-700">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="h-20 bg-white/80 border-gray-200/50 hover:bg-gray-50/80 hover:border-gray-300/50 shadow-sm hover:shadow-md transition-all duration-300 hover-lift flex flex-col items-center justify-center gap-2 rounded-xl"
              onClick={handleScheduleMeeting}
            >
              <div className="w-8 h-8 bg-blue-100/70 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 bg-white/80 border-gray-200/50 hover:bg-gray-50/80 hover:border-gray-300/50 shadow-sm hover:shadow-md transition-all duration-300 hover-lift flex flex-col items-center justify-center gap-2 rounded-xl"
              onClick={handleContactSupport}
            >
              <div className="w-8 h-8 bg-blue-100/70 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Contact Support</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
