import TabProvider from "@/app/providers/TabProvider";
import type { ReactNode } from "react";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";

export default function NotificationsRoot({ children }: { children: ReactNode }) {
  const { counts, isLoading } = useNotificationCounts({
    url: "/mock/notification-counts.json",
    token: "mock",
    projectId: "mock",
    mockDelayMs: 1200,
  });

  return (
    <TabProvider
      allCount={counts.all}
      unreadCount={counts.unread}
      isLoading={isLoading}
    >
      {children}
    </TabProvider>
  );
}