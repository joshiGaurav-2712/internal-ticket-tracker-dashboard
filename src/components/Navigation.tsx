
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}

interface NavigationProps {
  onCreateTicket: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isActive = false }) => (
  <Link 
    to={to} 
    className={`font-medium ${
      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
    }`}
  >
    {children}
  </Link>
);

export const Navigation: React.FC<NavigationProps> = ({ onCreateTicket }) => {
  const handleUserMenu = (): void => {
    console.log('User menu clicked');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-blue-600">Troopod</h1>
        <div className="hidden md:flex items-center space-x-6">
          {/* <NavLink to="/" isActive>Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          <NavLink to="/reports">Reports</NavLink> */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={onCreateTicket}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Ticket
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={handleUserMenu}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};
