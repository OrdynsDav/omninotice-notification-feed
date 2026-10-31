import { useCallback, useEffect, useMemo, useRef } from "react";
import { runAction } from "@core/actions";
import { apiFetch, ApiError, isApiError } from "@/api/apiFetch";
import { NotificationCountsSchema } from "@/api/notificationCounts";
import { NotificationsResponseSchema } from "@/api/notifications";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationFeedPage from "@/components/pages/NotificationFeedPage";
import "./App.css";
import {
  NotificationsProvider,
  RetryHandlers,
} from "./providers/NotificationsProvider";
import type { LoadNotificationDetails } from "@/components/molecules/types";
import type { SettingsOverrides } from "@/config/settings.config";

function App() {
  const notifications = useNotifications({ perPage: 10 });
  const {
    reset,
    replacePage,
    isLoadingMore,
    appendPage,
    setCounts,
    setError,
    setIsLoading,
    setIsLoadingMore,
    setIsCountsLoading,
    hasMore,
    page,
  } = notifications;

  // Единственный запрос списка: страница 1 заменяет данные, остальные добавляются
  const failNextRef = useRef(true); // тест: следующий запрос упадёт один раз

  useEffect(() => {
    (window as unknown as { failNext: () => void }).failNext = () => {
      failNextRef.current = true;
    };
  }, []);

  // Единственный запрос списка: страница 1 заменяет данные, остальные добавляются
  const loadPage = useCallback(
    async (pageNumber: number, signal: AbortSignal) => {
      const isFirst = pageNumber === 1;

      if (isFirst) {
        reset();
        setIsLoading(true);
        setIsCountsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        // --- тест: убрать после проверки ---
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (signal.aborted) return;
        if (failNextRef.current) {
          failNextRef.current = false;
          throw new Error("Тестовая ошибка");
        }
        // --- конец теста ---

        const [response, counts] = await Promise.all([
          apiFetch(
            `/mock/notifications-${pageNumber}.json`,
            NotificationsResponseSchema,
            { token: "mock", projectId: "mock", signal },
          ),
          isFirst
            ? apiFetch(
                "/mock/notification-counts.json",
                NotificationCountsSchema,
                {
                  token: "mock",
                  projectId: "mock",
                  signal,
                },
              )
            : null,
        ]);
        if (signal.aborted) return;

        if (isFirst) {
          replacePage(response.data, response.info, pageNumber);
          if (counts) setCounts(counts);
        } else {
          appendPage(response.data, response.info, pageNumber);
        }
      } catch (cause) {
        if (signal.aborted) return;
        setError(
          isApiError(cause)
            ? cause
            : new ApiError("network", "Неизвестная ошибка", { cause }),
        );
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
          setIsCountsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [
      reset,
      replacePage,
      appendPage,
      setCounts,
      setError,
      setIsLoading,
      setIsLoadingMore,
      setIsCountsLoading,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadPage(1, controller.signal);
    return () => controller.abort();
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    return loadPage(page + 1, new AbortController().signal);
  }, [hasMore, isLoadingMore, page, loadPage]);

  const loadDetails = useCallback<LoadNotificationDetails>(
    async (messageId, signal) => {
      const response = await fetch(
        `/mock/notification-details-${messageId}.json`,
        { signal },
      );
      if (response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return {
        messageId,
        title: data.title,
        description: data.description,
        action: data.action,
      };
    },
    [],
  );

  const markRead = useCallback(async (messageId: string) => {
    await runAction({ type: "mark-read", id: messageId });
  }, []);

  // Повтор = тот же запрос, который упал
  const onRetry = useMemo<RetryHandlers>(
    () => ({
      feed: () => loadPage(page + 1, new AbortController().signal),
      details: loadDetails,
    }),
    [page, loadPage, loadDetails],
  );

  const settings = useMemo<SettingsOverrides>(
    () => ({
      sidebarBackdrop: false,
      autoLoadUnread: false,
      notificationState: {
        noUnreadLoaded: {
          btn: hasMore
            ? {
                title: isLoadingMore ? "Загрузка" : "Показать больше",
                onClick: loadMore,
              }
            : undefined,
        },
      },
    }),
    [hasMore, isLoadingMore, loadMore],
  );

  return (
    <div className="app">
      <img src="/src/assets/menu.png" />
      <NotificationsProvider
        value={notifications}
        onMarkRead={markRead}
        onLoadMore={loadMore}
        onLoadDetails={loadDetails}
        onRetry={onRetry}
        settings={settings}
      >
        <NotificationFeedPage />
      </NotificationsProvider>
    </div>
  );
}

export default App;
