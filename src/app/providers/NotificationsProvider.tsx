import { createElement, ReactNode } from "react";
import { NotificationsContext } from "../contexts/NotificationsContext";
import { NotificationsState } from "@/hooks/useNotifications";

export interface NotificationsProviderProps {
  value: NotificationsState;
  onMarkRead: (messageId: string) => Promise<unknown>;
  onLoadMore: () => void | Promise<unknown>;
  children: ReactNode;
}

export function NotificationsProvider({
  value,
  onMarkRead,
  onLoadMore,
  children,
}: NotificationsProviderProps) {
  return createElement(
    NotificationsContext.Provider,
    { value: { state: value, onMarkRead, onLoadMore } },
    children,
  );
}