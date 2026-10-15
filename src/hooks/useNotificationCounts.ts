import { useEffect, useState } from "react";
import { apiFetch, ApiError, isApiError } from "../api/apiFetch";
import {
  NotificationCountsSchema,
  type NotificationCounts,
} from "../api/notificationCounts";

interface UseNotificationCountsOptions {
  url: string;
  token: string;
  projectId: string;
  enabled?: boolean;
  /** Только для моков: искусственная задержка перед запросом */
  mockDelayMs?: number;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useNotificationCounts({
  url,
  token,
  projectId,
  enabled = true,
  mockDelayMs = 0,
}: UseNotificationCountsOptions) {
  const [counts, setCounts] = useState<NotificationCounts>({
    all: 0,
    unread: 0,
  });
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    setError(null);
    setIsLoading(true);

    (async () => {
      try {
        if (mockDelayMs > 0) await sleep(mockDelayMs);
        if (controller.signal.aborted) return;

        const res = await apiFetch(url, NotificationCountsSchema, {
          token,
          projectId,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setCounts(res);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(
          isApiError(e)
            ? e
            : new ApiError("network", "Неизвестная ошибка", { cause: e }),
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url, token, projectId, enabled, mockDelayMs]);

  return { counts, isLoading, error };
}