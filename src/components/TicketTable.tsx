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
import { useState } from "react";
import { Check, X, Edit } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void;
  editingTicketId?: string | null;
  onTicketUpdate?: (ticketId: string, updatedTicket: Partial<Ticket>) => void;
  onEditComplete?: () => void;
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

export const TicketTable: React.FC<TicketTableProps> = ({ 
  tickets, 
  onStatusChange, 
  editingTicketId,
  onTicketUpdate,
  onEditComplete 
}) => {
  const [editingValues, setEditingValues] = useState<Partial<Ticket>>({});

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

  const handleEditStart = (ticket: Ticket) => {
    setEditingValues(ticket);
  };

  const handleEditSave = () => {
    if (editingTicketId && onTicketUpdate) {
      onTicketUpdate(editingTicketId, editingValues);
    }
    setEditingValues({});
    if (onEditComplete) {
      onEditComplete();
    }
  };

  const handleEditCancel = () => {
    setEditingValues({});
    if (onEditComplete) {
      onEditComplete();
    }
  };

  const isEditing = (ticketId: string) => editingTicketId === ticketId;

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
                {isEditing(ticket.id) ? (
                  <select 
                    value={editingValues.priority || ticket.priority}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="SOS">SOS</option>
                  </select>
                ) : (
                  <Badge className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {isEditing(ticket.id) ? (
                  <input
                    type="text"
                    value={editingValues.title || ticket.title}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, title: e.target.value }))}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  ticket.title
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  className={`${getStatusClass(ticket.status)} cursor-pointer`}
                  onClick={() => !isEditing(ticket.id) && handleStatusToggle(ticket)}
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                {isEditing(ticket.id) ? (
                  <input
                    type="text"
                    value={editingValues.assignedTo || ticket.assignedTo || ""}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Unassigned"
                  />
                ) : (
                  ticket.assignedTo || "Unassigned"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTatStatusIndicator(ticket.tatStatus)}
                  <span className="text-sm">{ticket.tatStatus}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{ticket.timeCreated}</TableCell>
              <TableCell className="text-right">
                {isEditing(ticket.id) ? (
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleEditSave}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleEditCancel}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => console.log('View ticket:', ticket.id)}
                    >
                      VIEW
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditStart(ticket)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
