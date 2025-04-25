
import { Navigation } from "@/components/Navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { StatusOverview } from "@/components/StatusOverview";
import { SOSAlert } from "@/components/SOSAlert";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketTable } from "@/components/TicketTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <SummaryCards />
        </div>
        
        <div className="mb-8">
          <StatusOverview />
        </div>
        
        <div className="mb-8">
          <SOSAlert />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
          <TicketFilters />
          <TicketTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
