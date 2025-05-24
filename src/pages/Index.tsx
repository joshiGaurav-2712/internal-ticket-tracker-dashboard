
import React, { useState, useMemo } from 'react';
import { Navigation } from "@/components/Navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { StatusOverview } from "@/components/StatusOverview";
import { SOSAlert } from "@/components/SOSAlert";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketTable } from "@/components/TicketTable";
import { LastUpdated } from "@/components/LastUpdated";
import { CommunicationCenter } from "@/components/CommunicationCenter";
import { Ticket } from "@/types";

// Dummy ticket data
const dummyTickets: Ticket[] = [
  {
    id: "#54",
    priority: "SOS",
    title: "API Integration Fix",
    status: "In Progress",
    tatStatus: "2h left",
    timeCreated: "4 hours ago",
    assignedTo: "David Thompson"
  },
  {
    id: "#55",
    priority: "SOS",
    title: "Payment Gateway Error",
    status: "Open",
    tatStatus: "3h left",
    timeCreated: "6 hours ago",
    assignedTo: "Sophia Wilson"
  },
  {
    id: "#53",
    priority: "Medium",
    title: "Page Optimization",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "1 day, 16 hours ago",
    assignedTo: "James Rodriguez"
  },
  {
    id: "#52",
    priority: "High",
    title: "Meet with kreo",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "5 days, 23 hours ago",
    assignedTo: "Emily Johnson"
  },
  {
    id: "#51",
    priority: "Low",
    title: "Protouch Meet",
    status: "Completed",
    tatStatus: "Done",
    timeCreated: "5 days, 23 hours ago",
    assignedTo: "Michael Chen"
  },
  {
    id: "#56",
    priority: "High",
    title: "Database Migration",
    status: "Open",
    tatStatus: "1 day left",
    timeCreated: "2 hours ago",
    assignedTo: "Alex Smith"
  },
  {
    id: "#57",
    priority: "Low",
    title: "UI Updates",
    status: "In Progress",
    tatStatus: "5h left",
    timeCreated: "1 day ago",
    assignedTo: "Sarah Johnson"
  }
];

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
  const [tickets, setTickets] = useState<Ticket[]>(dummyTickets);
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    ticketStatus: 'all',
    priority: 'all',
    tatStatus: 'all'
  });

  // Filter tickets based on current filters
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Search text filter
      if (filters.searchText && !ticket.title.toLowerCase().includes(filters.searchText.toLowerCase()) && 
          !ticket.id.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          !ticket.assignedTo?.toLowerCase().includes(filters.searchText.toLowerCase())) {
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
  }, [tickets, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const completed = tickets.filter(t => t.status === 'Completed').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    
    return {
      total,
      open,
      completed,
      inProgress,
      timeSpent: "767.48 Hrs"
    };
  }, [tickets]);

  // Calculate TAT status statistics
  const tatStats = useMemo(() => {
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress' || t.status === 'Open');
    const total = inProgressTickets.length;
    const onTrack = inProgressTickets.filter(t => t.tatStatus === 'Done' || !t.tatStatus.includes('left')).length;
    const atRisk = inProgressTickets.filter(t => t.tatStatus.includes('left') && !t.tatStatus.includes('1h')).length;
    const delayed = inProgressTickets.filter(t => t.tatStatus.includes('1h left') || t.tatStatus.includes('30min')).length;
    
    return {
      total,
      onTrack,
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
    const newTicket: Ticket = {
      id: `#${58 + tickets.length}`,
      priority: 'Medium',
      title: 'New Ticket',
      status: 'Open',
      tatStatus: '2 days left',
      timeCreated: 'Just now',
      assignedTo: 'Unassigned'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, tatStatus: newStatus === 'Completed' ? 'Done' : ticket.tatStatus }
        : ticket
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onCreateTicket={handleCreateTicket} />
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to Troopod Dashboard</h2>
            <p className="text-gray-600">Overview of your projects and tickets</p>
          </div>
          <LastUpdated />
        </div>
        
        <div className="mb-8">
          <SummaryCards stats={summaryStats} />
        </div>
        
        <div className="mb-8">
          <StatusOverview tatStats={tatStats} />
        </div>
        
        {sosTicketsCount > 0 && (
          <div className="mb-8">
            <SOSAlert count={sosTicketsCount} />
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
          <TicketFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            ticketCount={filteredTickets.length}
          />
          <TicketTable 
            tickets={filteredTickets}
            onStatusChange={handleTicketStatusChange}
          />
        </div>

        <div className="mb-8">
          <CommunicationCenter />
        </div>
      </div>
    </div>
  );
};

export default Index;
