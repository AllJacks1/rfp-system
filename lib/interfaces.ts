export interface SubNavItem {
    label: string;
    href: string;
    badge?: string;
}

export interface NavItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    subsections?: SubNavItem[];
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
