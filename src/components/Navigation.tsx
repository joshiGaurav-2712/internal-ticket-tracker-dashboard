
import { Button } from "@/components/ui/button";
import { Plus, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { logout } = useAuth();

  const handleLogout = (): void => {
    console.log('Logout button clicked');
    logout();
    window.location.href = '/'; // Redirect to sign-in page
  };

  const handleCreateTicketClick = () => {
    console.log('Create ticket button clicked');
    onCreateTicket();
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 component-card gradient-shadow border-b animate-fade-in-down">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600 tracking-tight">
            Troopod
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {/* <NavLink to="/" isActive>Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          <NavLink to="/reports">Reports</NavLink> */}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift px-3 md:px-4"
          onClick={handleCreateTicketClick}
          size="sm"
        >
          <Plus className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Create New Ticket</span>
          <span className="md:hidden">Create</span>
        </Button>
        
        {/* User Menu with Logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 md:gap-2 hover-lift transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 z-50 bg-background">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
