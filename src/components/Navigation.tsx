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
    <nav className="flex items-center justify-between px-8 py-6 component-card gradient-shadow border-b animate-fade-in-down">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-purple-200 shadow-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-5 h-5 bg-white rounded-full opacity-90"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent tracking-tight">
            troopod
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {/* <NavLink to="/" isActive>Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          <NavLink to="/reports">Reports</NavLink> */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          onClick={onCreateTicket}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Ticket
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover-lift transition-all duration-300"
          onClick={handleUserMenu}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};
