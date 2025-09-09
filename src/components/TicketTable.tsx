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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ticket } from "@/types";
import { useState, useMemo } from "react";
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
import { ViewTicketModal } from "./ViewTicketModal";
import { UserSearchDropdown } from "./UserSearchDropdown";

interface TicketTableProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void;
  onPriorityChange?: (ticketId: string, newPriority: Ticket['priority']) => void;
  onUserAssignment?: (ticketId: string, userId: number, userDisplayName: string) => void;
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
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800'
  };
  return classes[status];
};

const getTatStatusIndicator = (tatStatus: string) => {
  if (tatStatus === 'Done' || tatStatus.toLowerCase().includes('week')) {
    return (
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    );
  }
  
  if (tatStatus.includes('1 day') || (tatStatus.includes('h left') && parseInt(tatStatus) >= 2 && parseInt(tatStatus) <= 4)) {
    return (
      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>  
    );
  }
  
  if (tatStatus === 'Overdue' || tatStatus.includes('1h left') || tatStatus.includes('30min') || (tatStatus.includes('h left') && parseInt(tatStatus) < 2)) {
    return (
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
    );
  }
  
  return (
    <div className="h-full w-1/2 bg-gray-500 rounded-full"></div>
  );
};

export const TicketTable: React.FC<TicketTableProps> = ({ 
  tickets, 
  onStatusChange,
  onPriorityChange,
  onUserAssignment,
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
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Split tickets into first 20 and remaining for better performance and UX
  const { recentTickets, remainingTickets } = useMemo(() => {
    const recent = tickets.slice(0, 20);
    const remaining = tickets.slice(20);
    return { recentTickets: recent, remainingTickets: remaining };
  }, [tickets]);

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
    
    // Handle user assignment change separately if it changed
    if (editingTicketId && editingValues.assignedToId && onUserAssignment) {
      const currentTicket = tickets.find(t => t.id === editingTicketId);
      if (currentTicket && currentTicket.assignedToId !== editingValues.assignedToId) {
        console.log('User assignment changed, calling onUserAssignment');
        onUserAssignment(editingTicketId, editingValues.assignedToId, editingValues.assignedTo || '');
      }
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

  const handleViewTicket = (ticket: Ticket) => {
    setViewingTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingTicket(null);
  };  
  
  const displayAssignedTo = (assignedTo: string | undefined) => {
    if (!assignedTo || assignedTo.trim() === '' || assignedTo === 'Unassigned' || assignedTo.toLowerCase() === 'unassigned') {
      return 'Unassigned';
    }
    return assignedTo;
  };

  const displayBrandName = (brandName: string | undefined) => {
    if (!brandName || brandName.trim() === '') {
      return 'No Brand';
    }
    return brandName;
  };

  const renderTicketRow = (ticket: Ticket, index: number) => (
    <TableRow 
      key={ticket.id} 
      className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up"
      style={{ 
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'both'
      }}
    >
      <TableCell className="font-medium whitespace-nowrap">
        {isEditing(ticket.id) ? (
          <input
            type="text"
            value={editingValues.id || ticket.id}
            onChange={(e) => setEditingValues(prev => ({ ...prev, id: e.target.value }))}
            className="border rounded px-2 py-1 w-full text-sm transition-all duration-200"
          />
        ) : (
          ticket.id
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {isEditing(ticket.id) ? (
          <input
            type="text"
            value={editingValues.brandName || ticket.brandName || ""}
            onChange={(e) => setEditingValues(prev => ({ ...prev, brandName: e.target.value }))}
            className="border rounded px-2 py-1 w-full text-sm transition-all duration-200"
            placeholder="Brand Name"
          />
        ) : (
          displayBrandName(ticket.brandName)
        )}
      </TableCell>
      <TableCell>
        {isEditing(ticket.id) ? (
          <select 
            value={editingValues.priority || ticket.priority}
            onChange={(e) => setEditingValues(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="SOS">SOS</option>
          </select>
        ) : (
          <Select value={ticket.priority} onValueChange={(value) => handlePriorityChange(ticket.id, value as Ticket['priority'])}>
            <SelectTrigger className="w-[100px] h-8 border-none shadow-none p-0 transition-all duration-200">
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
            className="border rounded px-2 py-1 w-full transition-all duration-200"
          />
        ) : (
          <div className="max-w-[200px] truncate" title={ticket.title}>
            {ticket.title}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing(ticket.id) ? (
          <select 
            value={editingValues.status || ticket.status}
            onChange={(e) => setEditingValues(prev => ({ ...prev, status: e.target.value as Ticket['status'] }))}
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value as Ticket['status'])}>
            <SelectTrigger className="w-[120px] h-8 border-none shadow-none p-0 transition-all duration-200">
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
      <TableCell className="whitespace-nowrap relative" style={{ minWidth: '220px', width: '220px' }}>
        {isEditing(ticket.id) ? (
          <UserSearchDropdown
            value={editingValues.assignedTo || ticket.assignedTo || ""}
            userId={editingValues.assignedToId || ticket.assignedToId}
            onChange={(userId, userDisplayName) => {
              console.log('UserSearchDropdown onChange:', { userId, userDisplayName, ticketId: ticket.id });
                // For userId === 0, we want to handle "Unassigned"
              if (userId === 0) {
                console.log('Clearing user assignment (setting to Unassigned)');
                // Allow userId = 0 to indicate unassigned
              } else if (!userId) {
                console.log('Invalid user ID, ignoring');
                return;
              }
              
              // Update editing values
              setEditingValues(prev => ({ 
                ...prev, 
                assignedTo: userDisplayName,
                assignedToId: userId
              }));
              
              // Immediate update to provide better feedback
              if (onUserAssignment) {
                // Immediate save for better UX - makes the change take effect right away
                onUserAssignment(ticket.id, userId, userDisplayName);
              }
            }}
            placeholder="Type to search users..."
            className="w-full min-w-[200px]"
          />
        ) : (
          <div className="w-full truncate cursor-pointer hover:text-blue-500" 
               onClick={() => onEditStart && onEditStart(ticket.id)}
               title={displayAssignedTo(ticket.assignedTo)}>
            {displayAssignedTo(ticket.assignedTo)}
          </div>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap w-[150px]">
        <div className="flex items-center gap-2">
          {getTatStatusIndicator(ticket.tatStatus)}
          <span className="text-sm">{ticket.tatStatus}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap w-[120px]">
        {isEditing(ticket.id) ? (
          <input
            type="date"
            value={editingValues.dueDate || ticket.dueDate || ""}
            onChange={(e) => setEditingValues(prev => ({ ...prev, dueDate: e.target.value }))}
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
          />
        ) : (
          ticket.dueDate || 'N/A'
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap w-[120px]">
        {isEditing(ticket.id) ? (
          <input
            type="text"
            value={editingValues.timeTaken || ticket.timeTaken || ""}
            onChange={(e) => setEditingValues(prev => ({ ...prev, timeTaken: e.target.value }))}
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
            placeholder="e.g., 2h"
          />
        ) : (
          ticket.timeTaken || 'N/A'
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap w-[130px]">
        {isEditing(ticket.id) ? (
          <input
            type="date"
            value={editingValues.timeCreated || ticket.timeCreated || ""}
            onChange={(e) => setEditingValues(prev => ({ ...prev, timeCreated: e.target.value }))}
            className="border rounded px-2 py-1 text-sm transition-all duration-200"
          />
        ) : (
          ticket.timeCreated || 'N/A'
        )}
      </TableCell>
      <TableCell className="text-right w-[120px] md:w-[180px]">
        {isEditing(ticket.id) ? (
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEditSave}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEditCancel}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-1 md:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleViewTicket(ticket)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 text-xs md:text-sm px-2 md:px-3"
            >
              View
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleEditStart(ticket)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the ticket
                    and remove it from our servers.
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
  );

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-scale-in hover-lift">
        <p className="text-gray-500">No tickets found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-scale-in hover-lift">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="min-w-[1200px] w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[80px] md:w-[100px] whitespace-nowrap text-xs md:text-sm">ID</TableHead>
                  <TableHead 
                    className="w-[100px] md:w-[120px] cursor-pointer hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap text-xs md:text-sm"
                    onClick={() => handleSort('brandName')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="hidden md:inline">Brand Name</span>
                      <span className="md:hidden">Brand</span>
                      <SortIcon field="brandName" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px] md:w-[120px] whitespace-nowrap text-xs md:text-sm">Priority</TableHead>
                  <TableHead className="min-w-[150px] md:min-w-[200px] text-xs md:text-sm">Title</TableHead>
                  <TableHead className="w-[100px] md:w-[130px] whitespace-nowrap text-xs md:text-sm">Status</TableHead>
                  <TableHead className="w-[220px] whitespace-nowrap text-xs md:text-sm">Assigned To</TableHead>
                  <TableHead className="w-[150px] whitespace-nowrap text-xs md:text-sm">TAT Status</TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap text-xs md:text-sm">Due Date</TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap text-xs md:text-sm">Time</TableHead>
                  <TableHead className="w-[130px] whitespace-nowrap text-xs md:text-sm">Created</TableHead>
                  <TableHead className="text-right w-[120px] md:w-[180px] whitespace-nowrap text-xs md:text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Display first 20 tickets */}
                {recentTickets.map((ticket, index) => renderTicketRow(ticket, index))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Display remaining tickets in a scrollable area if there are more than 20 */}
        {remainingTickets.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-2">
              <p className="text-sm text-gray-600 font-medium">
                Additional Tickets ({remainingTickets.length} more) - Scroll to view
              </p>
            </div>
            <ScrollArea className="h-96">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="min-w-[1200px] w-full">
                  <Table>
                    <TableBody>
                      {remainingTickets.map((ticket, index) => renderTicketRow(ticket, index + 20))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <ViewTicketModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        ticket={viewingTicket}
      />
    </>
  );
};