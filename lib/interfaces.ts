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