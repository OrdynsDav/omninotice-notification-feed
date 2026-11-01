import type { NotificationCountsResponse } from "./notificationCounts";
import type { NotificationDetailsResponse } from "./notificationDetails";
import type { NotificationsResponse } from "./notifications";

/*
 * Запросы пишет потребитель пакета: делает fetch и возвращает ответ бэка как есть.
 * Всё остальное (загрузка, ошибки, пагинация, прочитанность) делает пакет.
 * Если `signal` сработал, запрос нужно прервать (передать его в fetch).
 */

/** Страница списка. Нумерация страниц с 1 */
export type FetchNotifications = (
  page: number,
  signal: AbortSignal,
) => Promise<NotificationsResponse>;

/** Количество уведомлений: всего и непрочитанных */
export type FetchNotificationCounts = (
  signal: AbortSignal,
) => Promise<NotificationCountsResponse>;

/** Детали одного уведомления */
export type FetchNotificationDetails = (
  messageId: string,
  signal: AbortSignal,
) => Promise<NotificationDetailsResponse>;
