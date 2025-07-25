import React, { useState, useMemo, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { StatusOverview } from "@/components/StatusOverview";
import { SOSAlert } from "@/components/SOSAlert";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketTable } from "@/components/TicketTable";
import { LastUpdated } from "@/components/LastUpdated";
import { CommunicationCenter } from "@/components/CommunicationCenter";
import { TicketCreationModal } from "@/components/TicketCreationModal";
import { LoginForm } from "@/components/LoginForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Ticket } from "@/types";
import { useAuth } from '@/hooks/useAuth';
import { ticketService, ApiTicket } from '@/services/ticketService';
import { userService, User } from '@/services/userService';
import { storeService, Store } from '@/services/storeService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type TicketStatus = 'all' | 'open' | 'in-progress' | 'completed';
type Priority = 'all' | 'low' | 'medium' | 'high' | 'sos';
type TatStatus = 'all' | 'on-track' | 'at-risk' | 'delayed';

interface FilterState {
  searchText: string;
  ticketStatus: TicketStatus;
  priority: Priority;
  tatStatus: TatStatus;
}

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    ticketStatus: 'all',
    priority: 'all',
    tatStatus: 'all'
  });

  // Fetch tickets with better error handling
  const { data: ticketsResponse, isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAllTickets(),
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      console.log('Tickets query failed:', error);
      return failureCount < 2;
    },
    retryDelay: 1000,  });
  // Remove the getAllUsers query since we'll use search instead
  // Users will be loaded on-demand through search functionality

  // Fetch stores with better error handling
  const { data: storesResponse, isLoading: storesLoading, error: storesError } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getAllStores(),
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      console.log('Stores query failed:', error);
      return failureCount < 2;
    },
    retryDelay: 1000,  });

  const stores = storesResponse?.data || [];
  const apiTickets = ticketsResponse?.data || [];
  // Fetch users based on assigned_to IDs from tickets (only for tickets where assigned_to is just an ID)
  const assignedUserIds = useMemo(() => {
    const ids = apiTickets
      .map(ticket => {
        // Only collect IDs if assigned_to is a number (not an object with user details)
        return typeof ticket.assigned_to === 'number' ? ticket.assigned_to : null;
      })
      .filter((id): id is number => id !== null && id !== undefined);
    return [...new Set(ids)]; // Remove duplicates
  }, [apiTickets]);

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ['usersByIds', assignedUserIds],
    queryFn: () => userService.getUsersByIds(assignedUserIds),
    enabled: isAuthenticated && assignedUserIds.length > 0,
    retry: (failureCount, error) => {
      console.log('Users by IDs query failed:', error);
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  const users = usersResponse?.data || [];

  console.log('Dashboard data:', {
    tickets: apiTickets.length,
    stores: stores.length,
    users: users.length,
    assignedUserIds,
    usersLoading,
    ticketsError: ticketsError?.message,
    storesError: storesError?.message,
    loading: { tickets: ticketsLoading, stores: storesLoading },    sampleTicketAssignments: apiTickets.slice(0, 3).map(t => ({
      id: t.id,
      assigned_to: t.assigned_to,
      assignedUserId: typeof t.assigned_to === 'number' ? t.assigned_to : t.assigned_to?.id,
      foundUser: users.find(u => u.id === (typeof t.assigned_to === 'number' ? t.assigned_to : t.assigned_to?.id))
    }))
  });

  // Convert API tickets to frontend format
  const tickets: Ticket[] = useMemo(() => {
    return apiTickets.map(apiTicket => 
      ticketService.convertApiTicketToFrontend(apiTicket, users, stores)
    );
  }, [apiTickets, users, stores]);

  // Calculate last ticket update
  const lastTicketUpdate = useMemo(() => {
    if (apiTickets.length === 0) return new Date();
    
    const latestTicket = apiTickets.reduce((latest, ticket) => {
      const ticketUpdate = new Date(ticket.updated_at);
      const latestUpdate = new Date(latest.updated_at);
      return ticketUpdate > latestUpdate ? ticket : latest;
    });
    
    return new Date(latestTicket.updated_at);
  }, [apiTickets]);

  // Calculate total time spent from all tickets
  const calculateTotalTimeSpent = (ticketList: Ticket[]): string => {
    let totalMinutes = 0;
    
    ticketList.forEach(ticket => {
      const timeTaken = ticket.timeTaken || '0h';
      const match = timeTaken.match(/(\d+)h/);
      if (match) {
        totalMinutes += parseInt(match[1]) * 60;
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}.${Math.round(((totalMinutes % 60) / 60) * 100).toString().padStart(2, '0')} Hrs`;
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      // Search text filter
      if (filters.searchText && !ticket.title.toLowerCase().includes(filters.searchText.toLowerCase()) && 
          !ticket.id.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          !ticket.assignedTo?.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          !ticket.brandName?.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.ticketStatus !== 'all') {
        const statusMap: Record<string, string> = {
          'open': 'Open',
          'in-progress': 'In Progress',
          'completed': 'Completed'
        };
        if (ticket.status !== statusMap[filters.ticketStatus]) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority !== 'all') {
        const priorityMap: Record<string, string> = {
          'low': 'Low',
          'medium': 'Medium',
          'high': 'High',
          'sos': 'SOS'
        };
        if (ticket.priority !== priorityMap[filters.priority]) {
          return false;
        }
      }

      // TAT Status filter
      if (filters.tatStatus !== 'all') {
        if (filters.tatStatus === 'on-track' && !ticket.tatStatus.includes('Done')) {
          return false;
        }
        if (filters.tatStatus === 'at-risk' && !ticket.tatStatus.includes('left')) {
          return false;
        }
        if (filters.tatStatus === 'delayed' && ticket.tatStatus === 'Done') {
          return false;
        }
      }

      return true;
    });

    // Sort tickets
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Ticket] || '';
        let bValue = b[sortField as keyof Ticket] || '';
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [tickets, filters, sortField, sortDirection]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const completed = tickets.filter(t => t.status === 'Completed').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    
    // Calculate total time spent from all tickets
    let totalMinutes = 0;
    tickets.forEach(ticket => {
      const timeTaken = ticket.timeTaken || '0h';
      const match = timeTaken.match(/(\d+)h/);
      if (match) {
        totalMinutes += parseInt(match[1]) * 60;
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const timeSpent = `${hours}.${Math.round(((totalMinutes % 60) / 60) * 100).toString().padStart(2, '0')} Hrs`;
    
    return {
      total,
      open,
      completed,
      inProgress,
      timeSpent
    };
  }, [tickets]);

  // Calculate TAT status statistics - Improved to be more accurate
  const tatStats = useMemo(() => {
    const allTickets = tickets;
    const total = allTickets.length;
    
    if (total === 0) {
      return { total: 0, onTrack: 0, atRisk: 0, delayed: 0 };
    }
    
    // More precise categorization based on actual TAT status values
    const onTrack = allTickets.filter(t => {
      const tatStatus = t.tatStatus.toLowerCase();
      return tatStatus === 'done' || 
             tatStatus.includes('week') ||
             (tatStatus.includes('day') && !tatStatus.includes('1 day')) ||
             (tatStatus.includes('h left') && parseInt(tatStatus) > 4);
    }).length;
    
    const atRisk = allTickets.filter(t => {
      const tatStatus = t.tatStatus.toLowerCase();
      return tatStatus.includes('1 day') ||
             (tatStatus.includes('h left') && parseInt(tatStatus) >= 2 && parseInt(tatStatus) <= 4);
    }).length;
    
    const delayed = allTickets.filter(t => {
      const tatStatus = t.tatStatus.toLowerCase();
      return tatStatus === 'overdue' || 
             tatStatus.includes('1h left') || 
             tatStatus.includes('30min') ||
             (tatStatus.includes('h left') && parseInt(tatStatus) < 2);
    }).length;
    
    // Ensure totals add up correctly
    const remaining = total - onTrack - atRisk - delayed;
    const adjustedOnTrack = onTrack + Math.max(0, remaining);
    
    console.log('TAT Stats Calculation:', {
      total,
      onTrack: adjustedOnTrack,
      atRisk,
      delayed,
      ticketsWithTatStatus: tickets.slice(0, 5).map(t => ({ id: t.id, tatStatus: t.tatStatus }))
    });
    
    return {
      total,
      onTrack: adjustedOnTrack,
      atRisk,
      delayed
    };
  }, [tickets]);

  // SOS tickets count
  const sosTicketsCount = useMemo(() => {
    return tickets.filter(t => t.priority === 'SOS' && t.status !== 'Completed').length;
  }, [tickets]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreateTicket = () => {
    setIsModalOpen(true);
  };

  const handleCreateTicketFromModal = async (ticketData: Omit<Ticket, 'id'>) => {
    try {
      console.log('Creating ticket from modal:', ticketData);
      
      // Convert frontend ticket format to API format
      const createRequest = {
        task: ticketData.title,
        description: ticketData.description,
        expected_due_date: ticketData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Use form date or default 7 days from now
        status: ticketData.status === 'Open' ? 'pending' as const : 
                ticketData.status === 'In Progress' ? 'in_progress' as const : 'completed' as const,
        category: ticketData.priority === 'SOS' ? 'bug' as const :
                  ticketData.priority === 'High' ? 'issue' as const : 'task' as const,
        store_id: stores.find(s => s.name === ticketData.brandName)?.id || stores[0]?.id || 1,
        assigned_to: ticketData.assignedToId || 1,
      };

      console.log('Create request payload:', createRequest);
      const response = await ticketService.createTicket(createRequest);
      
      if (response.data && response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        toast({
          title: "Success",
          description: "Ticket created successfully!",
        });
      } else {
        throw new Error(`Failed to create ticket: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTicketStatusChange = async (ticketId: string, newStatus: Ticket['status']) => {
    try {
      console.log('Updating ticket status:', ticketId, newStatus);
      const ticketNumber = parseInt(ticketId.replace('#', ''));
      const apiTicket = apiTickets.find(t => t.id === ticketNumber);
      
      if (!apiTicket) {
        console.error('Ticket not found:', ticketNumber);
        return;
      }

      const statusMap = {
        'Open': 'pending' as const,
        'In Progress': 'in_progress' as const,
        'Completed': 'completed' as const,
      };      const updateRequest = {
        task: apiTicket.task,
        description: apiTicket.description,
        expected_due_date: apiTicket.expected_due_date,
        status: statusMap[newStatus],
        category: apiTicket.category,
        store: apiTicket.store?.id || apiTicket.store_id,
        assigned_to: typeof apiTicket.assigned_to === 'number' ? apiTicket.assigned_to : apiTicket.assigned_to?.id,
      };

      console.log('Status update request:', updateRequest);
      const response = await ticketService.updateTicket(ticketNumber, updateRequest);
      
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        toast({
          title: "Success",
          description: "Ticket status updated successfully!",
        });
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      });
    }
  };

  const handleTicketPriorityChange = async (ticketId: string, newPriority: Ticket['priority']) => {
    try {
      console.log('Updating ticket priority:', ticketId, newPriority);
      const ticketNumber = parseInt(ticketId.replace('#', ''));
      const apiTicket = apiTickets.find(t => t.id === ticketNumber);
      
      if (!apiTicket) {
        console.error('Ticket not found:', ticketNumber);
        return;
      }

      const priorityMap = {
        'SOS': 'bug' as const,
        'High': 'issue' as const,
        'Medium': 'task' as const,
        'Low': 'enhancement' as const,
      };      const updateRequest = {
        task: apiTicket.task,
        description: apiTicket.description,
        expected_due_date: apiTicket.expected_due_date,
        status: apiTicket.status,
        category: priorityMap[newPriority],
        store: apiTicket.store?.id || apiTicket.store_id,
        assigned_to: typeof apiTicket.assigned_to === 'number' ? apiTicket.assigned_to : apiTicket.assigned_to?.id,
      };

      console.log('Priority update request:', updateRequest);
      const response = await ticketService.updateTicket(ticketNumber, updateRequest);
      
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        toast({
          title: "Success",
          description: "Ticket priority updated successfully!",
        });
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating ticket priority:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket priority.",
        variant: "destructive",
      });
    }
  };

  const handleTicketUpdate = async (ticketId: string, updatedTicket: Partial<Ticket>) => {
    try {
      console.log('Updating ticket:', ticketId, updatedTicket);
      const ticketNumber = parseInt(ticketId.replace('#', ''));
      const apiTicket = apiTickets.find(t => t.id === ticketNumber);
      
      if (!apiTicket) {
        console.error('Ticket not found:', ticketNumber);
        return;
      }      const updateRequest = {
        task: updatedTicket.title || apiTicket.task,
        description: updatedTicket.title || apiTicket.description,
        expected_due_date: apiTicket.expected_due_date,
        status: apiTicket.status,
        category: apiTicket.category,        store: stores.find(s => s.name === updatedTicket.brandName)?.id || apiTicket.store?.id || apiTicket.store_id,
        assigned_to: typeof apiTicket.assigned_to === 'number' ? apiTicket.assigned_to : apiTicket.assigned_to?.id, // Keep existing assignee for general updates
      };

      console.log('General update request:', updateRequest);
      const response = await ticketService.updateTicket(ticketNumber, updateRequest);
      
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        toast({
          title: "Success",
          description: "Ticket updated successfully!",
        });
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket.",
        variant: "destructive",
      });
    }
  };

  const handleTicketDelete = async (ticketId: string) => {
    try {
      console.log('Deleting ticket:', ticketId);
      const ticketNumber = parseInt(ticketId.replace('#', ''));
      
      const response = await ticketService.deleteTicket(ticketNumber);
      
      if (response.status === 204 || response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        
        if (editingTicketId === ticketId) {
          setEditingTicketId(null);
        }
        
        toast({
          title: "Success",
          description: "Ticket deleted successfully!",
        });
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to delete ticket.",
        variant: "destructive",
      });
    }
  };

  const handleEditComplete = () => {
    setEditingTicketId(null);
  };

  const handleEditStart = (ticketId: string) => {
    setEditingTicketId(ticketId);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }  };  const handleUserAssignment = async (ticketId: string, userId: number, userDisplayName: string) => {
    try {
      console.log('Updating ticket user assignment:', ticketId, userId, userDisplayName);
      
      // Validate inputs
      if (!ticketId) {
        console.error('Invalid ticket ID:', { ticketId });
        return;
      }
      
      // Special case for userId = 0, which means "Unassigned"
      const isUnassigning = userId === 0;
      
      const ticketNumber = parseInt(ticketId.replace('#', ''));
      const apiTicket = apiTickets.find(t => t.id === ticketNumber);
      
      if (!apiTicket) {
        console.error('Ticket not found:', ticketNumber);
        return;
      }
      
      // Optimistically update the local UI to show the change immediately
      // This helps the user see the change without waiting for the API
        // First, update any tickets displayed in the UI
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            assignedTo: isUnassigning ? '' : userDisplayName,
            assignedToId: isUnassigning ? 0 : userId
          };
        }
        return ticket;
      });
      
      // Next, make sure the user is in our cache for immediate display
      if (userId && userDisplayName && !users.some(u => u.id === userId)) {
        console.log('Adding user to local cache for immediate display:', { userId, userDisplayName });
        // Add user to cache for immediate display
        queryClient.setQueryData(['user', userId], {
          data: { id: userId, username: userDisplayName, name: userDisplayName }
        });
      }      const updateRequest = {
        task: apiTicket.task,
        description: apiTicket.description,
        expected_due_date: apiTicket.expected_due_date,
        status: apiTicket.status,
        category: apiTicket.category,
        store: apiTicket.store?.id || apiTicket.store_id,
        assigned_to: isUnassigning ? null : userId, // Send null to unassign
      };

      console.log('User assignment update request:', updateRequest);
      const response = await ticketService.updateTicket(ticketNumber, updateRequest);
      
      if (response.status === 200) {        // Force-refresh tickets data to get the updated assignments
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        
        // If we updated the userId and it's not unassigning, we might need to fetch that user's details
        if (!isUnassigning && !users.some(u => u.id === userId)) {
          console.log('Adding new user to fetch list:', userId);
          await queryClient.invalidateQueries({ queryKey: ['usersByIds'] });
          await queryClient.invalidateQueries({ queryKey: ['user', userId] });
        }
        
        // Set editingTicketId to null to exit editing mode
        setEditingTicketId(null);
        
        toast({
          title: "Success",
          description: `Ticket assigned to ${userDisplayName} successfully!`,
        });
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating ticket assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket assignment.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (stores.length > 0 && apiTickets.length > 0) {
      console.log('Store mapping debug:', {
        stores: stores.map(s => ({ id: s.id, name: s.name })),
        apiTickets: apiTickets.slice(0, 3).map(t => ({ 
          id: t.id, 
          store_id: t.store_id,
          store_object: t.store,
          effectiveStoreId: t.store?.id || t.store_id,
          matchedStore: stores.find(s => s.id === (t.store?.id || t.store_id))?.name 
        }))
      });
    }
  }, [stores, apiTickets]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }
  // Show loading state while initial data loads
  if (ticketsLoading && storesLoading) {
    return (
      <div className="min-h-screen">
        <Navigation onCreateTicket={handleCreateTicket} />
        <div className="container mx-auto py-8 px-4 lg:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading dashboard data..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state only if all critical data fails to load
  const hasCriticalError = ticketsError && storesError;
  if (hasCriticalError) {
    console.error('Critical error detected:', { ticketsError, storesError });
    return (
      <div className="min-h-screen">
        <Navigation onCreateTicket={handleCreateTicket} />
        <div className="container mx-auto py-8 px-4 lg:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">Unable to load dashboard data</div>
              <div className="text-sm text-gray-600 mb-6">
                Please check your internet connection and try again.
              </div>
              <button 
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['tickets'] });
                  queryClient.invalidateQueries({ queryKey: ['stores'] });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation onCreateTicket={handleCreateTicket} />
      <div className="container mx-auto py-8 px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome to Troopod Dashboard
            </h2>
            <p className="text-gray-600 font-medium mt-2">Overview of your projects and tickets</p>
          </div>
          <LastUpdated lastTicketUpdate={lastTicketUpdate} />
        </div>
        
        <div className="mb-10 animate-fade-in-up animate-stagger-1" style={{ animationFillMode: 'both' }}>
          <SummaryCards stats={summaryStats} />
        </div>
        
        <div className="mb-10 animate-fade-in-up animate-stagger-2" style={{ animationFillMode: 'both' }}>
          <StatusOverview tatStats={tatStats} />
        </div>
        
        {sosTicketsCount > 0 && (
          <div className="mb-10 animate-fade-in-up animate-stagger-3" style={{ animationFillMode: 'both' }}>
            <SOSAlert count={sosTicketsCount} />
          </div>
        )}
        
        <div className="mb-10 animate-fade-in-up animate-stagger-4" style={{ animationFillMode: 'both' }}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Ticket Details
          </h2>
          <div className="space-y-6">
            <TicketFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              ticketCount={filteredAndSortedTickets.length}
            />
            <div className="overflow-x-auto component-card gradient-shadow rounded-xl">
              {ticketsLoading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner text="Loading tickets..." />
                </div>
              ) : (
                <TicketTable 
                  tickets={filteredAndSortedTickets}
                  onStatusChange={handleTicketStatusChange}
                  onPriorityChange={handleTicketPriorityChange}
                  editingTicketId={editingTicketId}
                  onTicketUpdate={handleTicketUpdate}
                  onEditComplete={handleEditComplete}
                  onEditStart={handleEditStart}
                  onTicketDelete={handleTicketDelete}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onUserAssignment={handleUserAssignment}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 animate-fade-in-up animate-stagger-5" style={{ animationFillMode: 'both' }}>
          <CommunicationCenter />
        </div>
      </div>      <TicketCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTicket={handleCreateTicketFromModal}
        stores={stores}
      />
    </div>
  );
};

export default Index;
