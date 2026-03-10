import TopNavigation from "./TopNavigation";
import { Notifications } from "@/lib/interfaces";

const notifications: Notifications[] = [
  { id: 1, title: "New report available", time: "2 min ago", unread: true },
  {
    id: 2,
    title: "Team meeting in 30 mins",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "System update completed",
    time: "3 hours ago",
    unread: false,
  },
];

export default function TopNavigationWrapper() {
  return <TopNavigation notifications={notifications} />;
}
