import { LoadNotificationDetails } from "@/components/molecules/types";
import { NotificationsState } from "@/hooks/useNotifications";
import { createContext, useContext } from "react";
import { RetryHandlers } from "../providers/NotificationsProvider";

export interface NotificationsContextValue {
  state: NotificationsState;
  onMarkRead: (messageId: string) => Promise<unknown>;
  onLoadMore: () => void | Promise<unknown>;
  onLoadDetails?: LoadNotificationDetails;
  onRetry?: RetryHandlers;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

export function useNotificationsContext(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "NotificationFeedPage must be rendered inside NotificationsProvider",
    );
  }
  return context;
}
