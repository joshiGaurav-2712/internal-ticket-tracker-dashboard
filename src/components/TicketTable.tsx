
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket } from "@/types";
import { useState } from "react";
import { Check, X, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TicketTableProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void;
  onPriorityChange?: (ticketId: string, newPriority: Ticket['priority']) => void;
  editingTicketId?: string | null;
  onTicketUpdate?: (ticketId: string, updatedTicket: Partial<Ticket>) => void;
  onEditComplete?: () => void;
  onEditStart?: (ticketId: string) => void;
  onTicketDelete?: (ticketId: string) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
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
  onPriorityChange,
  editingTicketId,
  onTicketUpdate,
  onEditComplete,
  onEditStart,
  onTicketDelete,
  onSort,
  sortField,
  sortDirection
}) => {
  const [editingValues, setEditingValues] = useState<Partial<Ticket>>({});

  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    onStatusChange(ticketId, newStatus);
  };

  const handlePriorityChange = (ticketId: string, newPriority: Ticket['priority']) => {
    if (onPriorityChange) {
      onPriorityChange(ticketId, newPriority);
    }
  };

  const handleEditStart = (ticket: Ticket) => {
    setEditingValues(ticket);
    if (onEditStart) {
      onEditStart(ticket.id);
    }
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

  const handleDelete = (ticketId: string) => {
    if (onTicketDelete) {
      onTicketDelete(ticketId);
    }
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const isEditing = (ticketId: string) => editingTicketId === ticketId;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
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
            <TableHead 
              className="w-[120px] cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('brandName')}
            >
              <div className="flex items-center gap-1">
                Brand Name
                <SortIcon field="brandName" />
              </div>
            </TableHead>
            <TableHead className="w-[120px]">Priority</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>TAT Status</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>Time Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {isEditing(ticket.id) ? (
                  <input
                    type="text"
                    value={editingValues.id || ticket.id}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, id: e.target.value }))}
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                ) : (
                  ticket.id
                )}
              </TableCell>
              <TableCell>
                {isEditing(ticket.id) ? (
                  <input
                    type="text"
                    value={editingValues.brandName || ticket.brandName || ""}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, brandName: e.target.value }))}
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Brand Name"
                  />
                ) : (
                  ticket.brandName || "Default Brand"
                )}
              </TableCell>
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
                  <Select value={ticket.priority} onValueChange={(value) => handlePriorityChange(ticket.id, value as Ticket['priority'])}>
                    <SelectTrigger className="w-[100px] h-8 border-none shadow-none p-0">
                      <Badge className={getPriorityClass(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOS">SOS</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isEditing(ticket.id) ? (
                  <select 
                    value={editingValues.status || ticket.status}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, status: e.target.value as Ticket['status'] }))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value as Ticket['status'])}>
                    <SelectTrigger className="w-[120px] h-8 border-none shadow-none p-0">
                      <Badge className={getStatusClass(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
              <TableCell>
                {isEditing(ticket.id) ? (
                  <input
                    type="text"
                    value={editingValues.timeTaken || ticket.timeTaken || ""}
                    onChange={(e) => setEditingValues(prev => ({ ...prev, timeTaken: e.target.value }))}
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="0h"
                  />
                ) : (
                  ticket.timeTaken || "0h"
                )}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete ticket {ticket.id}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
