import { createElement, useMemo, type ReactNode } from "react";
import type { NotificationCountsResponse } from "../../api/notificationCounts";
import type { NotificationDetailsResponse } from "../../api/notificationDetails";
import { toDetails } from "../../api/notificationMapper";
import type { NotificationsResponse } from "../../api/notifications";
import type { LoadNotificationDetails } from "../../components/molecules/types";
import {
  resolveSettings,
  type SettingsOverrides,
} from "../../config/settings.config";
import {
  useNotificationsFeed,
  type GetHasMore,
} from "../../hooks/useNotificationsFeed";
import {
  NotificationsContext,
  type NotificationsContextValue,
} from "../contexts/NotificationsContext";
import { SettingsContext } from "../../config/SettingsContext";

export interface NotificationsFeedApi {
  fetchList: (page: number) => Promise<NotificationsResponse>;
  fetchCounts: () => Promise<NotificationCountsResponse>;
  fetchDetails: (
    messageId: string,
    signal?: AbortSignal,
  ) => Promise<NotificationDetailsResponse>;
  markRead: (messageId: string) => Promise<void>;
}

export interface NotificationsFeedDataProviderProps {
  api: NotificationsFeedApi;
  getHasMore?: GetHasMore;
  settings?: SettingsOverrides;
  children: ReactNode;
}

export function NotificationsFeedDataProvider({
  api,
  getHasMore,
  settings,
  children,
}: NotificationsFeedDataProviderProps) {
  const state = useNotificationsFeed({
    fetchList: (page) => api.fetchList(page),
    fetchCounts: () => api.fetchCounts(),
    getHasMore,
  });

  const onLoadDetails = useMemo<LoadNotificationDetails>(
    () => async (messageId, signal) =>
      toDetails(await api.fetchDetails(messageId, signal), messageId),
    [api.fetchDetails],
  );
  const onMarkRead = useMemo(
    () => (messageId: string) => api.markRead(messageId),
    [api.markRead],
  );
  const resolvedSettings = useMemo(() => resolveSettings(settings), [settings]);
  const contextValue = useMemo<NotificationsContextValue>(
    () => ({ state, onLoadDetails, onMarkRead }),
    [state, onLoadDetails, onMarkRead],
  );

  return createElement(
    SettingsContext.Provider,
    { value: resolvedSettings },
    createElement(
      NotificationsContext.Provider,
      { value: contextValue },
      children,
    ),
  );
}
