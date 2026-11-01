import type { LoadNotificationDetails } from "@/components/molecules/types";
import type { NotificationsState } from "@/hooks/useNotificationsFeed";
import { createContext, useContext } from "react";

export interface NotificationsContextValue {
  state: NotificationsState;
  onMarkRead: (messageId: string) => Promise<unknown>;
  /** Нет `fetchDetails` у потребителя — сайдбар показывает данные карточки как есть */
  onLoadDetails?: LoadNotificationDetails;
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
