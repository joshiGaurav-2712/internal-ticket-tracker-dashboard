
import { apiService } from './api';
import { Ticket } from '@/types';

export interface ApiTicket {
  id: number;
  task: string;
  description: string;
  expected_due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  store_id: number;
  assigned_to: number;
  created_at: string;
  updated_at: string;
  worklog_entries?: WorklogEntry[];
}

export interface WorklogEntry {
  id: number;
  task: string;
  description: string;
  assigned_to: number;
  created_at: string;
}

export interface CreateTicketRequest {
  task: string;
  description: string;
  expected_due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  store_id: number;
  assigned_to: number;
}

export interface UpdateTicketRequest {
  task: string;
  description: string;
  expected_due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  store: number;
  assigned_to: number;
}

export interface AddWorklogRequest {
  task: string;
  description: string;
  assigned_to: number;
}

class TicketService {
  async getAllTickets() {
    console.log('Fetching all tickets...');
    const response = await apiService.get<ApiTicket[]>('/techservices/api/tickets/');
    console.log('Tickets response:', response);
    return response;
  }

  async getTicketById(id: number) {
    console.log('Fetching ticket by ID:', id);
    return apiService.get<ApiTicket>(`/techservices/api/tickets/${id}/`);
  }

  async createTicket(ticketData: CreateTicketRequest) {
    console.log('Creating ticket:', ticketData);
    return apiService.post<ApiTicket>('/techservices/api/tickets/create/', ticketData);
  }

  async updateTicket(id: number, ticketData: UpdateTicketRequest) {
    console.log('Updating ticket:', id, ticketData);
    return apiService.put<ApiTicket>(`/techservices/api/tickets/update/${id}/`, ticketData);
  }

  async deleteTicket(id: number) {
    console.log('Deleting ticket:', id);
    return apiService.delete(`/techservices/api/tickets/delete/${id}/`);
  }

  async addWorklog(id: number, worklogData: AddWorklogRequest) {
    console.log('Adding worklog to ticket:', id, worklogData);
    return apiService.post<WorklogEntry>(`/techservices/api/tickets/${id}/add_worklog/`, worklogData);
  }

  // Helper function to convert API ticket to frontend ticket format
  convertApiTicketToFrontend(apiTicket: ApiTicket, users: any[] = [], stores: any[] = []): Ticket {
    const assignedUser = users.find(u => u.id === apiTicket.assigned_to);
    const store = stores.find(s => s.id === apiTicket.store_id);
    
    // Map API status to frontend status
    const statusMap = {
      'pending': 'Open' as const,
      'in_progress': 'In Progress' as const,
      'completed': 'Completed' as const,
    };

    // Map API category to frontend priority
    const priorityMap = {
      'bug': 'SOS' as const,
      'issue': 'High' as const,
      'feature': 'Medium' as const,
      'task': 'Medium' as const,
      'enhancement': 'Low' as const,
    };

    // Calculate time ago
    const createdDate = new Date(apiTicket.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    let timeCreated = '';
    if (diffDays > 0) {
      timeCreated = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      timeCreated = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      timeCreated = 'Just now';
    }

    // Calculate TAT status based on due date
    const dueDate = new Date(apiTicket.expected_due_date);
    const timeToDue = dueDate.getTime() - now.getTime();
    const hoursToDue = Math.floor(timeToDue / (1000 * 60 * 60));
    
    let tatStatus = '';
    if (apiTicket.status === 'completed') {
      tatStatus = 'Done';
    } else if (hoursToDue <= 0) {
      tatStatus = 'Overdue';
    } else if (hoursToDue <= 24) {
      tatStatus = `${hoursToDue}h left`;
    } else {
      const daysToDue = Math.floor(hoursToDue / 24);
      tatStatus = `${daysToDue} day${daysToDue > 1 ? 's' : ''} left`;
    }

    // Calculate time taken from worklog entries
    const timeTaken = apiTicket.worklog_entries ? 
      `${apiTicket.worklog_entries.length}h` : '0h';

    return {
      id: `#${apiTicket.id}`,
      priority: priorityMap[apiTicket.category],
      title: apiTicket.task,
      status: statusMap[apiTicket.status],
      tatStatus,
      timeCreated,
      assignedTo: assignedUser?.name || assignedUser?.username || 'Unassigned',
      brandName: store?.name || 'Default Brand',
      timeTaken,
    };
  }
}

export const ticketService = new TicketService();
