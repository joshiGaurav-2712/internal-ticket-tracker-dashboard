
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const TicketFilters = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-wrap gap-3">
        <select className="border rounded-md px-3 py-2 bg-white text-sm">
          <option>Ticket Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="border rounded-md px-3 py-2 bg-white text-sm">
          <option>Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>SOS</option>
        </select>
        <select className="border rounded-md px-3 py-2 bg-white text-sm">
          <option>TAT Status</option>
          <option>On Track</option>
          <option>At Risk</option>
          <option>Delayed</option>
        </select>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder="Search by text" className="w-full pl-9" />
        </div>
        <Button className="whitespace-nowrap">FILTER</Button>
      </div>
    </div>
  );
};
