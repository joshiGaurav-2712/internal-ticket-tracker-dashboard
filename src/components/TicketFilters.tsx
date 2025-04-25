
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const TicketFilters = () => {
  return (
    <div className="flex gap-4 mb-6">
      <select className="border rounded-md px-3 py-2">
        <option>Ticket Status</option>
        <option>Open</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <select className="border rounded-md px-3 py-2">
        <option>Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>SOS</option>
      </select>
      <select className="border rounded-md px-3 py-2">
        <option>TAT Status</option>
        <option>On Track</option>
        <option>At Risk</option>
        <option>Delayed</option>
      </select>
      <div className="flex-1">
        <Input type="text" placeholder="Search by text" className="w-full" />
      </div>
      <Button>FILTER</Button>
    </div>
  );
};
