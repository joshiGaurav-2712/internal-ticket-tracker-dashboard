
import { apiService } from './api';
import { Ticket } from '@/types';

export interface ApiTicket {
  id: number;
  task: string;
  description: string;
  expected_due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  store_id?: number;
  store?: {
    id: number;
    name: string;
  };
  assigned_to: number | null | {
    id: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
  updated_at: string;
  worklog_entries?: WorklogEntry[];
  total_time_spent?: number;
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
    console.log('TicketService: Fetching all tickets...');
    console.log('Current token available:', !!apiService.getCurrentToken());
    
    const response = await apiService.get<ApiTicket[]>('/techservices/api/tickets/');
    console.log('TicketService: Tickets response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to fetch tickets:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async getTicketById(id: number) {
    console.log('TicketService: Fetching ticket by ID:', id);
    const response = await apiService.get<ApiTicket>(`/techservices/api/tickets/${id}/`);
    console.log('TicketService: Ticket response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to fetch ticket:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async createTicket(ticketData: CreateTicketRequest) {
    console.log('TicketService: Creating ticket:', ticketData);
    const response = await apiService.post<ApiTicket>('/techservices/api/tickets/create/', ticketData);
    console.log('TicketService: Create response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to create ticket:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async updateTicket(id: number, ticketData: UpdateTicketRequest) {
    console.log('TicketService: Updating ticket:', id, ticketData);
    const response = await apiService.post<ApiTicket>(`/techservices/api/tickets/update/${id}/`, ticketData);
    console.log('TicketService: Update response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to update ticket:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async deleteTicket(id: number) {
    console.log('TicketService: Deleting ticket:', id);
    const response = await apiService.delete(`/techservices/api/tickets/delete/${id}/`);
    console.log('TicketService: Delete response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to delete ticket:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async addWorklog(id: number, worklogData: AddWorklogRequest) {
    console.log('TicketService: Adding worklog to ticket:', id, worklogData);
    const response = await apiService.post<WorklogEntry>(`/techservices/api/tickets/${id}/add_worklog/`, worklogData);
    console.log('TicketService: Worklog response:', response);
    
    if (response.error) {
      console.error('TicketService: Failed to add worklog:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }
  // Enhanced helper function to convert API ticket to frontend ticket format
  convertApiTicketToFrontend(apiTicket: ApiTicket, users: any[] = [], stores: any[] = []): Ticket {
    // Handle assigned_to being either a number, null, or an object
    let assignedUserId: number | null = null;
    let assignedUserFromTicket: any = null;
    
    if (typeof apiTicket.assigned_to === 'number') {
      assignedUserId = apiTicket.assigned_to;
    } else if (apiTicket.assigned_to && typeof apiTicket.assigned_to === 'object') {
      assignedUserId = apiTicket.assigned_to.id;
      assignedUserFromTicket = apiTicket.assigned_to;
    }
    
    // First try to find user from the embedded object, then from users array
    const assignedUser = assignedUserFromTicket || users.find(u => u.id === assignedUserId);
    
    // Handle both store_id and nested store object
    const storeId = apiTicket.store?.id || apiTicket.store_id;
    const store = stores.find(s => s.id === storeId) || apiTicket.store;
      console.log('TicketService: Converting ticket:', {
      ticketId: apiTicket.id,
      assigned_to: apiTicket.assigned_to,
      assignedUserId,
      assignedUserFromTicket,
      store_id: storeId,
      foundStore: store,
      assignedUser: assignedUser,
      totalUsers: users.length,
      totalStores: stores.length
    });
    
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

    // Enhanced TAT status calculation based on due date and current status
    let tatStatus = '';
    if (apiTicket.status === 'completed') {
      tatStatus = 'Done';
    } else if (apiTicket.expected_due_date) {
      const dueDate = new Date(apiTicket.expected_due_date);
      const now2 = new Date();
      const timeToDue = dueDate.getTime() - now2.getTime();
      const hoursToDue = Math.floor(timeToDue / (1000 * 60 * 60));
      
      if (hoursToDue <= 0) {
        tatStatus = 'Overdue';
      } else if (hoursToDue <= 1) {
        tatStatus = '1h left';
      } else if (hoursToDue <= 2) {
        tatStatus = '2h left';
      } else if (hoursToDue <= 24) {
        tatStatus = `${hoursToDue}h left`;
      } else {
        const daysToDue = Math.floor(hoursToDue / 24);
        tatStatus = `${daysToDue} day${daysToDue > 1 ? 's' : ''} left`;
      }
    } else {
      tatStatus = 'No due date';
    }

    // Calculate time taken from total_time_spent or worklog entries
    const timeTaken = apiTicket.total_time_spent ? 
      `${apiTicket.total_time_spent}h` : 
      (apiTicket.worklog_entries ? `${apiTicket.worklog_entries.length}h` : '0h');

    // Get user display name
    const assignedTo = assignedUser ? 
      (assignedUser.name || `${assignedUser.first_name || ''} ${assignedUser.last_name || ''}`.trim() || assignedUser.username) : 
      'Unassigned';    const result = {
      id: `#${apiTicket.id}`,
      priority: priorityMap[apiTicket.category],
      title: apiTicket.task,
      status: statusMap[apiTicket.status],
      tatStatus,
      timeCreated,
      assignedTo,
      assignedToId: assignedUserId || undefined,
      brandName: store?.name || `Store ${storeId || 'Unknown'}`,
      timeTaken,
    };

    console.log('TicketService: Converted ticket result:', result);
    return result;
  }
}

export const ticketService = new TicketService();
