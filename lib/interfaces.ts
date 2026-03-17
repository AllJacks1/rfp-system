export interface NavItem {
  icon?: React.ComponentType;
  label: string;
  href?: string;
  badge?: string;
  subsections?: NavItem[]; // Recursive reference
}

export interface TopNavigationProps {
  notifications?: Notifications[];
}

export interface NotificationsProps {
  initialNotifications: Notifications[];
}

export interface Notifications {
  id: number;
  title: string;
  time: string;
  unread: boolean;
}

export interface SelectedRequest {
  id: string;
  title: string;
  purchaseType: string;
  status: string;
  dateSubmitted: string;
  requestor: string;
  department: string;
  amount: string;
  description: string;
}

export interface Request {
  id: string;
  title: string;
  purchaseType: string;
  requestor: string;
  department: string;
  amount: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  description: string;
}

export interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export interface User {
  id: string;
  username?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  address?: string;
  birthday?: string;
  sex: string;
  auth_id: string;
}

export interface Company {
  company_id: string;
  name: string;
}

export interface Branch {
  id: string;
  location: string;
  company_id?: Company;
}

export interface Department {
  id: string;
  name: string;
  branch_id?: Branch;
}

export interface Role {
  id: string;
  name: string;
}

export interface SettingsPageProps {
  user?: User[];
  companies: Company[];
  branch?: Branch[];
  department?: Department[];
  roles?: Role[];
}

export interface CompanySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
}