import {
  createElement,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  NotificationsContext,
  type NotificationsContextValue,
} from "../contexts/NotificationsContext";
import { useNotificationsFeed } from "@/hooks/useNotificationsFeed";
import { toDetails } from "@/api/notificationMapper";
import type {
  FetchNotificationCounts,
  FetchNotificationDetails,
  FetchNotifications,
} from "@/api/requests";
import type { LoadNotificationDetails } from "@/components/molecules/types";
import {
  resolveSettings,
  type SettingsOverrides,
} from "@/config/settings.config";
import { SettingsContext } from "@/config/SettingsContext";

export interface NotificationsProviderProps {
  /** Страница списка. Вернуть ответ бэка как есть */
  fetchList: FetchNotifications;
  /** Количество уведомлений. Вернуть ответ бэка как есть */
  fetchCounts: FetchNotificationCounts;
  /** Детали уведомления. Без него сайдбар показывает данные карточки как есть */
  fetchDetails?: FetchNotificationDetails;
  /** Запрос «прочитано». После успеха пакет сам обновит ленту и счётчик */
  onMarkRead: (messageId: string) => Promise<unknown>;
  settings?: SettingsOverrides;
  children: ReactNode;
}

export function NotificationsProvider({
  fetchList,
  fetchCounts,
  fetchDetails,
  onMarkRead,
  settings,
  children,
}: NotificationsProviderProps) {
  const state = useNotificationsFeed({ fetchList, fetchCounts });

  // Функции приходят от потребителя и могут меняться каждый рендер,
  // а ниже по дереву нужна стабильная ссылка.
  const fetchDetailsRef = useRef(fetchDetails);
  fetchDetailsRef.current = fetchDetails;
  const onMarkReadRef = useRef(onMarkRead);
  onMarkReadRef.current = onMarkRead;

  const hasDetails = fetchDetails !== undefined;
  const onLoadDetails = useMemo<LoadNotificationDetails | undefined>(
    () =>
      hasDetails
        ? async (messageId, signal) =>
            toDetails(
              await fetchDetailsRef.current!(messageId, signal),
              messageId,
            )
        : undefined,
    [hasDetails],
  );
  const stableOnMarkRead = useCallback(
    (messageId: string) => onMarkReadRef.current(messageId),
    [],
  );

  const resolvedSettings = useMemo(() => resolveSettings(settings), [settings]);

  const contextValue = useMemo<NotificationsContextValue>(
    () => ({ state, onMarkRead: stableOnMarkRead, onLoadDetails }),
    [state, stableOnMarkRead, onLoadDetails],
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
