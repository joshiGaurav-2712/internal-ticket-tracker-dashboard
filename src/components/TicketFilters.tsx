
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type TicketStatus = 'all' | 'open' | 'in-progress' | 'completed';
type Priority = 'all' | 'low' | 'medium' | 'high' | 'sos';
type TatStatus = 'all' | 'on-track' | 'at-risk' | 'delayed';

interface FilterState {
  searchText: string;
  ticketStatus: TicketStatus;
  priority: Priority;
  tatStatus: TatStatus;
}

interface TicketFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  ticketCount: number;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  ticketCount 
}) => {
  const handleFilter = (): void => {
    console.log('Filter applied:', filters, `Showing ${ticketCount} tickets`);
  };

  const handleClearFilters = (): void => {
    onFilterChange({
      searchText: '',
      ticketStatus: 'all',
      priority: 'all',
      tatStatus: 'all'
    });
  };

  const hasActiveFilters = filters.searchText || 
    filters.ticketStatus !== 'all' || 
    filters.priority !== 'all' || 
    filters.tatStatus !== 'all';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-wrap gap-3">
        <select 
          className="border rounded-lg px-4 py-2 bg-gradient-to-br from-white to-gray-50 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover-lift"
          value={filters.ticketStatus}
          onChange={(e) => onFilterChange({ ticketStatus: e.target.value as TicketStatus })}
        >
          <option value="all">Ticket Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <select 
          className="border rounded-lg px-4 py-2 bg-gradient-to-br from-white to-gray-50 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover-lift"
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as Priority })}
        >
          <option value="all">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="sos">SOS</option>
        </select>
        
        <select 
          className="border rounded-lg px-4 py-2 bg-gradient-to-br from-white to-gray-50 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover-lift"
          value={filters.tatStatus}
          onChange={(e) => onFilterChange({ tatStatus: e.target.value as TatStatus })}
        >
          <option value="all">TAT Status</option>
          <option value="on-track">On Track</option>
          <option value="at-risk">At Risk</option>
          <option value="delayed">Delayed</option>
        </select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="text-sm hover-lift transition-all duration-200 font-medium"
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search by text" 
            className="w-full pl-9 component-card hover-lift transition-all duration-200"
            value={filters.searchText}
            onChange={(e) => onFilterChange({ searchText: e.target.value })}
          />
        </div>
        <Button 
          className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift font-semibold" 
          onClick={handleFilter}
        >
          FILTER ({ticketCount})
        </Button>
      </div>
    </div>
  );
};
