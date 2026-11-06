import { callProvider } from "@core/data";
import { runAction } from "@core/actions";
import { createElement, type ReactNode } from "react";
import type { NotificationCountsResponse } from "../../api/notificationCounts";
import type { NotificationDetailsResponse } from "../../api/notificationDetails";
import { NOTIFICATION_PROVIDERS } from "../../api/requests";
import type { NotificationsResponse } from "../../api/notifications";
import type { SettingsOverrides } from "../../config/settings.config";
import type { GetHasMore } from "../../hooks/useNotificationsFeed";
import {
  NotificationsFeedDataProvider,
  type NotificationsFeedApi,
} from "./NotificationsFeedDataProvider";

const notificationFeedApi: NotificationsFeedApi = {
  fetchList: (page) =>
    callProvider<NotificationsResponse>(NOTIFICATION_PROVIDERS.list, {
      page,
    }),
  fetchCounts: () =>
    callProvider<NotificationCountsResponse>(NOTIFICATION_PROVIDERS.counts),
  fetchDetails: (messageId, signal) =>
    callProvider<NotificationDetailsResponse>(
      NOTIFICATION_PROVIDERS.details,
      { messageId, signal },
    ),
  markRead: async (messageId) => {
    await runAction({ type: "mark-read", id: messageId });
  },
};

export interface NotificationsFeedProviderProps {
  /** Override pagination when the registered data provider uses a custom scheme. */
  getHasMore?: GetHasMore;
  settings?: SettingsOverrides;
  children: ReactNode;
}

export function NotificationsFeedProvider({
  getHasMore,
  settings,
  children,
}: NotificationsFeedProviderProps) {
  return createElement(NotificationsFeedDataProvider, {
    api: notificationFeedApi,
    getHasMore,
    settings,
    children,
  });
}
