
export interface Ticket {
  id: string;
  priority: 'SOS' | 'High' | 'Medium' | 'Low';
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Completed';
  tatStatus: string;
  timeCreated: string;
  assignedTo?: string;
  assignedToId?: number;
  brandName?: string;
  timeTaken?: string;
}

export interface Update {
  title: string;
  timestamp: string;
  timeAgo: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  textColor?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

export interface StatusBarData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}
