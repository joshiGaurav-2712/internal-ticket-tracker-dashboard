
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types";
import { Store } from "@/services/storeService";
import { UserSearchSelect } from "./UserSearchSelect";

interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (ticket: Omit<Ticket, 'id'>) => void;
  stores: Store[];
}

export const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateTicket,
  stores
}) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium' as Ticket['priority'],
    status: 'Open' as Ticket['status'],
    assignedTo: '',
    assignedToId: null as number | null,
    brandName: '',
    description: '',
    dueDate: null as Date | null
  });

  console.log('Modal render:', { 
    isOpen, 
    storesCount: stores.length,
    stores: stores.slice(0, 3) // Log first 3 stores for debugging
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      console.error('Title is required');
      return;
    }

    if (!formData.assignedToId) {
      console.error('Assigned user is required');
      return;
    }
    
    const newTicket: Omit<Ticket, 'id'> = {
      title: formData.title || 'New Ticket',
      description: formData.description || '', // Include description
      priority: formData.priority,
      status: formData.status,
      assignedTo: formData.assignedTo || '',
      assignedToId: formData.assignedToId,
      brandName: formData.brandName || '',
      tatStatus: '2 days left',
      timeCreated: 'Just now',
      timeTaken: '0h',
      dueDate: formData.dueDate ? format(formData.dueDate, 'yyyy-MM-dd') : undefined
    };

    console.log('Creating ticket with data:', newTicket);
    onCreateTicket(newTicket);
    setFormData({
      title: '',
      priority: 'Medium',
      status: 'Open',
      assignedTo: '',
      assignedToId: null,
      brandName: '',
      description: '',
      dueDate: null
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserSelect = (userId: number, userDisplayName: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: userDisplayName,
      assignedToId: userId
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in component-card gradient-shadow z-[60]">
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
                <div className="w-64">
                  <UserSearchSelect
                    value={formData.assignedTo}
                    onChange={handleUserSelect}
                    placeholder="Search for user..."
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="w-32 h-8 transition-all duration-200 hover-lift component-card bg-white border shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-[70]">
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
                  <SelectTrigger className="w-32 h-8 transition-all duration-200 hover-lift component-card bg-white border shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-[70]">
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Brand</Label>
                <Select value={formData.brandName} onValueChange={(value) => handleInputChange('brandName', value)}>
                  <SelectTrigger className="w-40 h-8 transition-all duration-200 hover-lift component-card bg-white border shadow-sm">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-[70] max-h-60 overflow-y-auto">
                    {stores.length === 0 ? (
                      <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                    ) : (
                      stores.map((store) => {
                        console.log('Rendering store option:', store);
                        return (
                          <SelectItem key={store.id} value={store.name}>
                            {store.name}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 font-medium">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 h-8 justify-start text-left font-normal transition-all duration-200 hover-lift component-card bg-white border shadow-sm",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[70]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate || undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date || null }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
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
