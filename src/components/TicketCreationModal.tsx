
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Ticket } from "@/types";
import { X } from "lucide-react";

interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (ticket: Omit<Ticket, 'id'>) => void;
}

export const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateTicket
}) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium' as Ticket['priority'],
    status: 'Open' as Ticket['status'],
    assignedTo: '',
    brandName: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: Omit<Ticket, 'id'> = {
      title: formData.title || 'New Ticket',
      priority: formData.priority,
      status: formData.status,
      assignedTo: formData.assignedTo || 'Unassigned',
      brandName: formData.brandName || 'Default Brand',
      tatStatus: '2 days left',
      timeCreated: 'Just now',
      timeTaken: '0h'
    };

    onCreateTicket(newTicket);
    setFormData({
      title: '',
      priority: 'Medium',
      status: 'Open',
      assignedTo: '',
      brandName: '',
      description: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-2 px-1 font-medium">
                Task
              </button>
              <button className="text-gray-500 pb-2 px-1">Doc</button>
              <button className="text-gray-500 pb-2 px-1">Reminder</button>
              <button className="text-gray-500 pb-2 px-1">Chat</button>
              <button className="text-gray-500 pb-2 px-1">Whiteboard</button>
              <button className="text-gray-500 pb-2 px-1">Dashboard</button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Task Name or type '/' for commands"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg border-none shadow-none text-gray-600 p-0 focus-visible:ring-0"
              />
            </div>

            <div>
              <Textarea
                placeholder="Add description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px] border-none shadow-none resize-none focus-visible:ring-0"
              />
            </div>

            <div className="flex flex-wrap gap-4 py-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">TO DO</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">Assignee</Label>
                <Input
                  placeholder="Unassigned"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className="w-32 h-8"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOS">SOS</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">Brand</Label>
                <Input
                  placeholder="Brand Name"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className="w-32 h-8"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-4">
              <Button type="button" variant="ghost" className="text-sm">
                📋 Templates
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm">
                📎
              </Button>
              <Button type="button" variant="ghost" size="sm">
                🔔 1
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Task
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
