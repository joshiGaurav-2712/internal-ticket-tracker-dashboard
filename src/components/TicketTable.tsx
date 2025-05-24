
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

interface TicketTableProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void;
}

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
    const timeLeft = tatStatus.toLowerCase();
    let progress = 0.25; // default low progress
    
    if (timeLeft.includes('1h') || timeLeft.includes('30min')) {
      progress = 0.1; // very urgent
    } else if (timeLeft.includes('2h') || timeLeft.includes('3h')) {
      progress = 0.3; // urgent
    } else if (timeLeft.includes('day')) {
      progress = 0.7; // moderate
    }
    
    return (
      <div className="w-20 h-2 bg-red-200 rounded-full">
        <div 
          className="h-full bg-red-500 rounded-full" 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    );
  }
  if (tatStatus === 'Done') {
    return (
      <div className="w-20 h-2 bg-green-200 rounded-full">
        <div className="h-full w-full bg-green-500 rounded-full"></div>
      </div>
    );
  }
  return (
    <div className="w-20 h-2 bg-gray-200 rounded-full">
      <div className="h-full w-1/2 bg-gray-500 rounded-full"></div>
    </div>
  );
};

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onStatusChange }) => {
  const handleStatusToggle = (ticket: Ticket) => {
    let newStatus: Ticket['status'];
    
    switch (ticket.status) {
      case 'Open':
        newStatus = 'In Progress';
        break;
      case 'In Progress':
        newStatus = 'Completed';
        break;
      case 'Completed':
        newStatus = 'Open';
        break;
      default:
        newStatus = 'Open';
    }
    
    onStatusChange(ticket.id, newStatus);
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No tickets found matching your filters.</p>
      </div>
    );
  }

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
                <Badge 
                  className={`${getStatusClass(ticket.status)} cursor-pointer`}
                  onClick={() => handleStatusToggle(ticket)}
                >
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log('View ticket:', ticket.id)}
                >
                  VIEW
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
