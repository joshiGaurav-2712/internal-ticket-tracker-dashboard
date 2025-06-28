
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
import { User } from "@/services/userService";
import { Store } from "@/services/storeService";

interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (ticket: Omit<Ticket, 'id'>) => void;
  users: User[];
  stores: Store[];
}

export const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateTicket,
  users,
  stores
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

  // Helper function to get user display name
  const getUserDisplayName = (user: User): string => {
    if (user.name) return user.name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in component-card gradient-shadow">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-2 px-1 font-bold transition-colors duration-200">
                Task
              </button>
            </div>
            <DialogTitle className="sr-only">Create New Ticket</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-1 animate-fade-in-up">
          <div className="space-y-4">
            <div className="animate-slide-in-down">
              <Input
                placeholder="Task Name or type '/' for commands"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg border-none shadow-none text-gray-600 p-0 focus-visible:ring-0 transition-all duration-200 bg-transparent"
              />
            </div>

            <div className="animate-fade-in-up animate-stagger-1" style={{ animationFillMode: 'both' }}>
              <Textarea
                placeholder="Add description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px] border-none shadow-none resize-none focus-visible:ring-0 transition-all duration-200 bg-gradient-to-br from-gray-50 to-white rounded-lg p-4"
              />
            </div>

            <div className="flex flex-wrap gap-4 py-4 animate-fade-in-up animate-stagger-2" style={{ animationFillMode: 'both' }}>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">TO DO</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Assignee</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                  <SelectTrigger className="w-40 h-8 transition-all duration-200 hover-lift component-card bg-white">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={getUserDisplayName(user)}>
                        {getUserDisplayName(user)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="w-32 h-8 transition-all duration-200 hover-lift component-card bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="SOS">SOS</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="w-32 h-8 transition-all duration-200 hover-lift component-card bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Brand</Label>
                <Select value={formData.brandName} onValueChange={(value) => handleInputChange('brandName', value)}>
                  <SelectTrigger className="w-40 h-8 transition-all duration-200 hover-lift component-card bg-white">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="">Select Brand</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.name}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center pt-4 border-t animate-fade-in-up animate-stagger-3" style={{ animationFillMode: 'both' }}>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover-lift shadow-lg">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
