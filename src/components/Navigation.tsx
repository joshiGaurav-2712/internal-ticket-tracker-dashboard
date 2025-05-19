
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-blue-600">BSC</h1>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-blue-600 font-medium">Dashboard</Link>
          <Link to="/projects" className="text-gray-600 hover:text-blue-600">Projects</Link>
          <Link to="/tickets" className="text-gray-600 hover:text-blue-600">Tickets</Link>
          <Link to="/reports" className="text-gray-600 hover:text-blue-600">Reports</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create New Ticket
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};
