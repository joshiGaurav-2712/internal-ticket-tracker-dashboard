
import { Button } from "@/components/ui/button";

interface Ticket {
  id: string;
  priority: string;
  title: string;
  status: string;
  tatStatus: string;
  timeCreated: string;
}

const tickets: Ticket[] = [
  {
    id: "#54",
    priority: "SOS",
    title: "API Integration Fix",
    status: "In Progress",
    tatStatus: "2h left",
    timeCreated: "4 hours ago"
  },
  {
    id: "#55",
    priority: "SOS",
    title: "Payment Gateway Error",
    status: "Open",
    tatStatus: "3h left",
    timeCreated: "6 hours ago"
  }
  // Add more sample tickets here
];

const getPriorityClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'sos':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-yellow-100 text-yellow-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'open':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TicketTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAT Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.tatStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.timeCreated}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm">VIEW</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
