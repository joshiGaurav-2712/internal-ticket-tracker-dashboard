
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types";
import { X } from "lucide-react";

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
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

export const ViewTicketModal: React.FC<ViewTicketModalProps> = ({
  isOpen,
  onClose,
  ticket
}) => {
  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Ticket Details - {ticket.id}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {ticket.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Ticket ID</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Brand Name</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.brandName || 'Default Brand'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusClass(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Assigned To</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.assignedTo || 'Unassigned'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">TAT Status</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.tatStatus}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Time Taken</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.timeTaken || '0h'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Time Created</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.timeCreated}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
