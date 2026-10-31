import { useCallback, useEffect } from "react";
import { runAction } from "@core/actions";
import { apiFetch, ApiError, isApiError } from "@/api/apiFetch";
import { NotificationCountsSchema } from "@/api/notificationCounts";
import { NotificationsResponseSchema } from "@/api/notifications";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationFeedPage from "@/components/pages/NotificationFeedPage";
import "./App.css";
import { NotificationsProvider } from "./providers/NotificationsProvider";

function App() {
  const notifications = useNotifications({ perPage: 10 });
  const {
    reset,
    replacePage,
    appendPage,
    setCounts,
    setError,
    setIsLoading,
    setIsLoadingMore,
    setIsCountsLoading,
  } = notifications;

  useEffect(() => {
    const controller = new AbortController();
    reset();
    setError(null);
    setIsLoading(true);
    setIsCountsLoading(true);

    void Promise.all([
      apiFetch("/mock/notifications-1.json", NotificationsResponseSchema, {
        token: "mock",
        projectId: "mock",
        signal: controller.signal,
      }),
      apiFetch("/mock/notification-counts.json", NotificationCountsSchema, {
        token: "mock",
        projectId: "mock",
        signal: controller.signal,
      }),
    ])
      .then(([response, counts]) => {
        if (controller.signal.aborted) return;
        replacePage(response.data, response.info, 1);
        setCounts(counts);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          isApiError(cause)
            ? cause
            : new ApiError("network", "Неизвестная ошибка", { cause }),
        );
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
        setIsCountsLoading(false);
      });

    return () => controller.abort();
  }, [
    reset,
    replacePage,
    setCounts,
    setError,
    setIsLoading,
    setIsCountsLoading,
  ]);

  const loadMore = useCallback(async () => {
    if (!notifications.hasMore || notifications.isLoadingMore) return;
    const nextPage = notifications.page + 1;
    const controller = new AbortController();
    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/mock/notifications-${nextPage}.json`,
        NotificationsResponseSchema,
        {
          token: "mock",
          projectId: "mock",
          signal: controller.signal,
        },
      );
      appendPage(response.data, response.info, nextPage);
    } catch (cause) {
      setError(
        isApiError(cause)
          ? cause
          : new ApiError("network", "Неизвестная ошибка", { cause }),
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    appendPage,
    notifications.hasMore,
    notifications.isLoadingMore,
    notifications.page,
    setError,
    setIsLoadingMore,
  ]);

  const markRead = useCallback(async (messageId: string) => {
    await runAction({ type: "mark-read", id: messageId });
  }, []);

  return (
    <div className="app">
      <img src="/src/assets/menu.png" />
      <NotificationsProvider
        value={notifications}
        onMarkRead={markRead}
        onLoadMore={() => void loadMore()}
      >
        <NotificationFeedPage />
      </NotificationsProvider>
    </div>
  );
}

export default App;
