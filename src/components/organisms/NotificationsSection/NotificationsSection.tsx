import { omni } from "@/helpers/omni";
import "./NotificationsSection.css";
import { NotificationList } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { useNotifications } from "@/hooks/useNotifications";
import { useCallback, useMemo, useRef, useState } from "react";
import { toCardProps } from "@/api/notificationMapper";
import type { NotificationAction } from "@/api/actions";
import type { NotificationDetails } from "@/components/molecules/types";
import { useTab } from "@/hooks/useTab";

interface NotificationsSectionProps {
  onSelectNotification?: (notification: NotificationDetails) => void;
  onNotificationRead?: (id: string) => void;
}

export default function NotificationsSection({
  onSelectNotification,
  onNotificationRead,
}: NotificationsSectionProps) {
  const {
    items,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markRead,
  } = useNotifications({
    baseUrl: "/mock",
    buildUrl: (page) => `/mock/notifications-${page}.json`,
    token: "mock",
    projectId: "mock",
    perPage: 10,
  });
  const { decrementUnreadCount } = useTab();
  const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(
    () => new Set(),
  );
  const pendingActionIdsRef = useRef(new Set<string>());
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const cards = useMemo(() => items.map(toCardProps), [items]);

  const handleAction = useCallback(
    async (action: NotificationAction) => {
      if (pendingActionIdsRef.current.has(action.id)) return false;
      pendingActionIdsRef.current.add(action.id);
      setPendingActionIds((current) => new Set(current).add(action.id));
      setActionError(null);
      try {
        const wasMarkedRead = await markRead(action.id);
        if (wasMarkedRead) {
          decrementUnreadCount();
          onNotificationRead?.(action.id);
        }
        return wasMarkedRead;
      } catch (cause) {
        setActionError(
          cause instanceof Error
            ? cause.message
            : "Не удалось выполнить действие",
        );
        return false;
      } finally {
        pendingActionIdsRef.current.delete(action.id);
        setPendingActionIds((current) => {
          const next = new Set(current);
          next.delete(action.id);
          return next;
        });
      }
    },
    [decrementUnreadCount, markRead, onNotificationRead],
  );

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    setActionError(null);
    try {
      for (const item of items) {
        if (item.is_read) continue;
        const succeeded = await handleAction({
          type: "mark-read",
          id: item.chit.message_id,
        });
        if (!succeeded) break;
      }
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Не удалось выполнить действие",
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <section className={omni("notifications")}>
      <div className={omni("notifications-action")}>
        <Button
          variant="link"
          onClick={handleMarkAllRead}
          disabled={isMarkingAll || items.every((item) => item.is_read)}
        >
          Прочитать загруженные
        </Button>
      </div>

      {isLoading && items.length === 0 && <p>Загрузка...</p>}
      {error && <p>{error.message}</p>}
      {actionError && <p role="alert">{actionError}</p>}

      <NotificationList
        notifications={cards}
        onAction={(action) => void handleAction(action)}
        pendingActionIds={pendingActionIds}
        onSelect={onSelectNotification}
      />

      {hasMore && (
        <div className={omni("notifications-action")}>
          <Button variant="link" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Загрузка..." : "Показать больше"}
          </Button>
        </div>
      )}
    </section>
  );
}
