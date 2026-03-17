export interface NavItem {
  icon?: React.ComponentType;
  label: string;
  href?: string;
  badge?: string;
  subsections?: NavItem[];  // Recursive reference
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
    title: string
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