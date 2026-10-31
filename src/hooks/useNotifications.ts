import { useCallback, useRef, useState } from "react";
import type { NotificationCounts } from "../api/notificationCounts";
import type { Notification, NotificationsInfo } from "../api/notifications";

export interface UseNotificationsOptions {
  perPage?: number;
}

export interface NotificationsState {
  items: Notification[];
  info: NotificationsInfo | null;
  page: number;
  counts: NotificationCounts;
  error: Error | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isCountsLoading: boolean;
  hasMore: boolean;
  reset: () => void;
  replacePage: (
    items: Notification[],
    info: NotificationsInfo,
    page: number,
  ) => void;
  appendPage: (
    items: Notification[],
    info: NotificationsInfo,
    page: number,
  ) => void;
  setCounts: (counts: NotificationCounts) => void;
  markRead: (messageId: string) => boolean;
  markAllRead: () => void;
  setError: (error: Error | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingMore: (loading: boolean) => void;
  setIsCountsLoading: (loading: boolean) => void;
}

function merge(prev: Notification[], next: Notification[]): Notification[] {
  const map = new Map<string, Notification>();
  for (const item of prev) map.set(item.chit.message_id, item);
  for (const item of next) map.set(item.chit.message_id, item);
  return Array.from(map.values());
}

export function useNotifications({
  perPage = 20,
}: UseNotificationsOptions = {}): NotificationsState {
  const size = Math.min(50, Math.max(1, perPage));
  const [items, setItems] = useState<Notification[]>([]);
  const [info, setInfo] = useState<NotificationsInfo | null>(null);
  const [page, setPage] = useState(0);
  const [counts, setCountsState] = useState<NotificationCounts>({
    all: 0,
    unread: 0,
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCountsLoading, setIsCountsLoading] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const reset = useCallback(() => {
    setItems([]);
    setInfo(null);
    setPage(0);
    setCountsState({ all: 0, unread: 0 });
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    setIsCountsLoading(false);
  }, []);

  const replacePage = useCallback(
    (
      nextItems: Notification[],
      nextInfo: NotificationsInfo,
      nextPage: number,
    ) => {
      setItems(nextItems);
      setInfo(nextInfo);
      setPage(nextPage);
    },
    [],
  );

  const appendPage = useCallback(
    (
      nextItems: Notification[],
      nextInfo: NotificationsInfo,
      nextPage: number,
    ) => {
      setItems((current) => merge(current, nextItems));
      setInfo(nextInfo);
      setPage(nextPage);
    },
    [],
  );

  const setCounts = useCallback((nextCounts: NotificationCounts) => {
    setCountsState(nextCounts);
  }, []);

  const markRead = useCallback((messageId: string) => {
    const item = itemsRef.current.find(
      (notification) => notification.chit.message_id === messageId,
    );
    if (!item || item.is_read) return false;

    setItems((current) =>
      current.map((notification) =>
        notification.chit.message_id === messageId
          ? { ...notification, is_read: true }
          : notification,
      ),
    );
    setCountsState((current) => ({
      ...current,
      unread: Math.max(0, current.unread - 1),
    }));
    return true;
  }, []);

  const markAllRead = useCallback(() => {
    setItems((current) =>
      current.map((notification) => ({ ...notification, is_read: true })),
    );
    setCountsState((current) => ({ ...current, unread: 0 }));
  }, []);

  const hasMore = info !== null && page * size < info.total;

  return {
    items,
    info,
    page,
    counts,
    error,
    isLoading,
    isLoadingMore,
    isCountsLoading,
    hasMore,
    reset,
    replacePage,
    appendPage,
    setCounts,
    markRead,
    markAllRead,
    setError,
    setIsLoading,
    setIsLoadingMore,
    setIsCountsLoading,
  };
}
