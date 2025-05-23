
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

type TicketStatus = 'all' | 'open' | 'in-progress' | 'completed';
type Priority = 'all' | 'low' | 'medium' | 'high' | 'sos';
type TatStatus = 'all' | 'on-track' | 'at-risk' | 'delayed';

export const TicketFilters: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('all');
  const [priority, setPriority] = useState<Priority>('all');
  const [tatStatus, setTatStatus] = useState<TatStatus>('all');

  const handleFilter = (): void => {
    console.log('Filter applied:', { searchText, ticketStatus, priority, tatStatus });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-wrap gap-3">
        <select 
          className="border rounded-md px-3 py-2 bg-white text-sm"
          value={ticketStatus}
          onChange={(e) => setTicketStatus(e.target.value as TicketStatus)}
        >
          <option value="all">Ticket Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <select 
          className="border rounded-md px-3 py-2 bg-white text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="all">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="sos">SOS</option>
        </select>
        
        <select 
          className="border rounded-md px-3 py-2 bg-white text-sm"
          value={tatStatus}
          onChange={(e) => setTatStatus(e.target.value as TatStatus)}
        >
          <option value="all">TAT Status</option>
          <option value="on-track">On Track</option>
          <option value="at-risk">At Risk</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search by text" 
            className="w-full pl-9"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button className="whitespace-nowrap" onClick={handleFilter}>
          FILTER
        </Button>
      </div>
    </div>
  );
};
