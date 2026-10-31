import { createElement, useMemo, type ReactNode } from "react";
import {
  NotificationsContext,
  type NotificationsContextValue,
} from "../contexts/NotificationsContext";
import type { NotificationsState } from "@/hooks/useNotifications";
import type { LoadNotificationDetails } from "@/components/molecules/types";
import {
  resolveSettings,
  type SettingsOverrides,
} from "@/config/settings.config";
import { SettingsContext } from "@/config/SettingsContext";

export interface RetryHandlers {
  /** Повтор при ошибке ленты */
  feed?: () => void | Promise<unknown>;
  /** Повтор при ошибке деталей: любой запрос, который вернёт детали */
  details?: LoadNotificationDetails;
}

export interface NotificationsProviderProps {
  value: NotificationsState;
  onMarkRead: (messageId: string) => Promise<unknown>;
  onLoadMore: () => void | Promise<unknown>;
  /** Запрос деталей уведомления. Без него сайдбар показывает данные карточки как есть */
  onLoadDetails?: LoadNotificationDetails;
  settings?: SettingsOverrides;
  children: ReactNode;
  onRetry?: RetryHandlers;
}

export function NotificationsProvider({
  value,
  onRetry,
  onMarkRead,
  onLoadMore,
  onLoadDetails,
  settings,
  children,
}: NotificationsProviderProps) {
  console.log("provider onRetry:", onRetry);
  const resolvedSettings = useMemo(() => resolveSettings(settings), [settings]);

  const contextValue = useMemo<NotificationsContextValue>(
    () => ({ state: value, onMarkRead, onLoadMore, onLoadDetails, onRetry }),
    [value, onMarkRead, onLoadMore, onLoadDetails, onRetry],
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
