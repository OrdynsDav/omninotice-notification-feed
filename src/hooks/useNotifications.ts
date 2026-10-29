import { useCallback, useEffect, useRef, useState } from "react";
import { runAction } from "@core/actions";
import { apiFetch, ApiError, isApiError } from "../api/apiFetch";
import {
  NotificationsResponseSchema,
  type Notification,
  type NotificationsInfo,
} from "../api/notifications";

interface UseNotificationsOptions {
  baseUrl: string;
  token: string;
  projectId: string;
  perPage?: number;
  enabled?: boolean;
  /** Переопределяет сборку URL (для моков) */
  buildUrl?: (page: number, perPage: number) => string;
}

// Дедупликация по message_id: если во время просмотра пришли новые
// уведомления, границы страниц сдвигаются и элементы могут повториться
function merge(prev: Notification[], next: Notification[]): Notification[] {
  const map = new Map<string, Notification>();
  for (const item of prev) map.set(item.chit.message_id, item);
  for (const item of next) map.set(item.chit.message_id, item);
  return Array.from(map.values());
}

export function useNotifications({
  baseUrl,
  token,
  projectId,
  perPage = 20,
  enabled = true,
  buildUrl,
}: UseNotificationsOptions) {
  const buildUrlRef = useRef(buildUrl);
  buildUrlRef.current = buildUrl;
  const size = Math.min(50, Math.max(1, perPage));

  const [items, setItems] = useState<Notification[]>([]);
  const [info, setInfo] = useState<NotificationsInfo | null>(null);
  const [page, setPage] = useState(0); // последняя успешно загруженная страница
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled); // первичная загрузка / refetch
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  const load = useCallback(
    async (targetPage: number, reset: boolean) => {
      // отменяем предыдущий запрос: защита от гонок
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      busyRef.current = true;

      setError(null);
      if (reset) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const query = new URLSearchParams({
          page: String(targetPage),
          per_page: String(size),
        });
        const url = buildUrlRef.current
          ? buildUrlRef.current(targetPage, size)
          : `${baseUrl}?${query}`;

        const res = await apiFetch(url, NotificationsResponseSchema, {
          token,
          projectId,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setItems((prev) => merge(reset ? [] : prev, res.data));
        setInfo(res.info);
        setPage(targetPage);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(
          isApiError(e)
            ? e
            : new ApiError("network", "Неизвестная ошибка", { cause: e }),
        );
      } finally {
        // сбрасываем флаги, только если нас не заменил более новый запрос
        if (controllerRef.current === controller) {
          busyRef.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [baseUrl, token, projectId, size],
  );

  // Первая загрузка и полный сброс при смене токена, проекта, URL или размера
  useEffect(() => {
    if (!enabled) return;
    setItems([]);
    setInfo(null);
    setPage(0);
    load(1, true);
    return () => controllerRef.current?.abort();
  }, [enabled, load]);

  const hasMore = info !== null && page * size < info.total;

  const loadMore = useCallback(() => {
    if (busyRef.current || !hasMore) return;
    load(page + 1, false);
  }, [hasMore, page, load]);

  // Перезагрузка с первой страницы; старые элементы остаются, пока не придут новые
  const refetch = useCallback(() => load(1, true), [load]);

  const markRead = useCallback(
    async (messageId: string) => {
      const item = items.find(
        (notification) => notification.chit.message_id === messageId,
      );
      if (!item || item.is_read) return false;

      await runAction({ type: "mark-read", id: messageId });
      setItems((current) =>
        current.map((notification) =>
          notification.chit.message_id === messageId
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
      return true;
    },
    [items],
  );

  return {
    items,
    info,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refetch,
    markRead,
  };
}
