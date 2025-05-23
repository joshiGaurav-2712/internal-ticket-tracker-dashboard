
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "@/types";

const tickets: Ticket[] = [
  {
    id: "#54",
    priority: "SOS",
    title: "API Integration Fix",
    status: "In Progress",
    tatStatus: "2h left",
    timeCreated: "4 hours ago",
    assignedTo: "David Thompson"
  },
  {
    id: "#55",
    priority: "SOS",
    title: "Payment Gateway Error",
    status: "Open",
    tatStatus: "3h left",
    timeCreated: "6 hours ago",
    assignedTo: "Sophia Wilson"
  },
  {
    id: "#53",
    priority: "Medium",
    title: "Page Optimization",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "1 day, 16 hours ago",
    assignedTo: "James Rodriguez"
  },
  {
    id: "#52",
    priority: "High",
    title: "Meet with kreo",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "5 days, 23 hours ago",
    assignedTo: "Emily Johnson"
  },
  {
    id: "#51",
    priority: "Low",
    title: "Protouch Meet",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "5 days, 23 hours ago",
    assignedTo: "Michael Chen"
  }
];

const getPriorityClass = (priority: Ticket['priority']): string => {
  const classes = {
    'SOS': 'bg-red-100 text-red-800',
    'High': 'bg-yellow-100 text-yellow-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'Low': 'bg-gray-100 text-gray-800'
  };
  return classes[priority];
};

const getStatusClass = (status: Ticket['status']): string => {
  const classes = {
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Open': 'bg-blue-100 text-blue-800'
  };
  return classes[status];
};

const getTatStatusIndicator = (tatStatus: string): React.ReactNode => {
  if (tatStatus.includes('left')) {
    return <div className="w-20 h-2 bg-red-200 rounded-full"><div className="h-full w-1/4 bg-red-500 rounded-full"></div></div>;
  }
  if (tatStatus === 'Done') {
    return <div className="w-20 h-2 bg-green-200 rounded-full"><div className="h-full w-full bg-green-500 rounded-full"></div></div>;
  }
  return <div className="w-20 h-2 bg-gray-200 rounded-full"><div className="h-full w-1/2 bg-gray-500 rounded-full"></div></div>;
};

export const TicketTable: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[100px]">Ticket ID</TableHead>
            <TableHead className="w-[120px]">Priority</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>TAT Status</TableHead>
            <TableHead>Time Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>
                <Badge className={getPriorityClass(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <Badge className={getStatusClass(ticket.status)}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTatStatusIndicator(ticket.tatStatus)}
                  <span className="text-sm">{ticket.tatStatus}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{ticket.timeCreated}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">VIEW</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
