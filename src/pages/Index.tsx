
import { Navigation } from "@/components/Navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { StatusOverview } from "@/components/StatusOverview";
import { SOSAlert } from "@/components/SOSAlert";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketTable } from "@/components/TicketTable";
import { ProjectHealth } from "@/components/ProjectHealth";
import { LastUpdated } from "@/components/LastUpdated";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to Troopod Dashboard</h2>
            <p className="text-gray-600">Overview of your projects and tickets</p>
          </div>
          <LastUpdated />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <SummaryCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <StatusOverview />
          </div>
          <div className="lg:col-span-1">
            <ProjectHealth />
          </div>
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
